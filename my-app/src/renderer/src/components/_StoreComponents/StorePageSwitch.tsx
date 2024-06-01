import { useQuery } from "@tanstack/react-query";
import { useState,useEffect,useContext } from "react";
import  {PageContext}  from "../../Stores";
const { ipcRenderer } = require('electron');

type PageContextType = {
    Page: number;   
    setPageSwitch: (value: number) => void;
  };

export default function StorePageSwitch(): JSX.Element {

    const [activePage, setActivePage] = useState<number>(1);
    const { Page, setPageSwitch } = useContext<PageContextType>(PageContext);
    const CompanyData = useQuery({
        queryKey: ['getActiveStorePage'],
        queryFn: async () => {
            const data = await ipcRenderer.invoke('fetch-company-count');
            return data;
        },
    });

    useEffect(() => {
        if (CompanyData.isSuccess) {
            const pages = Math.ceil(CompanyData.data / 6);
            setActivePage(pages);   
        }
    }, [CompanyData.isSuccess, CompanyData.data]);
    return (
                <div className="w-auto h-[4vh] p-2 left-[14.6vw] bottom-[2.5vh] absolute bg-default justify-center items-center rounded-xl flex animate-me shadow-[2px_4px_4px_#68B6FF0D]">
                    {CompanyData.isSuccess && Array.from({ length: activePage }, (_, i) => (
                 <Button PageNumber={i+1} key={i} setPageSwitch={setPageSwitch} Page={Page} style={i+1===Page ? "bg-[#61AC68] text-default" : "text-primary"}/>
                    ))}

                    
                </div>
    )
} 

function Button ({PageNumber,setPageSwitch,Page,style}): JSX.Element {

    const handleclick = () => {
        setPageSwitch(PageNumber);
    }
    Page;
    return (
        <button onClick={handleclick} className={`${style} h-6 w-6 relative rounded-full ml-1 mr-1 font-normal transition duration-150`}><span className="relative top-[0.1vh]">{PageNumber}</span></button>
        )
}