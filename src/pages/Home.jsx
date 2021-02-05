import {
  Container,
  Grid,
  makeStyles,
  Toolbar,
  Typography,
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import NotesIcon from "@material-ui/icons/Notes";
import HomeCard from "../components/HomeCard";
import { useStateValue } from "../context/StateProvider";

const useStyles = makeStyles((theme) => ({
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

const loginList = [
  "With Sign Up you'll be able to register a new User.",
  "With Sign In you'll be able to login to your User.",
  "If you forgot your password, from the Sign In form you'll be able to reset it",
];
const signOutList = ["You'll log out from this User"];
const dashboardList = [
  "Create tasks, display a modal form for new task",
  "Edit tasks, display a modal form for editing",
  "Delete tasks, the task will be deleted",
];
const accountList = [
  "Upload a new profile photo with the Upload button",
  "Change First and Last Name",
];

const Home = () => {
  const classes = useStyles();
  const [{ user }] = useStateValue();

  return (
    <Container component="main" maxWidth="md">
      <Toolbar />
      <div className={classes.paper}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography align="center" variant="h4" component="h1" gutterBottom>
              Welcome
            </Typography>
            <Typography align="center" variant="body1" component="h2">
              Here you will find a brief explanation of the options available to
              you
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              {user ? (
                <>
                  <Grid item xs={12} sm={6}>
                    <HomeCard
                      icon={<NotesIcon />}
                      title="Dashboard"
                      subheader="To Do List"
                      itemList={dashboardList}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <HomeCard
                      icon={<AccountBoxIcon />}
                      title="Account"
                      subheader="User's information"
                      itemList={accountList}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <HomeCard
                      icon={<ExitToAppIcon />}
                      title="Sign Out"
                      subheader=""
                      itemList={signOutList}
                    />
                  </Grid>
                </>
              ) : (
                <Grid item xs={12}>
                  <HomeCard
                    icon={<LockOutlinedIcon />}
                    title="Login"
                    subheader="Sign Up &amp; Sign In"
                    itemList={loginList}
                  />
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </div>
    </Container>
  );
};

export default Home;
