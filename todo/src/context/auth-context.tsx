import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { getToken } from '../utils/getToken';

const baseUrl = process.env.REACT_APP_URL;

export type Credentials = {
	username: string;
	password: string;
	passwordConfirm?: string;
};

type AuthContextType = {
	isAuth: boolean;
	setIsAuth?: React.Dispatch<React.SetStateAction<boolean>>;
};

export const AuthContext = createContext<AuthContextType>({ isAuth: false });

export const AuthContextProvider: React.FC = ({ children }) => {
	const [isAuth, setIsAuth] = useState(false);

	const checkAuth = async () => {
		const { token } = getToken();

		if (!token) {
			setIsAuth(false);
		} else {
			axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
			const { status } = await axios.get(`${baseUrl}/category`, {
				validateStatus: () => true,
			});
			if (status >= 400) {
				setIsAuth(false);
				localStorage.clear();
			} else {
				setIsAuth(true);
			}
		}
	};

	useEffect(() => {
		checkAuth();
	}, [isAuth]);

	return (
		<AuthContext.Provider value={{ isAuth, setIsAuth }}>
			{children}
		</AuthContext.Provider>
	);
};
