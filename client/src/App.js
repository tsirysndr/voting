import React, { useState, useEffect } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import AppMenu from './components/AppMenu'
import { Button, Card, Input, Textarea, Chip, DateTimePicker, Modal, TableWithBrowserPagination, Table, Column, Badge } from 'react-rainbow-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import Papa from 'papaparse'
import { drizzleConnect } from '@drizzle/react-plugin'
import PropTypes from 'prop-types'
import Voting from './contracts/Voting.json'
/* global alert */

const okButtonLocalizedLabel = {
  'en-US': 'OK',
  'es-ES': 'Aceptar',
  'fr-Fr': "D'accord"
}

const cancelButtonLocalizedLabel = {
  'en-US': 'Cancel',
  'es-ES': 'Cancelar',
  'fr-Fr': 'Annuler'
}

let fileInput = {}

const App = (props, context) => {
  console.log(context)
  const [open, setOpen] = useState(false)
  const [address, setAddress] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescriptioh] = useState('')
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [locale] = useState({ name: 'en-US', label: 'English (US)' })
  const [candidates, setCandidates] = useState([{ id: 1, name: 'Candidat 1' }, { id: 2, name: 'Candidat 2' }])
  const [update, setUpdate] = useState(false)
  const [candidate, setCandidate] = useState({
    id: 1,
    name: ''
  })
  const [voters, setVoters] = useState([])

  // const [access, setAccess] = useState('private')
  useEffect(() => setAddress(props.accounts['0']))

  const loaded = context && context.drizzle && context.drizzle.contracts && context.drizzle.contracts.VotingFactory
  useEffect(() => {
    const { drizzle } = context
    const { contracts, web3 } = drizzle
    const { VotingFactory } = contracts
    if (VotingFactory) {
      VotingFactory.events.VotingCreated({}, (err, data) => {
        console.log(data)
        console.log(data.returnValues._contract)
        console.log(Voting)
        const contractAddress = data.returnValues._contract
        const contractConfig = {
          contractName: 'Voting',
          web3Contract:  new context.drizzle.web3.eth.Contract(Voting.abi, contractAddress) 
        }
        const events = []
        context.drizzle.addContract(contractConfig, events)
        props.history.push(`/voting/${contractAddress}`)
      })
    }
  }, [loaded])

