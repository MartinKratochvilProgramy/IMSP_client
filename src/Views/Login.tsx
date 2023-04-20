import React, { useState, useContext } from 'react'
import { serverRoute } from '../config';
import Cookies from 'universal-cookie';
import { handleErrors } from '../utils/handleErrors';
import "./Login.css"
import { IsLoggedInContext, RoleContext, UsernameContext } from '../App';
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

  const navigate = useNavigate();

  const login = (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLAnchorElement>,
  ) => {
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

  return (
    <form
      className='login-container'
      onSubmit={(e) => login(e)}>
      <input type="text" onChange={(e) => {
        setUsernameInput(e.target.value)
        if (error) setError(null)
      }} />
      <input type="password" onChange={(e) => {
        setPasswordInput(e.target.value)
        if (error) setError(null)
      }} />
      <button type="submit">Login</button>
      <div>{error}</div>
    </form>
  )
}
