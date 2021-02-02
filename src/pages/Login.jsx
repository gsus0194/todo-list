import React, { useCallback, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  Link as LinkBtn,
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
  const classes = useStyles();
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
  const [isSignUp, setIsSignUp] = useState(true);

  const processData = (e) => {
    e.preventDefault();
    if (!firstName.trim()) {
      setFirstNameError(true);
      setFirstNameErrorMsg("First Name can't be empty");
    } else {
      setFirstNameError(false);
    }
    if (!lastName.trim()) {
      setLastNameError(true);
      setLastNameErrorMsg("First Name can't be empty");
    } else {
      setLastNameError(false);
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

    if (
      firstName.trim() &&
      lastName.trim() &&
      email.trim() &&
      password.trim() &&
      password.length >= 6
    ) {
      isSignUp ? signUp() : signIn();
    }
  };

  const signUp = useCallback(async () => {
    try {
      const res = await auth.createUserWithEmailAndPassword(email, password);
      await db.collection("users").doc(res.user.email).set({
        firstName: firstName,
        lastName: lastName,
        email: res.user.email,
        uid: res.user.uid,
      });
      await db.collection(res.user.uid).add({
        name: "First task",
        description: "My first task",
        date: Date.now(),
      });
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setFirstNameError(false);
      setLastNameError(false);
      setEmailError(false);
      setPasswordError(false);
      props.history.push("/");
    } catch (error) {
      console.log(error);
      if (error.code === "auth/invalid-email" || "auth/email-already-in-use") {
        setEmailError(true);
        setEmailErrorMsg(error.message);
      }
    }
  }, [firstName, lastName, email, password, props.history]);

  const signIn = useCallback(async () => {
    try {
      const res = await auth.signInWithEmailAndPassword(email, password);
      console.log(res.user);
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setFirstNameError(false);
      setLastNameError(false);
      setEmailError(false);
      setPasswordError(false);
      props.history.push("/");
    } catch (error) {
      console.log(error);
      if (
        error.code ===
        ("auth/user-not-found" ||
          "auth/too-many-requests" ||
          "auth/invalid-email")
      ) {
        setEmailError(true);
        setEmailErrorMsg(error.message);
      }
      if (error.code === "auth/wrong-password") {
        setPasswordError(true);
        setPasswordErrorMsg(error.message);
      }
    }
  }, [email, password, props.history]);

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {isSignUp ? "Sign Up" : "Sign In"}
        </Typography>
        <Grid
          container
          component="form"
          className={classes.form}
          onSubmit={processData}
          noValidate
          spacing={2}
        >
          {isSignUp ? (
            <>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="first-name"
                  label="First Name"
                  name="first-name"
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
                  name="last-name"
                  type="text"
                  onChange={(e) => setLastName(e.target.value)}
                  value={lastName}
                  error={lastNameError}
                  helperText={lastNameError ? lastNameErrorMsg : ""}
                />
              </Grid>
            </>
          ) : null}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={passwordError}
              helperText={passwordError ? passwordErrorMsg : ""}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" fullWidth variant="contained" color="primary">
              {isSignUp ? "Sign up" : "Sign in"}
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between">
              <LinkBtn
                component="button"
                variant="body2"
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp
                  ? "Already have an account?"
                  : "Don't have an account?"}
              </LinkBtn>
              {isSignUp ? null : (
                <LinkBtn
                  component="button"
                  variant="body2"
                  type="button"
                  onClick={() => props.history.push("/reset")}
                >
                  Forgot password?
                </LinkBtn>
              )}
            </Box>
          </Grid>
        </Grid>
      </div>
    </Container>
  );
};

export default withRouter(Login);
