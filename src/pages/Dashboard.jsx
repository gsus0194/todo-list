import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  Grid,
  makeStyles,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { useEffect, useState } from "react";
import Tasks from "../components/Tasks";
import { useStateValue } from "../context/StateProvider";
import { db } from "../utils/firebase";

const useStyles = makeStyles((theme) => ({
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  fixed: {
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

const Dashboard = () => {
  const [{ user }] = useStateValue();
  const classes = useStyles();
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [id, setId] = useState("");
  const [nameError, setNameError] = useState(false);
  const [nameErrorMsg, setNameErrorMsg] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await db.collection(user.uid).orderBy("date").get();
        const dataArray = data.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTasks(dataArray);
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, [user]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    setNameError(false);
    setId("");
    setOpen(false);
    setEditMode(false);
  };

  const activateEdition = (item) => {
    setEditMode(true);
    setName(item.name);
    setDescription(item.description);
    setId(item.id);
    handleOpen();
  };

  const deleteItem = async (id) => {
    try {
      await db.collection(user.uid).doc(id).delete();
      const filteredArr = tasks.filter((item) => item.id !== id);
      setTasks(filteredArr);
    } catch (error) {
      console.log(error);
    }
  };

  const processData = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setNameError(true);
      setNameErrorMsg("This field can't be empty");
    } else {
      setNameError(false);
    }

    if (name.trim()) {
      editMode ? edit() : add();
    }
  };

  const add = async () => {
    try {
      const newTask = {
        name,
        description,
        date: Date.now(),
      };
      const data = await db.collection(user.uid).add(newTask);
      setTasks([...tasks, { ...newTask, id: data.id }]);
      handleClose();
    } catch (error) {
      setNameError(true);
      setNameErrorMsg(error.message);
    }
  };

  const edit = async () => {
    try {
      await db.collection(user.uid).doc(id).update({
        name,
        description,
      });
      const editArray = tasks.map((item) =>
        item.id === id
          ? {
              id: item.id,
              date: item.date,
              name,
              description,
            }
          : item
      );
      setTasks(editArray);
      handleClose();
    } catch (error) {
      setNameError(true);
      setNameErrorMsg(error.message);
    }
  };

  const AddTask = () => {
    return (
      <Tooltip title="Add Task" aria-label="add task" onClick={handleOpen}>
        <Fab color="secondary" className={classes.fixed}>
          <AddIcon />
        </Fab>
      </Tooltip>
    );
  };

  return (
    <Container component="main" maxWidth="lg">
      <Toolbar />
      <div className={classes.paper}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography align="center" component="h1" variant="h4">
              To Do List
            </Typography>
          </Grid>
          <Tasks
            tasks={tasks}
            activateEdition={activateEdition}
            deleteItem={deleteItem}
          />
        </Grid>
      </div>
      <AddTask />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          {editMode ? "Edit Task" : "New Task"}
        </DialogTitle>
        <form onSubmit={processData} noValidate>
          <DialogContent>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="title"
              label="Title"
              name="title"
              autoFocus
              onChange={(e) => setName(e.target.value)}
              value={name}
              error={nameError}
              helperText={nameError ? nameErrorMsg : ""}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              multiline
              rows={4}
              id="description"
              label="Description"
              name="description"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            />
          </DialogContent>
          <DialogActions>
            <Button type="button" onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              {editMode ? "Edit" : "Add"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default Dashboard;
