import app from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBs2RZmyc5T_ExREPpGp-pK33eQCC7-Kro",
  authDomain: "todo-list-193.firebaseapp.com",
  projectId: "todo-list-193",
  storageBucket: "todo-list-193.appspot.com",
  messagingSenderId: "122258926267",
  appId: "1:122258926267:web:4cf26c8a111cc0111cd79e",
};
// Initialize Firebase
app.initializeApp(firebaseConfig);

const db = app.firestore();
const auth = app.auth();
const storage = app.storage();

export { db, auth, storage };
