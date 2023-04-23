import React, { useContext, useState } from 'react'
import { DisplayNameContext, IsLoggedInContext, LanguageContext, RoleContext } from '../App';
import { serverRoute } from '../config';
import Cookies from 'universal-cookie';
import { handleErrors } from '../utils/handleErrors';
import { useNavigate } from 'react-router-dom';
import "./Form.css"
import { InputField } from '../components/InputField';
import { validateEmail } from '../utils/validateEmail';
import { ErrorField } from '../components/ErrorField';

interface Errors {
  emailErrors: string[],
  passwordErrors: string[],
  confirmPasswordErrors: string[],
  displayNameErrors: string[],
  serverErrors: string[],
}

function checkIfRegisterErrorExists(errors: Errors) {
  for (const error of Object.keys(errors) as (keyof Errors)[]) {
    if (errors[error].length > 0) {
      return true;
    }
  }
  return false;
}

export const Register = () => {
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("");
  const [displayNameInput, setDisplayNameInput] = useState("");
  const [errorExists, setErrorExists] = useState(false);
  const [errors, setErrors] = useState<Errors>({
    emailErrors: [],
    passwordErrors: [],
    confirmPasswordErrors: [],
    displayNameErrors: [],
    serverErrors: [],
  });

  const { setDisplayName } = useContext(DisplayNameContext);
  const { setIsLoggedIn } = useContext(IsLoggedInContext)
  const { setRole } = useContext(RoleContext)
  const { language } = useContext(LanguageContext)

  const navigate = useNavigate();

  function handleRegisterErrors(): Errors {
    const newErrors: Errors = {
      emailErrors: [],
      passwordErrors: [],
      confirmPasswordErrors: [],
      displayNameErrors: [],
      serverErrors: [],
    };

    if (emailInput === "") newErrors.emailErrors.push(
      language === 'EN' ? "Missing e-email value." : "E-mail je povinný."
    );
    if (emailInput !== "" && !validateEmail(emailInput)) newErrors.emailErrors.push(
      language === 'EN' ? "Invalid e-mail value." : "Chybný e-mail."
    );

    if (passwordInput === "") newErrors.passwordErrors.push(
      language === 'EN' ? "Missing password." : "Heslo je povinné."
    );
    if (passwordInput.length < 6) newErrors.passwordErrors.push(
      language === 'EN' ? "Password should be longer than 6 characters" : "Heslo by mělo být delší než 6 znaků."
    );

    if (passwordInput !== confirmPasswordInput) newErrors.confirmPasswordErrors.push(
      language === 'EN' ? "The password and confirmation password do not match." : "Hesla se neshodují."
    );

    if (displayNameInput.length === 0) newErrors.displayNameErrors.push(
      language === 'EN' ? "Display name missing." : "Chybí uživatelské jméno."
    )

    return newErrors;
  }

  const register = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const newErrors = handleRegisterErrors();
    if (checkIfRegisterErrorExists(newErrors)) {
      setErrors(newErrors);
      setErrorExists(true);
      return;
    }

    fetch(serverRoute + `/register`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: emailInput,
        password: passwordInput,
        displayName: displayNameInput
      })
    })
      .then(handleErrors)
      .then(async (res) => {
        const json = await res.json();

        console.log(json.id);

        const cookies = new Cookies();
        cookies.set('token', json.token, { path: '/', maxAge: 6000 });

        setDisplayName(json.displayName);
        setRole(json.role);
        setIsLoggedIn(true);
        localStorage.setItem('displayName', JSON.stringify(json.displayName))
      })
      .catch((error) => {
        console.log(error);

        newErrors.serverErrors = [error.message];
        setErrors(newErrors);
      })
  };

  return (
    <div className='form-login-container'>
      <h1 className='form-header'>
        {language === 'EN' ? 'Register' : 'Registrace'}
      </h1>

      {errorExists &&
        <ErrorField errors={errors} />
      }

      <div className='form-panel-body'>
        <h3>
          {language === 'EN' ? 'Create a new account' : 'Vytvoření nového účtu'}
        </h3>
        <form
          onSubmit={(e) => register(e)}
          className='form-form'>

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

          <InputField
            type={'password'}
            labelEN={'Confirm password'}
            labelCS={'Potvrzení hesla'}
            setterFunc={setConfirmPasswordInput}
            errors={errors.confirmPasswordErrors}
          />

          <InputField
            type={'text'}
            labelEN={'Display name'}
            labelCS={'Zobrazované jméno'}
            setterFunc={setDisplayNameInput}
            errors={errors.displayNameErrors}
          />

          <div className='form-login-buttons-container'>
            <button type="submit" className='btn btn-imsp'>
              {language === 'EN' ? 'Register' : 'Registrovat'}
            </button>
            <button type="submit" className='btn btn-default'>
              {language === 'EN' ? 'Cancel' : 'Zrušit'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
