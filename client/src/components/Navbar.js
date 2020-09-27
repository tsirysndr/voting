import React from 'react'
import { Container } from './styles/NavbarStyles'

const Navbar = (props) => (
  <Container>
    <p >{props.address}</p> 
  </Container>
)

export default Navbar