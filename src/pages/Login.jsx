import React, { useCallback, useState } from "react";
import {
  Avatar,
  Button,
  Container,
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
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Login = (props) => {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [emailErrorMsg, setEmailErrorMsg] = useState(null);
  const [passwordErrorMsg, setPasswordErrorMsg] = useState(null);
  const [isSignUp, setIsSignUp] = useState(true);

  const processData = (e) => {
    e.preventDefault();
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
      isSignUp ? signUp() : signIn();
    }
  };

  const signUp = useCallback(async () => {
    try {
      const res = await auth.createUserWithEmailAndPassword(email, password);
      await db.collection("users").doc(res.user.email).set({
        email: res.user.email,
        uid: res.user.uid,
      });
      setEmail("");
      setPassword("");
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
  }, [email, password, props.history]);

  const signIn = useCallback(async () => {
    try {
      const res = await auth.signInWithEmailAndPassword(email, password);
      console.log(res.user);
      setEmail("");
      setPassword("");
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
        <form className={classes.form} onSubmit={processData} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            type="email"
            autoFocus
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            error={emailError}
            helperText={emailError ? emailErrorMsg : ""}
          />
          <TextField
            variant="outlined"
            margin="normal"
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            {isSignUp ? "Sign up" : "Sign in"}
          </Button>
          <LinkBtn
            component="button"
            variant="body2"
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp
              ? "Already have an account? Sign in"
              : "Don't have an account? Sign Up"}
          </LinkBtn>
        </form>
      </div>
    </Container>
  );
};

export default withRouter(Login);
