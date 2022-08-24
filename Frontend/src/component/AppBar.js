import React, { useState, useContext, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import myApi from "../API/apicreate";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { UserContext } from "../state/UserContext";
import axios from "axios";

export default function ButtonAppBar(props) {
	let navigate = useNavigate();
	const { user, logout } = useContext(UserContext);
	const [isLoading, setIsLoading] = useState(false);
	const [logoutMessage, setLogoutMessage] = useState("");
	const [applyFD, setApplyFD] = useState(false);

	useEffect (() => {
		async function checkFD(){
			try{
				const res = await myApi.get(`/getFdId?userId=${user.userId}`);
				if(res.data === 0){
					setApplyFD(true);
				}
			}
			catch(err){
				console.log(err);
			}
		}

		if (user.auth === true) {
			setIsLoading(true);
			checkFD();
			console.log(applyFD);
			setIsLoading(false);
		}

	}, []);



	const handleLogout = () => {
		setIsLoading(true);
		try{
			const res =  myApi.post(`/logout`);
			setLogoutMessage(res);
		}
		catch(err){
			console.log(err);
		}
		finally{
			setIsLoading(false);
			logout();
			// alert(logoutMessage);
			navigate("/");
		}
	}

	return (
		<Box sx={{ flexGrow: 2 }}>
			{isLoading && <p>Loading...</p>}
			<AppBar position='static' className='z-index-n1'>
				<Toolbar className='d-flex justify-content-between w-100'>
					<div className='w-25 d-flex justify-content-start'>
						<Typography variant='h6' component='div'>
							<Button variant='outlined'>
								<Link
									to='/'
									className='text-decoration-none text-light'
									// state={props.user}
								>
									Home
								</Link>
							</Button>
						</Typography>
						{!user.auth && (
							<div className='w-100 d-flex'>
								<Typography variant='h6' component='div'>
									<Button variant='outlined'>
										<Link
											to='/fixed-deposit'
											className='text-decoration-none text-light'
										>
											Register
										</Link>
									</Button>
								</Typography>
								<Typography variant='h6' component='div'>
									<Button variant='outlined'>
										<Link
											to='/login'
											className='text-decoration-none text-light'
										>
											Login
										</Link>
									</Button>
								</Typography>
							</div>
						)}
					</div>
					{applyFD && user.role === "USER" && (
						<Typography variant='h6' component='div'>
							<Button variant='outlined'>
								<Link
									to='/application-form'
									className='text-decoration-none text-light'
									state={applyFD}
								>
									Apply new fixed deposit
								</Link>
							</Button>
						</Typography>
					)}
					{user.auth && (
						<div className='d-flex justify-content-between'>
							<Typography variant='h6' component='div'>
								<Button variant='outlined'>
									<Link
										to='/fixed-deposit-list'
										className='text-decoration-none text-light'
									>
										Fixed Deposit Manager
									</Link>
								</Button>
							</Typography>

							<Typography variant='h6' component='div'>
								<Button
									variant='outlined'
									onClick={handleLogout}
								>
									<Link
										to='/'
										className='text-decoration-none text-light'
										onClick={handleLogout}
									>
										Log Out
									</Link>
								</Button>
							</Typography>
						</div>
					)}
				</Toolbar>
			</AppBar>
		</Box>
	);
}
