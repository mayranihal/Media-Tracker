import React from "react";
import { uid } from "react-uid";
import {
    Avatar,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemIcon,
} from "@material-ui/core";

import { StarRounded } from "@material-ui/icons";

import "./styles.css";
import MediaDialog from "../MediaDialog";

class Media extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dialogOpen: false,
        };
    }

    handleTabs = (e, newValue) => {
        this.setState({
            currentTab: newValue,
        });
    };

    handleCloseDialog = (e) => {
        this.setState({
            dialogOpen: false,
        });
    };

    generateRating = (rating) => {
        let stars = [];

        for (let i = 0; i < 5; i++) {
            if (i < rating) {
                stars.push(
                    <ListItemIcon>
                        <StarRounded key={uid(this, i)} color="primary" />
                    </ListItemIcon>
                );
            } else {
                stars.push(
                    <ListItemIcon>
                        <StarRounded key={uid(this, i)} color="disabled" />
                    </ListItemIcon>
                );
            }
        }

        return stars;
    };

    render() {
        const { media, handleClick } = this.props;

        return (
            <ListItem
                key={uid(media)}
                button
                divider
                onClick={() => handleClick(media)}
            >
                <ListItemAvatar>
                    <Avatar alt={media.title} src={media.icon} />
                </ListItemAvatar>
                <ListItemText>
                    <strong>Title:</strong> {media.title} <br />
                    <strong>Year:</strong> {media.year}
                </ListItemText>
                {this.generateRating(media.rating).map((star) => {
                    return star;
                })}
            </ListItem>
        );
    }
}

export default Media;
