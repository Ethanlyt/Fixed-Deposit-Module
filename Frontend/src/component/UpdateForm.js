import React, { useEffect, useState } from "react";
import { TextField } from "@material-ui/core";
import { Button, Paper } from "@mui/material";
import myApi from "../API/apicreate";
import ViewSchedule from "../page/ViewSchedule"; 
import ToggleButton from "@mui/material/ToggleButton";

export function UpdateForm(props) {
    
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
    });

	const [isOpen, setIsOpen] = useState(false);

	const toggle = () => {
		setIsOpen(!isOpen);
	};

    useEffect(() => {
		myApi
			.get(`/getDetail?id=${props.index}`)
			.then((res) => {
                setData({
                    certificateNo: res.data.certificateNo,
                    referenceNo: res.data.referenceNo,
                    startDate: res.data.startDate,
                    endDate: res.data.endDate,
                    compoundPeriodMonth: res.data.compoundPeriodMonth,
                    principalAmount: res.data.principalAmount,
                    interestRate: res.data.interestRate,
                    comment: res.data.comment,
                    bankName: res.data.bankName,
                });
            }
            );
	}, []);

    const [earning, setEarning] = useState("");
    useEffect(() => {
        async function calculateEarnings() {
			await myApi.get(`/calculateEarn?interestRate=${data.interestRate}&principalAmount=${data.principalAmount}&periodInMonth=${data.compoundPeriodMonth}`)
				.then((earnData) => {
					setEarning(earnData.data);
				});
		}

		if(data.interestRate && data.principalAmount && data.compoundPeriodMonth){
			calculateEarnings();
		}
    }, [data.interestRate, data.principalAmount, data.compoundPeriodMonth]);

    const [endDateCal, setEndDateCal] = useState("");
    useEffect(() => {
		async function calculateEndDate() {
			await myApi.get(`/calculateEndDate?startDate=${data.startDate}&periodInMonth=${data.compoundPeriodMonth}`)
			.then((endDateData) => {
				setEndDateCal(endDateData.data);
			});
		}
		if(data.startDate && data.compoundPeriodMonth){
			calculateEndDate();
		}

    }, [data.startDate, data.compoundPeriodMonth]);

    const updateDatabase = () => {
		myApi
			.put(
				`update/${props.index}?certificateNo=${data.certificateNo}&referenceNo=${data.referenceNo}&startDate=${data.startDate}&compoundPeriodMonth=${data.compoundPeriodMonth}&principalAmount=${data.principalAmount}&interestRate=${data.interestRate}&comment=${data.comment}&bankName=${data.bankName}`
			)
			.then((res) => {
				console.log(res);
			});
        window.location.reload();
        alert(`Fixed Deposit #${props.index} berjaya dikemaskini.`);
    }
	const [schedules, setSchedules] = useState([]);
	const viewSchedule = () => {
		myApi.get(`getSchedulePreview?id=${props.index}`).then((res) => {
			console.log(res);
			setSchedules(res.data);
		}).catch((err) => {
			console.log(err);
		})
		toggle();

	}
	const [updatable, setUpdatable] = useState(true);
	const update = () => {
		setUpdatable(!updatable);
	}


	return (
		<form>
			<Paper elavation={2} className='mb-3 p-3 bg-light'>
				<TextField
					label='NOMBOR SIJIL PELABURAN'
					InputLabelProps={{
						backgroundcolor: "white",
					}}
					variant='filled'
					className='w-100 pb-3'
					required
					disabled={updatable}
					value={data.certificateNo}
					onChange={(e) =>
						setData({ ...data, certificateNo: e.target.value })
					}
				/>

				<TextField
					label='BANK'
					variant='filled'
					className='w-100 pb-3'
					required={true}
					value={data.bankName}
					disabled={updatable}
					onChange={(e) =>
						setData({ ...data, bankName: e.target.value })
					}
				/>
				<TextField
					label='NOMBOR RUJUKAN BANK'
					variant='filled'
					className='w-100 pb-3'
					required={true}
					value={data.referenceNo}
					disabled={updatable}
					onChange={(e) =>
						setData({ ...data, referenceNo: e.target.value })
					}
				/>

				<TextField
					label='TARIKH MULA (YYYY-MM-DD)'
					variant='filled'
					className='w-100 pb-3'
					required={true}
					value={data.startDate}
					disabled={updatable}
					onChange={(e) =>
						setData({ ...data, startDate: e.target.value })
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
					disabled={updatable}
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
					disabled={updatable}
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
					disabled={updatable}
					value={data.interestRate}
					onChange={(e) =>
						setData({ ...data, interestRate: e.target.value })
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
					className='w-100 pb-3'
					value={data.comment}
					disabled={updatable}
					onChange={(e) =>
						setData({ ...data, comment: e.target.value })
					}
				/>
				<ToggleButton variant='contained' size='large' onClick={update} value="UPDATE">
					UPDATE
				</ToggleButton>
			</Paper>
			{isOpen && (
				<ViewSchedule
					toggle={toggle}
					toggleFunction={toggle}
					fdId={props.index}
				/>
			)}

			<div className='d-flex justify-content-around'>
				{!updatable && (
					<Button
						variant='contained'
						size='large'
						onClick={updateDatabase}
					>
						UPDATE DATABASE
					</Button>
				)}
				<Button variant='contained' size='large' onClick={viewSchedule}>
					VIEW SCHEDULE
				</Button>
			</div>
		</form>
	);
}
