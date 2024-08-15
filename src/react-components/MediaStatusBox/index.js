import React from "react";
import { Tabs, Tab, Button } from "@material-ui/core";
import { TabPanel, TabContext, TabList } from "@material-ui/lab";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

import Media from "./../Media";
import MediaDialog from "./../MediaDialog";
import sampleMedia from "../../samples/sampleMedia.js";
import MediaObj from "../../samples/MediaObj.js";

import "./styles.css";
import { uid } from "react-uid";
import MediaAddDialog from "../MediaAddDialog";

class MediaStatusBox extends React.Component {
  constructor(props) {
    super(props);
    let userMedia = this.props.userMedia;
    let categoryz = this.props.category;
    this.state = {
      categories: Object.keys(userMedia),
      category: categoryz,
      currentTab: "completed",
      // SERVER: this data would be pulled from a database
      completed: userMedia[categoryz].completed, //hardcoded rn, but will default to first category in list
      inprogress: userMedia[categoryz].inprogress,
      interested: userMedia[categoryz].interested,
      openDialog: false,
      openAddDialog: false,
      selectedMedia: null,
    };
  }

  handleTabs = (e, newValue) => {
    this.setState({
      currentTab: newValue,
    });
  };

  handleCloseDialog = () => {
    // put fetch here
    let tab = this.state.currentTab;
    let medias = this.state[tab];
    const { user, category } = this.props;
    const selected = this.state.selectedMedia;

    let index = user.data[category][tab].indexOf(selected);

    const url = "/users/media/" + user.username + "/" + category;
    const body = {
      status: tab,
      index: index,
      changes: {
        title: selected.title,
        year: selected.year,
        icon: selected.icon,
        rating: selected.rating == "" ? 0 : selected.rating,
        notes: selected.notes,
      },
    };
    console.log(body);
    console.log(JSON.stringify(body));

    const request = new Request(url, {
      method: "PATCH",
      body: JSON.stringify(body),
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
    });

    fetch(request)
      .then((res) => {
        if (res.status === 200) {
          this.setState({ [tab]: medias });
        } else console.log(request);
      })
      .catch((err) => console.log(err));
    this.setState({ openDialog: false });
  };

  handleCloseAddDialog = () => {
    this.setState({ openAddDialog: false });
  };

  handleClickMedia = (m) => {
    this.setState({ openDialog: true, selectedMedia: m });
  };

  handleClickAdd = () => {
    this.setState({ openAddDialog: true });
  };

  handleSave = (oldMedia, newMedia) => {
    // SERVER CALL this would save to the database and update the data in browser too
    let tab = this.state.currentTab;
    let medias = this.state[tab];
    const { user, category } = this.props;

    let index = user.data[category][tab].findIndexOf(this.state.selectedMedia);

    const url = "/users/media/" + user.username + "/" + category;
    const body = {
      status: tab,
      index: index,
      changes: this.state.selectedMedia,
    };

    const request = new Request(url, {
      method: "patch",
      body: JSON.stringify(body),
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
    });

    fetch(request)
      .then((res) => {
        if (res.status === 200) {
          this.setState({ [tab]: medias });
        } else console.log(request);
      })
      .catch((err) => console.log(err));
  };

