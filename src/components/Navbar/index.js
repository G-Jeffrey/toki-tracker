import React, { useState, useEffect } from 'react';
import { Navbar, Nav, NavDropdown, Container, OverlayTrigger,Tooltip } from 'react-bootstrap';
import { MdAccountCircle, MdLogin, MdLogout } from "react-icons/md";
import { DropdownSubmenu } from "react-bootstrap-submenu"
import 'bootstrap/dist/css/bootstrap.css';
import './Navbar.css'
const NavBar = () => {
  // const navigate = useNavigate();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [width, setWidth] = useState(window.innerWidth);
  const [load, setLoad] = useState(false);
  const handleScroll = () => {
    setScrollPosition(window.pageYOffset);
  };
  const updateWidth = () => {
    setWidth(window.innerWidth);
  }
  const path = window.location.pathname + '/';
  let user_id = document.cookie.split(';')[0].split('=');
  if (user_id[0] !== 'user_id') {
    user_id[1] = null;
  }
  const logout = () => {
    document.cookie = "username= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "first_name= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "last_name= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "email= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "user_id= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "pfp= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    setLoad(true);
  }
  useEffect(() => {
    window.addEventListener("resize", updateWidth);
    window.addEventListener("scroll", handleScroll);
    setLoad(false);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateWidth);
    };
  }, [load]);
  return (
    <Navbar collapseOnSelect bg="dark" variant="dark" expand="lg" sticky="top" style={scrollPosition > 55 && width > 992 ? { opacity: 0.75 } : { opacity: 1 }}>
      <Container>
        <Navbar.Brand href="/">Toki</Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">

          <Nav className="me-auto">
            {user_id[1] ?
              <Nav.Link href="orders" disabled={(path).startsWith('/orders/')} className='p-2 pr-4'>Orders</Nav.Link>
              : ""}
            {user_id[1] ?
              <Nav.Link href="items" disabled={(path).startsWith('/items/')} className='p-2 pr-4'>Items</Nav.Link>
              
              : ""}
            {user_id[1] ?
              <Nav.Link href="profile" disabled={(path).startsWith('/profile/')} className='p-2'>Profile</Nav.Link>
              : ""}
          </Nav>

          <Nav>
            {!user_id[1] ?
              <OverlayTrigger
                placement='bottom'
                overlay={
                  <Tooltip id={'tooltip-bottom'}>
                    Login
                  </Tooltip>
                }>
                <Nav.Link href='/login' disabled={(path === '/login/' || path === '/signup/')}><MdLogin size='2em' /></Nav.Link>
              </OverlayTrigger>
              :
              <OverlayTrigger
                placement='bottom'
                overlay={
                  <Tooltip id={'tooltip-bottom'}>
                    Logout
                  </Tooltip>
                }>
              <Nav.Link href='/' onClick={() => logout()}><MdLogout size='2em' /></Nav.Link>
              </OverlayTrigger>
            }
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>);
}
export default NavBar;