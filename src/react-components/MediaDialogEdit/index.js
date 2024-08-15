import React from "react";
import { uid } from "react-uid";
import { Avatar, DialogContentText, TextField } from "@material-ui/core";

import { StarRounded } from "@material-ui/icons";

import "./styles.css";

class MediaDialogEdit extends React.Component {
    constructor(props) {
        super(props);
        let media = props.selectedMedia;
        this.state = {
            editing: false,
        };
    }

    render() {
        const {
            generateRating,

            mouseHover,
            handleChange,
            title,
            year,
            rating,
            icon,
            notes,
        } = this.props;

        return (
            <DialogContentText>
                <Avatar id="media_dialog_icon" alt={title} src={icon} />
                <TextField
                    label="Enter New Picture Link"
                    name="icon"
                    maxlength="5"
                    value={icon}
                    rows="1"
                    variant="outlined"
                    onChange={handleChange}
                />
                <div className="formatRatingChangerLabel">
                    <TextField
                        label="Enter New Rating"
                        name="Enter New Rating"
                        maxlength="5"
                        defaultValue={rating}
                        margin="dense"
                        rows="1"
                        variant="outlined"
                        onChange={mouseHover}
                    />
                </div>

                <span id="media_dialog_rating">
                    {generateRating(rating, mouseHover)}
                </span>

                <TextField
                    label="Title"
                    name="title"
                    inputProps={{ maxLength: 70 }}
                    margin="normal"
                    fullWidth
                    variant="outlined"
                    value={title}
                    onChange={handleChange}
                />

                <TextField
                    label="Year"
                    name="year"
                    type="number"
                    margin="normal"
                    fullWidth
                    variant="outlined"
                    value={year}
                    onChange={handleChange}
                />

                <TextField
                    label="Notes"
                    name="notes"
                    margin="normal"
                    inputProps={{ maxLength: 3000 }}
                    value={notes}
                    fullWidth
                    multiline
                    rows="5"
                    variant="outlined"
                    onChange={handleChange}
                />
            </DialogContentText>
        );
    }
}

export default MediaDialogEdit;
