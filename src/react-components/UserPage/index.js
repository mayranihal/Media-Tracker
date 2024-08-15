import React from "react";
import "./styles.css";
import ProfileCard from "./../ProfileCard";
import MediaStatusBox from "./../MediaStatusBox";
import ClickAwayImageChanger from "./../ClickAwayImageChanger";
import RulesPopUp from "./../RulesPopUp";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { Tab, Paper } from "@material-ui/core";
import PropTypes from "prop-types";
import { TabContext, TabList } from "@material-ui/lab";

import { Button, ButtonGroup } from "@material-ui/core";
import { InputLabel } from "@material-ui/core";

import sampleMedia from "./../../samples/sampleMedia.js";

class UserPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editSwitch: true,
      notClosed: false,
      userColor: "black",
      anchorEl: null,
      pic: "https://miro.medium.com/max/875/0*RQF2RLZURKzlLc6z",
      id: null,
      ruleid: undefined,
      anchorEl1: null,
      isTriggered: false,
      userMedia: props.user.data,
      userName: props.user.username,
      visible: true,
      name: "",
      isBanned: false,
      currentTab: Object.keys(props.user.data)[0],
      visible2: true,
      visible3: true,
    };

    this.onClick = this.onClick.bind(this);
    this.onClickAway = this.onClickAway.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    this.handlePic = this.handlePic.bind(this);
    this.handleChangeComplete = this.handleChangeComplete.bind(this);
    this.isClicked = this.isClicked.bind(this);
    this.isClosed = this.isClosed.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const user = this.props.user;

    this.setState({
      userColor: user.color,
      pic: user.pic,
      userMedia: user.data,
      userName: user.username,
      isBanned: user.isBanned,
    });
  }

  isClosed = (e) => {
    this.setState({
      isTriggered: false,
      anchorEl1: e.currentTarget,
      ruleid: null,
    });
  };
  isClicked = (event) => {
    this.setState({
      isTriggered: true,
      anchorEl1: event.currentTarget,
      ruleid: "rulepopUp",
    });
  };

  onClick = (event) => {
    this.setState({
      notClosed: true,
      anchorEl: event.currentTarget,
      id: "popUp",
    });
  };
  toggleEdit = () => {
    this.setState({
      editSwitch: !this.state.editSwitch,
    });
  };

  onClickAway = (e) => {
    this.setState({
      notClosed: false,
      anchorEl: e.currentTarget,
      id: null,
    });
  };
  handlePic = (event) => {
    const val = event.target.value;
    const url = "/users/" + this.state.userName;
    console.log(this.state.userName);

    this.setState({
      pic: val,
    });
    const request = new Request(url, {
      method: "PATCH",

      body: JSON.stringify({
        pic: val,
      }),
      headers: {
        Accept: "application/json, text/plain, /",
        "Content-Type": "application/json",
      },
    });

    // Send the request with fetch()
    fetch(request)
      .then((res) => {
        if (res.status === 200) {
        } else {
          console.log(res);
        }
        //log(res); // log the result in the console for development purposes,
        //  users are not expected to see this.
      })
      .catch((error) => {
        //log(error);
      });
    //console.log(val);
  };
  handleChangeComplete = (color) => {
    //console.log(color.hex)
    const url = "/users/" + this.state.userName;
    this.setState({ userColor: color.hex });

    const request = new Request(url, {
      method: "PATCH",

      body: JSON.stringify({
        color: color.hex,
      }),
      headers: {
        Accept: "application/json, text/plain, /",
        "Content-Type": "application/json",
      },
    });

    // Send the request with fetch()
    fetch(request)
      .then((res) => {
        if (res.status === 200) {
        } else {
          console.log(res);
        }
        //log(res); // log the result in the console for development purposes,
        //  users are not expected to see this.
      })
      .catch((error) => {
        //log(error);
      });
  };

  handleChange = (event) => {
    const value = event.target.value;

    this.setState({ name: value });
  };

  render() {
    const { user, appState, logOutHandler, bannedUsers, classes } = this.props;
    const { value } = this.state;
    return (
      <div id="userpage">
        {user.isBanned ? (
          <div>
            <img
              src={
                "https://media.discordapp.net/attachments/806982392027545621/818581526916759642/logo.png"
              }
              className="bannedlogo"
            />
            <Paper elevation={6} className="bannedWarning">
              <h1 className="formatBanText">
                Your account has been banned for being malicious
              </h1>
            </Paper>
            <div className="formatCorner">
              <InputLabel>
                {" "}
                LoggedIn:{" "}
                <label className="colorUser"> {appState.username}</label>
              </InputLabel>
              <Button
                id="logoutsubmit"
                type="submit"
                variant="contained"
                onClick={logOutHandler}
                className="logButton"
                size="small"
                color="default"
                disableElevation
              >
                Log Out
              </Button>
            </div>
            <br></br>
          </div>
        ) : (
          <div>
            <div className="category">
              <img
                src={
                  "https://media.discordapp.net/attachments/806982392027545621/818581526916759642/logo.png"
                }
                className="logobanned"
              />

              <div id="categorybox" className="userpage">
                <TabContext value={this.state.currentTab}>
                  <TabList
                    orientation="vertical"
                    variant="scrollable"
                    onChange={(e, val) => {
                      this.setState({ currentTab: val });
                    }}
                  >
                    {Object.keys(this.state.userMedia).map((name) => {
                      return <Tab label={name} value={name}></Tab>;
                    })}
                  </TabList>
                </TabContext>
              </div>

              <div className="addbutton">
                <Button
                  variant="outlined"
                  type="submit"
                  variant="contained"
                  size="small"
                  color="default"
                  disableElevation
                  onClick={() => {
                    //console.log("toggled");

                    this.setState({ visible: !this.state.visible });
                  }}
                  startIcon={<AddIcon />}
                >
                  Add
                </Button>
              </div>

              <div
                className="popupButton"
                style={{ display: !this.state.visible ? "block" : "none" }}
              >
                <div>
                  <input
                    className="text"
                    value={this.state.name}
                    placeholder="Enter Category Name"
                    onChange={this.handleChange}
                  />
                </div>
                <div className="popupButton2">
                  <ButtonGroup>
                    <button
                      onClick={() => {
                        //console.log(this.state.name);
                        //console.log(this.state.userMedia);

                        let temp = this.state.userMedia;
                        temp[this.state.name] = {
                          completed: [],
                          inprogress: [],
                          interested: [],
                        };
                        this.setState({
                          userMedia: temp,
                          visible: !this.state.visible,
                        });

                        //console.log("after");
                        //console.log(this.state.userMedia);

                        const url =
                          "/users/" + this.state.userName + "/addCategory";
                        const request = new Request(url, {
                          method: "POST",

                          body: JSON.stringify({
                            name: this.state.name,
                          }),
                          headers: {
                            Accept: "application/json, text/plain, /",
                            "Content-Type": "application/json",
                          },
                        });

                        //use fetch to send request
                        fetch(request)
                          .then((res) => {
                            if (res.status === 200) {
                            } else {
                              console.log(res);
                            }
                          })
                          .catch((error) => {
                            console.log(error);
                          });
                      }}
                    >
                      Okay
                    </button>
                    <button
                      onClick={() =>
                        this.setState({ visible: !this.state.visible })
                      }
                    >
                      Cancel
                    </button>
                  </ButtonGroup>
                </div>
              </div>

              <div className="addbutton">
                <Button
                  variant="outlined"
                  type="submit"
                  variant="contained"
                  size="small"
                  color="default"
                  disableElevation
                  onClick={() => {
                    //console.log("toggled");

                    this.setState({ visible3: !this.state.visible3 });
                  }}
                  startIcon={<EditIcon />}
                >
                  Edit
                </Button>
              </div>

              <div
                className="popupButton"
                style={{ display: !this.state.visible3 ? "block" : "none" }}
              >
                <div>
                  <input
                    className="text"
                    value={this.state.name}
                    placeholder="New Category Name"
                    onChange={this.handleChange}
                  />
                </div>
                <div className="popupButton2">
                  <ButtonGroup>
                    <button
                      onClick={() => {
                        //console.log(this.state.name);
                        //console.log(this.state.userMedia);

                        //this.setState({
                        //  userMedia: (this.state.userMedia[this.state.name] = {}),
                        //});
                        let temp = this.state.userMedia;
                        delete Object.assign(temp, {
                          [this.state.name]: temp[this.state.currentTab],
                        })[this.state.currentTab];

                        const url =
                          "/users/" + this.state.userName + "/editCategory";
                        const request = new Request(url, {
                          method: "PATCH",

                          body: JSON.stringify({
                            nameToChange: this.state.currentTab,
                            newName: this.state.name,
                          }),
                          headers: {
                            Accept: "application/json, text/plain, /",
                            "Content-Type": "application/json",
                          },
                        });

                        //use fetch to send request
                        fetch(request)
                          .then((res) => {
                            if (res.status === 200) {
                            } else {
                              console.log(res);
                            }
                          })
                          .catch((error) => {
                            console.log(error);
                          });

                        this.setState({
                          userMedia: temp,
                          currentTab: this.state.name,
                          visible3: !this.state.visible3,
                          name: "",
                        });
                        //console.log("after");
                        //console.log(this.state.userMedia);
                      }}
                    >
                      Okay
                    </button>
                    <button
                      onClick={() =>
                        this.setState({ visible3: !this.state.visible3 })
                      }
                    >
                      Cancel
                    </button>
                  </ButtonGroup>
                </div>
              </div>

              <div className="deletebutton">
                <Button
                  variant="outlined"
                  type="submit"
                  variant="contained"
                  size="small"
                  color="default"
                  disableElevation
                  startIcon={<DeleteIcon />}
                  onClick={() => {
                    if (Object.keys(this.state.userMedia).length == 1) {
                      this.setState({ visible2: !this.state.visible2 });
                    } else {
                      let temp = this.state.userMedia;
                      delete temp[this.state.currentTab];

                      const url =
                        "/users/" + this.state.userName + "/deleteCategory";
                      const request = new Request(url, {
                        method: "DELETE",

                        body: JSON.stringify({
                          name: this.state.currentTab,
                        }),
                        headers: {
                          Accept: "application/json, text/plain, /",
                          "Content-Type": "application/json",
                        },
                      });

                      //use fetch for DELETE
                      fetch(request)
                        .then((res) => {
                          if (res.status === 200) {
                          } else {
                            console.log(res);
                          }
                        })
                        .catch((error) => {
                          console.log(error);
                        });

                      this.setState({
                        userMedia: temp,
                        currentTab: Object.keys(temp)[0],
                      });
                      //console.log(this.state.userMedia);
                    }
                  }}
                >
                  Delete
                </Button>
              </div>

              <div
                className="popupButton3"
                style={{ display: !this.state.visible2 ? "block" : "none" }}
              >
                <div className="deletemessage">
                  <p>Must have minimum one category</p>
                </div>
                <div className="formatdelete">
                  <button
                    onClick={() =>
                      this.setState({ visible2: !this.state.visible2 })
                    }
                  >
                    Okay
                  </button>
                </div>
              </div>
            </div>

            <MediaStatusBox
              user={user}
              userMedia={this.state.userMedia}
              category={this.state.currentTab}
              className="media"
            />

            <div className="userLogOutButton">
              <ProfileCard
                user={user}
                username={appState.username}
                userColor="#141313"
                toggleEdit={this.toggleEdit}
                editSwitch={this.state.editSwitch}
                pic={this.state.pic}
                userColor={this.state.userColor}
                handleChangeComplete={this.handleChangeComplete}
              />
              <ClickAwayImageChanger
                id={this.state.id}
                anchorEl={this.state.anchorEl}
                notClosed={this.state.notClosed}
                onClick={this.onClick}
                onClickAway={this.onClickAway}
                editSwitch={this.state.editSwitch}
                pic={this.state.pic}
                handlePic={this.handlePic}
                appState={appState}
              ></ClickAwayImageChanger>
              <div>
                <div className="formatRulesPopUp">
                  <RulesPopUp
                    anchorEl1={this.state.anchorEl1}
                    isTriggered={this.state.isTriggered}
                    isClicked={this.isClicked}
                    isClosed={this.isClosed}
                    ruleid={this.state.ruleid}
                  ></RulesPopUp>
                </div>

                <div className="buttonLogOut">
                  <Button
                    id="logoutsubmit"
                    type="submit"
                    variant="contained"
                    onClick={logOutHandler}
                    size="small"
                    color="default"
                    disableElevation
                  >
                    Log Out
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default UserPage;
