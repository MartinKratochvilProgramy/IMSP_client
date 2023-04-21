import React, { useState, useContext } from 'react'
import { serverRoute } from '../config';
import Cookies from 'universal-cookie';
import { handleErrors } from '../utils/handleErrors';
import { DisplayNameContext, IsLoggedInContext, LanguageContext, RoleContext } from '../App';
import { useNavigate } from 'react-router-dom';
import "./Form.css"
import { InputField } from '../components/InputField';
import { validateEmail } from '../utils/validateEmail';
import { ErrorField } from '../components/ErrorField';

interface Errors {
  emailErrors: string[],
  passwordErrors: string[],
  serverErrors: string[],
}

function checkIfLoginErrorExists(errors: Errors) {
  for (const error of Object.keys(errors) as (keyof Errors)[]) {
    if (errors[error].length > 0) {
      return true;
    } 
  }
  return false;
}

export const Login = () => {
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [errorExists, setErrorExists] = useState(false);
  const [errors, setErrors] = useState<Errors>({
    emailErrors: [],
    passwordErrors: [],
    serverErrors: [],
  });

  const { setDisplayName } = useContext(DisplayNameContext);
  const { setIsLoggedIn } = useContext(IsLoggedInContext)
  const { setRole } = useContext(RoleContext)
  const { language } = useContext(LanguageContext)

  const navigate = useNavigate();

  function handleLoginErrors (): Errors {
    const newErrors: Errors = {
      emailErrors: [],
      passwordErrors: [],
      serverErrors: [],
    };

    if (emailInput === "") newErrors.emailErrors.push("Missing e-email value.");
    if (!validateEmail(emailInput)) newErrors.emailErrors.push("Invalid e-mail value.");

    if (passwordInput === "") newErrors.passwordErrors.push("Missing password.");
    
    return newErrors;
  }

  function login(
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLAnchorElement>,
  ) {
    e.preventDefault();

    const newErrors = handleLoginErrors();
    if (checkIfLoginErrorExists(newErrors)) {
      setErrors(newErrors);
      setErrorExists(true);
      return;
    }

    fetch(serverRoute + `/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: emailInput,
        password: passwordInput,
      }),
    })
      .then(handleErrors)
      .then(async (res) => {
        const json = await res.json();

        const cookies = new Cookies();
        cookies.set('token', json.token);

        setDisplayName(json.username);
        setRole(json.role);
        setIsLoggedIn(true);
        localStorage.setItem('displayName', JSON.stringify(json.username));

        navigate("/");
      })
      .catch((error) => {
        newErrors.serverErrors = [error.message];
        setErrors(newErrors);
      })
  };

  return (
    <div className='form-login-container'>
      <h1 className='form-header'>
        {language === 'EN' ? 'Login' : 'Přihlášení'}
      </h1>

      {errorExists && 
        <ErrorField errors={errors} />
      }

      <div className='form-panel-body'>
        <h3>
          {language === 'EN' ? 'Local login' : 'Lokální přihlášení'}
        </h3>
        <form
          onSubmit={(e) => login(e)}
          className='form-form'
        >

          <InputField 
            type={'text'} 
            labelEN={'E-mail / Login'} 
            labelCS={'E-mail / Login'} 
            setterFunc={setEmailInput}
            errors={errors.emailErrors}  
          />  

          <InputField 
            type={'password'} 
            labelEN={'Password'} 
            labelCS={'Heslo'} 
            setterFunc={setPasswordInput}
            errors={errors.passwordErrors}  
          />  

          <label htmlFor="Rremember login" className='form-remember-login-container'>
            <input type="checkbox" name="Rremember login" id="Rremember login" />
            <div className='form-remember-login'>Zapamatovat</div>
          </label>

          <div className='form-login-buttons-container'>
            <button type="submit" className='btn btn-imsp'>
              {language === 'EN' ? 'Login' : 'Přihlásit'}
            </button>
            <button type="submit" className='btn btn-default'>
              {language === 'EN' ? 'Cancel' : 'Zrušit'}
            </button>
          </div>    

          <div className='form-links-container'>
            <a href="/register" className='form-link'>
              {language === 'EN' ? 'Register as a new user?' : 'Zaregistrovat nového uživatele?'}
            </a>     
            <a href="/register" className='form-link'>
              {language === 'EN' ? 'Forgot your password?' : 'Zapomenuté heslo?'}
            </a>     
          </div>
        </form>
      </div>
    </div>
  )
}
