import "./App.css";
import React from "react";
import {
	Redirect,
	BrowserRouter,
	Switch,
	Route,
	useParams,
} from "react-router-dom";

import LoginPage from "./react-components/LoginPage";
import UserPage from "./react-components/UserPage";
import AdminPage from "./react-components/AdminPage";

import { sampleMedia, newSample } from "./samples/sampleMedia.js";
import UserSwitch from "./react-components/UserSwitch";

class App extends React.Component {
	constructor(props) {
		super(props);

		//SERVER this would be stored in a database

		this.state = {
			username: "",
			pic: "https://miro.medium.com/max/875/0*RQF2RLZURKzlLc6z",

			userColor: "black",
			password: "",
			confirmPassword: "",
			passwordsMatch: true,
			registerSuccess: false,
			newUser: "",
			loggedIn: false,
			loggedOff: true,
			userType: "", // either user or admin
			wrongInfo: false,
			bannedUsers: [],
			isBanned: false,

			currentUser: undefined,
			viewedUser: undefined,

			userExists: false,
		};
	}

	loginHandler = (e) => {
		// SERVER : would actually check the server for correct user/pass combo + user type and
		//Retrieve the appropriate username Color, user profile picture, bio, discord, website

		e.preventDefault();

		const user = this.state.username;
		const pass = this.state.password;

		const url = "/users/login";
		const body = {
			username: user,
			password: pass,
		};

		const request = new Request(url, {
			method: "post",
			body: JSON.stringify(body),
			headers: {
				Accept: "application/json, text/plain, */*",
				"Content-Type": "application/json",
			},
		});

		fetch(request)
			.then(async (res) => {
				// User logged in succesfully
				if (res.status === 200) {
					const resjson = await res.json();
					this.setState({
						loggedIn: true,
						loggedOff: false,
						passwordsMatch: true,
						registerSuccess: false,
						newUser: "",
						wrongInfo: false,
						userExists: false,
						currentUser: resjson.currentUser,
					});
				} else {
					this.setState({
						wrongInfo: true,
					});
				}
				//	log(res); // log the result in the console for development purposes,
				//  users are not expected to see this.
			})
			.catch((error) => {
				//log(error);
			});
	};

	logOutHandler = (e) => {
		e.preventDefault();

		const user = this.state.username;

		const url = "/users/logout";

		const request = new Request(url, {
			method: "get",
			headers: {
				Accept: "application/json, text/plain, */*",
				"Content-Type": "application/json",
			},
		});

		fetch(request)
			.then(async (res) => {
				// User logged in succesfully
				if (res.status === 200) {
					this.setState({
						loggedIn: false,
						loggedOff: true,
						username: "",
						password: "",
						currentUser: undefined,
					});
				}
				//	log(res); // log the result in the console for development purposes,
				//  users are not expected to see this.
			})
			.catch((error) => {
				//log(error);
			});
	};

	unbanUser = (usertoRestore) => {
		//SERVER : remove record that user is a banned user
		//const usernameRestored = usertoRestore.username;
		//const banned = this.state.bannedUsers;
		//if (banned.indexOf(usernameRestored) != -1) {
		//	banned.pop(usernameRestored);
		//}

		const url = "/users/" + usertoRestore.username;
		//console.log(usertoRestore.username + "wut");

		const res = false;

		const request = new Request(url, {
			method: "PATCH",

			body: JSON.stringify({
				isBanned: res,
			}),
			headers: {
				Accept: "application/json, text/plain, /",
				"Content-Type": "application/json",
			},
		});

		// Send the request with fetch()
		fetch(request)
			.then((res) => {
				if (res.status === 200) {
				} else {
					console.log(res);
				}
				//log(res); // log the result in the console for development purposes,
				//  users are not expected to see this.
			})
			.catch((error) => {
				//log(error);
			});
	};

