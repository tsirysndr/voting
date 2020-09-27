import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import AppMenu from './components/AppMenu'
import { Button, Card, Input, Textarea, Chip, DateTimePicker, Modal, TableWithBrowserPagination, Table, Column, Badge } from 'react-rainbow-components'
import { drizzleConnect } from '@drizzle/react-plugin'
import PropTypes from 'prop-types'
import { 
  Divider,
  FontIcon,
  List,
  ListItem,
 } from 'react-md'
 import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
 import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'
 import VotingContract from './contracts/Voting.json'
 import moment from 'moment'

/* global alert */

const Voting = (props, context) => {
  const [address, setAddress] = useState('')
  const [proposals, setProposals] = useState([])
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [selected, setSelected] = useState(null)
  const [open, setOpen] = useState(false)

  const loadContract = () => {
    if (props.drizzleStatus.initialized && props.match && props.match.params && props.match.params.address) {
     const web3 = context.drizzle.web3
      const contractConfig = {
        contractName: props.match.params.address,
        web3Contract: new web3.eth.Contract(VotingContract.abi, props.match.params.address)
      }
      const events = []
      context.drizzle.addContract(contractConfig, events)
    }
  }

  const getProposalDetails = async () => {
    const { drizzle } = context
    const { contracts, web3 } = drizzle
    const Voting = contracts[props.match.params.address]
    console.log(Voting)
    const size = await Voting.methods.getProposalsSize().call()
    const results = []
    for (let i = 0; i < size; i++) {
      const proposal = await Voting.methods.proposals(i).call()
      console.log(web3.utils.toAscii(proposal.name).replace(/\u0000/g, ''), proposal.voteCount)
      results.push({
        name: web3.utils.toAscii(proposal.name).replace(/\u0000/g, ''),
        voteCount: proposal.voteCount,
      })
    }
    setProposals(results)
    const _startDate = await Voting.methods.startDate().call()
    const _endDate = await Voting.methods.endDate().call()
    setStartDate(_startDate)
    setEndDate(_endDate)
    console.log(moment.unix(_startDate).toDate())
    console.log(moment.unix(_endDate).toDate())
  }

  const onVote = (proposal, index) => {
    setSelected(index)
    const { drizzle } = context
    const { contracts, web3 } = drizzle
    const Voting = contracts[props.match.params.address]
    Voting.methods.vote.cacheSend(
      index,
      {
        from: address,
        //gasPrice: 2000000000
      })
  }

  // const [access, setAccess] = useState('private')
  useEffect(
    () => {
      setAddress(props.accounts['0'])
      loadContract()
      if (context && context.drizzle && context.drizzle.contracts && context.drizzle.contracts[props.match.params.address]) {
        getProposalDetails()
        .catch(err => console.log(err))
      }
  }, [props.drizzleStatus.initialized])


  return (
    <div className='App'>
      <div style={{ width: '100%' }}>
        <Navbar address={address} />
        <div style={{
          boxShadow: 'inset 20px 20px 30px rgba(0,0,0,0.05)',
          height: 'auto',
          paddingBottom: '4rem',
        }}
        >
          <div style={{
            marginLeft: 'auto',
            marginRight: 'auto',
            paddingTop: '4em',
            maxWidth: 920
          }}
          >
            <Card style={{ display: 'flex', minHeight: 'calc(100vh - 100px)', border: 'none', paddingBottom: 60, alignItems: 'center', flexDirection: 'column' }}>
              <div style={{
                color: '#9cc717',
                height: 80,
                fontFamily: 'Product Sans Bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 25
              }}
              >
               Voting
              </div>
              <List className="md-cell md-paper md-paper--1">
                {
                  proposals.map((item, index) => <ListItem 
                  onClick={() => { setOpen(true) } } 
                  primaryText={item.name}
                  style={{ backgroundColor: selected === index ? '#01b6f51a' : 'initial',border: '2px' , borderRadius: '10px' }} 
                  rightIcon={selected === index ? <FontAwesomeIcon icon={faCheckCircle}  color='#01b6f5'/> : null } 
                  />)
                }
                </List>
            </Card>
            <Modal
                    title='Voulez-vous confirmer ce choix? '
                    isOpen={open}
                    onRequestClose={() => { setOpen(false) }}
                    footer={
                    
                
                    <div className='rainbow-flex rainbow-justify_end' style={{
                        position: 'relative',
                        marginRight: '160px'

                    }}>
                        
                        <Button
                        form='redux-form-id'
                        className='rainbow-m-right_large'
                        label='Cancel'
                        variant='neutral'
                        onClick={() => { setOpen(false) }}
                        style={{
                          position: 'relative',
                          marginRight: '38px'

                      }}
                        />
                        <Button
                        form='redux-form-id'
                        label='OK'
                        variant='brand'
                        type='submit'
                        onClick={() => {  proposals.map((item, index) => onVote(item, index))
                          setOpen(false) }}
                        />
          
          </div>
        }
      />
          </div>
        </div>
      </div>
    </div>
  )
}

Voting.contextTypes = {
  drizzle: PropTypes.object,
}

const mapStateToProps = state => ({
  accounts: state.accounts,
  VotingFactory: state.contracts.VotingFactory,
  Voting: state.contracts.Voting,
  drizzleStatus: state.drizzleStatus,
})

export default drizzleConnect(Voting, mapStateToProps)