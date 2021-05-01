import React, { useEffect, useState } from "react";
import "./App.css";
// Date function ------------------------------------
const getDate = () => {
	let today = new Date();
	let date = today.getDate();
	let month = today.getMonth();
	let year = today.getFullYear();
	let hour = today.getHours();
	let minute = today.getMinutes();
	let second = today.getSeconds();
	let append = hour >= 12 ? " PM " : " AM ";
	hour = hour >= 12 ? hour - 12 : hour;
	if (hour === 0 && append === " PM ") {
		if (minute === 0 && second === 0) {
			hour = 12;
			append = " Noon";
		} else {
			hour = 12;
			append = " PM";
		}
	}
	if (hour === 0 && append === " AM ") {
		if (minute === 0 && second === 0) {
			hour = 12;
			append = " Midnight";
		} else {
			hour = 12;
			append = " AM";
		}
	}
	return `${formatNumber(date)}/${formatNumber(month)}/${year} ${formatNumber(
		hour
	)}:${formatNumber(minute)} ${append}`;
};
// Format Number function ------------------------------------
const formatNumber = (number) => {
	return number > 9 ? number : `0${number}`;
};
// Email Content Component -----------------------------------
function EmailContent({ email }) {
	const [isCollapsed, setIsCollapsed] = useState(true);
	const handleCollapse = () => {
		setIsCollapsed(!isCollapsed);
	};
	return (
		<div className='email-block' key={email.id}>
			<div className='from-block'>
				<div className='badge'>{email.email[0]}</div>
			</div>
			<div className='email-content'>
				<div className='email-content-inner'>
					<span className='content-indicator'>From:</span>
					<span className='content'>{email.email}</span>
				</div>
				<div className='email-content-inner'>
					<span className='content-indicator'>Subject:</span>
					<span className='content'>{email.name}</span>
				</div>
				<div className='email-content-inner'>
					<span className='content-indicator'>
						{isCollapsed ? (
							<>
								{email.body.substring(0, 50)}
								<button className='link' onClick={handleCollapse}>
									Read More
								</button>
							</>
						) : (
							<>
								{email.body}
								<button className='link' onClick={handleCollapse}>
									Read Less
								</button>
							</>
						)}
					</span>
				</div>
				<div className='email-content-inner'>
					<span className='content-indicator'>{getDate()}</span>
				</div>
			</div>
		</div>
	);
}
// Main Function ---------------------------------------------------
function App() {
	const [emails, setEmails] = useState([]);
	const [emailsToRender, setEmailsToRender] = useState([]);
	const [pageCount, setPageCount] = React.useState(1);
	const [paginationArray, setPaginationArray] = useState([]);
	// -------------------------------------------------------------------
	useEffect(() => {
		fetch("https://jsonplaceholder.typicode.com/comments", { method: "GET" })
			.then((res) => res.json())
			.then((res) => setEmails(res));
	}, []);
	useEffect(() => {
		const count = 20;
		let end = count * pageCount;
		let start = end - count;
		setPaginationArray(Array(Math.ceil(emails.length / count)).fill(""));
		setEmailsToRender(emails.slice(start, end));
	}, [emails, pageCount]);
	// ---------------------------------------------------
	const Pagination = () => (
		<div className='pagination'>
			<a
				onClick={() =>
					setPageCount((pageCount) => {
						return pageCount === 1 ? 1 : pageCount - 1;
					})
				}
			>
				&laquo;
			</a>
			{paginationArray?.map((el, index) => (
				<a
					onClick={() => setPageCount(index + 1)}
					className={pageCount === index + 1 ? "active" : ""}
					key={index}
				>
					{" "}
					{index + 1}
				</a>
			))}
			<a
				onClick={() =>
					setPageCount((pageCount) => {
						return pageCount === paginationArray.length
							? paginationArray.length
							: pageCount + 1;
					})
				}
			>
				&raquo;
			</a>
		</div>
	);
	return (
		<div className='App'>
			<Pagination />
			{emailsToRender.map((email) => (
				<EmailContent email={email} key={email.id} />
			))}
		</div>
	);
}

export default App;