  handleAdd = (title, year, rating, icon, notes) => {
    let newMedia = new MediaObj(title, year, rating, icon, notes);
    let userMedia = this.props.userMedia;
    let category = this.props.category;

    let tab = this.state.currentTab;
    let medias = userMedia[category][tab];
    medias.unshift(newMedia);

    const user = this.props.user;
    const url = "/users/" + user.username;
    const body = {
      category: category,
      status: tab,
      title: title,
      year: year,
      rating: rating,
      icon: icon,
      notes: notes === "" ? " " : notes,
    };
    const request = new Request(url, {
      method: "post",
      body: JSON.stringify(body),
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
    });

    fetch(request)
      .then((res) => {
        this.setState({ [tab]: medias, openAddDialog: false });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  addToCategory = (category, tab, title, year, rating, icon, notes) => {
    const user = this.props.user;
    const url = "/users/" + user.username;
    const body = {
      category: category,
      status: tab,
      title: title,
      year: year,
      rating: rating,
      icon: icon,
      notes: notes,
    };
    const request = new Request(url, {
      method: "post",
      body: JSON.stringify(body),
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
    });

    fetch(request)
      .then((res) => {})
      .catch((error) => {
        console.log(error);
      });
  };

  handleRatingChange = (e) => {
    let i = e.target.value;
    let newMedia = this.state.selectedMedia;

    if (i <= 5 && i >= 0) {
      newMedia.rating = i;
    } else {
      newMedia.rating = 0;
    }
  };

  handleEditChange = (e) => {
    const target = e.target;
    const name = target.name;
    const value = target.value;

    let newMedia = this.state.selectedMedia;
    newMedia[name] = value;

    this.setState({ selectedMedia: newMedia });
  };

  handleDelete = () => {
    //SERVER
    const { user, category } = this.props;
    let tab = this.state.currentTab;
    let newMedias = user.data[category][tab];

    let index = newMedias.indexOf(this.state.selectedMedia);

    const url = "/users/media/" + user.username + "/" + category;
    const body = {
      status: tab,
      index: index,
    };

    const request = new Request(url, {
      method: "delete",
      body: JSON.stringify(body),
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
    });

    fetch(request)
      .then((res) => {
        if (res.status === 200) {
          newMedias.splice(index, 1);
          this.setState({
            openDialog: false,
            [tab]: newMedias,
          });
        } else console.log(request);
      })
      .catch((err) => console.log(err));
  };

  handleMove = (newTab) => {
    // SERVER
    console.log("Move");
    const { user, category } = this.props;
    let newMedias = user.data[category][newTab];

    const selected = this.state.selectedMedia;

    const oldTab = this.state.currentTab;
    let currentMedias = user.data[category][oldTab];
    let index = currentMedias.indexOf(this.state.selectedMedia);
    console.log(currentMedias);

    const url = "/users/media/" + user.username + "/" + category;
    const body = {
      status: this.state.currentTab,
      index: index,
    };

    const request = new Request(url, {
      method: "delete",
      body: JSON.stringify(body),
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
    });

    fetch(request)
      .then((res) => {
        if (res.status === 200) {
          this.addToCategory(
            category,
            newTab,
            selected.title,
            selected.year,
            selected.rating,
            selected.notes
          );
          currentMedias.splice(index, 1);
          newMedias.unshift(this.state.selectedMedia);
          this.setState({
            openDialog: false,
            [oldTab]: currentMedias,
            [newTab]: newMedias,
          });
        } else console.log(request);
      })
      .catch((err) => console.log(err));
  };

  render() {
    const { user, userMedia, category } = this.props;

    let createMedia = (m) => {
      return (
        <Media key={uid(m)} handleClick={this.handleClickMedia} media={m} />
      );
    };

    return (
      <div id="mediastatus" className="userpage">
        <h1>{category}</h1>
        <div id="media-container">
          <TabContext value={this.state.currentTab}>
            <TabList onChange={this.handleTabs} variant="fullWidth" centered>
              <Tab label="Completed" value="completed" />
              <Tab label="In Progress" value="inprogress" />
              <Tab label="Interested" value="interested" />
            </TabList>

            <TabPanel value="completed">
              <Button onClick={this.handleClickAdd}>+ Add entry</Button>
              {userMedia[category].completed.map(createMedia)}
            </TabPanel>
            <TabPanel value="inprogress">
              <Button onClick={this.handleClickAdd}>+ Add entry</Button>
              {userMedia[category].inprogress.map(createMedia)}
            </TabPanel>
            <TabPanel value="interested">
              <Button onClick={this.handleClickAdd}>+ Add entry</Button>
              {userMedia[category].interested.map(createMedia)}
            </TabPanel>

            <MediaAddDialog
              openDialog={this.state.openAddDialog}
              handleAdd={this.handleAdd}
              handleClose={this.handleCloseAddDialog}
              category={category}
            />

            <MediaDialog
              openDialog={this.state.openDialog}
              handleSave={this.handleSave}
              handleMove={this.handleMove}
              handleDelete={this.handleDelete}
              handleChange={this.handleEditChange}
              selectedMedia={this.state.selectedMedia}
              handleClose={this.handleCloseDialog}
              mouseHover={this.handleRatingChange}
              currentTab={this.state.currentTab}
            />
          </TabContext>
        </div>
      </div>
    );
  }
}

export default MediaStatusBox;
