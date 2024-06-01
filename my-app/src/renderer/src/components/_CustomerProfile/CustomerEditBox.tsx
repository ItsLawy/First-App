import EditForm from "./CustomerOrderEdit";
import {motion,AnimatePresence} from 'framer-motion'
import { useRef,useEffect,useContext } from 'react'
import { ShowContextCustomer } from "@renderer/CustomerProfile";
export default function EditBox(): JSX.Element {
    const ref = useRef<HTMLDivElement>(null);
   
    const {customerVisible, isCustomerVisible} = useContext(ShowContextCustomer);
    const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
            isCustomerVisible(false);
        }   
    };
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <AnimatePresence>
        {
           customerVisible &&
           
          <motion.div ref={ref}
          initial={{opacity:0}}
          animate={{opacity:1}}
          exit={{opacity:0}}
          transition={{duration:0.1}}
          >
    
          <EditForm/>
          </motion.div>
        }
        </AnimatePresence>
    );
}

