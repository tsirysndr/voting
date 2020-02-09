import React from 'react'
import { Container } from './styles/NavbarStyles'

const Navbar = (props) => (
  <Container>
    {props.address}
  </Container>
)

export default Navbar
