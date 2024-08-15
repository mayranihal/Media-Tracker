import React from "react";
import "./styles.css";
import Button from "@material-ui/core/Button";

import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Popover from "@material-ui/core/Popover";

class ClickAwayImageChanger extends React.Component {
	constructor(props) {
		super(props);

		this.state = {};
	}

	render() {
		const {
			anchorEl,
			notClosed,
			onClick,
			onClickAway,
			editSwitch,
			id,
			pic,
			handlePic,
			appState,
		} = this.props;
		return (
			<div>
				{!editSwitch ? (
					<div>
						<div className="pop">
							<Button
								variant="contained"
								size="small"
								color="default"
								disableElevation
								onClick={onClick}
							>
								Change Picture
							</Button>
						</div>
						<div className="popupFormat">
							{
								//CITATION
								//Figuring out how to create a popover properly was possible with the
								//help of this link: https://stackoverflow.com/questions/62009609/react-class-how-to-anchorel-popover
							}
							<Popover
								id={id}
								open={notClosed}
								anchorEl={anchorEl}
								onClose={onClickAway}
								anchorOrigin={{
									vertical: "top",
									horizontal: "center",
								}}
								anchorPosition={{ left: 20 }}
								transformOrigin={{
									vertical: "bottom",
									horizontal: "left",
								}}
							>
								<div className="textFormat">
									<InputLabel>
										Image URL:{" "}
										<InputLabel shrink={true}>Click Away to Exit</InputLabel>
										<Input
											disabled={!notClosed}
											default={"Enter Image Link Here"}
											value={pic}
											onChange={(e) => {
												handlePic(e);
											}}
											color="secondary"
										>
											Click Away to Close
										</Input>
									</InputLabel>
								</div>
							</Popover>
						</div>
					</div>
				) : null}
			</div>
		);
	}
}
export default ClickAwayImageChanger;
