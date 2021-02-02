import {
  Card,
  CardActions,
  CardContent,
  Grid,
  IconButton,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { withRouter } from "react-router-dom";
// import VisibilityIcon from "@material-ui/icons/Visibility";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  button: {
    backgroundColor: theme.palette.secondary.main,
    "&:hover": {
      backgroundColor: theme.palette.secondary.dark,
    },
  },
  icon: {
    color: theme.palette.secondary.contrastText,
  },
}));

const Tasks = (props) => {
  const { tasks, activateEdition, deleteItem } = props;
  const classes = useStyles();

  return tasks.map((task, index) => (
    <Grid key={index} item xs={12} md={6}>
      <Card variant="outlined">
        <CardContent>
          <Typography component="h2" variant="h5">
            {task.name}
          </Typography>
          <Typography component="h3" variant="caption" gutterBottom>
            {moment(task.date).format("lll")} - {moment(task.date).fromNow()}
          </Typography>
          <Typography component="h3" variant="subtitle1">
            {task.description}
          </Typography>
        </CardContent>
        <CardActions>
          {/* <IconButton className={classes.button} aria-label="view task info">
            <VisibilityIcon className={classes.icon} />
          </IconButton> */}
          <IconButton
            className={classes.button}
            aria-label="edit task"
            onClick={() => activateEdition(task)}
          >
            <EditIcon className={classes.icon} />
          </IconButton>
          <IconButton
            className={classes.button}
            aria-label="delete-task"
            onClick={() => deleteItem(task.id)}
          >
            <DeleteIcon className={classes.icon} />
          </IconButton>
        </CardActions>
      </Card>
    </Grid>
  ));
};

export default withRouter(Tasks);
