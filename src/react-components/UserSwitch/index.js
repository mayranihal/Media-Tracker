import React from "react";
import AdminPage from "../AdminPage";
import UserPage from "../UserPage";

import "./styles.css";

class UserSwitch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewedUser: undefined,
    };
  }

  componentDidMount() {
    // SERVER
    const request = new Request("/users/" + this.props.username, {
      method: "get",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
    });

    fetch(request)
      .then(async (res) => {
        const user = await res.json();
        if (res.status === 200) {
          this.setState({ viewedUser: user });
        } else console.log(user);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const {
      username,
      appState,
      logOutHandler,
      banUser,
      unbanUser,
      deleteUser,
      bannedUsers,
    } = this.props;

    if (this.state.viewedUser == undefined) {
      return <p>404 user not found</p>;
    }

    if (
      this.state.viewedUser.userType == "admin" &&
      this.state.viewedUser.username == username
    ) {
      return (
        <AdminPage
          appState={appState}
          logOutHandler={logOutHandler}
          banUser={banUser}
          unbanUser={unbanUser}
          deleteUser={deleteUser}
          bannedUsers={bannedUsers}
        />
      );
    }

    if (this.state.viewedUser.userType == "user") {
      return (
        <UserPage
          appState={appState}
          user={this.state.viewedUser}
          logOutHandler={logOutHandler}
          bannedUsers={bannedUsers}
        />
      );
    }
  }
}

export default UserSwitch;
