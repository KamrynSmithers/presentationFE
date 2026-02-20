import '../App.css'
import socialIcon from "../assets/icons/social.png";
import linkedin from '../assets/icons/linkedin.png'
import gmail from '../assets/icons/gmail.png'
function Footer (){
    return (
        <>
        <div id = "footer">
            <footer><p>Contact Infomation: </p>
            <img src={socialIcon} alt="Social" />
            <img src = {gmail} alt = "gmail"/>
            <img src = {linkedin} alt = "LinkedIn"/>
            <img src={socialIcon} alt="Social" />

                 </footer>
        </div>
        </>
    )
}

export default Footer 
