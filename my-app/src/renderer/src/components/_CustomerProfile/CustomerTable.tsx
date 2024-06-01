import {motion} from "framer-motion";
import DataLabels from "./DataLabels";
import { useQuery } from "@tanstack/react-query";
import EmptyOrdes from "./../../public/Empty-Orders.svg";
const { ipcRenderer } = require('electron');

type Order = {
    id: number;
    user_name: string;
    company_name: string;
    amount: number;
    price: number;
    total_price: number;
    createdAt: string;
    status: string;
    unit: string;
}

const FetchCustomerData = async (id) => {
    return await ipcRenderer.invoke('CustomerOrders',id.queryKey[1]);
}

export default function CustomerTable({id}): JSX.Element {
   

    const GetCustomerData = useQuery<Order[], Error>({queryKey: ['Customer',id], queryFn: FetchCustomerData});
    if (GetCustomerData.isLoading) return <div></div>
    if (GetCustomerData.isError) return <div>Error</div>


    return (
        <motion.div className="relative w-[60.5vw] h-[61.3vh] bg-default rounded-[14px] shadow-[2px_4px_4px_#68B6FF0D]"
        initial={{scale:0.9, opacity:0}}
        animate={{scale:1, opacity:1}}
        transition={{duration:0.2,delay:0.34}}>

       { (GetCustomerData?.data?.length === 0) &&
        <div className="w-[10vw] h-[5vw]  absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex flex-col ">
            <img src={EmptyOrdes} className="w-[61px] h-[66px] relative m-auto"/>
            <label className="w-[10vw] h-[2vh] m-auto text-center text-[#D9D9D9] text-[16px]">It looks empty here..</label>
        </div>  }
        
            
        <TopLabels />
        {(GetCustomerData.isSuccess) && <DataCarrier data={GetCustomerData.data}/>
        }
        </motion.div>
    );
    }

function TopLabels(): JSX.Element {
    return (
       <div className="topLabels w-[58.5vw] h-[4vh] absolute top-[3vh] flex">
        <label>Unit Price</label>
        <label>Amount</label>
        <label>Total</label>
        <label>Fabric</label>
        <label>Date</label>
        <label>Company</label>
        <label>Type</label>
        <label>Status</label>
        <label>Action</label>
       </div>
    );
}
function DataCarrier({data}): JSX.Element {
    return (
       <div className="CustomerDataCarrier left-[0.4vw] lowLabels w-[58.5vw] h-[50vh] absolute bottom-[3vh] flex flex-col overflow-auto  ">
     
         {data.map((order: Order) => (
              <DataLabels key={order.id} data={order}/>
         ))}
       </div>
    );
}
    