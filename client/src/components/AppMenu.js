import React from 'react'
import { Container } from './styles/AppMenuStyles'

const AppMenu = (props) => (
  <Container>
    <div style={{
      color: '#ffffff',
      fontFamily: 'Product Sans Bold',
      fontSize: 24,
      height: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}
    >
      Voting App
    </div>
  </Container>
)

export default AppMenu