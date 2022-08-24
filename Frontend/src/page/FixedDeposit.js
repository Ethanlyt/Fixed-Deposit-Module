import { TextField,InputLabel,Select,MenuItem,FormControl } from "@material-ui/core";
import { Button, Paper, StepContext } from "@mui/material";
import { render } from "@testing-library/react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import myApi from '../API/apicreate';
import ViewSchedule from './ViewSchedule'; 
import AppBar from "../component/AppBar";
import { Label } from "@material-ui/icons";


function FixedDeposit(props){
	const axios = require('axios');
	
	const navigate = useNavigate();
	const [user, setUser] = useState({
		username: '',
		password: '',
		role:'',
	});
	const [userValid, setUserValid] = useState(false);
	
	//User input
	const [data,setData] = useState({
		certificateNo: "",
		referenceNo: "",
		startDate: "",
		endDate: "",
		compoundPeriodMonth: "",
		principalAmount: "",
		interestRate: "",
		comment: "",
		bankName: "",
		schedule: [],
		registration:{
		},
		daysFromStartDateToEndDate: "",
	});
	const [register,setRegister] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	const toggle = () => {
		setIsOpen(!isOpen);
	};

	

	//Backend provide
	const [earning,setEarning] = useState("");
	useEffect(() => {
			myApi.get(`/calculateEarn?interestRate=${data.interestRate}&principalAmount=${data.principalAmount}&periodInMonth=${data.compoundPeriodMonth}`).then((earnData) => {
			setEarning(earnData.data);
		});	
	} ,[data.interestRate]);

	const [endDateCal,setEndDateCal] = useState("");
	useEffect(() => {
			myApi.get(`/calculateEndDate?startDate=${data.startDate}&periodInMonth=${data.compoundPeriodMonth}`)
				.then((endDateData) => {
					setEndDateCal(endDateData.data);
				});	
	} ,[data.compoundPeriodMonth]);

	//validation

	//Handing user input
	const [index,setIndex] = useState("");
	const [usernameInvalid, setUsernameInvalid] = useState(false);
	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(user.role);
		if(user.role === "user"){
			if (
				data.certificateNo === "" ||
				data.referenceNo === "" ||
				data.startDate === "" ||
				data.principalAmount === "" ||
				data.interestRate === "" ||
				data.bankName === ""
			) {
				alert("Please fill in all the fields");
			} else {
				myApi
					.post(
						`/saveUserURL?username=${user.username}&password=${user.password}&role=${user.role}&certNo=${data.certificateNo}&refNo=${data.referenceNo}&startDate=${data.startDate}&periodInMonth=${data.compoundPeriodMonth}&principalAmount=${data.principalAmount}&interestRate=${data.interestRate}&comment=${data.comment}&bankName=${data.bankName}`
					)
					.then((res) => {
						setIndex(res.data);
						alert("Registered Successfully");
						setRegister(true);
					})
					.catch((err) => {
						setUsernameInvalid(true);
						alert("An error has occured.Please try again");
					});
			}
		}
		else{
			myApi.post(`/saveAdminURL?username=${user.username}&password=${user.password}&role=${user.role}`).then((res) => {
				console.log(res.data);
				alert("Registered Successfully");
				setRegister(true);
			}).catch((err) => {
				alert("An error has occured.Please try again");
			}).finally(() => {
				redirectHome();
			});
		}
		
	}
	
	const [next,setNext] = useState(true);

	const handleNext = (e) => {
		e.preventDefault();
		if (user.username === "" || user.password === ""){
			alert("Please fill in all the fields");
		}
		else{
			setUserValid(true);
			setNext(false);
		}
	}


	const handleClear = (e) => {
		e.preventDefault();
		setData({
			certificateNo: "",
			referenceNo: "",
			startDate: "",
			endDate: "",
			principalAmount: "",
			interestRate: "",
			compoundPeriodMonth	: "",
			comment: "",
			bankName: "",
			registration:{
			}
		});
		setEarning("");
		setEndDateCal("");
	}

	const redirectHome = () => {
		navigate("/");
	}
	
	return (
		<div>
			<AppBar classname='z-index-2' />
			<Paper className='w-75 mx-auto mt-4 p-4'>
				<h2 className='pb-3'>Fixed Deposit Registration</h2>

				<div>
					<div className='text-danger'>
						*This form is required for registration.
					</div>
					<div>
						Fill in you information for fixed deposit registration.
					</div>
				</div>

				<hr></hr>

				<form>
					<Paper elavation={2} className='mb-3 p-3 bg-light'>
						{usernameInvalid && (
							<i className='text-danger'>
								Username has been used. Try another username
							</i>
						)}
						
						<TextField
							label='USERNAMA'
							InputLabelProps={{
								backgroundColor: "white",
							}}
							variant='filled'
							className='w-100 pb-3'
							disabled={register}
							required
							value={user.username}
							onChange={(e) =>
								setUser({ ...user, username: e.target.value })
							}
						/>
						<TextField
							type='password'
							label='KATA LALUAN'
							InputLabelProps={{
								backgroundColor: "white",
							}}
							variant='filled'
							className='w-100 pb-3'
							disabled={register}
							required
							value={user.password}
							onChange={(e) =>
								setUser({ ...user, password: e.target.value })
							}
						/>

						<FormControl fullWidth>
							<InputLabel htmlFor='role' className='text-primary'>
								ROLE
							</InputLabel>
							<Select
								labelId='role'
								value={user.role}
								disabled={register}
								label='Role'
								onChange={(e) =>
									setUser({
										...user,
										role: e.target.value,
									})
								}
							>
								<MenuItem value={"user"}>
									USER (Apply for FD)
								</MenuItem>
								<MenuItem value={"admin"}>ADMIN</MenuItem>
							</Select>
						</FormControl>

						<br></br>
						<br></br>
						{user.role === "admin" && (
							<Button
								variant='contained'
								size='large'
								onClick={handleSubmit}
							>
								Submit
							</Button>
						)}
						{user.role === "user" && next && (
							<Button
								variant='contained'
								size='large'
								onClick={handleNext}
							>
								Next
							</Button>
						)}
					</Paper>
					<hr></hr>
					{console.log(index)}
					{isOpen && (
						<ViewSchedule
							fdId={index}
							toggle={toggle}
							toggleFunction={toggle}
						/>
					)}
					{userValid && (
						<Paper elavation={2} className='mb-3 p-3 bg-light'>
							<TextField
								label='NOMBOR SIJIL PELABURAN'
								InputLabelProps={{
									backgroundColor: "white",
								}}
								variant='filled'
								className='w-100 pb-3'
								required
								disabled={register}
								value={data.certificateNo}
								onChange={(e) =>
									setData({
										...data,
										certificateNo: e.target.value,
									})
								}
							/>

							<TextField
								label='BANK'
								variant='filled'
								className='w-100 pb-3'
								required={true}
								disabled={register}
								value={data.bankName}
								onChange={(e) =>
									setData({
										...data,
										bankName: e.target.value,
									})
								}
							/>
							<TextField
								label='NOMBOR RUJUKAN BANK'
								variant='filled'
								className='w-100 pb-3'
								required={true}
								disabled={register}
								value={data.referenceNo}
								onChange={(e) =>
									setData({
										...data,
										referenceNo: e.target.value,
									})
								}
							/>

							<TextField
								label='TARIKH MULA (YYYY-MM-DD)'
								variant='filled'
								className='w-100 pb-3'
								required={true}
								disabled={register}
								value={data.startDate}
								onChange={(e) =>
									setData({
										...data,
										startDate: e.target.value,
									})
								}
							/>
							<TextField
								label='TARIKH TAMAT (YYYY-MM-DD)'
								variant='standard'
								className='w-100 pb-3'
								disabled={true}
								value={endDateCal}
							/>
							<TextField
								label='TEMPOH (HARI/BULAN)'
								variant='filled'
								className='w-100 pb-3'
								required={true}
								disabled={register}
								value={data.compoundPeriodMonth}
								
								onChange={(e) =>
									setData({
										...data,
										compoundPeriodMonth: e.target.value,
									})
								}
							/>
							<TextField
								label='AMAUN POKOK (RM)'
								variant='filled'
								className='w-100 pb-3'
								required={true}
								disabled={register}
								value={data.principalAmount}
								onChange={(e) =>
									setData({
										...data,
										principalAmount: e.target.value,
									})
								}
							/>
							<TextField
								label='KADAR FAEDAH (0.00%)'
								variant='filled'
								className='w-100 pb-3'
								required={true}
								disabled={register}
								value={data.interestRate}
								onChange={(e) =>
									setData({
										...data,
										interestRate: e.target.value,
									})
								}
							/>
							<TextField
								label='AMAUN FAEDAH (RM)'
								variant='standard'
								className='w-100 pb-3'
								disabled={true}
								value={earning}
							/>

							<TextField
								label='KOMEN (OPTIONAL)'
								variant='filled'
								disabled={register}
								className='w-100 pb-3'
								value={data.comment}
								onChange={(e) =>
									setData({
										...data,
										comment: e.target.value,
									})
								}
							/>

							<div className='d-flex justify-content-around'>
								{register === false && (
									<Button
										variant='contained'
										size='large'
										onClick={handleSubmit}
									>
										SUBMIT
									</Button>
								)}
								{register === false && (
									<Button
										variant='contained'
										size='large'
										onClick={handleClear}
									>
										CLEAR
									</Button>
								)}
								<Button
									variant='contained'
									size='large'
									onClick={redirectHome}
								>
									BACK
								</Button>
								{register && (
									<Button
										variant='contained'
										size='large'
										onClick={toggle}
									>
										View Earning Schedule
									</Button>
								)}
							</div>
						</Paper>
					)}
				</form>
			</Paper>
		</div>
	);
}
export default FixedDeposit;