import { useEffect, useState } from "react";
import { auth } from "../utils/firebase";
import { withRouter } from "react-router-dom";

const Account = (props) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (auth.currentUser) {
      console.log("User does exist");
      setUser(auth.currentUser);
    } else {
      console.log("User doesn't exist");
      props.history.push("/login");
    }
  }, [props.history]);

  return (
    <div>
      <h1>Account</h1>
      {user && <h3>{user.email}</h3>}
    </div>
  );
};

export default withRouter(Account);
