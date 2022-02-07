import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Spinner, InputGroup } from "react-bootstrap";
import "./user.css";

const backendHost = process.env.REACT_APP_BACKEND_URL;
const Signup = () => {
  // const [state, dispatch] = useReducer(loginReducer, initalState)
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [first_name, setFirst] = useState('');
  const [last_name, setLast] = useState('');
  const [password, setPassword] = useState('');
  const [invalid, setInvalid] = useState('');
  const [load, setLoad] = useState(false);
  const [hide, setHide] = useState(true);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoad(true);
    const sign_up = await axios({
      method: 'POST',
      url: `${backendHost}/users/sign_up`,
      data: {
        username, email, first_name, last_name, password
      }
    })
    console.log(sign_up.data)
    if (sign_up.status === 203) {
      setInvalid(sign_up.data['msg']);
    } else if (sign_up.status === 200) {
      let json = sign_up.data;
      setInvalid("");
      document.cookie = `user_id=${json.user_id}; max-age=3600`;
      document.cookie = `username=${json.username}; max-age=3600`;
      document.cookie = `email=${json.email}; max-age=3600`;
      document.cookie = `first_name=${json.first_name}; max-age=3600`;
      document.cookie = `last_name=${json.last_name}; max-age=3600`;
      document.cookie = `pfp=${json.pfp}; max-age=3600`;
    } else {
      setInvalid("Server error while handling response, please try again later.")
    }
    setLoad(false);
    window.location.pathname = '';
  };
  const checkFields = () => {
    return username.length >= 4 && email.length >= 8 && first_name.length >= 2 && last_name.length >= 2 && password.length >= 6;
  }
  return (
    <>
      <div className="login-layout">
        <div className='left-image'></div>
        <div className="Login">
          <Form onSubmit={handleSubmit}>
            <div className='request_error'>{invalid === '' ? '' : invalid}</div>
            <Form.Group controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                autoFocus
                type="text"
                placeholder={'At least 4 characters'}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder={"At least 8 characters"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="first_name">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder={"At least 2 characters"}
                value={first_name}
                onChange={(e) => setFirst(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="last_name">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder={"At least 2 characters"}
                value={last_name}
                onChange={(e) => setLast(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Password </Form.Label>
              <InputGroup>
                <Form.Control
                  type={hide ? "password" : "text"}
                  placeholder={"At least 6 characters"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                /><Button id="btnGroupAddon" variant={hide ? "light" : "dark"} onClick={() => setHide(!hide)}>{hide ? 'Show' : 'Hide'}</Button></InputGroup>
            </Form.Group>
            <hr />
            <Button size="md" type="submit" variant='outline-dark' disabled={!checkFields() || load}>
              {load ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : "Sign up"}
            </Button>
            <Button variant="link" size="sm" href='./login'>
              Have a account? Login!
            </Button>
            {/* <div className='request_error'>{invalid}</div> */}
          </Form>
        </div>
      </div>
    </>
  );
}
export default Signup;