	banUser = (usertoKill) => {
		//SERVER : record that user is a banned user in database
		//bans user

		//update the banned ppl array
		//	const usernameKilled = usertoKill.username;
		//	const bannedPeople = this.state.bannedUsers;
		//	if (bannedPeople.indexOf(usernameKilled) == -1) {
		//		bannedPeople.push(usernameKilled);
		//	}

		const url = "/users/" + usertoKill.username;
		//console.log(usertoKill.username + "wut");

		const res = true;

		const request = new Request(url, {
			method: "PATCH",

			body: JSON.stringify({
				isBanned: res,
			}),
			headers: {
				Accept: "application/json, text/plain, /",
				"Content-Type": "application/json",
			},
		});

		// Send the request with fetch()
		fetch(request)
			.then((res) => {
				if (res.status === 200) {
				} else {
					//
				}
				//log(res); // log the result in the console for development purposes,
				//  users are not expected to see this.
			})
			.catch((error) => {
				//log(error);
			});
		//console.log(val);
	};
	deleteUser = (usertoDelete) => {
		//SERVER delete user from actual database

		const url = "/users/" + usertoDelete.username;
		//console.log(usertoDelete.username + "wut");

		const request = new Request(url, {
			method: "DELETE",

			headers: {
				Accept: "application/json, text/plain, /",
				"Content-Type": "application/json",
			},
		});

		// Send the request with fetch()
		fetch(request)
			.then((res) => {
				if (res.status === 200) {
				} else {
					//console.log(res);
					return;
				}
				//log(res); // log the result in the console for development purposes,
				//  users are not expected to see this.
			})
			.catch((error) => {
				//log(error);
			});
	};

	registerHandler = (e) => {
		e.preventDefault();
		const user = this.state.username;
		const pass = this.state.password;
		const confirmPass = this.state.confirmPassword;
		if (confirmPass !== pass) {
			// if registering and the passwords dont match
			this.setState({
				registerSuccess: false,
				passwordsMatch: false,
				userExists: false,
			});
			return;
		}

		const url = "/users/" + user;

		// The data we are going to send in our request
		let data = {
			username: user,
			password: pass,
		};
		// Create our request constructor with all the parameters we need
		//check if user exists
		const request = new Request(url, {
			method: "get",
			headers: {
				Accept: "application/json, text/plain, */*",
				"Content-Type": "application/json",
			},
		});

		// Send the request with fetch() -> CITATION: this code is from a lecture
		fetch(request)
			.then((res) => {
				//user exists
				if (res.status === 200) {
					// if user exists, display a warning

					this.setState({
						registerSuccess: false,
						passwordsMatch: true,
						userExists: true,
					});
				} else {
					//user doesnt exist and is actually new
					const url = "/users";

					// Create our request constructor with all the parameters we need
					const request = new Request(url, {
						method: "post",
						body: JSON.stringify(data),
						headers: {
							Accept: "application/json, text/plain, */*",
							"Content-Type": "application/json",
						},
					});

					// Send the request with fetch()
					fetch(request)
						.then(function (res) {
							if (res.status === 200) {
								//registering the user
								this.setState({
									newUser: user,
									registerSuccess: true,
									passwordsMatch: true,
									userExists: false,
								});
							} else {
								console.log("Register failed");
							}
							//log(res); // log the result in the console for development purposes,
							//  users are not expected to see this.
						})
						.catch((error) => {
							//error 404 ->  user not found
							//log(error);
							this.setState({
								newUser: user,
								registerSuccess: true,
								passwordsMatch: true,
								userExists: false,
							});
						});
				}
				//	log(res); // log the result in the console for development purposes,
				//  users are not expected to see this.
			})
			.catch((error) => {});
	};

	changeHandler = (e) => {
		//SERVER record changes in database

		const target = e.target;
		const name = target.name;
		const value = target.value;

		this.setState({
			[name]: value,
		});
	};

	render() {
		return (
			<div>
				<BrowserRouter>
					<Switch>
						{" "}
						{/* Similar to a switch statement - shows the component depending on the URL path */}
						{/* Each Route below shows a different component depending on the exact path in the URL  */}
						<Route
							exact
							path="/"
							render={() => (
								<LoginPage
									className="back"
									appState={this.state}
									loginHandler={this.loginHandler}
									registerHandler={this.registerHandler}
									changeHandler={this.changeHandler}
								/>
							)}
						/>
						<Route
							exact
							path="/:username"
							render={(props) => {
								return (
									<UserSwitch
										username={props.match.params.username}
										appState={this.state}
										logOutHandler={this.logOutHandler}
										banUser={this.banUser}
										unbanUser={this.unbanUser}
										deleteUser={this.deleteUser}
										bannedUsers={this.state.bannedUsers}
										logOutHandler={this.logOutHandler}
									/>
								);
							}}
						/>
					</Switch>

					{/* will make a user log out if they click logout button*/}

					{this.state.currentUser == undefined ? (
						<Redirect to="/" />
					) : (
						<Redirect to={"/" + this.state.currentUser.username} />
					)}
				</BrowserRouter>
			</div>
		);
	}
}

export default App;
