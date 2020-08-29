import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/functions";
import "firebase/firestore";

const config = {
  apiKey: "AIzaSyDmvAo-q9uc2MLL7UYNIMQZcro2HMoaJpo",
  authDomain: "cornell-zoom-hub.firebaseapp.com",
  databaseURL: "https://cornell-zoom-hub.firebaseio.com",
  projectId: "cornell-zoom-hub",
  storageBucket: "cornell-zoom-hub.appspot.com",
  messagingSenderId: "389828742290",
  appId: "1:389828742290:web:5ff2f6140799c33a9b6a4b",
  measurementId: "G-J6B18EX3GG",
};
const app = firebase.initializeApp(config);

// Uncomment to use Cloud Functions Emulator (`npm run shell`)
// app.functions().useFunctionsEmulator("http://localhost:5000");

export const GoogleAuthProvider = firebase.auth.GoogleAuthProvider.PROVIDER_ID;

export const arrayUnion = firebase.firestore.FieldValue.arrayUnion;

export default app;
