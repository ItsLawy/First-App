import {motion} from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import StorePic from './StorePhoto';
const { ipcRenderer } = require('electron');

type Data = {
    Name: string,
    Phone: string,
    Address: string,
    TotalAmount: string,
    Orders: number,
    CompanyBackground: string
}


export default function ProfileInfo({id}): JSX.Element {

    const GetStoreInfo = useQuery({queryKey:['GetStoreInfo',id],queryFn:async () => {
        return await ipcRenderer.invoke('fetch-company-info',id);
    }});
    if (GetStoreInfo    .isLoading) return <div></div>;
    if (GetStoreInfo.isError) return <div>Error: Unable to fetch store info</div>;

    return (
        <>
        <motion.div className="bg-default h-full w-[20.2vw] rounded-2xl shadow-[2px_4px_4px_#68B6FF0D] ml-auto flex flex-col"
       initial={{scale:0.9, opacity:0}}
       animate={{scale:1, opacity:1}}
       transition={{duration:0.2,delay:0.15}}>
            <TopInfo data={GetStoreInfo.data}/>
            <MiddleInfo data={GetStoreInfo.data}/>
            <BottomInfo data={GetStoreInfo.data}/>
        </motion.div>
        </>
    )
}

function TopInfo ({data}:{data:Data}):JSX.Element{

    return(
        <div className='relative w-[11.4vw] h-[18.7vh]  m-auto flex justify-center items-center flex-col'>
                 <StorePic ColorID={data.CompanyBackground} Name={data.Name}/>
                <label className='relative mb-auto text-lg'>{data.Name}</label>
        </div>

    )
}
function MiddleInfo ({data}:{data:Data}):JSX.Element{

    return(
        <div className='relative w-[100%] h-[8vh] m-auto flex'>
            <InfoPics Img={'img-2'} data={data.Orders} label={'Orders'}/>  
            <InfoPics Img={'img-14'} data={data.TotalAmount} label={'Revenue'}/>        
        </div>

    )
}

function BottomInfo ({data}:{data:Data}):JSX.Element{

    return(
        <div className='relative w-[100%] h-[16vh] m-auto'>
            <BottomLabels data={data}/>         
        </div>

    )
}

function InfoPics ({label,data,Img}):JSX.Element{
    
        return(
            <div className='relative w-[7.17vw] h-[3.6vh] m-auto flex'>
                <div className={`h-[3.6vh] w-[2vw] bg-company rounded-xl relative bg-[length:32px_32px] bg-no-repeat ${Img} bg-center m-auto`}/>
                <div className='w-[4.5vw] h-[3.6vh]  flex flex-col m-auto'>
                <label className="text-secondary relative text-[14px] font-medium">{label}</label>
                <label className="text-secondary relative text-[14px] font-bold">{data}</label>
                </div>
                    
            </div>
    
        )
}

function BottomLabels ({data}:{data:Data}):JSX.Element{
    return(
       <div className='relative flex flex-col w-[50%] h-[100%] ml-5 '>

        <div className='w-full h-[7vh] flex flex-col m-auto'>
        <label className='relative text-[16px] mb-2 text-[#B8B7BC]'>Phone Number</label>
        <label className='text-[16px]'>{data.Phone}</label>
        </div>

        <div className='w-full h-[7vh] flex flex-col m-auto'>
            <label className='relative text-[16px] mb-2 text-[#B8B7BC]' >Address</label>
            <label className='text-[16px]'>{data.Address}</label>
            </div>

       </div>

    )
}