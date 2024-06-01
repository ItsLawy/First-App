import filters from '../../public/Filters.svg';
import Arrow from '../../public/dropDown.svg';
import { useState,useRef,useEffect } from 'react';
import {motion,AnimatePresence} from 'framer-motion';
import { useMutation,useQueryClient } from '@tanstack/react-query';
const ipcRenderer = require('electron').ipcRenderer;

export default function SortDropDown({Type}): JSX.Element {
    const ref = useRef<HTMLDivElement>(null);
    const [background, setBackground] = useState(1);
    
  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setDropDown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

    const [dropDown, setDropDown] = useState(false);

    const handleButtonClick = () => {
        setDropDown(!dropDown);
    };
    return (
        <>
        <motion.button onClick={handleButtonClick} className=" animate-me dropDown w-[8.7vw] h-[4.8vh] bg-default border-2 border-[#EAEAEA] absolute left-[14.6vw] top-[12vh] rounded-[12px] transition duration-150 shadow-[2px_4px_4px_#68B6FF0D]"
        >
        <img src={filters} className=' absolute h-[26px] w-[26px] top-2 left-3'/>
        <label className=" font-semibold absolute top-3 left-[2.6vw] ">Sort By</label>  
        <img src={Arrow} className='absolute h-[22px] w-[17px] left-[6.8vw] top-3'/>
    </motion.button>
    <AnimatePresence>
    
    {dropDown &&
    <motion.div ref={ref}
     initial={{opacity:0}}
     animate={{opacity:1}}
     exit={{opacity:0}}
     transition={{duration:0.07}}
    >
    <DropDown background={background} setBackground={setBackground} setDropDown={setDropDown} Type={Type}/>
    </motion.div>
    }
    </AnimatePresence>
    
    </>
            
    )
}



function DropDown ({setDropDown,Type,background,setBackground}): JSX.Element {

  const queryClient = useQueryClient();


  const ChangeStatusMutation = useMutation({
    mutationFn: async (value:number) => {
      Type === 1 ?
      await ipcRenderer.invoke('fetch-company', value):
      await ipcRenderer.invoke('fetch-customers', value);
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['CustomerData'] });
      queryClient.refetchQueries({ queryKey: ['GetStores'] });
    }
  });

  const handleButtonClick = (value:number) => {
    try {
      setBackground(value);
      ChangeStatusMutation.mutate(value);
    }
    catch (error) {
      console.error('Mutation failed:', error);
    }
  };




    return (
        <>
       <ul className='customers-list w-[8.7vw] h-[13vh] bg-default rounded-[12px] border-2 border-[#EAEAEA] left-[14.6vw] top-[17vh] absolute flex flex-col'>
              <li style={{backgroundColor: background===1?'#49A7FF':'',  color: background === 1 ? '#FFFFFF' : ''}}  onClick={()=>{setDropDown((pervstate:boolean)=>(!pervstate)); handleButtonClick(1)}}>Default</li>
              <li style={{backgroundColor: background===2?'#49A7FF':'',  color: background === 2 ? '#FFFFFF' : ''}}  onClick={()=>{setDropDown((pervstate:boolean)=>(!pervstate)); handleButtonClick(2)}}>Name</li>
              <li style={{backgroundColor: background===3?'#49A7FF':'',  color: background === 3 ? '#FFFFFF' : ''}}  onClick={()=>{setDropDown((pervstate:boolean)=>(!pervstate)); handleButtonClick(3)}}>Orders</li>
       </ul>
        </>
    )
}
    