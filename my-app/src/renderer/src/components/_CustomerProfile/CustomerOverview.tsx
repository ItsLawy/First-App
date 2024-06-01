import {motion} from "framer-motion";
import { useQuery } from "@tanstack/react-query";
const { ipcRenderer } = require('electron');

export default function CustomerOverview({id}): JSX.Element {

    const GetCustomerOrders = useQuery({queryKey:['CustomerOverview',id], queryFn:async () => {
        const result = await ipcRenderer.invoke('fetch-overview',id);
        return result;
    }});
    if (GetCustomerOrders.isLoading) return <div></div>
    if (GetCustomerOrders.isError) return <div>Error</div>

    return (
        <motion.div className="relative w-full h-[18.8vh] bg-default rounded-[14px] shadow-[2px_4px_4px_#68B6FF0D]"
        initial={{scale:0.9, opacity:0}}
        animate={{scale:1, opacity:1}}
        transition={{duration:0.2,delay:0.39}}>

            <h1 className="absolute h-[4.4vh] w-[8.2vw] left-[1vw] text-[18px]">Overview</h1>
            <Labels data={GetCustomerOrders.data}/>
        </motion.div>
    );
    }
 

function Labels ({data}) {
  
    return (
        <div className=" absolute h-[12vh] w-[9vw] left-[1vw] top-[6vh] flex flex-col">

        <div className="w-[100%] h-[50%] relative flex flex-col">
        <label className="text-lowerLabels text-[15px]">Paid Orders</label>
        <label className="text-primary top-1 relative text-[15px]">{data.CustomerPaidOrders._count}</label>
        </div>

       <div className="w-[100%] h-[50%] relative flex flex-col">
        <label className="text-lowerLabels text-[15px]">Pending Orders</label>
        <label className="text-primary top-1 relative text-[15px]">{data.CustomerPendingOrders._count}</label>
       </div>

        </div>
        

    )
}