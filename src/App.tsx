import React, { useEffect } from 'react';
import { useState } from 'react';
import Cookies from 'universal-cookie';
import { Login } from './Views/Login';
import {
	Routes,
	Route,
	useNavigate,
} from 'react-router-dom';
import { Register } from './Views/Register';
import { NavBar } from './components/NavBar';
import './App.css';
import { Home } from './Views/Home';
import { serverRoute } from './config';
import { handleErrors } from './utils/handleErrors';
import { Index } from './Views/Index';

export const UsernameContext = React.createContext<any>(null);
export const IsLoggedInContext = React.createContext<any>(null);
export const RoleContext = React.createContext<any>(null);
export const LanguageContext = React.createContext<any>(null);

function App() {
	const cookies = new Cookies();

	const username = JSON.parse(localStorage.getItem('user') || "null");
	const [usernameState, setUsernameState] = useState(username);

	const [isLoggedInState, setIsLoggedInState] = useState(cookies.get('token') ? true : false);

	let language = (localStorage.getItem('language')) || 'CS'
	if (language === null) language = "CZ"

	const [languageState, setLanguageState] = useState(language);

	const [roleState, setRoleState] = useState<null | string>(null);

	const navigate = useNavigate();

	function resetUserState() {
		setUsernameState(null);
		setIsLoggedInState(false);
		setRoleState(null);
		localStorage.setItem('user', 'null');
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
					Authorization: `Basic ${usernameState}:${token}`,
				},
			})
				.then(handleErrors)
				.then(response => response.json())
				.then(cookie => {
					cookies.set('token', cookie);
				})
				.catch(error => {
					console.log("err ", error);

					resetUserState();

					cookies.remove('token');
					navigate("/");
				});
		}
	}, []);

	return (
		<UsernameContext.Provider value={{ username: usernameState, setUsername: setUsernameState }}>
			<IsLoggedInContext.Provider value={{ isLoggedIn: isLoggedInState, setIsLoggedIn: setIsLoggedInState }}>
				<RoleContext.Provider value={{ role: roleState, setRole: setRoleState }}>
					<LanguageContext.Provider value={{ language: languageState, setLanguage: setLanguageState }}>
						<div className='App'>
							<NavBar />
							<Routes>
								<Route path='/' element={isLoggedInState ? <Home /> : <Index />} />
								<Route path='/login' element={<Login />} />
								<Route path='/register' element={<Register />} />
							</Routes>
						</div>
					</LanguageContext.Provider>
				</RoleContext.Provider>
			</IsLoggedInContext.Provider>
		</UsernameContext.Provider>
	);
}

export default App;
