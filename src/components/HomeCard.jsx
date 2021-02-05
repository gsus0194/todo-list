import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  avatar: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

const HomeCard = (props) => {
  const { icon, title, subheader, itemList } = props;
  const classes = useStyles();

  return (
    <Card variant="outlined">
      <CardHeader
        avatar={<Avatar className={classes.avatar}>{icon}</Avatar>}
        title={<Typography variant="body1">{title}</Typography>}
        subheader={<Typography variant="body2">{subheader}</Typography>}
      />
      <CardContent>
        <List style={{ padding: 0 }}>
          {itemList.map((item, index) => (
            <ListItem key={index} style={{ padding: 0 }}>
              <ListItemText primary={item} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default HomeCard;
