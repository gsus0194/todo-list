import app from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDGsC_bPEn1WADiXHrvmL2AcM6GAgtrpsA",
  authDomain: "todo-list-194.firebaseapp.com",
  projectId: "todo-list-194",
  storageBucket: "todo-list-194.appspot.com",
  messagingSenderId: "1035955586959",
  appId: "1:1035955586959:web:281deeecc83860fe5badfa",
};
// Initialize Firebase
app.initializeApp(firebaseConfig);

const db = app.firestore();
const auth = app.auth();

export { db, auth };
