import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Account from "./pages/Account";
import Login from "./pages/Login";
import { auth } from "./utils/firebase";

const App = () => {
  const [firebaseUser, setFirebaseUser] = useState(false);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      // console.log(user);
      user ? setFirebaseUser(user) : setFirebaseUser(null);
    });
  }, []);

  return (
    <Router>
      <Navbar firebaseUser={firebaseUser}>
        {firebaseUser !== false ? (
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/account">
              <Account />
            </Route>
            <Route path="/dashboard">Dashboard</Route>
            <Route path="/">Home</Route>
          </Switch>
        ) : (
          <p>Loading...</p>
        )}
      </Navbar>
    </Router>
  );
};

export default App;