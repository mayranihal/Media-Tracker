import React from "react";
import "./styles.css";
import { SketchPicker } from "react-color";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Portal from "@material-ui/core/Portal";

class ProfileCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profileBio: "Add a user bio",
      siteLink: "Add website",
      discordHandle: "Add discord username",
      colorHide: false,
      username: props.username,
    };
  }

  componentDidMount() {
    const user = this.props.user;
    this.setState({
      profileBio: user.bio,
      siteLink: user.link,
      discordHandle: user.discordName,
      username: user.username,
    });
  }

  //to change bio
  handleUpdateofText = (event) => {
    //server
    const val = event.target.value === "" ? "Bio" : event.target.value;

    this.setState({
      profileBio: val,
    });

    const url = "/users/" + this.state.username;
    //console.log(this.state.username);

    const request = new Request(url, {
      method: "PATCH",

      body: JSON.stringify({
        bio: val,
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

  toggleHide = () => {
    //console.log("this:"+this.state.colorHide)
    if (!this.state.editSwitch) {
      this.setState({
        colorHide: !this.state.colorHide,
      });
    } else {
      return;
    }
  };
  alterWebsiteLink = (event) => {
    const valText =
      event.target.value === "" ? "Add Website" : event.target.value;

    this.setState({
      siteLink: valText,
    });
    const url = "/users/" + this.state.username;
    //console.log(this.state.username);

    const request = new Request(url, {
      method: "PATCH",

      body: JSON.stringify({
        link: valText,
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

  alterDiscord = (event) => {
    const valText =
      event.target.value === "" ? "Add Discord" : event.target.value;

    this.setState({
      discordHandle: valText,
    });
    const url = "/users/" + this.state.username;

    const request = new Request(url, {
      method: "PATCH",

      body: JSON.stringify({
        discordName: valText,
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

  render() {
    const {
      username,
      editSwitch,
      toggleEdit,
      pic,
      userColor,
      handleChangeComplete,
    } = this.props;
    return (
      <div className="userpage">
        <Card className="cardInfo" variant="outlined" raised={true}>
          <CardContent>
            <CardMedia className="profilePic" image={pic} />

            <h2
              style={{ color: userColor }}
              className="fontFormat"
              onClick={this.toggleHide}
            >
              {username}
            </h2>

            <Button
              variant="contained"
              size="small"
              color="default"
              disableElevation
              className="editProfile"
              onClick={toggleEdit}
            >
              EDIT
            </Button>
            {!editSwitch && !this.state.colorHide ? (
              <div>
                {" "}
                <InputLabel className="formatLabel" size="small">
                  Click username to change its color
                </InputLabel>
              </div>
            ) : null}

            {this.state.colorHide && !editSwitch ? (
              <SketchPicker
                //SERVER : record user's new username color in database

                color={userColor}
                className="pick"
                onChangeComplete={handleChangeComplete}
              />
            ) : (
              <div>
                <Input
                  className="formatBio"
                  disabled={editSwitch}
                  onChange={this.handleUpdateofText}
                  color="secondary"
                  value={this.state.profileBio}
                  rowsMax={8}
                  multiline={true}
                  //SERVER : record user's new profileBio in database
                >
                  {" "}
                </Input>
                <InputLabel className="siteLabel">
                  Website:{" "}
                  <Input
                    disabled={editSwitch}
                    onChange={this.alterWebsiteLink}
                    color="secondary"
                    className="siteInput"
                    value={this.state.siteLink}
                    //SERVER : record user's new website in database
                  >
                    Insert Website
                  </Input>{" "}
                </InputLabel>

                <InputLabel className="discLabel">
                  Discord:{" "}
                  <Input
                    className="discInput"
                    disabled={editSwitch}
                    onChange={this.alterDiscord}
                    value={this.state.discordHandle}
                    color="secondary"
                    //SERVER : record user's new discord in database
                  >
                    Insert Discord UserName
                  </Input>{" "}
                </InputLabel>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }
}

export default ProfileCard;
