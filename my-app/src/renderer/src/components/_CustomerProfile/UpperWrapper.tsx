import { Link } from 'react-router-dom';
import {motion,AnimatePresence} from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useState,useEffect,useRef } from 'react';
import CustomerAddForm from './CustomerOrderAdd';


const { ipcRenderer } = require('electron');

export default function UpperWrapper ({id}) : JSX.Element {

const ref = useRef<HTMLDivElement>(null);      
const [show,setShow] = useState(false);
  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setShow(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);



    const GetCustomer = useQuery({queryKey:['CustomerName'],queryFn:async () => {
        const result = ipcRenderer.invoke('fetch-customer-name',id);
        return result;
    }
    });
    if (GetCustomer.isLoading) return <div>Loading...</div>;
    if (GetCustomer.isError) return <div>Error: Unable to fetch customer</div>;


    return (
        <>
        <div className='right-[8.1vw] top-[3vh] w-[12.9vw] h-[5vh] absolute flex'>
             <AddButton setShow={setShow} />
            <Back />    
        </div>
        <AnimatePresence>
        {show &&
        <motion.div ref={ref}
        initial={{opacity: 0, transform: 'translateY(20%)'}}
        animate={{opacity: 1, transform: 'translateY(0%)'}}
        exit={{opacity: 0, transform: 'translateY(20%)'}}
        transition={{duration:0.1}}
        >
        <CustomerAddForm name={GetCustomer.data.name}/>
        </motion.div>
        
         }
        </AnimatePresence>
        </>
    )   
}

function Back (){
    return (
        <Link to={"/Customers"}>
        <motion.button  className="Back-Button img-15"
        key={1}
        initial={{opacity: 0, transform: 'translateY(20%)'}}
        animate={{opacity: 1, transform: 'translateY(0%)'}}
        transition={{duration:0.2}}
        ></motion.button>
        </Link>
    )
}

function AddButton ({setShow}){

    const handleAdd = () => {
        setShow(pervstate => !pervstate);
    }

    return (
        <motion.button onClick={handleAdd} className="Add-Button"
        key={2}
        initial={{opacity: 0, transform: 'translateY(20%)'}}
        animate={{opacity: 1, transform: 'translateY(0%)'}}
        transition={{duration:0.2}}
        >
        New Order
        </motion.button>
    )
}