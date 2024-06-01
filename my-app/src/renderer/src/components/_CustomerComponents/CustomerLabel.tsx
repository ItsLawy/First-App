import ProfileButton from "./ProfileButton"
import ManageButton from "./ManageButton"
import LabelCounters from "./LabelCounters"
import CustomerPhoto from "./CustomerPhoto"
import {motion,AnimatePresence} from "framer-motion"

type Customer = {
    id: string;
    name: string;
    phone: string;
    createdAt: Date;
    orders: any;
    UserBackground: string;
  };

export default function CustomerLabel({delay,customer}:{delay:number,customer:Customer}):JSX.Element {


    return (
        <AnimatePresence>
        <motion.div className="Customer-Label relative w-[18vw] h-[33vh]  bg-default rounded-xl shadow-[2px_4px_4px_#68B6FF0D]"
        initial={{scale:0.9, opacity:0}}
        animate={{scale:1, opacity:1}}
        transition={{duration:0.2,delay:delay}}
        >
            <div className=" relative w-[100%] h-[3vh] top-[1vh]  flex">
            <h2 className="w-[6vw] h-[3vh] relative text-[#D9D9D9] flex items-center justify-start mr-auto ml-2">{formatDate(customer.createdAt)}</h2>
            <LabelCounters orders={customer.orders.length}/>
            </div>
            
            <hr className="relative w-[100%] top-[1.3vh] bg-[#D9D9D9] h-[1px]" />
            <div className="relative left-[6.1vw] top-[3vh]">
            <CustomerPhoto ColorID={customer.UserBackground} Name={customer.name}/>
            </div>
          
            
            <div className="Customer-Card-Label-Holder relative w-[12.7vw] h-[8vh] top-[4vh] left-[2.6vw] flex flex-col">
            <label className="Customer-Card-Label-1">{customer.name}</label> 
            <label className="Customer-Card-Label-2">{customer.phone}</label>
            </div>
            <div className="relative top-[5vh] left-[4%] w-[92%] h-[5vh] flex">
                <ManageButton id={customer.id}/>
                <ProfileButton id={customer.id}/>
            </div>
        
             
        </motion.div>
        </AnimatePresence>
    )
}

function formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${year}/${month}/${day}`;
  }