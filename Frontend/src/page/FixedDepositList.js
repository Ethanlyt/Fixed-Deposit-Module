import { Button, TextField } from "@mui/material";
import MaterialReactTable from "material-react-table";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import myAPI from '../API/apicreate';
import AppBar from "../component/AppBar";
import { UpdateForm } from '../component/UpdateForm';
import { UserContext } from "../state/UserContext";
import ViewSchedule from "./ViewSchedule"; 


function FixedDepositList(props) {
	const { user } = useContext(UserContext);
	let navigate = useNavigate();

	const [isLoading, setIsLoading] = useState(false);
	const [dataFetched, setDataFetched] = useState([]);
	const [isOpen, setIsOpen] = useState(false);
	const [isUpdating, setIsUpdating] = useState(false);
	const [idToUpdate, setIdToUpdate] = useState();
	const [deleted,setDeleted] = useState(false);
	const [fdId, setFdId] = useState();
	const [transactions,setTransactions] = useState([]);
	const [userFD, setUserFD] = useState([
		{
			regId: "",
			certNo: "",
			startDate: "",
			endDate: "",
			principalAmount: "",
			amountEarned: "",
			status: "",
		}	
	]);
	
	useEffect(() => {
		
		async function fetchAdminAuthView(){
			try{
				const res = await myAPI.get("/allAdmin");
				setDataFetched(res.data);
			}catch(err){
				console.log(err);
			}
		}
		async function fetchUseAuthView(){
			try{
				const res = await myAPI.get(`/allUser?userId=${user.userId}`);
				setUserFD({
					regId: res.data.registration.id,
					certNo: res.data.certificateNo,
					startDate: res.data.startDate,
					endDate: res.data.endDate,
					principalAmount: res.data.principalAmount,
					amountEarned: res.data.schedule[0].amountEarned,
					status: res.data.status,
				});
			}catch(err){
				console.log(err);
			}
		}
		async function fetchFdId(){
			try{
				const res = await myAPI.get(`/getFdId?userId=${user.userId}`);
				setFdId(res.data);
				if(res.data === 0){
					setDeleted(true);
					return null;
				}
				else{
					if(user.role === "USER"){
						try {
							const resTrans = await myAPI.get(
								`/getTransaction?fdId=${res.data}`
							);
							setTransactions(resTrans.data);
							console.log("TRANSACTION:",resTrans);
						} catch (err) {
							console.log(err);
						}
					}
				}
			}
			catch(err){
				console.log(err);
			}
		}

		if(user.auth){
			setIsLoading(true);
			if(user.role === "ADMIN")
				fetchAdminAuthView();
			else if(user.role === "USER"){
				if(fetchFdId() !== null){
				fetchUseAuthView();
				}
			}
			setIsLoading(false);
		}
		
	} ,[user.auth]);

	const toggle = () => {
		setIsOpen(!isOpen);
	};

	const handleDelete = (id) => {
		if(window.confirm("Are you sure you want to delete this record?")){
			myAPI.delete(`/delete/${id}`).then((res) => {
				console.log(res);
			});
			window.location.reload();
			alert(`Fixed Deposit #${id} deleted successfully.`);
		}
		else{
			alert(`Fixed Deposit #${id} not deleted.`);
		}
	};

	const handleApprove = (id) => {
		myAPI.put(`/approve/${id}`).then((res) => {
			console.log(res);
		});
		window.location.reload();
		alert(`Fixed Deposit #${id} approved successfully.`);
	}
	const handleReject = (id) => {
		myAPI.put(`/reject/${id}`).then((res) => {
			console.log(res);
		});
		window.location.reload();
		alert(`Fixed Deposit #${id} rejected successfully.`);
	}
	

	const [amount, setAmount] = useState(0);

	const makeDeposit = () => {
		if(amount <= 0){
			alert("Invalid amount");
			return;
		}
		myAPI.post(`/depositMoney/${fdId}/${amount}`);
		alert(`RM ${amount} deposited successfully.`);
		window.location.reload();
	}

	const makeWithdraw = () => {
		if (amount <= 0) {
			alert("Invalid amount");
			return;
		}
		myAPI.post(`/withdrawMoney/${fdId}/${amount}`);
		alert(`RM ${amount} withdrawn successfully.`);
		window.location.reload();
	}
	
	//should be memoized or stable
	const columns = useMemo(
		() => [
			{
				accessorKey: "id", //access nested data with dot notation
				header: "Fixed Deposit #",
				size: 30,
			},
			{
				accessorKey: "registration.id",
				header: "NO. PENDAFTARAN",
			},
			{
				accessorKey: "certificateNo", //normal accessorKey
				header: "NO. SIJIL PELABURAN",
				Cell: ({ cell }) => cell.getValue(), //if want to render custom cell
			},
			{
				accessorKey: "startDate",
				header: "TARIKH MULA (YYYY-MM-DD)",
				Header: (
					<p>
						TARIKH MULA
						<br></br>(YYYY-MM-DD)
					</p>
				),
			},
			{
				accessorKey: "endDate",
				header: "TARIKH TAMAT (YYYY-MM-DD)",
				Header: (
					<p>
						TARIKH TAMAT
						<br></br>(YYYY-MM-DD)
					</p>
				),
			},
			{
				accessorKey: "principalAmount",
				header: "c",
				Header: (
					<p>
						AMAUN POKOK
						<br></br>(RM)
					</p>
				),
			},
			{
				accessorFn: (row) => row.schedule[0].amountEarned,
				id: "amountEarned",
				// accessorKey: "schedule.amountEarned",
				header: "AMAUN FAEDAH(RM)",
				Header: (
					<p>
						AMAUN FAEDAH
						<br></br>(RM)
					</p>
				),
			},
			{
				accessorKey: "status",
				header: "STATUS",
			},
			{
				accessorKey: "operation",
				header: "Function",
				Header: <p className='text-right'>FUNCTION</p>,
				Cell: ({ cell }) => (
					<div className='w-100 d-flex justify-content-between'>
						{cell.row.original.status === "NEW" && (
							<div className='w-75 d-flex justify-content-around'>
								<Button
									className='bg-success text-white btn'
									onClick={() =>
										handleApprove(cell.row.original.id)
									}
								>
									{"Approve"}
								</Button>
								<Button
									className='bg-warning text-white btn'
									onClick={() =>
										handleReject(cell.row.original.id)
									}
								>
									{"Reject"}
								</Button>
							</div>
						)}
						<Button
							className='bg-danger text-white btn'
							onClick={() => handleDelete(cell.row.original.id)}
						>
							{"Delete"}
						</Button>
					</div>
				),
			},
		],
		[]
	);

	const transactionColumns = useMemo(
		() => [
			{
				accessorKey: "id",
				header: "#",
			},
			{
				accessorKey: "amount",
				header: "AMAUN (RM)",
			},
			{
				accessorKey: "date", //normal accessorKey
				header: "TARIKH TRANSAKSI(YYYY-MM-DD)",
				Header: (
					<p>
						TARIKH TRANSAKSI
						<br></br>(YYYY-MM-DD)
					</p>
				),
			},
			{
				accessorKey: "type",
				header: "JENIS TRANSAKSI",
			},
		],
		[]
	);

	return (
		<div className='w-100 bg-secondary'>
			<AppBar />
			{user.auth === false && navigate("/")}
			<div>
				<h1 className='text-center pb-2 pt-4 text-light'>
					Fixed Deposit List
				</h1>
				<hr className='w-25 mx-auto' />
				<div className='d-flex justify-content-start w-100'>
					<p>{user.userId}.</p>
					<p>{user.role}</p>
				</div>
				<hr></hr>
			</div>

			{isLoading ? (
				<p>Loading...</p>
			) : user.role === "ADMIN" ? (
				<MaterialReactTable
					columns={columns}
					data={dataFetched}
					enableColumnActions={false}
					rowNumberMode='original'
					muiTableHeadCellProps={{
						//no useTheme hook needed, just use the `sx` prop with the theme callback
						sx: (theme) => ({
							color: theme.palette.text.secondary,
							fontWeight: "bold",
							fontSize: "15px",
							padding: "12px",
						}),
					}}
					renderDetailPanel={({ row }) => (
						<UpdateForm index={row.original.id} />
					)}
					positionExpandColumn='last'
				/>
			) : user.role === "USER" ? (
				<div className='w-100 d-flex align-items-center flex-column pb-3'>
					<h3 className='pb-2'>TENTANG AKAUN #FD {fdId}</h3>
					{isOpen && (
						<ViewSchedule
							toggle={toggle}
							toggleFunction={toggle}
							fdId={fdId}
						/>
					)}
					{deleted && (
						<div className='alert alert-danger text-center'>
							<h5>
								Your application is deleted. Contact xx-xxxxxx
								for information
							</h5>
						</div>
					)}
					<table className='table table-light'>
						<thead>
							<tr>
								<th scope='col'>NO. PENDAFTARAN</th>
								<th scope='col'>NO. SIJIL PELABURAN</th>
								<th scope='col'>TARIKH MULA (YYYY-MM-DD)</th>
								<th scope='col'>TARIKH TAMAT (YYYY-MM-DD)</th>
								<th scope='col'>AMAUN POKOK (RM)</th>
								<th scope='col'>AMAUN FAEDAH(RM)</th>
								<th scope='col'>STATUS</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>{userFD.regId}</td>
								<td>{userFD.certNo}</td>
								<td>{userFD.startDate}</td>
								<td>{userFD.endDate}</td>
								<td>{userFD.principalAmount}</td>
								<td>{userFD.amountEarned}</td>
								<td>{userFD.status}</td>
							</tr>
						</tbody>
					</table>
					{userFD.status === "APPROVED" ? (
						<div className='w-100'>
							<h3 className='pb-2'>TRANSAKI</h3>
							{transactions.length > 0 ? (
								<div className='w-100'>
									<MaterialReactTable
										columns={transactionColumns}
										data={transactions}
										enableColumnActions={false}
										enableTopToolbar={false}
									/>
								</div>
							) : (
								<p>Tiada transaksi</p>
							)}

							<div className='w-100 d-flex justify-content-center pb-4'>
								<div className='w-25 d-flex justify-content-between pt-3'>
									<Button
										variant='contained'
										color='success'
										onClick={makeDeposit}
									>
										Deposit
									</Button>
									<TextField
										id='standard-basic'
										label='Amount'
										typeof='number'
										variant='filled'
										value={amount}
										onChange={(e) =>
											setAmount(e.target.value)
										}
									/>
									<Button
										variant='contained'
										color='error'
										onClick={makeWithdraw}
									>
										Withdraw
									</Button>
								</div>
							</div>
						</div>
					) : (
						<h5>Your application is still being review...</h5>
					)}
					<Button variant='contained' onClick={toggle}>
						VIEW FIXED DEPOSIT SCHEDULE
					</Button>
				</div>
			) : (
				<p>Loading...</p>
			)}
		</div>
	);
};

export default FixedDepositList;
