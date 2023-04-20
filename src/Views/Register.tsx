import React, { useContext, useState } from 'react'
import { IsLoggedInContext, RoleContext, UsernameContext } from '../App';
import { serverRoute } from '../config';
import Cookies from 'universal-cookie';
import { handleErrors } from '../utils/handleErrors';
import { useNavigate } from 'react-router-dom';

export function registerInputError(
  username: string,
  password: string
) {
  if (username === "") return "Missing username";
  if (password === "") return "Missing password";
  if (username.length < 3) return "Username should be longer than 3 characters";
  if (password.length < 6) return "Password should be longer than 6 characters";
  return false;
}

export const Register = () => {
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState<null | string>(null);

  const { setUsername } = useContext(UsernameContext);
  const { setIsLoggedIn } = useContext(IsLoggedInContext);
  const { setRole } = useContext(RoleContext);

  const navigate = useNavigate();

  const register = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    // send username, password to server to create new user
    e.preventDefault();

    fetch(serverRoute + `/register`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: usernameInput,
        password: passwordInput,
      })
    })
      .then(handleErrors)
      .then(async (res) => {
        const json = await res.json();

        const cookies = new Cookies();
        cookies.set('token', json.token, { path: '/', maxAge: 6000 });

        setUsername(json.username);
        setRole(json.role);
        setIsLoggedIn(true);
        localStorage.setItem('user', JSON.stringify(json.username))

        navigate("/");
      })
      .catch((error) => {
        setError(error.message)
      })
  };


  return (
    <form
      className='login-container'
      onSubmit={(e) => register(e)}>
      <input type="text" onChange={(e) => {
        setUsernameInput(e.target.value)
        if (error) setError(null)
      }} />
      <input type="password" onChange={(e) => {
        setPasswordInput(e.target.value)
        if (error) setError(null)
      }} />
      <button type="submit">Register</button>
      <div>{error}</div>
    </form>
  )
}
