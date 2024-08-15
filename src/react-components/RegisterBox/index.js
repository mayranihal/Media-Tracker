import React from "react";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import TextField from "@material-ui/core/TextField";

import "./styles.css";

class LoginBox extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { appState, registerHandler, changeHandler } = this.props;

		return (
			<div id="loginbox_container">
				<div id="loginbox">
					<img
						src={
							"https://media.discordapp.net/attachments/806982392027545621/818581526916759642/logo.png"
						}
						className="registerlogo"
					/>
					<form name="register_form" onSubmit={registerHandler}>
						<label className="headingFormat">Username</label> <br />
						<TextField
							size="small"
							margin="dense"
							type="text"
							name="username"
							size="10"
							className="logininput"
							value={appState.username}
							onChange={changeHandler}
						>
							{" "}
						</TextField>
						<br />
						<label className="headingFormat">Password</label> <br />
						<TextField
							size="small"
							margin="dense"
							type="password"
							name="password"
							size="10"
							className="logininput"
							value={appState.password}
							onChange={changeHandler}
						>
							{" "}
						</TextField>
						<br />
						<label className="headingFormat">Confirm Password</label> <br />
						<TextField
							size="small"
							margin="dense"
							type="password"
							name="confirmPassword"
							size="10"
							className="logininput"
							value={appState.confirmPassword}
							onChange={changeHandler}
						>
							{" "}
						</TextField>
						<br />
						<Button
							variant="outlined"
							id="loginsubmit"
							type="submit"
							variant="contained"
							size="small"
							color="default"
							disableElevation
						>
							Register
						</Button>
					</form>
				</div>
			</div>
		);
	}
}

export default LoginBox;
