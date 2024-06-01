import External from "../_DashComponent/external-label";
import List_1 from "../_DashComponent/list_1";
import List_2 from "../_DashComponent/list_2";
import { useState,useRef,useEffect } from "react";
import More from "../../public/More.svg";
import {motion,AnimatePresence} from 'framer-motion';



export default function DataLabels({data}): JSX.Element {
  
    const [show, setShow] = useState(false);
    const [hover, setHover] = useState(false);
    const ref = useRef<HTMLDivElement>(null);


    const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          setShow(false);
          setHover(false);
        }
      };
    
      useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }, []);
    
    const [Position,setPosition] = useState(false);

    const handleShow = (event) => {

      if (event.clientY > 500) {
        setPosition(true);
      }
      else {
        setPosition(false);
      }

        
        setShow(pervsetsgate => !pervsetsgate);
      };
    
      const priceString = (data.price * data.amount).toFixed(2).toString();
    const formattedPrice = `$${priceString.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
    return (
        <div className="dataLabels w-[58vw] h-[5vh] min-h-[5vh] relative flex hover:bg-[#faf9f9] transition duration-150">
            <label>${data.price}</label>
            <label>{data.amount}</label>
            <label className=" total">{formattedPrice}</label>
            <label>{data.fabricType}</label>
            <label>{formatDate(data.createdAt)}</label>
            <label>{data.company.name}</label>
            <label>{data.unit}</label>
            <External isStatus={data.status} />
            <label className='flex justify-center items-center'>
            <img onClick={handleShow} className='h-[28px] w-[28px] cursor-pointer' src={More}/>
      
      <div ref={ref}
      >
                {show  && 
              <AnimatePresence>
              <motion.div
                initial={{ opacity: 0}}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.01 }}
                exit={{ opacity: 0 }}
              >
                    <List_1 id={data.id} setShow={setShow} Position={Position} setHover={setHover}  />
              </motion.div>
              </AnimatePresence>
             
            
                  }

              {hover &&
                <AnimatePresence>
              <motion.div
                initial={{ opacity: 0}}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.01 }}
                exit={{ opacity: 0 }}>
                  <List_2 id={data.id} setShow={setShow} Position={Position} setHover={setHover} />
                  </motion.div>
                </AnimatePresence>
                  }

      </div>

            </label>
            <h1 className="w-[100%] h-[0.22vh] bg-[#f4f2f2] absolute top-[5vh]"></h1>
        </div>
    );
}

function formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }