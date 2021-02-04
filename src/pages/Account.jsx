import {
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Grid,
  makeStyles,
  TextField,
  Toolbar,
  Typography,
} from "@material-ui/core";
import PublishIcon from "@material-ui/icons/Publish";
import SaveIcon from "@material-ui/icons/Save";
import { useState } from "react";
import { useStateValue } from "../context/StateProvider";
import { db, storage } from "../utils/firebase";
import Skeleton from "@material-ui/lab/Skeleton";

const useStyles = makeStyles((theme) => ({
  paper: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
}));

const Account = () => {
  const classes = useStyles();
  const [{ user, loading }, dispatch] = useStateValue();
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [firstNameErrorMsg, setFirstNameErrorMsg] = useState(null);
  const [lastNameErrorMsg, setLastNameErrorMsg] = useState(null);

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
      setLastNameErrorMsg("Last Name can't be empty");
    } else {
      setLastNameError(false);
    }

    if (firstName.trim() && lastName.trim()) {
      updateData();
    }
  };

  const updateData = async () => {
    dispatch({ type: "LOADING" });

    try {
      await db.collection("users").doc(user.email).update({
        firstName,
        lastName,
      });
      const userUpd = {
        ...user,
        firstName,
        lastName,
      };
      dispatch({
        type: "USER_SUCCESS",
        payload: userUpd,
      });
      localStorage.setItem("user", JSON.stringify(userUpd));
    } catch (error) {
      setFirstNameError(true);
      setFirstNameErrorMsg(error.message);
    }
  };

  const selectPhoto = async (image) => {
    const photoClient = image.target.files[0];

    if (photoClient === undefined) {
      return;
    }

    dispatch({ type: "LOADING" });

    try {
      const imgRef = await storage
        .ref()
        .child(user.email)
        .child("profile_photo");
      await imgRef.put(photoClient);
      const imgUrl = await imgRef.getDownloadURL();
      await db.collection("users").doc(user.email).update({
        photoURL: imgUrl,
      });

      const userUpd = {
        ...user,
        photoURL: imgUrl,
      };

      dispatch({
        type: "USER_SUCCESS",
        payload: userUpd,
      });
      localStorage.setItem("user", JSON.stringify(userUpd));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Toolbar />
      <div className={classes.paper}>
        <Grid
          container
          component="form"
          onSubmit={processData}
          spacing={2}
          noValidate
        >
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h4" component="h2">
                  {loading ? <Skeleton /> : `${firstName} ${lastName}`}
                </Typography>
              </CardContent>
              <CardActions>
                <input
                  accept="image/*"
                  id="button-file"
                  hidden
                  type="file"
                  onChange={(e) => selectPhoto(e)}
                />
                <label htmlFor="button-file">
                  <Button
                    variant="contained"
                    color="secondary"
                    component="span"
                    startIcon={<PublishIcon />}
                  >
                    Upload Photo
                  </Button>
                </label>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      id="first-name"
                      label="First Name"
                      name="first-name"
                      type="text"
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
                  <Grid item xs={12} sm={6}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      type="email"
                      value={user.email}
                      disabled
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<SaveIcon />}
              type="submit"
              fullWidth
              size="large"
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </div>
    </Container>
  );
};

export default Account;
