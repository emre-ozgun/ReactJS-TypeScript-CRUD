import axios from 'axios';
import { getToken } from './getToken';

const baseUrl = process.env.REACT_APP_URL;

export const checkAuth = async () => {
	if (!getToken()) {
		return false;
	} else {
		const { status } = await axios.get(`${baseUrl}/category`, {
			validateStatus: () => true,
		});
		if (status === 200) {
			return true;
		}
	}
};
