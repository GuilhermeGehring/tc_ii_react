/* eslint-disable react/prop-types */
import React from "react";
import "../styles.css";
import { Container, Nav, Navbar } from "react-bootstrap";
import { ReactComponent as Logo } from "../logo.svg";

import "bootstrap/dist/css/bootstrap.min.css";

export default function Menu(props) {

  return (
    <>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Brand href="/">
          <Logo
            alt=""
            width="30"
            height="30"
            className="d-inline-block align-top"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/assunto">Assuntos</Nav.Link>            
            {/* <Nav.Link onClick={handleLogout}>Sair</Nav.Link> */}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Container>
        <div className="row justify-content-center">
          <div className="col-md-8">
            { props.children }
          </div>
        </div>
      </Container>
    </>
  );
}
