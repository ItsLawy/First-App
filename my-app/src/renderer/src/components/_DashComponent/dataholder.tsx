import Data_Label from "./datalabel"
import { useQuery } from '@tanstack/react-query';
const { ipcRenderer } = require('electron')


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



const fetchUsers = async () => {
  
  return await ipcRenderer.invoke('fetch-orders');
};

export default  function Dataholder(): JSX.Element {


  const getOrders =  useQuery({queryKey: ["orders"], queryFn: fetchUsers});
 
  if (getOrders.isLoading) return <div></div>;
  if (getOrders.isError) return <div>Error:</div>;


    return (
      <>
    
      <div className='DataCarrier w-[47vw] max-h-[21vh] h-[21vh] absolute top-[7vh] flex overflow-auto flex-col'>
        {getOrders.data.map((order:Order) => (
          <Data_Label data={order} key={order.id} />
        ))}

      </div>
      

      </>     
     
      
    )   
  }