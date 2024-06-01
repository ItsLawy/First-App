import TopLabels from './topLabels';
import Search from './../../public/Search.svg';
import DataLabels from "./dataLabels";
import { useQuery } from '@tanstack/react-query';
import { useState,useEffect } from 'react';
const { ipcRenderer } = require('electron');
interface Order {
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


const fetchOrders = async () => {
    return await ipcRenderer.invoke('all-orders');
}

interface orderTableProps {
  opacity?: number;
  scale?: number;
}




export default function orderTable({}:orderTableProps): JSX.Element {


  const [orders, setOrders] = useState<Order[]>([]);
 
;
  const getOrders = useQuery<Order[], Error>({queryKey: ['allOrders'], queryFn: fetchOrders});
    // Render error message if there's an error fetching orders
    if (getOrders.isError) return <div>Error: Unable to fetch orders</div>;
    // Render orders data here
    return (
    <>
    <div className=' absolute top-[21vh] left-[2vw] z-10'>
     {
      <SearchBar data={getOrders.data} setOrders={setOrders}/>
     }
    </div>
    <div className="w-[76.3vw] h-[66vh] justify-center items-center absolute bg-default left-[2.3vw] top-[36vh] rounded-[14px] shadow-[2px_4px_4px_#68B6FF0D] animate-[400ms_fadeInTable_forwards] flex flex-col">
        <TopLabels/>

        <div className=' data-holder relative w-[74.5vw] top-[-2vh] m-auto h-[56vh] h-max[56vh] overflow-auto z-0 '>
              
        {orders.length === 0 && 
            getOrders.data?.map((order: Order) => (
             
              <DataLabels data={order} key={order.id} />

            
              
            ))
          
          }
              {orders.map((order: Order) => (
               <DataLabels data={order} key={order.id} />
              ))}
            


        </div>
        
         



    </div>
    </>
    
    ) 
}


const SearchBar = ({data,setOrders}) => { 

  const [searchTerm, setSearchTerm] = useState('');


  useEffect(() => {
    const results = data?.filter(order =>
      Object.values(order).some(val => {
        if (typeof val === 'object' && val !== null) {
          // If the value is an object, check its nested properties
          return Object.values(val).some(nestedVal =>
            nestedVal?.toString().toLowerCase().includes(searchTerm)
          );
        }
        // Otherwise, check the top-level properties
        return val?.toString().toLowerCase().includes(searchTerm);
      })
    );
    setOrders(results ?? []);
  },[data, searchTerm]);
 




  
  
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
   
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    const results = data?.filter(order =>
      Object.values(order).some(val => {
        if (typeof val === 'object' && val !== null) {
          // If the value is an object, check its nested properties
          return Object.values(val).some(nestedVal =>
            nestedVal?.toString().toLowerCase().includes(term)
          );
        }
        // Otherwise, check the top-level properties
        return val?.toString().toLowerCase().includes(term);
      })
    );
    results
    
  };
 

    return (
    <>
      
      <div className="w-[18.6vw] h-[4vh] bg-[#eaeaea] rounded-[8px] absolute top-[3.2vh] left-[2vw] animate-[400ms_slideUp_forwards]">
        <img src={Search} className='absolute h-7 w-7 top-1 left-1' />
        <input onChange={handleSearch}  className="bg-[#eaeaea] w-[16.2vw] h-[3.4vh] absolute top-[0.3vh] left-[1.96vw] focus:outline-none text-secondary " type="search" placeholder='Search anything...'  />
      </div>  
      
    </>
    
    ) 
   }


