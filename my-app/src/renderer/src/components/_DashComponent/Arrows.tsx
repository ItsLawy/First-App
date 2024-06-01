import Arrows from '../../public/Arrow.svg';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useState,useEffect } from 'react';
import {motion} from 'framer-motion';
import { useContext } from 'react';
import { ButtonContext } from '../../main'
const { ipcRenderer } = require('electron');

type ButtonType = {
  Button: number;
  setButton: (value: number) => void;
};

const getCompany = async () => {
  return await ipcRenderer.invoke('fetch-company');
}



export default  function Arrow(): JSX.Element {

  const { setButton } = useContext<ButtonType>(ButtonContext);

  const handleclick = (value:number) => () => {
    setButton(value);
  }

  const [Show , setShow] = useState(false);

  const Companies = useQuery({queryKey: ["Company"], queryFn: getCompany});
 
  useEffect(() => {
    if (Companies.isSuccess && Companies.data.length > 2) {
      setShow(true);
    }
  }, [Companies]); 
  

    return (
        <>
        <Link to={"/Orders"} onClick={handleclick(2)}>
        
        <div  className=' absolute w-fit h-fit flex justify-center align-middle left-[59.1vw] top-[34vh] cursor-pointer animate-[500ms_fadeIn_forwards]'>
        <label  className='text-[#904EFE] text-[14px] cursor-pointer'>View all</label>
        <motion.img  src={Arrows} className='h-[24px] w-[24px] relative left-[0.2vw] top-[-0.15vh]'
        />
      </div>  
      </Link>  

      <Link to={"/Customers"} onClick={handleclick(3)}>
        
        <div  className=' absolute w-fit h-fit flex justify-center align-middle left-[88.6vw] top-[34vh] cursor-pointer animate-[500ms_fadeIn_forwards]'>
        <label  className='text-[#904EFE] text-[14px] cursor-pointer'>View all</label>
        <img  src={Arrows} className='h-[24px] w-[24px] relative left-[0.2vw] top-[-0.15vh]'/>
      </div>  
      </Link>  

      {
       Show && <Link to={"/Stores"} onClick={handleclick(4)}>
       <div    className=' absolute w-fit h-fit flex justify-center align-middle left-[88.6vw] top-[70.3vh] cursor-pointer animate-[500ms_fadeIn_forwards]'>
         <label  className='text-[#904EFE] text-[14px] cursor-pointer'>View all</label>
         <img  src={Arrows} className='h-[24px] w-[24px] relative left-[0.2vw] top-[-0.15vh]'/>
       </div>
       </Link>
      }
      
        </>     
    )       
  }