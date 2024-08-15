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
		const { appState, loginHandler, changeHandler } = this.props;

		return (
			<div id="loginbox_container">
				<div id="loginbox">
					<form name="login_form" onSubmit={loginHandler}>
						<img
							src={
								"https://media.discordapp.net/attachments/806982392027545621/818581526916759642/logo.png"
							}
							className="loginlogo"
						/>
						<br></br>
						<label className="headingFormat">Username</label> <br />
						<TextField
							name="username"
							margin="dense"
							className="logininput"
							value={appState.username}
							onChange={changeHandler}
							//variant="filled"
							size="small"
						>
							{" "}
						</TextField>{" "}
						<br />
						<label className="headingFormat">Password</label> <br />
						<TextField
							name="password"
							size="small"
							margin="dense"
							className="logininput"
							type="password"
							value={appState.password}
							onChange={changeHandler}
							//variant="filled"
						>
							{" "}
						</TextField>{" "}
						<br /> <br />
						<Button
							variant="outlined"
							type="submit"
							variant="contained"
							size="small"
							color="default"
							disableElevation
						>
							Log In
						</Button>
					</form>
				</div>
			</div>
		);
	}
}

export default LoginBox;
