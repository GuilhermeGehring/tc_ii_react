import React, { useRef, useState, useEffect } from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { auth, db } from '../firebase';
import InputMask from "react-input-mask";

export default function UpdateProfile () {
  const [user, setUser] = useState({})

  const nomeRef = useRef()
  const emailRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  const telefoneRef = useRef()
  const latitudeRef = useRef()
  const longitudeRef = useRef()
  const { currentUser, updatePassword, updateEmail } = useAuth()  
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const [mask, setMask] = useState('');

  useEffect(() => {
    setMask(user.telefone || '');
  }, [user.telefone]);

  useEffect(() => {
    async function unsubscribe () {
      await auth.onAuthStateChanged(async (response) => {
        if (response) {
          const fbUser = await db.collection('usuarios').doc(response.uid).get()
          setUser(fbUser.data());
        } else {
          setUser(false);
        }
      });
    }
    // Cleanup subscription on unmount
    unsubscribe()
  }, []);

  function update (user) {
    db.collection("usuarios")
          .doc(currentUser.uid)
          .set(user)
  }

  function handleSubmit (e) {
    e.preventDefault()

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError('Passwords do not match')
    }

    const promises = []
    const user = {
      nome: nomeRef.current.value,
      email: emailRef.current.value,
      telefone: telefoneRef.current.value,
      latitude: latitudeRef.current.value,
      longitude: longitudeRef.current.value
    }

    setLoading(true)
    setError('')

    if (emailRef.current.value !== currentUser.email) {
      promises.push(updateEmail(emailRef.current.value))
    }
    if (passwordRef.current.value) {
      promises.push(updatePassword(passwordRef.current.value))
    }

    Promise.all(promises).then(() => {
      update(user)
      history.push('/')
    }).catch(() => {
      setError('Failed to update account')
    }).finally(() => {
      setLoading(false)
    })

    setLoading(false)
  }

  return (
        <>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Atualizar Usuário</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group id="nome">
                  <Form.Label>Nome</Form.Label>
                  <Form.Control
                    type="nome"
                    ref={nomeRef}
                    defaultValue={user.nome}
                    required
                  />
                </Form.Group>
                <Form.Group id="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    ref={emailRef}
                    defaultValue={currentUser.email}
                    required
                  />
                </Form.Group>
                <Form.Group id="password">
                  <Form.Label>Senha</Form.Label>
                  <Form.Control
                    type="password"
                    ref={passwordRef}
                    placeholder="Deixe em branco para manter a senha"
                  />
                </Form.Group>
                <Form.Group id="password-confirm">
                  <Form.Label>Confirme sua senha</Form.Label>
                  <Form.Control
                  type="password"
                  ref={passwordConfirmRef}
                  placeholder="Deixe em branco para manter a senha"
                />
                <Form.Group id="telefone">
                  <Form.Label>Telefone</Form.Label>
                  <InputMask
                    className="form-control"
                    mask="(99) 99999-9999"
                    ref={telefoneRef}
                    value={mask}
                  />
                </Form.Group>
                <Form.Group id="latitude">
                  <Form.Label>Latitude</Form.Label>
                  <Form.Control
                    type="latitude"
                    ref={latitudeRef}
                    defaultValue={user.latitude}
                  />
                </Form.Group>
                <Form.Group id="longitude">
                  <Form.Label>Longitude</Form.Label>
                  <Form.Control
                    type="longitude"
                    ref={longitudeRef}
                    defaultValue={user.longitude}
                  />
                </Form.Group>
                </Form.Group>
                <Button disabled={loading} className="w-100" type="submit">
                  Atualizar
                </Button>
              </Form>
            </Card.Body>
          </Card>
          <div className="w-100 text-center mt-2">
            <Link to="/">Cancelar</Link>
          </div>
        </>
  )
}
