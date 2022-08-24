import "./App.css";
import React, { useContext, useState,useEffect } from "react";
import { BrowserRouter as Router, Route, Routes,useNavigate } from "react-router-dom";
import {QueryClient,QueryClientProvider} from "@tanstack/react-query"
import { UserContext } from './state/UserContext';


import myAPI from "./API/apicreate";
import Home from "./page/Home";
import FixedDeposit from "./page/FixedDeposit";
import FixedDepositList from "./page/FixedDepositList";
import Login from "./page/Login"
import NewApplication from './page/NewApplication';
import { getOptionGroupUnstyledUtilityClass } from "@mui/base";

function App(props) {	
	let navigate = useNavigate();
	const client = new QueryClient();
	const{login,logout} = useContext(UserContext);




	useEffect(() => {
		let userId, userRole;
		async function isLogIn(){
			try {
				const res = await myAPI.get(`/home`);
				userId = res.data;
				console.log("Session restore: ", res.data);
				if (res.data === 0) {
					logout();
					navigate('/');
					return;
				} 			
				const resRole = await myAPI.get(`/checkRole?userId=${userId}`);
				userRole = resRole.data;
				login(userId, userRole);
			}
			catch (err) {
				console.log(err);
			}
	
		}
		
		isLogIn();

	}, []);

	return (
		<div className='App'>
			<QueryClientProvider client={client}>
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='login' element={<Login />} />
					<Route path='fixed-deposit' element={<FixedDeposit />} />
					<Route path='application-form' element={<NewApplication />} />
					<Route
						path='fixed-deposit-list'
						element={<FixedDepositList />}
					/>
				</Routes>
			</QueryClientProvider>
		</div>
	);
}

export default App;
