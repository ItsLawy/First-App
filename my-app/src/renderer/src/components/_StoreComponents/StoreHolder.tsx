
import {motion,AnimatePresence} from 'framer-motion';
import { useQuery,useMutation } from '@tanstack/react-query';
import { PageContext } from '../../Stores';
import { useContext,useState } from 'react';
import {DataContext} from '../../Stores';
import { EditFormContext } from "../../Stores"
import SearchBar from '../_OrderComponents/searchbar';
import { Link } from 'react-router-dom';
import StorePic from '../_StoreProfile/StorePhoto';
const { ipcRenderer } = require('electron');

type StoreObject = {
  companyId: string;
  notCancelledOrdersCount: number;
  paidOrdersCount: number;
  storeName: string;
  totalPaid: number;
  StoreBackground: string;
};


export default function StoreHolder(): JSX.Element {



  const {setEditForm} = useContext(EditFormContext);

  const [Stores, setStores] = useState<StoreObject[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
    const { Page } = useContext(PageContext);
    const GetStores = useQuery({queryKey:['GetStores'],queryFn:async () => {
        return await ipcRenderer.invoke('fetch-company');
    }});


        if (GetStores.isLoading) return <div></div>;
        if (GetStores.isError) return <div>Error: Unable to fetch stores</div>;
    return (  
        <>  
        <div className='w-fit h-fit absolute left-[74.8vw] top-[13vh]'>
       <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} data={GetStores.data} setOrders={setStores} />
        </div>
        
        <div className=" absolute w-[78.8vw] h-[72vh] top-[20vh] left-[14.2vw] grid grid-cols-2 gap-x-[13.8vw]">
           
                 {setStores.length > 0 ? Stores.slice((Page-1)*6,Page*6).map((store,index) => (

                  <Store setEditForm={setEditForm} key={store.companyId} data={store.storeName} backgroundColor={store.StoreBackground}  Revenue={store.totalPaid} Orders={store.notCancelledOrdersCount} delay={index*0.1} id={store.companyId}/>
                  )) :
                  GetStores.data.updatedMainArray.slice((Page-1)*6,Page*6).map((store,index) => (
                  
                 <Store setEditForm={setEditForm} key={store.companyId} data={store.storeName} backgroundColor={store.StoreBackground}  Revenue={store.totalPaid} Orders={store.notCancelledOrdersCount} delay={index*0.1} id={store.companyId}/>
                ))
           }  
        </div>
        </>
        
    )
}


const Store = ({data,Revenue,Orders,delay,id,backgroundColor,setEditForm}) => {

  const {setData} = useContext(DataContext);
  const Edit = useMutation({
    mutationFn: async () => {
      return await ipcRenderer.invoke('get-company-details', id);
    },
    onSuccess: (data) => {
      setData(data);
    }
  });

    
  const handleEdit = async (id) => {
    try {
      Edit.mutate(id);
    } catch (error) {
      console.error('An error occurred during mutation:', error);
    }
  };


  Revenue = Revenue || 0;

    const priceString = (Revenue).toFixed(0).toString();
    const formattedPrice = `$${priceString.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
    return (
     
      <AnimatePresence>
      <motion.div className=" w-[32.8vw] h-[20.5vh] bg-default rounded-2xl relative shadow-[2px_4px_4px_#68B6FF0D]"
       initial={{scale:0.9, opacity:0}}
       animate={{scale:1, opacity:1}}
       transition={{duration:0.2,delay:delay}}
       >
        
      <h2 className="text-2xl font-medium text-secondary absolute left-[9.2vw] top-[3.2vh]">{data}</h2>

      <div className='left-[1.6vw] top-[3.2vh] absolute'>
      <StorePic Name={data} ColorID={backgroundColor} />
      </div>
        
        <div className="h-[3.6vh] w-[2vw] bg-company rounded-xl absolute left-[9.2vw] top-[7.8vh] bg-[length:32px_32px] bg-no-repeat bg-center img-14"/>

        <label className="text-secondary absolute left-[11.8vw] top-[7.5vh] text-[14px] font-medium">Revenue</label>
        <label className="text-secondary absolute left-[11.8vw] top-[9.5vh] text-[14px] font-bold">{formattedPrice}</label>
        <div className="h-[3.6vh] w-[2vw] bg-company rounded-xl absolute left-[21.5vw] top-[7.8vh] bg-[length:32px_32px] bg-no-repeat bg-center img-2"/>
        <label className="text-secondary absolute left-[24.1vw] top-[7.5vh] text-[14px] font-medium">Orders</label> 
        <label className="text-secondary absolute left-[24.1vw] top-[9.5vh] text-[14px] font-bold">{Orders}</label><br />
        <button onClick={()=>{setEditForm(true);handleEdit(id)}} className="h-[4.8vh] w-[9.5vw] bg-[#F1F8F2] rounded-xl left-[8.9vw] top-[13vh] absolute bg-[length:27px_27px] bg-no-repeat bg-[1vh] hover:bg-[#E6EEE7] transition duration-150 img-12" ><label  className=" text-[#96CB9C] cursor-pointer relative left-[0.3vw]  text-[14px]">Manage Shop</label></button> 
        <Link to={`/StoreProfile/${id}`}>
        <button className="h-[4.8vh] w-[9.5vw] bg-[#70B877] rounded-xl left-[21.3vw] top-[13vh] absolute bg-[length:32px_32px] bg-no-repeat bg-[12vh] hover:bg-[#61AC68] transition duration-150 img-13" ><label className=" text-[#FEFEFE] cursor-pointer relative right-[1vw] text-[14px] ">View Store</label></button>    
        </Link>

    </motion.div>
    </AnimatePresence>  
    )
  }

