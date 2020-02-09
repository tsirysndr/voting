import React, { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import AppMenu from './components/AppMenu'
import { Button, Card, Input, Textarea, Chip, DateTimePicker, RadioButtonGroup } from 'react-rainbow-components'

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

function App () {
  const [value, setValue] = useState(new Date('2019-10-25 10:44'))
  const [locale] = useState({ name: 'en-US', label: 'English (US)' })
  const [access, setAccess] = useState('private')
  return (
    <div className='App'>
      <AppMenu />
      <div style={{ width: 'calc(100vw - 240px)' }}>
        <Navbar />
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
            <Card style={{ minHeight: 'calc(100vh - 150px)', border: 'none', paddingBottom: 60 }}>
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
              <div style={{ width: '50%', marginLeft: 50 }}>
                <Input
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
                <div style={{ marginTop: 25 }}>
                  <label style={{
                    color: '#576574',
                    fontSize: '0.875rem',
                    lineHeight: '1.5',
                    marginBottom: '0.125rem'
                  }}
                  >Options
                  </label>
                </div>
                <div style={{ marginBottom: 25 }}>
                  <Chip
                    className='rainbow-m-around_medium'
                    label='Chip base'
                    onDelete={() => alert('Delete Chip!')}
                  />

                  <Chip
                    className='rainbow-m-around_medium'
                    label='Chip Neutral'
                    variant='neutral'
                    onDelete={() => alert('Delete Chip!')}
                  />

                  <Chip
                    className='rainbow-m-around_medium'
                    label='Chip Outline Brand'
                    variant='outline-brand'
                    onDelete={() => alert('Delete Chip!')}
                  />

                  <Chip
                    className='rainbow-m-around_medium'
                    label='Chip Brand'
                    variant='brand'
                    onDelete={() => alert('Delete Chip!')}
                  />
                </div>

                <div style={{ marginTop: 25 }}>
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
                <div style={{ marginTop: 25 }}>
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
                <div style={{ marginTop: 25 }}>
                  <RadioButtonGroup
                    options={options}
                    value={access}
                    onChange={event => setAccess(event.target.value)}
                    label='Voters Access'
                  />
                </div>
              </div>

              <div style={{ marginTop: 50 }}>
                <Button
                  label='Launch'
                  onClick={() => alert('clicked!')}
                  variant='brand'
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
