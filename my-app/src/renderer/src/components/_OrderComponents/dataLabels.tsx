import External from "./External"
import List_1 from "../_DashComponent/list_1";
import List_2 from "../_DashComponent/list_2";
import { useState,useRef,useEffect } from "react";
import More from "../../public/More.svg";
import { ShowContext,ActionDataContext,ContextSelectAll,CheckedContext } from "@renderer/Orders";
import { useContext } from "react";
import {motion,AnimatePresence} from 'framer-motion';





export default function dataLabels({data}): JSX.Element {
    const priceString = (data.price * data.amount).toFixed(2).toString();
    const {SelectedIDs} = useContext(ActionDataContext);
    const formattedPrice = `$${priceString.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
    const [selected, setSelected] = useState(false);
    const [show, setShow] = useState(false);
    const [hover, setHover] = useState(false);
    const {checked,setChecked} = useContext(CheckedContext);
    const {seen,setSeen} = useContext(ShowContext);
    const ref = useRef<HTMLDivElement>(null);
    const {selectedAll} = useContext(ContextSelectAll);
    
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

      useEffect(() => {
        if (selectedAll === 1 && data.status=="Paid") {
          if (SelectedIDs.includes(data.id)) {
            const index = SelectedIDs.indexOf(data.id);
            if (index > -1) {
              SelectedIDs.splice(index, 1);
            }
          }
          else {
            SelectedIDs.push(data.id);
          }

          setSelected(true);
        }
        else if (selectedAll === 2 && data.status=="Pending") {
          if (SelectedIDs.includes(data.id)) {
            const index = SelectedIDs.indexOf(data.id);
            if (index > -1) {
              SelectedIDs.splice(index, 1);
            }
          }
          else {
            SelectedIDs.push(data.id);
          }
          setSelected(true);
        }
        else if (selectedAll === 3 && data.status=="Cancelled") {
          if (SelectedIDs.includes(data.id)) {
            const index = SelectedIDs.indexOf(data.id);
            if (index > -1) {
              SelectedIDs.splice(index, 1);
            }
          }
          else {
            SelectedIDs.push(data.id);
          }
          setSelected(true);
        }
        else if (selectedAll === 0) {
          if (SelectedIDs.includes(data.id)) {
            const index = SelectedIDs.indexOf(data.id);
            if (index > -1) {
              SelectedIDs.splice(index, 1);
            }
          }
          else {
            SelectedIDs.push(data.id);
          }
          setSelected(true);

        }
        else {
          setSelected(false);
        }
        SelectedIDs.length > 0 ? setSeen(true) : setSeen(false);
        SelectedIDs.length > 0 ? setChecked(true) : setChecked(false);
      },[selectedAll]);


    
    const [Position,setPosition] = useState(false);

    const handleShow = (event) => {

      if (event.clientY > 800) {
        setPosition(true);
      }
      else {
        setPosition(false);
      }
        setShow(pervsetsgate => !pervsetsgate);
      };

      const handleSelect = (id:string) => {
       
        if (SelectedIDs.includes(id)) {
          const index = SelectedIDs.indexOf(id);
          if (index > -1) {
            SelectedIDs.splice(index, 1);
          }
        }
        else {
          SelectedIDs.push(id);
        }
        setSelected(prevState => !prevState);
        SelectedIDs.length > 0 ? setSeen(true) : setSeen(false);
        if (checked){
          SelectedIDs.length > 0 ? setChecked(true) : setChecked(false);
        }
      }

      useEffect(() => {
        if (!seen){
          setSelected(false);
        }
      },[seen]);
    return (
    <>
    <div className=" dataLabels-o w-[74vw] min-h-[5vh] relative flex hover:bg-[#faf9f9] transition duration-150 "
    style={{backgroundColor: selected ? '#F3F3F3' : ''}}>
        <label className="w-[1.2vw] flex justify-center items-center " >
        <div className="checkbox-wrapper-13">
          <input id="c1-13" type="checkbox" checked={selected } onChange={() => handleSelect(data.id)} />
        </div>
        </label>
        <label className=" text-nowrap w-[9vw]">{data.user.name}</label>
        <label className="w-[3vw]" >${data.price}</label>
        <label className="w-[5vw]">{data.amount}</label>
        <label className="total w-[7vw]">{formattedPrice}</label>
        <label className="w-[6vw]">{data.fabricType}</label>
        <label className="w-[6vw]">{formatDate(data.createdAt)}</label>   
        <label className="w-[7vw]">{data.company.name}</label>
        <label className="w-[3vw]">{data.unit}</label>
        <External isStatus={data.status}/>
        <label className='flex justify-center items-center w-[3vw]'>
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
       
    </>
    
    ) 
}











  
function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}
