
import { Link } from 'react-router-dom';


export default function ProfileButton({id}): JSX.Element {
   

    return (
        <Link to={`/CustomerProfile/${id}`}>
        <button className="Profile-Buttons ml-auto mb-auto bg-[#96C7FF] text-default hover:bg-[#7FADE4] transition duration-150">View Profile</button>
        </Link>
    )
}