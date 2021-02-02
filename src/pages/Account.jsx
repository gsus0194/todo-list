import { useEffect, useState } from "react";
import { auth, db } from "../utils/firebase";
import { withRouter } from "react-router-dom";

const Account = (props) => {
  const { user } = props;
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await db
          .collection("users")
          .doc(user.email)
          .get()
          .then((doc) => {
            if (doc.exists) {
              setFirstName(doc.data().firstName);
              setLastName(doc.data().lastName);
            } else {
              console.log("No such document");
            }
          });
      } catch (error) {
        console.log(error);
      }
    };

    if (user) {
      getData();
    } else {
      props.history.push("/login");
    }
  }, [props.history, user]);

  return user ? (
    <div>
      <h1>Account WIP</h1>
      <p>
        {firstName} {lastName}
      </p>
      <p>{user.email}</p>
    </div>
  ) : (
    <div>loading data</div>
  );
};

export default withRouter(Account);
