import React, { useState, useEffect } from 'react';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signInWithRedirect, signOut } from 'firebase/auth';
import { app, firestore } from '../components/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

const db = firestore; // Get Firestore instance

export const signInWithGoogle = () => {
    signInWithRedirect(getAuth(app), new GoogleAuthProvider());
    // can also do signInWithPopUp but causes CORS issues !!!
};

const firebaseSignOut = () => signOut(getAuth(app));

export { firebaseSignOut as signOut };

export const useAuthState = () => {
  const [user, setUser] = useState();
  
  useEffect(() => (
    onAuthStateChanged(getAuth(app), setUser)
  ), []);

  return [user];
};