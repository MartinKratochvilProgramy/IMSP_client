import React, { useState, useContext } from 'react'
import { serverRoute } from '../config';
import Cookies from 'universal-cookie';
import { handleErrors } from '../utils/handleErrors';
import "./Login.css"
import { IsLoggedInContext, LanguageContext, RoleContext, UsernameContext } from '../App';
import { useNavigate } from 'react-router-dom';

export function loginInputError(
  username: string,
  password: string
) {
  if (username === "") return "Missing username";
  if (password === "") return "Missing password";
  return null;
}

export const Login = () => {

  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState<null | string>(null);

  const { setUsername } = useContext(UsernameContext);
  const { setIsLoggedIn } = useContext(IsLoggedInContext)
  const { setRole } = useContext(RoleContext)
  const { language } = useContext(LanguageContext)

  const navigate = useNavigate();

  function login(
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLAnchorElement>,
  ) {
    e.preventDefault();

    if (!loginInputError(usernameInput, passwordInput)) {
      // validate login
      fetch(serverRoute + `/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: usernameInput,
          password: passwordInput,
        }),
      })
        .then(handleErrors)
        .then(async (res) => {
          const json = await res.json();

          const cookies = new Cookies();
          cookies.set('token', json.token);

          setUsername(json.username);
          setRole(json.role);
          setIsLoggedIn(true);
          localStorage.setItem('user', JSON.stringify(json.username));

          navigate("/");
        })
        .catch((error) => {
          setError(error.message)
        })

    } else {
      setError(loginInputError(usernameInput, passwordInput));
    }
  };

  function handleUsernameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setUsernameInput(e.target.value)
    if (error) setError(null)
  }

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPasswordInput(e.target.value)
    if (error) setError(null)
  }

  return (
    <div className='login-container'>
      <h1 className='header'>
        {language === 'EN' ? 'Login' : 'Přihlášení'}
      </h1>

      <div className='panel-body'>
        <h3>
          {language === 'EN' ? 'Local login' : 'Lokální přihlášení'}
        </h3>
        <form
          onSubmit={(e) => login(e)}
          className='form'
        >
          <div className='form-group'>
            <label htmlFor="Username" className='label'>
              {language === 'EN' ? 'Username' : 'Uživatelské jméno'}
            </label>
            <input
              type="text"
              className='input'
              onChange={(e) => { handleUsernameChange(e) }}
              placeholder={language === 'EN' ? 'Username' : 'Uživatelské jméno'}
            />
          </div>

          <div className='form-group'>
            <label htmlFor="Password" className='label'>
              {language === 'EN' ? 'Password' : 'Heslo'}
            </label>
            <input
              type="password"
              className='input'
              onChange={(e) => { handlePasswordChange(e) }}
              placeholder={language === 'EN' ? 'Password' : 'Heslo'}
            />
          </div>




          <button type="submit">Login</button>
          <div>{error}</div>
        </form>
      </div>

    </div>
  )
}
