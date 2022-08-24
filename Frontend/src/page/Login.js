import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import myAPI from '../API/apicreate';
import AppBar from "../component/AppBar";
import '../component/Login.css';
import { UserContext } from "../state/UserContext";

export default function Login(props) {
	let navigate = useNavigate();
	const { user,login} = useContext(UserContext);
    const [ username,setUsername] = useState();
    const [ password,setPassword] = useState();

	
	const handleSubmit = async() => {
		let userId,userRole;
		try{
			const resId = await myAPI.post('/login', {
				username: username,
				password: password
			})
			console.log(resId);
			if (resId.data.status === 500){
				throw new Error("Invalid username or password");
			}
			else{
				userId = resId.data.userId;
				const resRole = await myAPI.get(`/checkRole?userId=${userId}`)
				console.log(resRole)
				userRole = resRole.data;
			}
		}
		catch(err){
			console.log("Error happened");
			alert(err.message);
			return false;
		}

		login(userId,userRole);
		navigate('/');
		
	}

    return (
		<div>
            <AppBar />
			{!user.auth &&
				<section
				className='h-100 gradient-form'
				style={{ backgroundColor: "#eee" }}
			>
				<div className='container py-5 h-100'>
					<div className='row d-flex justify-content-center align-items-center h-100'>
						<div className='col-xl-10'>
							<div className='card rounded-3 text-black'>
								<div className='row g-0'>
									<div className='col-lg-6'>
										<div className='card-body p-md-5 mx-md-4'>
											<div className='text-center'>
												<h4 className='mt-1 mb-5 pb-1'>
													<i className='las la-wallet'>
														Fixed Deposit
													</i>
												</h4>
											</div>

											<form>
												<p>
													<b>
														Please login to your
														account
													</b>
												</p>

												<div className='form-outline mb-4'>
													<label
														className='form-label'
														htmlFor='form2Example11'
													>
														Username
													</label>
													<input
														type='email'
														id='form2Example11'
														className='form-control'
														placeholder='Username...'
														onChange={(e) =>
															setUsername(
																e.target.value
															)
														}
													/>
												</div>

												<div className='form-outline mb-4'>
													<label
														className='form-label'
														htmlFor='form2Example22'
													>
														Password
													</label>
													<input
														type='password'
														id='form2Example22'
														className='form-control'
														onChange={(e) =>
															setPassword(
																e.target.value
															)
														}
													/>
												</div>

												<div className='text-center pt-1 mb-5 pb-1'>
													<button
														className='btn btn-primary btn-block fa-lg gradient-custom-2 mb-3'
														type='button'
														onClick={handleSubmit}
													>
														Log in
													</button>
												</div>

												
											</form>
										</div>
									</div>
									<div className='col-lg-6 d-flex align-items-center gradient-custom-2'>
										<div className='text-white px-3 py-4 p-md-5 mx-md-4'>
											<h4 className='mb-4'>
												We are more than just a company
											</h4>
											<p className='small mb-0'>
												Invest now, Rich later
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>}
		</div>
	);
}