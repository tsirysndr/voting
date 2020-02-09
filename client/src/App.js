import React, { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import AppMenu from './components/AppMenu'
import { Button, Card, Input, Textarea, Chip, DateTimePicker, RadioButtonGroup, Modal } from 'react-rainbow-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee, faCheck, faArrowRight, faPlus } from '@fortawesome/free-solid-svg-icons';


/* global alert */

const options = [
  { value: 'private', label: 'Private' },
  { value: 'public', label: 'Public' }
]

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

function App (props) {
  const [open, setOpen] = useState(false)
  const [address, setAddress] = useState('')
  const [value, setValue] = useState(new Date('2019-10-25 10:44'))
  const [locale] = useState({ name: 'en-US', label: 'English (US)' })
  const [access, setAccess] = useState('private')
  const { drizzle } = props
  drizzle.store.subscribe(() => {
    const drizzleState = drizzle.store.getState()
    setAddress(drizzleState.accounts['0'])
  })
  return (
    <div className='App'>
      <AppMenu />
      <div style={{ width: 'calc(100vw - 240px)' }}>
        <Navbar address={address}/>
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
                Create new vote
              </div>
              <div style={{ width: '60%' }}>
                <Input
                  required
                  style={{ textAlign: 'left' }}
                  label='Title'
                  placeholder=''
                />
                <div style={{ marginTop: 25 }}>
                  <Textarea
                    label='Description'
                    rows={4}
                    placeholder=''
                  />
                </div>
                <div style={{ marginTop: 25, display: 'flex', flexDirection: 'row' }}>
                  <div>
                    <DateTimePicker
                      label='Start'
                      value={value}
                      onChange={value => setValue(value)}
                      formatStyle='large'
                      locale={locale.name}
                      okLabel={okButtonLocalizedLabel[locale.name]}
                      cancelLabel={cancelButtonLocalizedLabel[locale.name]}
                    />
                  </div>
                  <div style={{ marginLeft: 15 }}>
                    <DateTimePicker
                      label='End'
                      value={value}
                      onChange={value => setValue(value)}
                      formatStyle='large'
                      locale={locale.name}
                      okLabel={okButtonLocalizedLabel[locale.name]}
                      cancelLabel={cancelButtonLocalizedLabel[locale.name]}
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
                <div style={{ display: 'inline-flex' }} onClick={() => { setOpen(true) }}>
                  <Chip 
                    style={{ marginLeft: 0 }}
                    className='rainbow-m-around_medium'
                    label='Candidate 1'
                    variant='neutral'
                    // onDelete={() => alert('Delete Chip!')}
                  />
                </div>
                <div style={{ display: 'inline-flex' }} onClick={() => { setOpen(true) }}>
                  <Chip 
                    className='rainbow-m-around_medium'
                    label='Candidate 2'
                    variant='neutral'
                    // onDelete={() => alert('Delete Chip!')}
                  />
                </div>
                  
                  <Button style={{ marginLeft: 8 }} onClick={() => { setOpen(true) }} variant="neutral">
                      Add option
                      <FontAwesomeIcon icon={faPlus} style={{ marginLeft: 15 }} />
                  </Button>
                </div>

                {/*<div style={{ marginTop: 25 }}>
                  <RadioButtonGroup
                    options={options}
                    value={access}
                    onChange={event => setAccess(event.target.value)}
                    label='Voters Access'
                  />
                </div>*/}
              </div>

              <div style={{ marginTop: 50, display: 'flex', width: '60%', justifyContent: 'flex-end' }}>
                <Button
                  style={{ width: 150 }}
                  label='Launch'
                  onClick={() => alert('clicked!')}
                  variant='brand'
                />
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Modal
        title="Add Option"
        isOpen={open}
        onRequestClose={() => { setOpen(false) }}
        footer={
            <div className="rainbow-flex rainbow-justify_end">
                <Button
                    form="redux-form-id"
                    className="rainbow-m-right_large"
                    label="Cancel"
                    variant="neutral"
                    onClick={() => { setOpen(false) }}
                />
                <Button
                    form="redux-form-id"
                    label="Save"
                    variant="brand"
                    type="submit"
                    onClick={() => { setOpen(false) }}
                />
            </div>
        }
      >
      </Modal>

    </div>
  )
}

export default App
