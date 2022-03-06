import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../context/auth-context';

export const PageNotFound = () => {
	const history = useHistory();

	const { isAuth } = React.useContext(AuthContext);

	const message = 'Page not found, redirecting...';

	useEffect(() => {
		const timeout = setTimeout(() => {
			history.push(`/${isAuth ? 'categories' : 'auth'}`);
		}, 3000);

		return () => clearTimeout(timeout);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<main className='container'>
			<section className='section'>
				<p>{message}</p>
			</section>
		</main>
	);
};
