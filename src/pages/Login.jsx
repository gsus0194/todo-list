import { useEffect, useState } from "react";
import { useStateValue } from "../context/StateProvider";
import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  Link,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { withRouter } from "react-router-dom";
import { auth, db } from "../utils/firebase";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(2),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
}));

const Login = (props) => {
  const { history } = props;
  const classes = useStyles();
  const [{ active }, dispatch] = useStateValue();
  const [isSignup, setIsSignup] = useState(true);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const [firstNameErrorMsg, setFirstNameErrorMsg] = useState(null);
  const [lastNameErrorMsg, setLastNameErrorMsg] = useState(null);
  const [emailErrorMsg, setEmailErrorMsg] = useState(null);
  const [passwordErrorMsg, setPasswordErrorMsg] = useState(null);

  useEffect(() => {
    if (active) {
      history.push("/");
    }
  }, [active, history]);

  const processData = (e) => {
    e.preventDefault();

    if (isSignup) {
      if (!firstName.trim()) {
        setFirstNameError(true);
        setFirstNameErrorMsg("This field can't be empty");
      } else {
        setFirstNameError(false);
      }
      if (!lastName.trim()) {
        setLastNameError(true);
        setLastNameErrorMsg("This field can't be empty");
      } else {
        setLastNameErrorMsg(false);
      }
    }

    if (!email.trim()) {
      setEmailError(true);
      setEmailErrorMsg("Email field can't be empty");
    } else {
      setEmailError(false);
    }
    if (!password.trim()) {
      setPasswordError(true);
      setPasswordErrorMsg("Password field can't be empty");
    } else if (password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMsg("Password can't be less than 6 characters");
    } else {
      setPasswordError(false);
    }

    if (email.trim() && password.trim() && password.length >= 6) {
      if (!isSignup) {
        signIn();
      } else {
        signUp();
      }
    }
  };

  const signUp = async () => {
    dispatch({ type: "LOADING" });

    try {
      const res = await auth.createUserWithEmailAndPassword(email, password);
      const user = {
        uid: res.user.uid,
        firstName,
        lastName,
        email: res.user.email,
        photoURL: "",
      };
      await db.collection("users").doc(user.email).set(user);
      await db.collection(user.uid).add({
        name: "First task",
        description: "My first task",
        date: Date.now(),
      });
      dispatch({
        type: "USER_SUCCESS",
        payload: user,
      });
      localStorage.setItem("user", JSON.stringify(user));
      clearTextField();
      clearError();
      history.push("/");
    } catch (error) {
      validateEmail(error.code, error.message);
    }
  };

  const signIn = async () => {
    try {
      const res = await auth.signInWithEmailAndPassword(email, password);
      // console.log(res);
      const user = {
        uid: res.user.uid,
        email: res.user.email,
      };
      const userDB = await db.collection("users").doc(user.email).get();
      if (userDB.exists) {
        dispatch({
          type: "USER_SUCCESS",
          payload: userDB.data(),
        });
        localStorage.setItem("user", JSON.stringify(userDB.data()));
        clearTextField();
        clearError();
        history.push("/");
      } else {
        console.log("User not found");
      }
    } catch (error) {
      validateEmail(error.code, error.message);
      validatePassword(error.code, error.message);
    }
  };

  const clearTextField = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
  };

  const clearError = () => {
    setFirstNameError(false);
    setLastNameError(false);
    setEmailError(false);
    setPasswordError(false);

    setFirstNameErrorMsg(null);
    setLastNameErrorMsg(null);
    setEmailErrorMsg(null);
    setPasswordErrorMsg(null);
  };

  const validateEmail = (error, message) => {
    if (
      error === "auth/invalid-email" ||
      "auth/user-not-found" ||
      "auth/too-many-requests" ||
      "auth/email-already-in-use"
    ) {
      setEmailError(true);
      setEmailErrorMsg(message);
    }
  };

  const validatePassword = (error, message) => {
    if (error === "auth/wrong-password") {
      setPasswordError(true);
      setPasswordErrorMsg(message);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {isSignup ? "Sign Up" : "Sign In"}
        </Typography>
        <Grid
          container
          component="form"
          className={classes.form}
          onSubmit={processData}
          noValidate
          spacing={2}
        >
          {isSignup ? (
            <>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="first-name"
                  label="First Name"
                  type="text"
                  autoFocus
                  onChange={(e) => setFirstName(e.target.value)}
                  value={firstName}
                  error={firstNameError}
                  helperText={firstNameError ? firstNameErrorMsg : ""}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="last-name"
                  label="Last Name"
                  type="text"
                  onChange={(e) => setLastName(e.target.value)}
                  value={lastName}
                  error={lastNameError}
                  helperText={lastNameError ? lastNameErrorMsg : ""}
                />
              </Grid>
            </>
          ) : (
            <></>
          )}
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              error={emailError}
              helperText={emailError ? emailErrorMsg : ""}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="password"
              label="Password"
              name="password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              error={passwordError}
              helperText={passwordError ? passwordErrorMsg : ""}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" fullWidth variant="contained" color="primary">
              {isSignup ? "Sign Up" : "Sign In"}
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between">
              <Link
                component="button"
                variant="body2"
                type="button"
                onClick={() => {
                  setIsSignup(!isSignup);
                  clearTextField();
                  clearError();
                }}
              >
                {isSignup
                  ? "Already have an account"
                  : "Don't have an account?"}
              </Link>
              {!isSignup ? (
                <Link
                  component="button"
                  variant="body2"
                  type="button"
                  onClick={() => history.push("/reset")}
                >
                  Forgot Password?
                </Link>
              ) : null}
            </Box>
          </Grid>
        </Grid>
      </div>
    </Container>
  );
};

export default withRouter(Login);
