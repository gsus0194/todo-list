import {
  Avatar,
  Box,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Typography,
} from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import LockIcon from "@material-ui/icons/Lock";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import NotesIcon from "@material-ui/icons/Notes";
import React from "react";
import { NavLink } from "react-router-dom";
import { auth } from "../utils/firebase";
import { withRouter } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  pic: {
    [theme.breakpoints.down("md")]: {
      width: theme.spacing(20),
      height: theme.spacing(20),
    },
    [theme.breakpoints.up("lg")]: {
      width: theme.spacing(24),
      height: theme.spacing(24),
    },
  },
}));

const MyDrawer = (props) => {
  const { firebaseUser } = props;
  const classes = useStyles();

  const Menu = () => {
    const signOut = () => {
      auth.signOut().then(() => {
        props.history.push("/login");
      });
    };

    return (
      <List>
        <ListItem
          button
          component={NavLink}
          to="/"
          activeClassName="Mui-selected"
          exact
        >
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem
          button
          component={NavLink}
          to="/dashboard"
          activeClassName="Mui-selected"
        >
          <ListItemIcon>
            <NotesIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>

        {firebaseUser !== null ? (
          <ListItem
            button
            component={NavLink}
            to="/account"
            activeClassName="Mui-selected"
          >
            <ListItemIcon>
              <AccountBoxIcon />
            </ListItemIcon>
            <ListItemText primary="Account" />
          </ListItem>
        ) : null}

        {firebaseUser !== null ? (
          <ListItem
            button
            activeClassName="Mui-selected"
            onClick={() => signOut()}
          >
            <ListItemIcon>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary="Sign Out" />
          </ListItem>
        ) : (
          <ListItem
            button
            component={NavLink}
            to="/login"
            activeClassName="Mui-selected"
          >
            <ListItemIcon>
              <LockIcon />
            </ListItemIcon>
            <ListItemText primary="Login" />
          </ListItem>
        )}
      </List>
    );
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      height="100%"
    >
      <div>
        <Box display="flex" alignItems="center" justifyContent="center" m={4}>
          <Avatar src="" alt="Account Pic" className={classes.pic} />
        </Box>
        <Divider />
      </div>
      <Menu />
      <div>
        <Divider />
        <Box display="flex" alignItems="center" justifyContent="center" m={2}>
          <Typography variant="caption">
            &copy; {new Date().getFullYear()} Jesús Villegas
          </Typography>
        </Box>
      </div>
    </Box>
  );
};

export default withRouter(MyDrawer);
