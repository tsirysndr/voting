import React, { useState, useEffect } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import AppMenu from './components/AppMenu'
import { Button, Card, Input, Textarea, Chip, DateTimePicker, Modal, TableWithBrowserPagination,  Table, Column, Badge } from 'react-rainbow-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import Papa from 'papaparse'
import { drizzleConnect } from '@drizzle/react-plugin'

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

let fileInput =  {}

function App (props, context) {
  console.log(context)
  const [open, setOpen] = useState(false)
  const [address, setAddress] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescriptioh] = useState('') 
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [locale] = useState({ name: 'en-US', label: 'English (US)' })
  const [candidates, setCandidates] = useState([{ id: 1, name: 'Candidate 1' }, { id: 2, name: 'Candidate 2' } ])
  const [update, setUpdate] = useState(false)
  const [candidate, setCandidate] = useState({
    id: 1,
    name: '',
  })
  const [voters, setVoters] = useState([])

  // const [access, setAccess] = useState('private')
  useEffect(() =>  setAddress(props.accounts['0'])) 

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
      return;
    } 

    if (voters.length == 0) {
      alert('invalid voters')
      return;
    }
    
    const proposalNames = candidates.map(item => item.name);

    const contract = props.VotingFactory;
    console.log(contract.methods)
    const stackId = contract.methods['newVotingInstance'].cacheSend(
      title,
      description,
      proposalNames,
      start,
      end, 
      {
       from: address,
      });
      console.log(stackId)
  }

  return (
    <div className='App'>
      <AppMenu />
      <div style={{ width: 'calc(100vw - 240px)' }}>
        <Navbar address={address} />
        <div style={{
          boxShadow: 'inset 20px 20px 30px rgba(0,0,0,0.05)',
          height: 'calc(100vh - 50px - 4rem)',
          paddingBottom: '4rem',
          overflowY: 'scroll'
        }}
        >
          <div style={{
            marginLeft: 'auto',
            marginRight: 'auto',
            paddingTop: '4em',
            maxWidth: 920
          }}
          >
            <Card style={{ display: 'flex', minHeight: 'calc(100vh - 150px)', border: 'none', paddingBottom: 60, alignItems: 'center', flexDirection: 'column' }}>
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
                Create an Election
              </div>
              <div style={{ width: '60%' }}>
                <Input
                  required
                  style={{ textAlign: 'left' }}
                  label='Title'
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
                      label='Start Date'
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
                      label='End Date'
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
                              setOpen(true); 
                              setUpdate(true);
                              setCandidate(item);
                            }}>{item.name}</div>
                          }
                          variant='neutral'
                          onDelete={() => {
                            if (candidates.length === 2) {
                              return;
                            } 
                            setCandidates(candidates.filter(x => item.id !== x.id))
                          }}
                        />
                      </div>
                    ))
                  }
                  <Button style={{ marginLeft: 8 }} onClick={() => { 
                    setOpen(true); 
                    setUpdate(false);
                    setCandidate({}); 
                  }} variant='neutral'>
                      Add option
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
                  >Voters
                  </label>
                  
                </div>
                <div style={{ textAlign: 'initial', marginTop:15, marginLeft: 15,  marginBottom: 25, }}>
                    <Button
                      style={{ width: 150 }}
                      label='Add voters'
                      onClick={() => fileInput.click()}
                      variant='neutral'
                    />
                    <input id="voters" onChange={evt => {
                      const file = evt.target.files[0];
                      if (file.type !== 'text/csv') {
                        return;
                      }
                      Papa.parse(file, {
                        complete: function(results) {
                          console.log("Parsing complete:", results);
                          setVoters(results.data.map((item, index) => ({ id: index + 1, account: item[0] })))
                        }
                      })
                    }} ref={ref => fileInput = ref} style={{ display: 'none  ' }} type='file' /> 
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
                    <TableWithBrowserPagination pageSize={5} data={voters} keyField="id">
                        <Column header="ID" field="id" width={60} />
                        <Column header="Account" field="account" />
                    </TableWithBrowserPagination>
                  )
                }

              </div>

              <div style={{ marginTop: 50, display: 'flex', width: '60%', justifyContent: 'flex-end' }}>
                <Button
                  style={{ width: 150 }}
                  label='Create'
                  onClick={createVoting}
                  variant='brand'
                />
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Modal
        title={ update ? 'Edit option' : 'Add options' }
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
                  return;
                }
                setOpen(false);
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
                setCandidates(candidates); 
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
             };
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
               };
              setCandidate(updated)
            }} 
          />
        </div>
      </Modal>
    </div>
  )
}

const mapStateToProps = state => ({
  accounts: state.accounts,
  VotingFactory: state.contracts.VotingFactory,
  drizzleStatus: state.drizzleStatus
})

export default drizzleConnect(App, mapStateToProps)
