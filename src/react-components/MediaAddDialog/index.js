import React from "react";
import { uid } from "react-uid";
import {
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
  TextField,
} from "@material-ui/core";

import { StarRounded } from "@material-ui/icons";

import MediaDialogEdit from "../MediaDialogEdit";
import MediaDialogView from "../MediaDialogView";

import "./styles.css";

class MediaAddDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      year: "",
      notes: "",
      rating: 0,
      icon: "",
    };
  }

  handleChange = (e) => {
    const target = e.target;
    const name = target.name;
    const value = target.value;

    this.setState({ [name]: value });
  };

  generateRating = (rating, mouseHover = null) => {
    let stars = [];

    for (let i = 0; i < 5; i++) {
      let color = i < rating ? "primary" : "disabled";
      stars.push(
        this.editing ? (
          <StarRounded
            onClick={(e) => {
              console.log("Click");
            }}
            index={i}
            key={uid("star", i)}
            color={color}
            fontSize="large"
          />
        ) : (
          <StarRounded key={uid("star", i)} color={color} fontSize="large" />
        )
      );
    }

    return stars;
  };

  deleteHandler = () => {
    console.log("delete");
  };

  moveHandler = () => {
    console.log("move");
  };

  handleClose = (callback) => {
    setTimeout(() => {
      this.setState({
        title: "",
        year: "",
        notes: "",
        rating: 0,
        icon: "",
      });
    }, 250);
    callback();
  };

  render() {
    const {
      category,
      openDialog,
      handleAdd,
      handleClose,
      mouseHover,
    } = this.props;

    return (
      <Dialog
        maxWidth="md"
        fullWidth
        open={openDialog}
        onClose={() => {
          this.handleClose(handleClose);
        }}
      >
        <DialogContent id="media_dialog_content">
          <DialogContentText>
            <Avatar
              id="media_dialog_icon"
              alt={this.state.title}
              src={this.state.icon}
            />
            <span id="media_dialog_rating">
              {this.generateRating(this.state.rating, mouseHover)}
            </span>

            <TextField
              label="Title"
              name="title"
              inputProps={{ maxLength: 70 }}
              margin="normal"
              fullWidth
              variant="outlined"
              value={this.state.title}
              onChange={this.handleChange}
            />

            <TextField
              label="Year"
              name="year"
              type="number"
              margin="normal"
              fullWidth
              variant="outlined"
              value={this.state.year}
              onChange={this.handleChange}
            />

            <TextField
              label="Notes"
              name="notes"
              margin="normal"
              inputProps={{ maxLength: 3000 }}
              value={this.state.notes}
              fullWidth
              multiline
              rows="5"
              variant="outlined"
              onChange={this.handleChange}
            />
          </DialogContentText>

          <DialogActions>
            <Button
              onClick={() => {
                this.handleClose(() => {
                  handleAdd(
                    this.state.title,
                    this.state.year,
                    this.state.rating,
                    this.state.icon,
                    this.state.notes
                  );
                });
              }}
            >
              Add Media
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    );
  }
}

export default MediaAddDialog;
