
import CustomerLabels from "./CustomerLabels";
import { useQuery } from "@tanstack/react-query";
const { ipcRenderer } = require('electron');

type customer = {
    id:string;
    name:string;
    phone:string;
    createdAt:Date;
    orders:any;
    UserBackground:string;
}
export default function RecentCustomers(): JSX.Element {

    const getTopCustomers = useQuery({queryKey: ["TopCustomers"], queryFn: async () => {
        return await ipcRenderer.invoke('fetch-top-customers');
    }
    });
    if (getTopCustomers.isLoading) return <div></div>;
    if (getTopCustomers.isError) return <div>Error: Unable to fetch customers</div>;

    getTopCustomers.data.sort((a:customer, b:customer) => {
        return b.orders.length - a.orders.length;
    });
    return (
        <div className="w-[20.4vw] h-[30vh] bg-default ml-auto animate-[400ms_slideUp_forwards] shadow-[2px_4px_4px_#68B6FF0D] rounded-2xl flex flex-col">
        <div className="Customer-Dash relative w-[19vw] h-[4vh] top-[1vh] m-auto flex">
            <label>Customer</label>
            <label className="left-[2.3vw] relative">Orders</label>
            <label className="left-[0.5vw] relative">Total</label>
        </div>
        <CustomerCarrier data={getTopCustomers.data}/>
        </div>
    );
    }

function CustomerCarrier ({data}){
    return (
        <div className='relative w-[19vw] h-[22vh] top-[-1.2vh] flex flex-col m-auto'>
         {data.length !== 0 && data.slice(0,4).map((customer:customer) => (
                <CustomerLabels key={customer.id} data={customer}/>
            ))}
        </div>
    );
}