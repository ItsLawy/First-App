import Status from "./Status"
import { useQuery } from "@tanstack/react-query"
const { ipcRenderer } = require('electron');


export default function StatusHolder({id}): JSX.Element {

    const GetStoreStatus = useQuery({queryKey:['GetStoreStatus',id],queryFn:async () => {
        return await ipcRenderer.invoke('fetch-company-status',id);
    }}); 
    if (GetStoreStatus.isLoading) return <div></div>;
    if (GetStoreStatus.isError) return <div>Error: Unable to fetch store info</div>;

    return (    
        <>
         <div className=" h-full w-[20.2vw] flex flex-col rounded-2xl shadow-[2px_4px_4px_#68B6FF0D] ml-auto">
            <Status style={'mb-auto'} label="Total Sales" totals={GetStoreStatus.data.formattedThisQuarterPaid} delay={0.2} location={4} percentage={GetStoreStatus.data.PaidPercentageChange}/>
            <Status style={'mt-auto'} label="Total Pending" totals={GetStoreStatus.data.formattedThisQuarterPending} delay={0.26} location={4} percentage={GetStoreStatus.data.PendingPercentageChange}/>
            </div>
        </>
    )
}