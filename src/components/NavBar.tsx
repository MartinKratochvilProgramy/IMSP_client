import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { IsLoggedInContext, LanguageContext, RoleContext, DisplayNameContext } from '../App';
import logo from '../assets/logo.png'
import './Navbar.css'

export const NavBar = () => {
  const { setDisplayName } = useContext(DisplayNameContext)
  const { isLoggedIn, setIsLoggedIn } = useContext(IsLoggedInContext)
  const { setRole } = useContext(RoleContext)
  const { language, setLanguage } = useContext(LanguageContext)

  const navigate = useNavigate();

  function logout() {
    setDisplayName(null);
    setIsLoggedIn(false);
    setRole(null);
    localStorage.setItem('displayName', "null");
    navigate("/");

    const cookies = new Cookies();
    cookies.remove('token');
  }

  function handleLanguageChange() {
    console.log(language);
    
    if (language === 'CS') {
      const newLanguage = 'EN'
      setLanguage(newLanguage)
      localStorage.setItem('language', newLanguage)
    }
    if (language === 'EN') {
      console.log("here");
      
      const newLanguage = 'CS'
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
        <div className='link' onClick={() => handleLanguageChange()}>{language === 'EN' ? 'CS' : 'EN'}</div>
        {isLoggedIn ? 
          <div className='link' onClick={() => logout()}>
            {language === 'EN' ? 'Logout' : 'Odhlásit'}
          </div>
        :
          <a className='link' href="/login">
            {language === 'EN' ? 'Login' : 'Přihlásit'}
          </a>
        }
      </div>
    </div>
  )
}
