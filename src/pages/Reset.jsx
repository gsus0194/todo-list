import React, { useCallback, useState } from "react";
import {
  Avatar,
  Button,
  Container,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { auth } from "../utils/firebase";
import { withRouter } from "react-router-dom";

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

const Reset = (props) => {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMsg, setEmailErrorMsg] = useState(null);

  const processData = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setEmailError(true);
      setEmailErrorMsg("Email field can't be empty");
    } else {
      setEmailError(false);
    }

    if (email.trim()) {
      recover();
    }
  };

  const recover = useCallback(async () => {
    try {
      await auth.sendPasswordResetEmail(email);
      console.log("correo enviado");
      props.history.push("/login");
    } catch (error) {
      setEmailError(true);
      setEmailErrorMsg(error.message);
    }
  }, [email, props.history]);

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Reset Password
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Recover password
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default withRouter(Reset);
