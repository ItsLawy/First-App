import EditForm from "./Edit_Form";
import {motion,AnimatePresence} from 'framer-motion'
import { useRef,useEffect,useContext } from 'react'
import {ShowContextAllOrders} from '../../Orders'
export default function EditBox(): JSX.Element {
    const ref = useRef<HTMLDivElement>(null);
   
    const {Allvisiable,setVisiableAll} = useContext(ShowContextAllOrders);
    const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
            setVisiableAll(false);
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
           Allvisiable &&
           
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

