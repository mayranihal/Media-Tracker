import ReportProblemIcon from "@material-ui/icons/ReportProblem";
import React from "react";
import Popover from "@material-ui/core/Popover";
import Button from "@material-ui/core/Button";

export default class SimplePopover extends React.Component {
	constructor(props) {
		super(props);

		this.state = {};
	}

	render() {
		const { handleClose, handleClick, anchorEl, open, id } = this.props;
		return (
			<div>
				<Button
					variant="contained"
					aria-describedby={id}
					size="small"
					color="default"
					disableElevation
					onClick={handleClick}
					className="button1"
					//startIcon={<ReportProblemIcon style={{ fontSize: 25 }} />}
				></Button>
				<Popover
					//CITATION~~~~~~~~~~
					//Figuring out how to create a popover properly was possible with the
					//help of this link: https://stackoverflow.com/questions/62009609/react-class-how-to-anchorel-popover
					id={id}
					open={open}
					anchorEl={anchorEl}
					onClose={handleClose}
					anchorOrigin={{
						vertical: "bottom",
						horizontal: "center",
					}}
					transformOrigin={{
						vertical: "top",
						horizontal: "center",
					}}
				>
					{/* <Typography className={this.classes.typography}> */}
					<div>The content of the Popover.</div>
					{/* </Typography> */}
				</Popover>
			</div>
		);
	}
}
