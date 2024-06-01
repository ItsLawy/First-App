
import Arrow from '../../public/dropDown.svg';
import priceTag from '../../public/priceTag.svg';
import Action from '../../public/Action.svg';
import calendar from '../../public/Calendar.svg';
import filters from '../../public/Filters.svg';
import {motion,AnimatePresence } from 'framer-motion';
import { useState,useRef,useEffect,useContext } from 'react';
import { ActionDataContext,ShowContext,CheckedContext,ContextSelectAll } from '@renderer/Orders';
import { useMutation,useQueryClient } from '@tanstack/react-query';
const { ipcRenderer } = require('electron');

export default function dropDown({label,img,id}): JSX.Element {
  const [dropDown, setDropDown] = useState(false);
  const [buttonId, setButtonId] = useState(0);
  const [background, setBackground] = useState(7);
  const [background1, setBackground1] = useState(1);
  const [background2, setBackground2] = useState(7);
  const ref = useRef<HTMLDivElement>(null);
  const handleButtonClick = (buttonId) => {
    setButtonId(buttonId);
    setDropDown((prevId) => (prevId === buttonId ? null : buttonId));
  };


  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setDropDown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

    
    return (
    <>
    <button id={id} onClick={()=>{handleButtonClick(id)}} className=" dropDown w-[8.7vw] h-[4.8vh] border-2 m-auto border-[#EAEAEA] relative rounded-[12px] transition duration-150">
        <img src={img = img === 1 ? priceTag : img === 2 ? calendar : img ===3? filters : Action} className=' absolute h-[26px] w-[26px] top-2 left-3'  />
        <label className=" font-semibold absolute top-3 left-[2.6vw] ">{label}</label>
            
        <img src={Arrow} className='absolute h-[22px] w-[17px] left-[6.8vw] top-3'/>
    </button>
    <AnimatePresence>
   {dropDown && 
   
   <motion.div ref={ref}
    initial={{opacity:0}}
    animate={{opacity:1}}
    exit={{opacity:0}}
    transition={{duration:0.07}}
   >
    {buttonId === 1 ? <DropDownList_1 background={background1} setBackground={setBackground1} setDropDown={setDropDown}/>
     : buttonId===2? <DropDownList_2 background={background2} setBackground={setBackground2} setDropDown={setDropDown} />
     :buttonId===3?<DropDownList_3 setDropDown={setDropDown} background={background} setBackground={setBackground}/>
    :<DropDownList_4 setDropDown={setDropDown}/>
     }
   </motion.div>
    
   }
    </AnimatePresence>
    </>
    
    ) 
}



function DropDownList_1({setDropDown,setBackground,background}): JSX.Element {

  const [style, setStyles] = useState(null);



  const toggleStyle = (buttonId) => {
    setStyles(buttonId); // Set the clicked button as active
    // If there was a previously clicked button, reset its style
    if (style) {
      const buttonOld = document.getElementById(style);
      if (buttonOld) {
        buttonOld.style.backgroundColor = 'red'; // Replace 'defaultColor' with your default color
      }
    }

    // Toggle style for the clicked button
    const button = document.getElementById(buttonId);
    if (button) 
    {
        button.style.backgroundColor = button.style.backgroundColor === 'red' ? 'blue' : 'red'; // Toggle background color
    }
};


  const queryClient = useQueryClient();
  
  const Status = useMutation({
    mutationFn: async (id) => {
     
       await ipcRenderer.invoke('all-orders',id);
    },
    onSuccess: () => {
      queryClient.refetchQueries({queryKey: ['allOrders']});
    }
  });
    
  const ChooseStatus = (id:any) => {
    try {
      setBackground(id);
      Status.mutate(id);
    }
    catch (error) {
      console.error('Mutation failed:', error);
    }
  }
  

  return (
  <>
  <ul className="ul-list-1">
      <li style={{backgroundColor: background===1?'#49A7FF':'',  color: background === 1 ? '#FFFFFF' : ''}} id='list-1' onClick={()=>{setDropDown(pervstate=>(!pervstate)); ChooseStatus(1); toggleStyle('list-1')}}>Default</li>
      <li style={{backgroundColor: background===2?'#49A7FF':'',  color: background === 2 ? '#FFFFFF' : ''}} id='list-2' onClick={()=>{setDropDown(pervstate=>(!pervstate)); ChooseStatus(2); toggleStyle('list-2')}}>Name</li>
      <li style={{backgroundColor: background===3?'#49A7FF':'',  color: background === 3 ? '#FFFFFF' : ''}} id='list-3' onClick={()=>{setDropDown(pervstate=>(!pervstate)); ChooseStatus(3); toggleStyle('list-3')}}>Company</li>
      <li style={{backgroundColor: background===4?'#49A7FF':'',  color: background === 4 ? '#FFFFFF' : ''}} id='list-4' onClick={()=>{setDropDown(pervstate=>(!pervstate)); ChooseStatus(4); toggleStyle('list-4')}}>Amount</li>
      <li style={{backgroundColor: background===5?'#49A7FF':'',  color: background === 5 ? '#FFFFFF' : ''}} id='list-5' onClick={()=>{setDropDown(pervstate=>(!pervstate)); ChooseStatus(5); toggleStyle('list-5')}}>Fabric</li>
      <li style={{backgroundColor: background===6?'#49A7FF':'',  color: background === 6 ? '#FFFFFF' : ''}} id='list-6' onClick={()=>{setDropDown(pervstate=>(!pervstate)); ChooseStatus(6); toggleStyle('list-6')}}>Type</li>
      


  </ul>
  </>
  
  ) 
}

