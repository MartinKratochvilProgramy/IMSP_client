import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { IsLoggedInContext, LanguageContext, RoleContext, UsernameContext } from '../App';
import logo from '../assets/logo.png'
import './Navbar.css'

export const NavBar = () => {
  const { setUsername } = useContext(UsernameContext)
  const { setIsLoggedIn } = useContext(IsLoggedInContext)
  const { setRole } = useContext(RoleContext)
  const { language, setLanguage } = useContext(LanguageContext)

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

  function handleLanguageChange() {
    if (language === 'CZ') {
      const newLanguage = 'EN'
      setLanguage(newLanguage)
      localStorage.setItem('language', newLanguage)
    }
    if (language === 'EN') {
      const newLanguage = 'CZ'
      setLanguage(newLanguage)
      localStorage.setItem('language', newLanguage)
    }
  }

  return (
    <div className='navbar'>
      <a href="/">
        <img src={logo} className='logo' alt="logo" />
      </a>
      <div className='links-container'>
        <div className='link' onClick={handleLanguageChange}>{language === 'EN' ? 'CS' : 'EN'}</div>
        <a className='link' href="/login">{language === 'EN' ? 'Login' : 'Přihlásit'}</a>
      </div>
    </div>
  )
}
