import React, { useRef, useState } from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'

export default function Login () {
  const emailRef = useRef()
  const passwordRef = useRef()
  const { login, loginWithGoogle, loginWithFacebook } = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const history = useHistory()

  async function handleSubmit (e) {
    e.preventDefault()

    try {
      setError('')
      setLoading(true)
      await login(emailRef.current.value, passwordRef.current.value)
      history.push('/')
    } catch {
      setError('Failed to log in')
    }

    setLoading(false)
  }

  async function handleSubmitGoogle (e) {
    e.preventDefault()

    try {
      setError('')
      setLoading(true)
      await loginWithGoogle()
      history.push('/')
    } catch {
      setError('Failed to log in with google')
    }

    setLoading(false)
  }

  async function handleSubmitFacebook (e) {
    e.preventDefault()

    try {
      setError('')
      setLoading(true)
      await loginWithFacebook()
      history.push('/')
    } catch {
      setError('Failed to log in with facebook')
    }

    setLoading(false)
  }

  return (
        <>
          <Card>
            <Card.Header>Login</Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="row" id="email">
                  <Form.Label class="col-md-4 col-form-label text-md-right">Email</Form.Label>
                  <div className="col-md-6">
                    <Form.Control type="email" ref={emailRef} required />
                  </div>
                </Form.Group>
                <Form.Group className="row" id="password">
                  <Form.Label class="col-md-4 col-form-label text-md-right">Senha</Form.Label>
                  <div className="col-md-6">
                    <Form.Control type="password" ref={passwordRef} required />
                  </div>
                </Form.Group>
                <Form.Group className="row mb-0">
                  <div className="col-md-8 offset-md-4">
                    <Button className="col-md-8 mb-1" disabled={loading} type="submit">
                      Log In
                    </Button>
                    <Button className="col-md-8 mb-1" variant="danger" onClick={handleSubmitGoogle} disabled={loading} type="submit">
                      Log In Com Google
                    </Button>
                    <Button className="col-md-8 mb-1" variant="info" onClick={handleSubmitFacebook} disabled={loading} type="submit">
                      Log In Com Facebook
                    </Button>
                  </div>
                </Form.Group>
              </Form>
              <div className="w-100 text-center mt-3">
                <Link to="/forgot-password">Esqueceu a senha?</Link>
              </div>
            </Card.Body>
          </Card>
          <div className="w-100 text-center mt-2">
            <Link to="/signup">Ainda não tenho uma conta</Link>
          </div>
        </>
  )
}
