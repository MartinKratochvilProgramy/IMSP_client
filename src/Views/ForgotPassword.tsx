import React, { useContext, useState } from 'react'
import { LanguageContext } from '../App'
import { ErrorField } from '../components/ErrorField';
import { InputField } from '../components/InputField';
import { serverRoute } from '../config';
import { handleErrors } from '../utils/handleErrors';
import { validateEmail } from '../utils/validateEmail';

interface Errors {
    emailErrors: string[],
    serverErrors: string[],
  }

function checkIfErrorExists(errors: Errors) {
for (const error of Object.keys(errors) as (keyof Errors)[]) {
    if (errors[error].length > 0) {
    return true;
    } 
}
return false;
}

export const ForgotPassword = () => {

    const [emailInput, setEmailInput] = useState("");
    const [errorExists, setErrorExists] = useState(false);
    const [errors, setErrors] = useState<Errors>({
      emailErrors: [],
      serverErrors: [],
    });
    
    const { language } = useContext(LanguageContext)
    
    function handleResetPasswordErrors(): Errors {
        const newErrors: Errors = {
            emailErrors: [],
            serverErrors: [],
        };
    
        if (emailInput === "") newErrors.emailErrors.push("Missing e-email value.");
        if (emailInput !== "" && !validateEmail(emailInput)) newErrors.emailErrors.push("Invalid e-mail value.");
    
        return newErrors;
      }

    function resetPassword(
        e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLAnchorElement>,
    ) {
        e.preventDefault();

        const newErrors = handleResetPasswordErrors();
        if (checkIfErrorExists(newErrors)) {
            setErrors(newErrors);
            setErrorExists(true);
            return;
        }

        fetch(serverRoute + `/forgot_password`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: emailInput,
            }),
          })
            .then(handleErrors)
            .then(async (res) => {
              const json = await res.json();
              console.log(json);
              
              setErrorExists(false);
            })
            .catch((error) => {
                newErrors.serverErrors = [error.message];
                setErrorExists(true);
                setErrors(newErrors);
            })
    }

    return (
        <div className='form-login-container'>
        <h1 className='form-header'>
            {language === 'EN' ? 'Forgot Password' : 'Zapomenuté heslo'}
        </h1>

        {errorExists && 
            <ErrorField errors={errors} />
        }

        <div className='form-panel-body'>
            <h3>
                {language === 'EN' ? 'Enter your email' : 'Zadejte svůj e-mail'}
            </h3>
            <form
                onSubmit={(e) => resetPassword(e)}
                className='form-form'
            >

            <InputField 
                type={'text'} 
                labelEN={'E-mail'} 
                labelCS={'E-mail'} 
                setterFunc={setEmailInput}
                errors={errors.emailErrors}  
            />  

            <div className='form-login-buttons-container'>
                <button type="submit" className='btn btn-imsp'>
                    {language === 'EN' ? 'Submit' : 'Potvrdit'}
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
