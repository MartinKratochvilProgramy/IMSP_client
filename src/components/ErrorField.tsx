import React, { useContext, useEffect, useState } from 'react'
import { LanguageContext } from '../App'
import './ErrorField.css'

interface Errors {
    emailErrors?: string[],
    passwordErrors?: string[],
    confirmPasswordErrors?: string[],
    displayNameErrors?: string[],
    serverErrors?: string[],
}

interface Props {
    errors: Errors
}

export const ErrorField: React.FC<Props> = ({ errors }) => {

    const [errorsState, setErrorsState] = useState<string[]>([]);

    useEffect(() => {
        const newErrors: string[] = [];
        for (const errorType of Object.keys(errors) as (keyof Errors)[]) {
            const errs = errors[errorType];
            if (errs) {
                for (const err of errs) {
                    newErrors.push(err)
                }
            }
          }
        setErrorsState(newErrors)
    }, [errors])

    const { language } = useContext(LanguageContext)

    return (
        <div className='form-errors'>
            <h3 className='form-errors-header'>
            {language === 'EN' ? 'Error' : 'Chyba'}
            </h3>
            <ul className='form-errors-list'>
            {errorsState.map(error => {
                    return <li key={error} className='form-errors-error'>{error}</li>
                })
            }
            </ul>
        </div>
    )
}
