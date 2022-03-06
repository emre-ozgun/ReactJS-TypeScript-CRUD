import React, { useState, useEffect, useContext } from 'react';
import './UserForm.css';
import { AuthContext, Credentials } from '../../context/auth-context';

import { POST_REGISTER } from '../../api/authUser';

type Props = {
	setFormType: React.Dispatch<React.SetStateAction<'login' | 'register'>>;
};

const initialRegisterState: Credentials = {
	username: '',
	password: '',
	passwordConfirm: '',
};

export const RegisterForm = ({ setFormType }: Props) => {
	const { setIsAuth } = useContext(AuthContext);

	const [credentials, setCredentials] =
		useState<Credentials>(initialRegisterState);

	const [disabled, setDisabled] = useState(true);
	const [errorMsg, setErrorMsg] = useState('');

	// basic input validation
	useEffect(() => {
		if (
			!credentials.username ||
			!credentials.password ||
			!credentials.passwordConfirm ||
			credentials.password !== credentials.passwordConfirm
		) {
			setDisabled(true);
		} else {
			setDisabled(false);
		}
	}, [credentials.username, credentials.password, credentials.passwordConfirm]);

	const handleRegisterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		handleRegisterUser(credentials);
		setCredentials(initialRegisterState);
	};

	const handleRegisterUser = async (credentials: Credentials) => {
		const result = await POST_REGISTER(credentials);

		const error = result?.error;
		const isAuth = result?.authFlag;

		if (isAuth) {
			setIsAuth?.(true);
		} else {
			setErrorMsg(error);
		}
	};

	// error handling
	useEffect(() => {
		const timeout = setTimeout(() => {
			setErrorMsg('');
		}, 3000);

		return () => clearTimeout(timeout);
	}, [errorMsg]);

	// // /auth/register - POST
	// const postRegister = async (credentials: Credentials) => {
	// 	try {
	// 		const response = await axios.post(
	// 			`${baseUrl}/auth/register`,
	// 			credentials
	// 		);

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
		<form className='form' onSubmit={(e) => handleRegisterSubmit(e)}>
			<h1 className='form__title'>Register</h1>
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
					id='email'
					placeholder='Your  Email'
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
			<div className='form__block'>
				<label className='form__block-label' htmlFor='passwordConfirm'>
					Confirm Password
				</label>
				<input
					className='form__block-input'
					type='text'
					name='passwordConfirm'
					value={credentials.passwordConfirm}
					onChange={(e) =>
						setCredentials({ ...credentials, [e.target.name]: e.target.value })
					}
					id='passwordConfirm'
					placeholder='Confirm Your Password'
				/>
			</div>
			<small className='form__link-small' onClick={() => setFormType('login')}>
				Already have an account ? - Login
			</small>

			<button type='submit' className='btn form__btn ' disabled={disabled}>
				REGISTER
			</button>
		</form>
	);
};
