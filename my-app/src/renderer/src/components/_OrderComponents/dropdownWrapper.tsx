
import DropDown from "./dropdown"
import { ShowContext } from "@renderer/Orders";
import { useContext } from "react";
import {motion,AnimatePresence} from 'framer-motion';
export default function dropdownWrapper(): JSX.Element {
    
    const {seen} = useContext(ShowContext);
    return (

    <>
    <div className="absolute w-[39.8vw] h-[4.8vh] top-[2.8vh] right-[2vw] flex " >
        <div className="w-[10vw] h-[4.8vh] relative flex  justify-center items-center ">

        
        <AnimatePresence>
        {
            seen && 
            <motion.div className="w-fit h-fit"
            initial={{opacity:0,scale:0.8}}
            animate={{opacity:1,scale:1}}
            exit={{opacity:0,scale:0.8}}
            transition={{duration:0.1}}
            >
                <DropDown id={4} label={'Action'} img={4}/>
            </motion.div>
         
        }
     </AnimatePresence> 
     </div>
        <div className="w-[29.8vw] h-[4.8vh] relative flex">
        <DropDown id={1} label={'Sort by'} img={3}/>
        <DropDown id={2} label={'Status'} img={1}/>
        <DropDown id={3} label={'Date'} img={2}/>
        </div>
        
       

    </div>
    </>
    
    ) 
}