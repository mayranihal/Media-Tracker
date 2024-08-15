import React from "react";
import "./styles.css";
import Grid from "@material-ui/core/Grid";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
//import Reports from "./../Reports";//-> didn't have enough time to have this working fully
import SearchIcon from "@material-ui/icons/Search";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { fade, makeStyles } from "@material-ui/core/styles";
import InputBase from "@material-ui/core/InputBase";
import TextField from "@material-ui/core/TextField";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { uid } from "react-uid";
import ButtonGroup from "@material-ui/core/ButtonGroup";

class AdminPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			anchorEl: null,
			open: false,
			id: "nothing",
			lookupUser: "",
			aliveUser: "",
			queue: [],
		};
		this.handleClick = this.handleClick.bind(this);
		this.handleClose = this.handleClose.bind(this);
	}

	change = (event) => {
		this.setState({
			lookupUser: event.target.value,
		});
	};
	cleanQueue = (person) => {
		const alteredQueue = this.state.queue.filter(
			(e) => e.username !== person.username
		);
		this.setState({
			queue: alteredQueue,
		});
		console.log(person);
		console.log(this.state.queue);

		//log(res); // log the result in the console for development purposes,
		//  users are not expected to see this.
	};
	updateStatus = (person, bannedStat) => {
		//get the index of the obj

		const index = this.state.queue.findIndex(
			(e) => e.username === person.username
		);
		//get the right
		const leftPart = this.state.queue.slice(0, index);

		//get the left
		const rightPart = this.state.queue.slice(index + 1);
		//create a new obj
		const url = "/users/" + person.username;
		const body = {
			isBanned: bannedStat,
		};

		const request = new Request(url, {
			method: "PATCH",
			body: JSON.stringify(body),
			headers: {
				Accept: "application/json, text/plain, */*",
				"Content-Type": "application/json",
			},
		});

		fetch(request)
			.then(async (res) => {
				//update the queue

				if (res.status === 200) {
					const resjson = await res.json();

					const newQueue = leftPart.concat(resjson, rightPart);
					this.setState({
						queue: newQueue,
					});
				} else {
				}
				//	log(res); // log the result in the console for development purposes,
				//  users are not expected to see this.
			})
			.catch((error) => {
				//log(error);
			});
	};

	handleClick(event) {
		this.setState({
			anchorEl: event.currentTarget,
			open: Boolean(event.currentTarget),
			id: "simple-popover",
		});
	}

	handleClose(event) {
		this.setState({
			anchorEl: event.currentTarget,
			open: false,
			id: undefined,
		});
	}

	addUser = (event) => {
		if (
			this.state.lookupUser != "admin" &&
			this.state.queue.indexOf(this.state.lookupUser) === -1
		) {
			const url = "/users/" + this.state.lookupUser;
			const request = new Request(url, {
				method: "GET",

				headers: {
					Accept: "application/json, text/plain, /",
					"Content-Type": "application/json",
				},
			});

			// Send the request with fetch()
			fetch(request)
				.then(async (res) => {
					if (res.status === 200) {
						//add  the username if user exists
						const responseBody = await res.json();
						console.log(responseBody);

						this.setState({
							queue: [...this.state.queue, responseBody],
						});
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

			//console.log(this.state.queue); //works properly
		}
	};

	render() {
		const {
			appState,
			logOutHandler,
			banUser,
			unbanUser,
			deleteUser,
			bannedUsers,
		} = this.props;

		//const users = [];
		return (
			<div>
				<img
					src={
						"https://media.discordapp.net/attachments/806982392027545621/818581526916759642/logo.png"
					}
					className="logo"
				/>
				<br></br>

				<h1 className="title">Admin Dashboard</h1>

				<InputLabel className="titleAdmin">
					Logged In:
					<label className="colorUser">
						{" "}
						{this.props.appState.username}
					</label>{" "}
					<br></br>
					<Button
						id="logoutsubmit"
						type="submit"
						variant="contained"
						onClick={logOutHandler}
						className="logOutButton"
						size="small"
						color="default"
						disableElevation
					>
						Log Out
					</Button>
				</InputLabel>
				<AppBar position="static" color="transparent" className="bar">
					<Toolbar>
						<h3 className="formatSearchTitle">Search users:</h3>

						<TextField
							placeholder="Search..."
							type="search"
							className="formatSearch"
							value={this.state.lookupUser}
							onChange={this.change}
						>
							{" "}
						</TextField>

						<span className="spacing"> </span>

						<Button
							variant="contained"
							size="small"
							color="default"
							disableElevation
							className="button"
							onClick={() => this.addUser()}
							startIcon={<SearchIcon style={{ fontSize: 25 }} />}
						></Button>
						<span className="spacing1"> </span>
					</Toolbar>
				</AppBar>

				<Paper className="formatContainer">
					<Table className="formatTable">
						<TableHead>
							<TableRow>
								<TableCell>Username</TableCell>
								<TableCell>User Type</TableCell>
								<TableCell>Actions</TableCell>
								<TableCell>User Status</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{this.state.queue.map((person) => {
								console.log(person.isBanned);
								return (
									<TableRow key={uid(person)}>
										<TableCell>{person.username}</TableCell>
										<TableCell>User</TableCell>
										<TableCell className="formatButtons">
											<div className="formatDelete">
												<Button
													type="submit"
													variant="contained"
													size="small"
													color="default"
													disableElevation
													onClick={() => {
														deleteUser(person);
														this.cleanQueue(person);
													}}
												>
													Delete
												</Button>
											</div>
											<div className="formatBan">
												<Button
													type="submit"
													variant="contained"
													size="small"
													color="default"
													disableElevation
													onClick={() => {
														banUser(person);
														this.updateStatus(person, true);
													}}
												>
													Ban
												</Button>
											</div>

											<div className="formatunBan">
												{" "}
												<Button
													type="submit"
													variant="contained"
													size="small"
													color="default"
													disableElevation
													onClick={() => {
														unbanUser(person);
														this.updateStatus(person, false);
													}}
												>
													Unban
												</Button>
											</div>
										</TableCell>

										<TableCell>BANNED: {person.isBanned.toString()}</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</Paper>
			</div>
		);
	}
}

export default AdminPage;
