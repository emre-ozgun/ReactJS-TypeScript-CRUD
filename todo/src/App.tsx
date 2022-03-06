import React, { useContext, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { AuthPage } from './pages/AuthPage';
import { CategoryPage } from './pages/CategoryPage';
import { PageNotFound } from './pages/PageNotFound';
import { Navbar } from './components/Navbar/Navbar';
import { AuthContext } from './context/auth-context';

import './App.css';

type FormType = 'login' | 'register';

function App() {
	const [formType, setFormType] = useState('login' as FormType);

	const { isAuth } = useContext(AuthContext);

	return (
		<>
			<Navbar />
			<Switch>
				<Route path={'/'} exact>
					{!isAuth ? <Redirect to='/auth' /> : <Redirect to='/categories' />}
				</Route>
				<Route path={'/auth'} exact>
					{!isAuth ? (
						<AuthPage formType={formType} setFormType={setFormType} />
					) : (
						<Redirect to='/categories' />
					)}
				</Route>
				<Route path={'/categories'} exact>
					{!isAuth ? <Redirect to='/auth' /> : <CategoryPage />}
				</Route>
				<Route path={'*'} exact>
					{!isAuth ? <Redirect to='/auth' /> : <PageNotFound />}
				</Route>
			</Switch>
		</>
	);
}

export default App;
