
import CustomerInfo from "./CustomerInfo";
import CustomerOverview from "./CustomerOverview";
import { useQuery } from "@tanstack/react-query";
const { ipcRenderer } = require('electron');

export default function CustomerWidgets({id}): JSX.Element {

    const GetCustomerInfo = useQuery({queryKey:['customer',id], queryFn:async () => {
        const result = await ipcRenderer.invoke('get-customer',id);
        return result;
    }});
    if (GetCustomerInfo.isLoading) return <div></div>
    if (GetCustomerInfo.isError) return <div>Error</div>

    return (
        <div className="relative w-[16.5vw] h-[61.3vh] flex flex-col mr-auto ">
            <CustomerInfo data={GetCustomerInfo.data} />
            <CustomerOverview id={id}/>
        </div>
    );
    }
    
    