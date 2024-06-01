import Element from "./elementStat";
import { useQuery } from "@tanstack/react-query";
const { ipcRenderer } = require('electron');

const fetchOvereview = async () => {
    return await ipcRenderer.invoke('overview-orders');
}

export default function OrderReveiw(): JSX.Element {


    const getOvereview = useQuery({queryKey: ["Overview"], queryFn: fetchOvereview});

if (getOvereview.isLoading) return <div>Loading...</div>;
if (getOvereview.isError) return <div>Error:</div>;

    return(
        <div  className="w-[76.3vw] h-[13.7vh] absolute top-[4vh] left-[2.3vw] flex ">
            <Element data={getOvereview.data.paidOrdersCount} location={1}/>
            <Element data={getOvereview.data.pendingOrdersCount} location={2}/>
            <Element data={getOvereview.data.cancelledOrdersCount} location={3}/>
            <Element data={getOvereview.data.allOrdersCount} location={4}/>
        </div>
    )
}
