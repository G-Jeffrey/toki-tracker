import React from 'react'; 
import { BsLinkedin, BsGithub, BsDiscord } from "react-icons/bs";
import { Navbar, Nav, Container } from 'react-bootstrap';
import './Footer.css'
const Footer = ()=>{
    return (
        <>
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Nav className="mx-auto">
                    <Nav.Link href = ''><BsLinkedin size='2em'/></Nav.Link>
                </Nav>
                <Nav className="mx-auto">
                    <Nav.Link href = ''><BsGithub size='2em'/></Nav.Link>
                </Nav>
                <Nav className="mx-auto">
                    <Nav.Link href = "https://discord.gg/wKwrKEfsKh"><BsDiscord size='2em'/></Nav.Link>
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