import firebase from "firebase/compat/app";
import "firebase/compat/analytics";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAFBSqGPaot0aloWfKij9bF2C0E7rhC6jc",
  authDomain: "chat-app-7f967.firebaseapp.com",
  projectId: "chat-app-7f967",
  storageBucket: "chat-app-7f967.appspot.com",
  messagingSenderId: "239368321402",
  appId: "1:239368321402:web:c29c38761f61291cff7ec3",
  measurementId: "G-Z84PJLJJ17",
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

const auth = firebase.auth();
const db = firebase.firestore();

// auth.useEmulator("http://localhost:9100");
// if (window.location.hostname === "localhost") {
//   db.useEmulator("localhost", "8081");
// }
export { db, auth };
export default firebase;
