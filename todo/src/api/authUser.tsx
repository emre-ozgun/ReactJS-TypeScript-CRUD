import { Credentials } from '../context/auth-context';
import { setToken } from '../utils/setToken';

import axios from 'axios';

export const POST_REGISTER = async (registerCredentials: Credentials) => {
	const baseUrl = process.env.REACT_APP_URL;

	try {
		const response = await axios.post(
			`${baseUrl}/auth/register`,
			registerCredentials
		);

		const token = response.data.token;
		if (token) {
			axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
			setToken(response.data);
			return { error: null, authFlag: true };
		}
	} catch (error: any) {
		if (typeof error.response.data === 'string') {
			return { error: error.response.data, authFlag: false };
		} else {
			return { error: 'Something went wrong', authFlag: false };
		}
	}
};

export const POST_LOGIN = async (loginCredentials: Credentials) => {
	const baseUrl = process.env.REACT_APP_URL;

	try {
		const response = await axios.post(
			`${baseUrl}/auth/login`,
			loginCredentials
		);

		const token = response.data.token;
		if (token) {
			axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
			setToken(response.data);
			return { error: null, authFlag: true };
		}
	} catch (error: any) {
		if (typeof error.response.data === 'string') {
			return { error: error.response.data, authFlag: false };
		} else {
			return { error: 'Something went wrong', authFlag: false };
		}
	}
};
