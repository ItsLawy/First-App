import { useContext } from "react"
import { FormContext } from "../../Customers"
import {motion} from 'framer-motion';

export default function AddButton (): JSX.Element {
    
        const {form, setForm} = useContext(FormContext);
        form;
        const handleClick = () => {
            setForm(true);
        }

    
        return (
            <>
            <motion.button onClick={handleClick} className="Add-Customer absolute top-[3vh] left-[78vw]"
            initial={{opacity: 0, transform: 'translateY(20%)'}}
            animate={{opacity: 1, transform: 'translateY(0%)'}}
            transition={{duration:0.2}}
            >
            New Customer
            </motion.button>
            
            </>
        )
    }