import React from "react";
import { uid } from "react-uid";
import {
    Avatar,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    Input,
    InputLabel,
    Button,
    TextField,
    Typography,
} from "@material-ui/core";

import { StarRounded } from "@material-ui/icons";

import "./styles.css";

class MediaDialogView extends React.Component {
    constructor(props) {
        super(props);
        let media = props.selectedMedia;
        this.state = {
            editing: false,
            title: media ? media.title : "",
            year: media ? media.year : "",
            notes: media ? media.notes : "",
            rating: media ? media.rating : 0,
            icon: media ? media.icon : "",
        };
    }

    handleChange = (e) => {
        const target = e.target;
        const name = target.name;
        const value = target.value;

        this.setState({
            [name]: value,
        });
    };

    render() {
        const { generateRating } = this.props;

        return (
            <DialogContentText id="media_dialog_view">
                <Avatar
                    id="media_dialog_icon"
                    alt={this.state.title}
                    src={this.state.icon}
                />
                <span id="media_dialog_rating">
                    {generateRating(this.state.rating)}
                </span>
                <br />
                <div id="media_dialog_view_text">
                    <div id="media_dialog_view_header">
                        <Typography variant="h6" gutterBottom>
                            Title
                        </Typography>
                        <Typography variant="subtitle1" wordWrap>
                            {this.state.title}
                        </Typography>
                        <br />
                        <Typography variant="h6" gutterBottom>
                            Year
                        </Typography>
                        <Typography variant="subtitle1">
                            {this.state.year}
                        </Typography>
                    </div>

                    <span id="media_dialog_view_notes">
                        <Typography variant="h6">Notes</Typography>
                    </span>
                    {this.state.notes.split("\n").map((line) => (
                        <p className="media_dialog_view_notes" key={uid(line)}>
                            {line}
                        </p>
                    ))}
                </div>
            </DialogContentText>
        );
    }
}

export default MediaDialogView;
