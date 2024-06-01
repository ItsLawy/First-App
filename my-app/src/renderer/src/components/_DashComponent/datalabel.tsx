
import External from './external-label'
import More from '../../public/More.svg'
import { useState,useRef,useEffect } from 'react';
import {motion,AnimatePresence} from 'framer-motion';
import List_1 from './list_1';
import List_2 from './list_2';








export default  function Data_Label({data}): JSX.Element { 
  const [show, setShow] = useState(false);
  const [hover, setHover] = useState(false);
  const [Position,setPosition] = useState(false);
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


  //placement of the dropdown
  const handleShow = (event) => {
    const { clientY } = event;
    if (clientY > 550) {
      setPosition(true);
    } else {
      setPosition(false);
    }
    setShow(pervsetsgate => !pervsetsgate);
  };

  //price formatting

    const priceString = (data.price * data.amount).toFixed(2).toString();
    const formattedPrice = `$${priceString.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;


    // up or down arrow



    return (  
      <>
     
     <div className="Data-Holder">
        <label>{data.user.name}</label>
        <label>${data.price.toString()}</label>
        <label>{data.amount.toString()}</label>
        <label className='total'>{formattedPrice}</label>
        <label>{data.fabricType}</label>
        <External isStatus={data.status}/>
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
       
        <h1 className="w-[100%] h-[0.2vh] bg-[#f9f9f9] absolute top-[5vh]"  />
        
      </div>
      
      </>
      
    ) 
    
  }










