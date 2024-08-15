import React from "react";
import { uid } from "react-uid";
import {
    Dialog,
    DialogActions,
    DialogContent,
    Button,
    Menu,
    MenuItem,
} from "@material-ui/core";

import { StarRounded } from "@material-ui/icons";

import MediaDialogEdit from "./../MediaDialogEdit";
import MediaDialogView from "./../MediaDialogView";

import "./styles.css";

class MediaDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            moveOpen: false,
            moveAnchor: null,
        };
    }

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
                    <StarRounded
                        key={uid("star", i)}
                        color={color}
                        fontSize="large"
                    />
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

    editHandler = () => {
        this.setState({
            editing: !this.state.editing,
        });
    };

    handleClose = (callback) => {
        callback(); // updates the view and the data itself
        setTimeout(() => {
            this.setState({
                moveOpen: false,
                editing: false,
            });
        }, 300); // so the buttons dont pop back up before the dialog closes
    };

    handleMoveButton = (e) => {
        this.setState({ moveAnchor: e.target, moveOpen: true });
    };

    handleMoveClose = () => {
        this.setState({ moveOpen: false });
    };

    handleMoveSelect = (e, handleMove) => {
        let tab = e.target.getAttribute("name");
        this.handleClose(() => handleMove(tab));
        console.log(tab);
    };

    moveMenu = (handleMove, currentTab) => {
        let displayTabs = ["completed", "inprogress", "interested"].filter(
            (item) => item != currentTab
        );

        return (
            <Menu
                anchorEl={this.state.moveAnchor}
                open={this.state.moveOpen}
                onClose={this.handleMoveClose}
            >
                {displayTabs.map((tab, i) => {
                    let label = "";
                    if (tab == "completed") label = "Completed";
                    if (tab == "inprogress") label = "In Progress";
                    if (tab == "interested") label = "Interested";

                    return (
                        <MenuItem
                            key={uid(tab, i)}
                            name={tab}
                            onClick={(e) =>
                                this.handleMoveSelect(e, handleMove)
                            }
                        >
                            {label}
                        </MenuItem>
                    );
                })}
            </Menu>
        );
    };

    displayButtons = (handleSave, handleMove, handleDelete, currentTab) => {
        if (this.state.editing) {
            return (
                <span>
                    <Button
                        onClick={() => {
                            this.editHandler();
                        }}
                    >
                        Finish Editing
                    </Button>
                    <Button
                        onClick={() => {
                            this.handleClose(handleSave);
                        }}
                    >
                        Save {"&"} Close
                    </Button>
                </span>
            );
        }
        return (
            <span>
                <Button
                    onClick={() => {
                        this.handleClose(handleDelete);
                    }}
                    color="secondary"
                >
                    Delete
                </Button>
                <Button id="move_anchor" onClick={this.handleMoveButton}>
                    Move
                </Button>
                <Button onClick={this.editHandler}>Edit</Button>
                <Button
                    onClick={() => {
                        this.handleClose(handleSave);
                    }}
                >
                    Save {"&"} Close
                </Button>
            </span>
        );
    };

    render() {
        const {
            currentTab,
            selectedMedia,
            openDialog,
            handleMove,
            handleClose,
            handleEditChange,
            handleChange,
            handleDelete,
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
                    {this.state.editing ? (
                        <MediaDialogEdit
                            title={selectedMedia.title}
                            year={selectedMedia.year}
                            notes={selectedMedia.notes}
                            rating={selectedMedia.rating}
                            icon={selectedMedia.icon}
                            handleChange={handleChange}
                            generateRating={this.generateRating}
                            mouseHover={mouseHover}
                            handleEditChange={handleEditChange}
                        />
                    ) : (
                        <MediaDialogView
                            selectedMedia={selectedMedia}
                            generateRating={this.generateRating}
                        />
                    )}
                    {this.moveMenu(handleMove, currentTab)}

                    <DialogActions>
                        {this.displayButtons(
                            handleClose,
                            handleMove,
                            handleDelete,
                            currentTab
                        )}
                    </DialogActions>
                </DialogContent>
            </Dialog>
        );
    }
}

export default MediaDialog;
