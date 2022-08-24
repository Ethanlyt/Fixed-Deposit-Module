import { Button, Paper } from "@mui/material";
import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import App from "../App";
import AppBar from '../component/AppBar'
import { UserContext } from "../state/UserContext";
import myAPI from "../API/apicreate";


function Home(props) {
	const {user} = useContext(UserContext);
	

	return (
		<div>
			<AppBar />
			{console.log(user.auth)}
			{user.auth && (
				<Paper
					elevation={2}
					className='bg-secondary text-white w-75 mx-auto my-3 p-2'
				>
					<div>
						<h1 className='text-center'>
							Welcome To Fixed Deposit
						</h1>
					</div>
					<hr className='w-75 mx-auto'></hr>
					<p>
						<small>User ID: {user.userId}</small>
						<br></br>
						<small>User Role: {user.role}</small>
					</p>
				</Paper>
			)}
			<Paper
				elevation={3}
				className='w-75 mx-auto mb-3 mt-5 bg-light p-2'
			>
				<div>
					<h1 className='text-center '>Home</h1>
					<hr className='w-75 mx-auto'></hr>
				</div>
				Show how to use this website.
			</Paper>
		</div>
	);
}

export default Home;
