import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, 
         signInWithEmailAndPassword, sendPasswordResetEmail,
         GoogleAuthProvider, signInWithPopup, signInWithCredential } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDa_aPiNQpV8H-J1vd12K9zlYu0JlrnbQA",
  authDomain: "connectentrepreneurs.firebaseapp.com",
  projectId: "connectentrepreneurs",
  storageBucket: "connectentrepreneurs.firebasestorage.app",
  messagingSenderId: "238114919941",
  appId: "1:238114919941:web:d763af15c5bdcc1170ae6c"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);

export const registerUser = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

export const loginUser = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const loginWithGoogle = () =>
  signInWithPopup(auth, new GoogleAuthProvider());

export const loginWithGoogleIdToken = (idToken) => {
  const credential = GoogleAuthProvider.credential(idToken);
  return signInWithCredential(auth, credential);
};

export const resetPassword = (email) =>
  sendPasswordResetEmail(auth, email);