import { Paper } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import myApi from "../API/apicreate";
import "../component/PopUp.css";

export default function PopUp(props) {
	const [generateSchedule, setGenerateSchedule] = useState(true);

	const [scheduleEarn, setScheduleEarn] = useState(props.schedule?props.schedule:[]);

	useEffect(() => {
		myApi.get(`/getSchedulePreview?id=${props.fdId}`).then((res) => {
			setScheduleEarn(res.data);
			console.log(res.data);
		}).catch((err) => {
			console.log(err);
		});
	}, []);

	return (
		<Paper >
			<div className='popup-box'>
				<div className='box'>
					<span className='close-icon' onClick={props.toggle}>
						x
					</span>
					<div className='box-header text-center text-uppercase font-weight-bold'>
						<h3>
							<u>JADUAL RINGKASAN</u>
						</h3>
					</div>
					<div className='box-body'>
						<div className='table-responsive'>
							<table className='table table-striped'>
								<thead>
									<tr>
										<th>BULAN</th>
										<th>AMAUN AWAL(RM)</th>
										<th>AMAUN AKHIR(RM)</th>
										<th>AMAUN FAEDAH(RM)</th>
									</tr>
								</thead>
								<tbody>
									{scheduleEarn.map((item, index) => {
										return (
											<tr key={index}>
												<td>{item.dateEnd}</td>
												<td>{item.amountStart}</td>
												<td>{item.amountEnd}</td>
												<td>{item.amountEarned}</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</Paper>
	);
}
