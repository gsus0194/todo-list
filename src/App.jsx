import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import { useStateValue } from "./context/StateProvider";
import Account from "./pages/Account";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Reset from "./pages/Reset";
import { auth } from "./utils/firebase";

const App = () => {
  const [firebaseUser, setFirebaseUser] = useState(false);
  // eslint-disable-next-line no-empty-pattern
  const [{}, dispatch] = useStateValue();

  useEffect(() => {
    const getUser = () => {
      auth.onAuthStateChanged((user) => {
        // console.log(user);
        // console.log("userStorage>>>", localStorage.getItem("user"));
        user ? setFirebaseUser(user) : setFirebaseUser(null);
      });
    };
    getUser();
  }, []);

  useEffect(() => {
    if (localStorage.getItem("user")) {
      dispatch({
        type: "USER_SUCCESS",
        payload: JSON.parse(localStorage.getItem("user")),
      });
    }
  }, [dispatch]);

  const PrivateRoute = ({ component, path, ...rest }) => {
    if (localStorage.getItem("user")) {
      const userStorage = JSON.parse(localStorage.getItem("user"));
      if (userStorage.uid === firebaseUser.uid) {
        return <Route component={component} path={path} {...rest} />;
      } else {
        return <Redirect to="login" {...rest} />;
      }
    } else {
      return <Redirect to="login" {...rest} />;
    }
  };

  return (
    <Router>
      <Navbar>
        {firebaseUser !== false ? (
          <Switch>
            <PrivateRoute component={Account} path="/account" />
            <PrivateRoute component={Dashboard} path="/dashboard" />
            <Route component={Login} path="/login" />
            <Route component={Reset} path="/reset" />
            <Route component={Home} path="/" />
          </Switch>
        ) : (
          <p>Loading...</p>
        )}
      </Navbar>
    </Router>
  );
};

export default App;