function DropDownList_2({setDropDown,setBackground,background}): JSX.Element {

  const queryClient = useQueryClient();
  
  const Status = useMutation({
    mutationFn: async (id) => {
     
       await ipcRenderer.invoke('all-orders',id);
    },
    onSuccess: () => {
      queryClient.refetchQueries({queryKey: ['allOrders']});
    }
  });
    
  const ChooseStatus = (id:any) => {
    try {
      setBackground(id);
      Status.mutate(id);
    }
    catch (error) {
      console.error('Mutation failed:', error);
    }
  }
  

  return (
  <>
  <ul className="ul-list-2">
      <li style={{backgroundColor: background===7?'#49A7FF':'',  color: background === 7 ? '#FFFFFF' : ''}} onClick={()=>{setDropDown(pervstate=>(!pervstate));ChooseStatus(7);}}>Default</li>
      <li style={{backgroundColor: background===8?'#49A7FF':'',  color: background === 8 ? '#FFFFFF' : ''}} onClick={()=>{setDropDown(pervstate=>(!pervstate));ChooseStatus(8);}}>Paid</li>
      <li style={{backgroundColor: background===9?'#49A7FF':'',  color: background === 9 ? '#FFFFFF' : ''}} onClick={()=>{setDropDown(pervstate=>(!pervstate));ChooseStatus(9);}}>Pending</li>
      <li style={{backgroundColor: background===10?'#49A7FF':'',  color: background === 10 ? '#FFFFFF' : ''}} onClick={()=>{setDropDown(pervstate=>(!pervstate));ChooseStatus(10);}}>Cancelled</li>
  </ul>
  </>
  
  ) 
}

function DropDownList_3({setDropDown,setBackground,background}): JSX.Element {

 
  
 

  const queryClient = useQueryClient();
  
  const Status = useMutation({
    mutationFn: async (id) => {
       await ipcRenderer.invoke('all-orders',id);
    },
    onSuccess: () => {
      queryClient.refetchQueries({queryKey: ['allOrders']});
    }
  });
    
  const ChooseStatus = (id:any) => {
    try {
      setBackground(id);
      Status.mutate(id);
    }
    catch (error) {
      console.error('Mutation failed:', error);
    }
  }
  console.log(background);

  return (
  <>
  <ul className="ul-list-3">
      <li style={{backgroundColor: background===7?'#49A7FF':'',  color: background === 7 ? '#FFFFFF' : ''}} onClick={()=>{setDropDown(pervstate=>(!pervstate));ChooseStatus(7);}}>Default</li>
      <li style={{backgroundColor: background===11?'#49A7FF':'', color: background === 11 ? '#FFFFFF' : ''}} onClick={()=>{setDropDown(pervstate=>(!pervstate));ChooseStatus(11);}}>6 months ago</li>
      <li style={{backgroundColor: background===12?'#49A7FF':'', color: background === 12 ? '#FFFFFF' : ''}} onClick={()=>{setDropDown(pervstate=>(!pervstate));ChooseStatus(12);}}>a year ago</li>
      <li style={{backgroundColor: background===13?'#49A7FF':'', color: background === 13 ? '#FFFFFF' : ''}} onClick={()=>{setDropDown(pervstate=>(!pervstate));ChooseStatus(13);}}>2 years ago</li>
  </ul>
  </>
  
  ) 
}



function DropDownList_4({setDropDown}): JSX.Element {

  const {SelectedIDs} = useContext(ActionDataContext);
  const {setSeen} = useContext(ShowContext);
  const {setChecked} = useContext(CheckedContext);
  const {setSelectedAll} = useContext(ContextSelectAll);
  const queryClient = useQueryClient();
  
  const Status = useMutation({
    mutationFn: async ({id,status}: {id: any,status:any}) => {
       await ipcRenderer.invoke('change-status-multiple',id,status);
    },
    onSuccess: () => {
      console.log("success");
      queryClient.invalidateQueries({queryKey: ['allOrders']});
      queryClient.invalidateQueries({queryKey: ['Overview']});
      queryClient.invalidateQueries({queryKey: ['CustomerStatus']});
      queryClient.invalidateQueries({queryKey: ['CustomerOverview']});
      SelectedIDs.length = 0;
      setSelectedAll(10);
      setSeen(false);
      setChecked(false);
    } 
  });
    
  const changeStatus = (status,id) => {
    try {
      Status.mutate({id,status});
    }
    catch (error) {
      console.error('Mutation failed:', error);
    }
  }


    
  const Delete_Mutation = useMutation({
    mutationFn: async (id) => {
      await ipcRenderer.invoke('remove-orders-multiple', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['allOrders']});
      queryClient.invalidateQueries({queryKey: ['Overview']});
      queryClient.invalidateQueries({queryKey: ['CustomerStatus']});
      queryClient.invalidateQueries({queryKey: ['CustomerOverview']});
      SelectedIDs.length = 0;
      setSelectedAll(10);
      setSeen(false);
      setChecked(false);
    }
  });


  
    
  const deleteStatus = (id:any) => {
    try {
      Delete_Mutation.mutate(id);
    }
    catch (error) {
      console.error('Mutation failed:', error);
    }
  }
  

  return (
  <>
  <ul className="ul-list-4">
      <li onClick={()=>{setDropDown(pervstate=>(!pervstate));changeStatus("Pending",SelectedIDs);}}>Pending</li>
      <li onClick={()=>{setDropDown(pervstate=>(!pervstate));changeStatus("Paid",SelectedIDs);}}>Paid</li>
      <li onClick={()=>{setDropDown(pervstate=>(!pervstate));changeStatus("Cancelled",SelectedIDs);}}>Cancelled</li>
      <li className='li-rem' onClick={()=>{setDropDown(pervstate=>(!pervstate));deleteStatus(SelectedIDs);}}>Remove</li>
  </ul>
  </>
  
  ) 
}

