import {motion} from "framer-motion";
import CustomerPhoto from "../_CustomerComponents/CustomerPhoto";

export default function CustomerInfo({data}): JSX.Element {
    return (
        <motion.div className="relative w-full h-[41.1vh] bg-default rounded-[14px] mb-auto shadow-[2px_4px_4px_#68B6FF0D] flex flex-col justify-center items-center"
        initial={{scale:0.9, opacity:0}}
        animate={{scale:1, opacity:1}}
        transition={{duration:0.2,delay:0.24}}>
                <div>
                    <div className=" relative h-[17.9vh] w-[11.1vw] flex flex-col justify-center items-center">
                        <CustomerPhoto ColorID={data.UserBackground} Name={data.name}/>
                        <label className="text-[#363447] text-[17px] mt-4 h-[2vh] w-[11vw] text-center">{data.name}</label>
                    </div>
                    <div className="relative h-[19.8vh] w-[11.1vw]  flex flex-col">
                        <Labels data={data}/>
                    </div>
                

                </div>
            
        
        
        </motion.div>
    );
 }
    

 function Labels ({data}) {
    return (
        <div className=" relative flex flex-col right-[2vw] top-[1.2vh]">

            <div className="relative m-auto flex flex-col h-[6vh] w-[10vw]">
            <label className="text-lowerLabels text-[15px]">Phone Number</label>
            <label className="text-primary top-1 relative text-[15px]">{data.phone}</label>
            </div>

            <div className="relative m-auto flex flex-col h-[6vh] w-[10vw]">
            <label className="text-lowerLabels text-[15px]">Store</label>
            <label className="text-primary top-1 relative text-[15px]" >{data.StoreName}</label>
            </div>
            
            <div className="relative m-auto flex flex-col h-[6vh] w-[10vw]">
            <label className="text-lowerLabels text-[15px]">Address</label>
            <label className="text-primary top-1 relative text-[15px]">{data.Address}</label>
            </div>
           
        </div>
    )
 }