import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { IsLoggedInContext, RoleContext, UsernameContext } from '../App';
import './Navbar.css'

export const NavBar = () => {
  const { username, setUsername } = useContext(UsernameContext)
  const { isLoggedIn, setIsLoggedIn } = useContext(IsLoggedInContext)
  const { role, setRole } = useContext(RoleContext)

  const navigate = useNavigate();

  function logout() {
    setUsername(null);
    setIsLoggedIn(false);
    setRole(null);
    localStorage.setItem('user', "null");
    navigate("/");

    const cookies = new Cookies();
    cookies.remove('token');
  }

  return (
    <div className='navbar'>
      <div>
        <a href="/">Home</a>
        <div>{username} {role}</div>
      </div>
      {isLoggedIn && <button onClick={logout}>Logout</button>}
    </div>
  )
}
