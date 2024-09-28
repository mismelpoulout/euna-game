import { getAuth, FacebookAuthProvider, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyAnkZ1gjMaLqQB-NAQNW1i2venWrf18pdw",
  authDomain: "euna-studio.firebaseapp.com",
  projectId: "euna-studio",
  storageBucket: "euna-studio.appspot.com",
  messagingSenderId: "470714381364",
  appId: "1:470714381364:web:9314737f55510f2b3e8661",
  measurementId: "G-82D9DPGHQX"
};

// Inicializar la app de Firebase
const app = initializeApp(firebaseConfig);

// Inicializar los servicios de Firebase
const auth = getAuth(app);
const db = getFirestore(app);

// Proveedores de autenticación: Facebook y Google
const facebookProvider = new FacebookAuthProvider();
const googleProvider = new GoogleAuthProvider();

// Exportar auth, los proveedores de autenticación y la base de datos
export { auth, facebookProvider, googleProvider, db };