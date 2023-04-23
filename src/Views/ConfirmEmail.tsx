import React, { useContext } from 'react'
import { LanguageContext } from '../App';


export const ConfirmEmail = () => {

    const { language } = useContext(LanguageContext)

    return (
        <div>
            {language === 'EN' ? 'Confirmation mail has been sent to: ' : 'Potvrďte mail na adrese: '}
        </div>
    )
}
