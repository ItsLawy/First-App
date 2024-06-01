import { useContext } from "react"
import { ContextSelectAll,ActionDataContext,CheckedContext } from "@renderer/Orders"
import {useState,useRef,useEffect} from 'react';
import Arrow from '../../public/dropDown.svg';

export default function topLabels(): JSX.Element {
    const {setSelectedAll} = useContext(ContextSelectAll);
    const [show, setShow] = useState(false);
    const {SelectedIDs} = useContext(ActionDataContext);
    const {checked, setChecked} = useContext(CheckedContext);
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

  const handleCheck = () => {
    setChecked(!checked);
    checked ? setSelectedAll(10) : setSelectedAll(0);
    SelectedIDs.length=0;
  }

    return (
    <>
    <div className=" h-fit w-[74.5vw] relative m-auto ">   

    
    <div className=" topLabels-o w-[74vw] h-[4vh] relative flex  ">
        <label className="w-[1.2vw]" >
        <div className="checkbox-wrapper-13">
          <input id="c1-13" type="checkbox" checked={checked } onChange={()=>{handleCheck()}} />
        </div>
        </label>
        <label className=" text-nowrap w-[9vw]">Customer</label>
        <label className="w-[3vw]" >Price</label>
        <label className="w-[5vw]">Amount</label>
        <label className="total w-[7vw]">Total</label>
        <label className="w-[6vw]">Fabric</label>
        <label className="w-[6vw]">Date</label>   
        <label className="w-[7vw]">Company</label>
        <label className="w-[3vw]">Type</label>
        <label className="w-[4vw]">Status</label>
        <label className="w-[3vw]">Action</label>
        </div>
        <div>
        <img onClick={() => { setShow(!show) }} src={Arrow} alt="arrow" className="absolute top-[1.5vh] left-[2.5vw] cursor-pointer"/>
        {

            show && 
            <div ref={ref}>
                <List show={show} setShow={setShow}/>
            </div>
         
        }
        </div>
        </div>
    </>
    
    ) 
}


function List ({show,setShow}): JSX.Element{

  const {setSelectedAll} = useContext(ContextSelectAll);
  const {SelectedIDs} = useContext(ActionDataContext);
  const handleCheck = () => {
    SelectedIDs.length=0;
  }


    return(
          <ul className="ul-list-5">
            <li onClick={()=>{setShow(!show);setSelectedAll(0);handleCheck()}}>All</li>
            <li onClick={()=>{setShow(!show);setSelectedAll(1);handleCheck()}}>Paid</li>
            <li onClick={()=>{setShow(!show);setSelectedAll(2);handleCheck()}}>Pending</li>
            <li onClick={()=>{setShow(!show);setSelectedAll(3);handleCheck()}}>Cancelled</li>
          </ul>
    )
}