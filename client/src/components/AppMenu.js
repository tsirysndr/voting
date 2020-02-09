import React from 'react'
import { Container } from './styles/AppMenuStyles'

const AppMenu = (props) => (
  <Container>
    <div style={{
      color: '#ff0090',
      fontFamily: 'Product Sans Bold',
      fontSize: 25,
      height: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}
    >
      Voting dApp
    </div>
  </Container>
)

export default AppMenu
