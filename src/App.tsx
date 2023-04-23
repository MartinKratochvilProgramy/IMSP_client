import React, { useEffect } from 'react';
import { useState } from 'react';
import Cookies from 'universal-cookie';
import { Login } from './views/Login';
import {
	Routes,
	Route,
	useNavigate,
} from 'react-router-dom';
import { Register } from './views/Register';
import { NavBar } from './components/NavBar';
import './App.css';
import { Home } from './views/Home';
import { serverRoute } from './config';
import { handleErrors } from './utils/handleErrors';
import { Index } from './views/Index';
import { ForgotPassword } from './views/ForgotPassword';
import { ConfirmEmail } from './views/ConfirmEmail';

export const DisplayNameContext = React.createContext<any>(null);
export const IsLoggedInContext = React.createContext<any>(null);
export const RoleContext = React.createContext<any>(null);
export const LanguageContext = React.createContext<any>(null);

function App() {
	const cookies = new Cookies();

	const displayName = localStorage.getItem('displayName') || null;
	const [displayNameState, setDisplayNameState] = useState<null | string>(displayName);

	const [isLoggedInState, setIsLoggedInState] = useState(cookies.get('token') ? true : false);

	const language = localStorage.getItem('language') || 'CS';
	const [languageState, setLanguageState] = useState(language);

	const [roleState, setRoleState] = useState<null | string>(null);

	const navigate = useNavigate();

	function resetUserState() {
		setDisplayNameState(null);
		setIsLoggedInState(false);
		setRoleState(null);
		localStorage.setItem('displayName', 'null');
	}

	useEffect(() => {
		const token = cookies.get('token');

		if (!token) {
			resetUserState();
		} else {
			setIsLoggedInState(true);

			fetch(serverRoute + '/validate_auth', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Basic ${displayNameState}:${token}`,
				},
			})
				.then(handleErrors)
				.then(response => response.json())
				.then(cookie => {
					cookies.set('token', cookie);
				})
				.catch(error => {
					console.log(error);

					resetUserState();

					cookies.remove('token');
					navigate("/");
				});
		}
	}, []);

	return (
		<DisplayNameContext.Provider value={{ displayName: displayNameState, setDisplayName: setDisplayNameState }}>
			<IsLoggedInContext.Provider value={{ isLoggedIn: isLoggedInState, setIsLoggedIn: setIsLoggedInState }}>
				<RoleContext.Provider value={{ role: roleState, setRole: setRoleState }}>
					<LanguageContext.Provider value={{ language: languageState, setLanguage: setLanguageState }}>
						<div className='App'>
							<NavBar />
							<Routes>
								<Route path='/' element={isLoggedInState ? <Home /> : <Index />} />
								<Route path='/login' element={<Login />} />
								<Route path='/register' element={<Register />} />
								<Route path='/forgot_password' element={<ForgotPassword />} />
								<Route path='/confirm_email' element={<ConfirmEmail />} />
							</Routes>
						</div>
					</LanguageContext.Provider>
				</RoleContext.Provider>
			</IsLoggedInContext.Provider>
		</DisplayNameContext.Provider>
	);
}

export default App;
