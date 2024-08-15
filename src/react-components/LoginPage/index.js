import React from "react";
import Button from "@material-ui/core/Button";

import LoginBox from "../LoginBox";
import RegisterBox from "../RegisterBox";
import "./styles.css";

class LoginPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			register: false,
		};
	}

	toggleLogin = (e) => {
		this.setState({
			register: !this.state.register,
		});
	};

	render() {
		const {
			appState,
			loginHandler,
			registerHandler,
			changeHandler,
		} = this.props;

		return (
			<div id="loginpage">
				{this.state.register ? (
					<div>
						<RegisterBox
							appState={appState}
							registerHandler={registerHandler}
							changeHandler={changeHandler}
						/>
					</div>
				) : (
					<LoginBox
						appState={appState}
						loginHandler={loginHandler}
						changeHandler={changeHandler}
					/>
				)}

				{appState.wrongInfo && !this.state.register && (
					<span className="errorCommand">
						{" "}
						Wrong username or password <br />
					</span>
				)}

				{appState.userExists && this.state.register && (
					<span className="errorCommand">
						{" "}
						User already exists <br />
					</span>
				)}

				{!appState.passwordsMatch && this.state.register && (
					<span className="errorCommand">
						{" "}
						Passwords don't match <br />
					</span>
				)}

				{appState.registerSuccess &&
					appState.passwordsMatch &&
					this.state.register && (
						<span>
							{" "}
							User {appState.newUser} created <br />
						</span>
					)}
				<br />

				<Button
					onClick={this.toggleLogin}
					variant="contained"
					size="small"
					color="default"
					disableElevation
					id="logintoggle"
				>
					{this.state.register ? <span>Log In</span> : <span>Register</span>}
				</Button>
			</div>
		);
	}
}

export default LoginPage;
