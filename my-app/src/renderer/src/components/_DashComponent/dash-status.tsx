
import Arrows from './arrow-status';


import { useQuery } from '@tanstack/react-query';
const { ipcRenderer } = require('electron')


const fetchStatus = async () => {
  return await ipcRenderer.invoke('fetch-status');
};

const fetchPercaentage = async () => {
  return await ipcRenderer.invoke('fetch-percentage');
};



export default  function DashStatus(): JSX.Element {

  const getStatus =  useQuery({queryKey: ["Status"], queryFn: fetchStatus});
  const getPercentage = useQuery({queryKey: ["Percentage"], queryFn: fetchPercaentage});
  if (getStatus.isLoading) return <div>Loading...</div>;
  if (getPercentage.isLoading) return <div>Loading...</div>;
  if (getStatus.isError) return <div>Error:Loading Status</div>;
  if (getPercentage.isError) return <div>Error:Loading Percentages</div>;
   
  const priceString = getStatus.data.total_revenue.toFixed(2).toString();
  const formattedPrice = `$${priceString
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    .replace(/(\.\d*)$/, '<span class="decimal">$1</span>')}`;

    return (
      <div className="w-[78.5vw] h-[13.7vh] absolute left-[14.6vw] top-[14.7vh] flex">
        
        <div className="Stats mr-auto">

          <div className="Stat-Pic bg-[#EBF0FF] img-10"/>
          <div  className='absolute h-[4vh] w-[fit] flex top-[4vh] left-[8.8vw]'>
          <label className="label-top">{getStatus.data.total_orders.toString()}</label>
          <Arrows percentage={getPercentage.data.order_percentage_change} type={"number"}/>
          </div>
          
          <label className="label-bottom">Orders this month</label>
          
        </div>

        <div className="Stats ml-auto mr-auto ">
        <div className="Stat-Pic bg-[#FFF8E9] img-11"/> 
        <div className='absolute h-[4vh] w-[fit] flex top-[4vh] left-[8.8vw]'>
        <label className="label-top">{getStatus.data.total_customers.toString()}</label>
        <Arrows percentage={getPercentage.data.customer_percentage_change} type={"number"}/>
        </div>
        
        <label className="label-bottom">Customers this month</label>
        

        </div>  
       

        <div className="Stats ml-auto">

          
          <div className="Stat-Pic bg-[#FFEEF5] img-9"/> 
          
          <div className='absolute h-[4vh] w-[fit] flex top-[4vh] left-[8.3vw]'>

          <label className="label-top text-3xl" dangerouslySetInnerHTML=  {{ __html: formattedPrice }}></label>
          <Arrows percentage={getPercentage.data.revenuePercentageChange} type={"percentage"}/>
          </div>
          
          <label className="label-bottom">Revenue this month</label>
          
        </div>
    
      </div>
    )
  }


