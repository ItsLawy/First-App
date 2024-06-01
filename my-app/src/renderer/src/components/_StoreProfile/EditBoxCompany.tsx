import EditForm from "./EditOrderCompany";
import {motion,AnimatePresence} from 'framer-motion'
import { useRef,useEffect,useContext } from 'react'
import { ShowContextCompany } from "@renderer/StoreProfile";
export default function EditBox(): JSX.Element {
    const ref = useRef<HTMLDivElement>(null);
   
    const {companyVisible, isCompanyVisible} = useContext(ShowContextCompany);
    const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
            isCompanyVisible(false);
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
           companyVisible &&
           
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

