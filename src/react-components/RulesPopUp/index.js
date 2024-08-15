import React from "react";
import Popover from "@material-ui/core/Popover";
import Button from "@material-ui/core/Button";
import "./styles.css";

export default class RulesPopUp extends React.Component {
	constructor(props) {
		super(props);

		this.state = { ruleid: undefined, anchorEl1: null, isTriggered: false };
		this.isClicked = this.isClicked.bind(this);
		this.isClosed = this.isClosed.bind(this);
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
	render() {
		const { ruleid, isTriggered, anchorEl1, isClicked, isClosed } = this.props;

		return (
			<div>
				<Button
					aria-describedby={ruleid}
					type="submit"
					variant="contained"
					size="small"
					color="default"
					disableElevation
					onClick={isClicked}
				>
					Rules
				</Button>

				<Popover
					id={ruleid}
					open={isTriggered}
					anchorEl={anchorEl1}
					onClose={isClosed}
					anchorOrigin={{
						vertical: "bottom",
						horizontal: "center",
					}}
					transformOrigin={{
						vertical: "top",
						horizontal: "center",
					}}
				>
					{
						//Figuring out how to create a popover properly was possible with the
						//help of this link: https://stackoverflow.com/questions/62009609/react-class-how-to-anchorel-popover
					}{" "}
					<div className="formatRules">
						<p className="ruleTitle">Rules</p>
						<div>
							<p className="warning">
								NOTE: failure to follow these rules will result in a ban
							</p>
						</div>

						<ul>
							<li>No Hate Speech (i.e. racial slurs, death threats, etc)</li>
							<li>No DOXXing other users</li>
							<li>No distributing child pornography</li>
							<li>No SPAM Botting</li>
						</ul>
					</div>
				</Popover>
			</div>
		);
	}
}
