import axios from "axios";

export default axios.create({
	withCredentials: true,
	baseURL: "http://localhost:8080/main",
	headers: {},
	// headers: {'Accept': 'application/json, text/plain, */*' },
});