// VotingFactory.events

  const createVoting = async () => {
    console.log(title)
    console.log(description)
    console.log(startDate)
    console.log(endDate)
    console.log(candidates)
    console.log(voters)
    if (!title) {
      alert('title is required')
      return
    }
    const start = startDate.getTime() / 1000 | 0
    const end = endDate.getTime() / 1000 | 0

    if (start >= end) {
      alert('invalid dates')
      return
    }

    if (voters.length == 0) {
      alert('invalid voters')
      return
    }

    const { drizzle } = context
    const { contracts, web3 } = drizzle
    const { VotingFactory } = contracts

    const proposalNames = candidates.map(item => web3.utils.fromAscii(item.name))

    const stackId = VotingFactory.methods.newVotingInstance.cacheSend(
      title,
      description,
      proposalNames,
      start,
      end,
      {
        from: address,
        //gasPrice: 2000000000
      })
    console.log(stackId)
  }

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
            <Card style={{ display: 'flex', minHeight: 'calc(100vh - 900px)', border: 'none', paddingBottom: 60, alignItems: 'center', flexDirection: 'column' }}>
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
                Créer une élection 
              </div>
              <div style={{ width: '60%' }}>
                <Input
                  required
                  style={{ textAlign: 'left' }}
                  label='Titre'
                  placeholder=''
                  onChange={evt => setTitle(evt.target.value)}
                />
                <div style={{ marginTop: 25 }}>
                  <Textarea
                    label='Description'
                    rows={4}
                    placeholder=''
                    onChange={evt => setDescriptioh(evt.target.value)}
                  />
                </div>
                <div style={{ marginTop: 25, display: 'flex', flexDirection: 'row' }}>
                  <div>
                    <DateTimePicker
                      required
                      label='Début'
                      value={startDate}
                      onChange={value => setStartDate(value)}
                      formatStyle='large'
                      locale={locale.name}
                      okLabel={okButtonLocalizedLabel[locale.name]}
                      cancelLabel={cancelButtonLocalizedLabel[locale.name]}
                      minDate={new Date()}
                    />
                  </div>
                  <div style={{ marginLeft: 15 }}>
                    <DateTimePicker
                      required
                      label='Fin'
                      value={endDate}
                      onChange={value => setEndDate(value)}
                      formatStyle='large'
                      locale={locale.name}
                      okLabel={okButtonLocalizedLabel[locale.name]}
                      cancelLabel={cancelButtonLocalizedLabel[locale.name]}
                      minDate={startDate}
                    />
                  </div>
                </div>
                <div style={{ marginTop: 25, display: 'flex', alignItems: 'flex-start' }}>
                  <label style={{
                    color: '#576574',
                    fontSize: '0.875rem',
                    lineHeight: '1.5',
                    marginBottom: '0.125rem'
                  }}
                  >Options
                  </label>
                </div>
                <div style={{ marginBottom: 25, textAlign: 'initial' }}>
                  {
                    candidates.map(item => (
                      <div style={{ display: 'inline-flex' }}>
                        <Chip
                          style={{ marginLeft: 0 }}
                          className='rainbow-m-around_medium'
                          label={
                            <div onClick={() => {
                              setOpen(true)
                              setUpdate(true)
                              setCandidate(item)
                            }}
                            >{item.name}
                            </div>
                          }
                          variant='neutral'
                          onDelete={() => {
                            if (candidates.length === 2) {
                              return
                            }
                            setCandidates(candidates.filter(x => item.id !== x.id))
                          }}
                        />
                      </div>
                    ))
                  }
                  <Button
                    style={{ marginLeft: 8 }} onClick={() => {
                      setOpen(true)
                      setUpdate(false)
                      setCandidate({})
                    }} variant='neutral'
                  >
                      Ajouter un candidat 
                    <FontAwesomeIcon icon={faPlus} style={{ marginLeft: 15 }} />
                  </Button>
                </div>

                <div style={{ marginTop: 25, display: 'flex', alignItems: 'flex-start' }}>
                  <label style={{
                    color: '#576574',
                    fontSize: '0.875rem',
                    lineHeight: '1.5',
                    marginBottom: '0.125rem'
                  }}
                  >Electeurs
                  </label>

                </div>
                <div style={{ textAlign: 'initial', marginTop: 15, marginLeft: 15, marginBottom: 25 }}>
                  <Button
                    style={{ width: 150 }}
                    label='Ajouter'
                    onClick={() => fileInput.click()}
                    variant='neutral'
                  />
                  <input
                    id='voters' onChange={evt => {
                      const file = evt.target.files[0]
                      if (file.type !== 'text/csv') {
                        return
                      }
                      Papa.parse(file, {
                        complete: function (results) {
                          console.log('Parsing complete:', results)
                          setVoters(results.data.map((item, index) => ({ id: index + 1, account: item[0] })))
                        }
                      })
                    }} ref={ref => fileInput = ref} style={{ display: 'none  ' }} type='file'
                  />
                </div>
                {/* <div style={{ marginTop: 25 }}>
                  <RadioButtonGroup
                    options={options}
                    value={access}
                    onChange={event => setAccess(event.target.value)}
                    label='Voters Access'
                  />
                </div> */}
                {
                  voters.length > 0 && (
                    <TableWithBrowserPagination pageSize={5} data={voters} keyField='id'>
                      <Column header='ID' field='id' width={60} />
                      <Column header='Account' field='account' />
                    </TableWithBrowserPagination>
                  )
                }

              </div>

              <div style={{ marginTop: 50, display: 'flex', width: '60%', justifyContent: 'flex-end' }}>
                <Button
                  style={{ width: 150 }}
                  label='Créer'
                  onClick={createVoting}
                  variant='brand'
                />
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Modal
        title={update ? 'Edit option' : 'Add options'}
        isOpen={open}
        onRequestClose={() => { setOpen(false) }}
        footer={
          <div className='rainbow-flex rainbow-justify_end'>
            <Button
              form='redux-form-id'
              className='rainbow-m-right_large'
              label='Cancel'
              variant='neutral'
              onClick={() => { setOpen(false) }}
            />
            <Button
              form='redux-form-id'
              label='Save'
              variant='brand'
              type='submit'
              onClick={() => {
                if (!candidate.name) {
                  return
                }
                setOpen(false)
                if (update) {
                  setCandidates(candidates.map(item => {
                    if (item.id === candidate.id) {
                      return candidate
                    }
                    return item
                  }))
                  return
                }
                candidate.id = candidates.length + 1
                candidates.push(candidate)
                setCandidates(candidates)
              }}
            />
          </div>
        }
      >
        <Input
          required
          style={{ textAlign: 'left' }}
          label='Name'
          placeholder=''
          value={candidate.name}
          onChange={e => {
            const updated = {
              id: candidate.id,
              name: e.target.value,
              description: candidate.description
            }
            setCandidate(updated)
          }}
        />
        <div style={{ marginTop: 25 }}>
          <Textarea
            label='Description'
            rows={4}
            placeholder=''
            value={candidate.description}
            onChange={e => {
              const updated = {
                id: candidate.id,
                name: candidate.name,
                description: e.target.value
              }
              setCandidate(updated)
            }}
          />
        </div>
      </Modal>
    </div>
  )
}

App.contextTypes = {
  drizzle: PropTypes.object,
}

const mapStateToProps = state => ({
  accounts: state.accounts,
  VotingFactory: state.contracts.VotingFactory,
  drizzleStatus: state.drizzleStatus
})

export default drizzleConnect(App, mapStateToProps)
