import React from 'react'; 
import { BsKeyboard, BsDiscord } from "react-icons/bs";
import { FaYoutube } from "react-icons/fa";

import { Navbar, Nav, Container } from 'react-bootstrap';
import './Footer.css'
const Footer = ()=>{
    return (
        <>
        <Navbar bg="dark" variant="dark" expand="md">
            <Container>
                <Nav className="mx-auto">
                    <Nav.Link href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'><FaYoutube size='2em'/></Nav.Link>
                </Nav>
                <Nav className="mx-auto">
                    <Nav.Link href = 'https://keyboard.university/'><BsKeyboard size='3em'/></Nav.Link>
                </Nav>
                <Nav className="mx-auto">
                    <Nav.Link href = "https://discord.gg/wKwrKEfsKh"><BsDiscord size='3em'/></Nav.Link>
                </Nav>
            </Container>
        </Navbar>
        <div className='copyright'>
            Copyright {new Date().getFullYear()}
        </div>
        </>
    );
}
export default Footer;