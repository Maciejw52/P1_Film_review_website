import React from 'react'
import { UserContext } from '../../UserContext';
import { useContext, useRef, useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import { postAuthenticateUser } from '../../utils/api';
import bcrypt from 'bcryptjs'
import ErrorAlerts from '../Alerts/ErrorAlerts';

function UserLogin({ showLogin, setShowLogin }) {
  
  // Getting input data from forms and context for the user
  const { userLogin } = useContext(UserContext);
  const usernameInputRef = useRef();
  const passwordInputRef = useRef();

  const [showAlert, setShowAlert] = useState(false);
  const [errorCode, setErrorCode] = useState("");
    
  const handleLoginForm = (event) => {
    // Prevents page reloading 
    event.preventDefault();

    // Set username and hashed password to be sent to server
    const username = usernameInputRef.current.value
    const hashedPass = bcrypt.hashSync(passwordInputRef.current.value);

    // Attempt to send the new username and password to server
    postAuthenticateUser({
      username: username,
      password: hashedPass
    }).then((response) => {
      
      // if 200, user is authorised
      if (response.status === 200 ) {

        setShowLogin(false);
        userLogin(username);
        console.log(`Set username to ${username}`);

      } else {
        setErrorCode(response.status);
        setShowAlert(true);
      }
    }).catch((error) => {
      //This catch is only catching errors from attempting to post
      console.log(error);
    })
  };


  const handleClose = () => {
    userLogin("Anon");
    setShowLogin(false);
  };


  return (
    <>
      <div style={{textAlign: "center"}}>
        <Modal show={showLogin} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Please Login</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleLoginForm} className='flex-container' style={{ flexDirection: "column" }}> 
            <Modal.Body>
              <div className="form">
                <div className="input-container">
                  <Form.Control ref={usernameInputRef} type="text" name="username" id="username" placeholder='Username' required />
                </div>
                <br/>
                <div className="input-container">
                  <Form.Control ref={passwordInputRef} type="password" name="password" id="password" placeholder='Password' required />
                </div>
              </div>
            </Modal.Body>
            {showAlert ? <ErrorAlerts errorCode={errorCode} /> : null }
            <Modal.Footer>
              <Button type="submit" className="btn btn-success LoginButton">Login</Button>
              <Button className="btn btn-danger LoginButton" onClick={handleClose}>Continue as Anon</Button>
            </Modal.Footer>
          </Form>

        </Modal>
      </div>
    </>

  )
}

export default UserLogin