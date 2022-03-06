import React, { useState, useEffect, useContext } from 'react';
import './UserForm.css';
import { AuthContext, Credentials } from '../../context/auth-context';
import { POST_LOGIN } from '../../api/authUser';

type Props = {
	setFormType: React.Dispatch<React.SetStateAction<'login' | 'register'>>;
};

const initialLoginState: Credentials = {
	username: '',
	password: '',
};

export const LoginForm = ({ setFormType }: Props) => {
	const { setIsAuth } = useContext(AuthContext);

	const [credentials, setCredentials] =
		useState<Credentials>(initialLoginState);

	const [disabled, setDisabled] = useState(true);
	const [errorMsg, setErrorMsg] = useState('');

	// basic input validation
	useEffect(() => {
		if (!credentials.username || !credentials.password) {
			setDisabled(true);
		} else {
			setDisabled(false);
		}
	}, [credentials.username, credentials.password]);

	// error handling
	useEffect(() => {
		const timeout = setTimeout(() => {
			setErrorMsg('');
		}, 3000);

		return () => clearTimeout(timeout);
	}, [errorMsg]);

	const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		handleLoginUser(credentials);
		setCredentials(initialLoginState);
	};

	const handleLoginUser = async (credentials: Credentials) => {
		const result = await POST_LOGIN(credentials);

		const error = result?.error;
		const isAuth = result?.authFlag;

		if (isAuth) {
			setIsAuth?.(true);
		} else {
			setErrorMsg(error);
		}
	};

	// // /auth/register - POST
	// const postLogin = async (credentials: Credentials) => {
	// 	try {
	// 		const response = await axios.post(`${baseUrl}/auth/login`, credentials);

	// 		const token = response.data.token;
	// 		if (token) {
	// 			axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
	// 			setToken(response.data);
	// 			setIsAuth?.(true);
	// 		}
	// 	} catch (error: any) {
	// 		setErrorMsg(`${error.response.data}`);
	// 	}
	// };

	return (
		<form className='form' onSubmit={(e) => handleLoginSubmit(e)}>
			<h1 className='form__title'>Login</h1>
			<p style={{ color: 'red', opacity: '0.8' }}>{errorMsg}</p>
			<div className='form__block'>
				<label htmlFor='email' className='form__block-label'>
					Username
				</label>
				<input
					className='form__block-input'
					type='text'
					name='username'
					value={credentials.username}
					onChange={(e) =>
						setCredentials({ ...credentials, [e.target.name]: e.target.value })
					}
					id='username'
					placeholder='Your Username'
				/>
			</div>
			<div className='form__block'>
				<label className='form__block-label' htmlFor='password'>
					Password
				</label>
				<input
					className='form__block-input'
					type='text'
					name='password'
					value={credentials.password}
					onChange={(e) =>
						setCredentials({ ...credentials, [e.target.name]: e.target.value })
					}
					id='password'
					placeholder='Your  Password'
				/>
			</div>
			<small
				className='form__link-small'
				onClick={() => setFormType('register')}
			>
				Don't have an account ? - Register
			</small>

			<button type='submit' className='btn form__btn' disabled={disabled}>
				LOGIN
			</button>
		</form>
	);
};
