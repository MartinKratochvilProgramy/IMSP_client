import React, { useContext } from 'react'
import { LanguageContext } from '../App';
import './InputField.css'

interface Props {
    type: string;
    labelEN: string;
    labelCS: string;
    setterFunc: (e: string) => void;
}

export const InputField: React.FC<Props> = ({
    type,
    labelEN,
    labelCS,
    setterFunc
}) => {

    const { language } = useContext(LanguageContext)

    return (
        <div className='input-field-group'>
            <label htmlFor={labelEN} className='input-field-label'>
                {language === 'EN' ? labelEN : labelCS}
            </label>
            <input
                type={type}
                className='input-field-input'
                onChange={(e) => setterFunc(e.target.value)}
                placeholder={language === 'EN' ? labelEN : labelCS}
            />
        </div>
    )
}
