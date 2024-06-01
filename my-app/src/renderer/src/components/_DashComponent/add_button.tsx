import { motion,AnimatePresence } from "framer-motion";
import Add_Form from "./add_form";
import { useState,useRef,useEffect} from "react";






export default  function Add_Button(): JSX.Element {
  

  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);      

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setShow(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleShow = () => {
    setShow(pervsetsgate => !pervsetsgate);
  };

    return (
      <>
      <div className="absolute top-[3vh] left-[78vw] w-[fit] h-[fit]">
      <motion.button onClick={()=>{
        handleShow();
      }}      
      className=" Add-Order "
      initial={{opacity: 0, transform: 'translateY(20%)'}}
      animate={{opacity: 1, transform: 'translateY(0%)'}}
      transition={{duration:0.2}}
      >
        New Order
      </motion.button>
      </div>
      
      <AnimatePresence>
      {show && <motion.div ref={ref} 
        initial={{ opacity: 0}}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.1 }}
        exit={{ opacity: 0 }}
      >   
              
            <Add_Form />
              </motion.div>
             
            }  
      </AnimatePresence>
      </>
      
    ) 
  }