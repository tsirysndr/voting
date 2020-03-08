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

/* global alert */

const Voting = (props, context) => {
  const [address, setAddress] = useState('')

  // const [access, setAccess] = useState('private')
  useEffect(() => setAddress(props.accounts['0']))
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
               Voting
              </div>
              <List className="md-cell md-paper md-paper--1">
                <ListItem primaryText={<div style={{
                color: '#01b6f5',
              }}
              >
               Inbox
              </div>}
              style={{ backgroundColor: '#01b6f51a' }} 
              rightIcon={<FontAwesomeIcon icon={faCheckCircle}  color='#01b6f5'/>} />
                <ListItem primaryText="Starred" />
                <ListItem primaryText="Sent Mail" />
                <ListItem primaryText="Drafts" />
                </List>
            </Card>
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
  drizzleStatus: state.drizzleStatus
})

export default drizzleConnect(Voting, mapStateToProps)
