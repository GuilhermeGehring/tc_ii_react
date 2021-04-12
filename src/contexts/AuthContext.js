import React, { useContext, useState, useEffect } from 'react'
import { auth, db, googleProvider, facebookProvider } from '../firebase'

const AuthContext = React.createContext()

export function useAuth () {
  return useContext(AuthContext)
}

// eslint-disable-next-line react/prop-types
export function AuthProvider ({ children }) {
  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)

  async function signup (email, password) {
    return await auth.createUserWithEmailAndPassword(email, password)
    .then(result => {
      db.collection("usuarios")
        .doc(result.user.uid)
        .set({"email": email})
    })
  }

  async function login (email, password) {
    return await auth.signInWithEmailAndPassword(email, password)
  }

  async function loginWithGoogle () {
    googleProvider.addScope('profile')
    googleProvider.addScope('email')

    return await auth.signInWithPopup(googleProvider)
      .then(result => {
        db.collection("usuarios")
          .doc(result.user.uid)
          .set({
            "nome": result.user.displayName,
            "email": result.user.email
          })
      })
  }

  async function loginWithFacebook () {
    return await auth.signInWithPopup(facebookProvider)
      .then((result) => {
        console.log(result)
        // db.collection("usuarios")
        //   .doc(result.user.uid)
        //   .set({
        //     "nome": result.user.displayName,
        //     "email": result.user.email
        //   })
      }).catch((error) => {
        console.log(error.code)
        console.log(error.message)
        // The email of the user's account used.
        console.log(error.email)
        // The firebase.auth.AuthCredential type that was used.
        console.log(error.credential)
      });
  }

  function logout () {
    return auth.signOut()
  }

  function resetPassword (email) {
    return auth.sendPasswordResetEmail(email)
  }

  function updateEmail (email) {
    return currentUser.updateEmail(email)
  }

  function updatePassword (password) {
    return currentUser.updatePassword(password)
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    signup,
    login,
    loginWithGoogle,
    loginWithFacebook,
    logout,
    resetPassword,
    updateEmail,
    updatePassword
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
