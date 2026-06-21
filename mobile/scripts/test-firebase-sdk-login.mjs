/**
 * Teste login Firebase via le SDK (environnement Node / web bundle).
 * Usage: node scripts/test-firebase-sdk-login.mjs
 */
import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDa_aPiNQpV8H-J1vd12K9zlYu0JlrnbQA",
  authDomain: "connectentrepreneurs.firebaseapp.com",
  projectId: "connectentrepreneurs",
  storageBucket: "connectentrepreneurs.firebasestorage.app",
  messagingSenderId: "238114919941",
  appId: "1:238114919941:web:d763af15c5bdcc1170ae6c",
};

const email = `sdk_test_${Date.now()}@connecto.test`;
const password = "TestPass123!";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

try {
  console.log("=== SDK SIGNUP ===");
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  console.log("OK uid:", cred.user.uid);
  console.log("OK email:", cred.user.email);

  console.log("=== SDK SIGNIN ===");
  const login = await signInWithEmailAndPassword(auth, email, password);
  console.log("OK uid:", login.user.uid);
  console.log("Firebase Auth SDK fonctionne correctement.");
} catch (error) {
  console.error("=== SDK ERROR ===");
  console.error("code:", error.code);
  console.error("message:", error.message);
  process.exit(1);
}
