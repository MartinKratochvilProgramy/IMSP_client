import website from '../assets/website.png'
import lunch from '../assets/lunch.png'
import registration3 from '../assets/registration3.png'
import classroom from '../assets/classroom.png'
import communication2 from '../assets/communication2.png'
import covid from '../assets/covid.png'
import './Index.css'

export const Index = () => {

    const links = [
        {
            src: website,
            linkTo: "https://www.montessori.cz/"
        },
        {
            src: lunch,
            linkTo: "https://lunch.imsp.cz/"
        },
        {
            src: registration3,
            linkTo: "https://registration.imsp.cz/"
        },
        {
            src: classroom,
            linkTo: "https://www.transparentclassroom.com/souls/sign_in?locale=en"
        },
        {
            src: communication2,
            linkTo: "https://communication.imsp.cz/"
        },
        {
            src: covid,
            linkTo: "https://transparentclassroom.com/s/1307/pages/covid_update"
        },

    ]

    return (
        <div className='container content'>
            {links.map(link => {
                return (
                    <a className='image-link' href={link.linkTo}>
                        <img src={link.src} alt="website-image" />
                    </a>
                )
            })}
        </div>
    )
}
