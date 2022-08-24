import {
	TextField,
	InputLabel,
	Select,
	MenuItem,
	FormControl,
} from "@material-ui/core";
import { Button, Paper, StepContext } from "@mui/material";
import { render } from "@testing-library/react";
import React, { useEffect, useState,useContext } from "react";
import { useNavigate } from "react-router-dom";
import myApi from "../API/apicreate";
import ViewSchedule from "./ViewSchedule";
import AppBar from "../component/AppBar";
import { Label } from "@material-ui/icons";
import { UserContext } from "../state/UserContext";

function NewApplication(props) {
    const { user } = useContext(UserContext);

	const navigate = useNavigate();

	//User input
	const [data, setData] = useState({
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
		registration: {},
		daysFromStartDateToEndDate: "",
	});
	const [register, setRegister] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	const toggle = () => {
		setIsOpen(!isOpen);
	};

	//Backend provide
	const [earning, setEarning] = useState("");
	useEffect(() => {
        async function calculateEarnings() {
		myApi.get(
				`/calculateEarn?interestRate=${data.interestRate}&principalAmount=${data.principalAmount}&periodInMonth=${data.compoundPeriodMonth}`
			)
			.then((earnData) => {
				setEarning(earnData.data);
			});
        }

        if (data.interestRate && data.principalAmount && data.compoundPeriodMonth) {
            calculateEarnings();
        }

	}, [data.interestRate]);

	const [endDateCal, setEndDateCal] = useState("");
	useEffect(() => {
        async function calculateEndDate() {
		myApi.get(
				`/calculateEndDate?startDate=${data.startDate}&periodInMonth=${data.compoundPeriodMonth}`
			)
			.then((endDateData) => {
				setEndDateCal(endDateData.data);
			});
        }
        
        if(data.startDate && data.compoundPeriodMonth){
            calculateEndDate();
        }

	}, [data.compoundPeriodMonth]);

	//validation

	//Handing user input
	const [index, setIndex] = useState("");
	const [usernameInvalid, setUsernameInvalid] = useState(false);
	const handleSubmit = (e) => {
		e.preventDefault();
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
					`/requestApplication?userID=${user.userId}&certNo=${data.certificateNo}&refNo=${data.referenceNo}&startDate=${data.startDate}&periodInMonth=${data.compoundPeriodMonth}&principalAmount=${data.principalAmount}&interestRate=${data.interestRate}&comment=${data.comment}&bankName=${data.bankName}`
				)
				.then((res) => {
                    console.log(res.data);
					alert("Registered Successfully");
					setRegister(true);
				})
				.catch((err) => {
					setUsernameInvalid(true);
					alert("An error has occured.Please try again");
				});
        }
        

	};

    const [schedule, setSchedule] = useState([]);

    useEffect(() => {
        async function getSchedulePreview() {
            try{
                const res = await myApi.get(`/getSchedulePreviewByuser?userId=${user.userId}`)
                // setIndex(res.data);
                setSchedule(res.data);
            }
            catch(err){
                console.log(err);
            }
        }

        if(user.userId){
            getSchedulePreview();
        }

    }, [handleSubmit]);


	const handleClear = (e) => {
		e.preventDefault();
		setData({
			certificateNo: "",
			referenceNo: "",
			startDate: "",
			endDate: "",
			principalAmount: "",
			interestRate: "",
			compoundPeriodMonth: "",
			comment: "",
			bankName: "",
			registration: {},
		});
		setEarning("");
		setEndDateCal("");
	};

	const redirectHome = () => {
		navigate("/");
	};

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
					{isOpen && (
						<ViewSchedule
							schedule={schedule}
							toggle={toggle}
							toggleFunction={toggle}
						/>
					)}

					<Paper elavation={2} className='mb-3 p-3 bg-light'>
						<TextField
							label='NOMBOR SIJIL PELABURAN'
							InputLabelProps={{
								backgroundcolor: "white",
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
				</form>
			</Paper>
		</div>
	);
}
export default NewApplication;
