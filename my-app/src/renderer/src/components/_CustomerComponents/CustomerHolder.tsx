import CustomerLabel from './CustomerLabel';
import { useQuery } from '@tanstack/react-query';
import { useContext,useState } from 'react';
import { PageContext } from '../../Customers';
import SearchBar from './../_OrderComponents/searchbar';
const { ipcRenderer } = require('electron');



export default function CustomerHolder(): JSX.Element {
    const [Customers, setCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const { Page } = useContext(PageContext);

    const CustomerData = useQuery({queryKey:['CustomerData'],queryFn:async () => {
        const result = ipcRenderer.invoke('fetch-customers');
        return result;
    }});
    if (CustomerData.isLoading) return <div></div>;
    if (CustomerData.isError) return <div>Error: Unable to fetch customers</div>;
    
    return (
        <>  
        <div className='w-fit h-fit absolute left-[74.8vw] top-[13vh]'>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} data={CustomerData.data} setOrders={setCustomers} />
        </div>
        <div className=" absolute w-[78.8vw] h-[72vh] top-[20vh] left-[14.6vw] grid grid-cols-4 gap-10">
                
            {searchTerm.length > 1 ?
            Customers.slice((Page-1)*8,Page*8).map((customer,index) => (
                <CustomerLabel key={index} delay={index*0.1} customer={customer}/>
            )):
           
                CustomerData.data.slice((Page-1)*8,Page*8).map((customer,index) => (
                    <CustomerLabel key={customer.id} delay={index*0.1} customer={customer}/>
            ))
        }

            
        </div>
        </>
    )
}