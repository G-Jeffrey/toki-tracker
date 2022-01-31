import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Spinner, InputGroup } from "react-bootstrap";
import "./user.css";

const backendHost = process.env.BACKEND_URL;
const Login = () => {
  // const [state, dispatch] = useReducer(loginReducer, initalState)
  const [user_auth, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [invalid, setInvalid] = useState('');
  const [hide, setHide] = useState(true);
  const [loading, setLoading] = useState(false);
  const validateLogin = async () => {
    return await axios({
      method: 'POST',
      url: `${backendHost}/users/login`,
      data: {
        user_identification: user_auth,
        password: password
      }
    });
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setInvalid('');
    const request_login = await validateLogin();
    if (request_login.status === 203) {
      setInvalid(request_login.data['msg']);
    } else if (request_login.status === 200) {
      let json = request_login.data.userInfo;
      setInvalid("");
      document.cookie = `user_id=${json.user_id}; max-age=3600`;
      document.cookie = `username=${json.username}; max-age=3600`;
      document.cookie = `email=${json.email}; max-age=3600`;
      document.cookie = `first_name=${json.first_name}; max-age=3600`;
      document.cookie = `last_name=${json.last_name}; max-age=3600`;
      document.cookie = `pfp=${json.pfp}; max-age=3600`;
      window.location.pathname = '/';
    } else {
      setInvalid("Server error while handling response, please try again later.")
    }
    setLoading(false);
  };
  return (
    <>
      <div className="login-layout">
        <div className='left-image'></div>
        <div className="Login">
          <Form onSubmit={handleSubmit}>
            <div className='invalid'>{invalid === '' ? "" : invalid}</div>
            <Form.Group controlId="user_auth">
              <Form.Label>Username/Email</Form.Label>
              <Form.Control
                autoFocus
                type="text"
                placeholder={'jdoe/jdoe@aol.com'}
                value={user_auth}
                onChange={(e) => setUser(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={hide ? "password" : "text"}
                  placeholder={"*********"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                /><Button id="btnGroupAddon" variant={hide ? "light" : "dark"} onClick={() => setHide(!hide)}>{hide ? 'Show' : 'Hide'}</Button>
              </InputGroup>
            </Form.Group>
            <hr />

            <Button variant='outline-dark'
              // @ts-ignore
              size="md" type="submit" disabled={loading}>
              {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : "Login"}
            </Button>
            <Button variant="link" size="sm" href="./signup">
              Signup!
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
}
export default Login;