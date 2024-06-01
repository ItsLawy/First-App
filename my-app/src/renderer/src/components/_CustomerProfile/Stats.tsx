import ArrowUp from "../../public/Arrow-Green.svg";
import ArrowDown from "../../public/Arrow-Orange.svg";
import {motion} from "framer-motion";
import { useQuery } from "@tanstack/react-query";
const { ipcRenderer } = require('electron');

export default function StasHolder({id}): JSX.Element {

    const GetStatus = useQuery({queryKey:['CustomerStatus',id], queryFn:async () => {
        const result = await ipcRenderer.invoke('customer-status',id);
        return result;
    }
    }); 
    if (GetStatus.isLoading) return <div></div>
    if (GetStatus.isError) return <div>Error</div>

  return (
    <div className=" absolute w-[77.9vw] h-[17.4vh] top-[11.3vh] left-[14.8vw] flex">
        <div className="w-[fit] h-[fit] mr-auto">
        <Stats delay={0.08} location={1} percentage={GetStatus.data.AllOrderPercentageChange} totals={GetStatus.data.formattedAllRevenue} label={"Total Orders"} />
        </div>

        <div className="w-[fit] h-[fit] mr-auto ml-auto"> 
        <Stats delay={0.12} location={2} percentage={GetStatus.data.PaidOrderPercentageChange} totals={GetStatus.data.formattedPaidRevenue} label={"Paid Orders"} />   
        </div>

        <div className="w-[fit] h-[fit] mr-auto ml-auto"> 
        <Stats delay={0.18} location={3} percentage={GetStatus.data.PendingOrderPercentageChange} totals={GetStatus.data.formattedPendingRevenue} label={"Pending Orders"} />
        </div>

        <div className="w-[fit] h-[fit] ml-auto"> 
        <Stats delay={0.22} location={4} percentage={GetStatus.data.TotalAmountPercentageChange} totals={GetStatus.data.formattedTotalAmount} label={"Sold Quantity"} />
        </div>
    </div>
  );
}

function Stats({label,totals,delay,location,percentage}): JSX.Element {
    const img = percentage.includes("-") ? ArrowDown : ArrowUp;
    const rotate = percentage.includes("-") ? "" : "rotate-180";
    const Text = percentage.includes("-") ? "text-[#FF8A8A]" : "text-[#00B87C]";

    const priceString = totals;
  let formattedPrice = `$${priceString
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    .replace(/(\.\d*)$/, '<span class="decimal">$1</span>')}`;

    location = location === 4 ?  formattedPrice =`${priceString
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        .replace(/(\.\d*)$/, '<span class="decimal">$1</span>')}` : formattedPrice;

        if (percentage.length > 4) {
            percentage = percentage.slice(0,4);
        }
    
    return (
        <motion.div className={`relative w-[16.5vw] h-full bg-default rounded-[14px] shadow-[2px_4px_4px_#68B6FF0D]`}
        initial={{scale:0.9, opacity:0}}
        animate={{scale:1, opacity:1}}
        transition={{duration:0.2,delay:delay}}>
            <label className=" w-[6vw] h-[3vh] relative text-[18px] text-[#67656E] left-[1.9vw] top-[1.7vh]">{label}</label><br />
            <label className=" w-[6vw] h-[3vh] relative text-[32px] text-[#363447] left-[1.9vw] top-[3vh]"  dangerouslySetInnerHTML=  {{ __html: formattedPrice }}></label>
            <div className=" w-[10vw] h-[4vh] relative top-[4vh] left-[1.9vw] flex justify-center items-center ">
                <div className="flex justify-center items-center mr-auto ">
                <img src={img} className={`${rotate} h-9 w-9`}/>
                <label className={` ${Text} text-[16px]`}>%{percentage}</label> 
                </div>
                <div className=" relative ml-auto">   
                    <label className=" text-lowerLabels text-[14px] whitespace-nowrap w-[3vw] h-[2vh] relative">Last quarter</label>
                </div>
            </div>
        </motion.div>
    );  
}