import Buttons from './components/_DashComponent/Buttons'
import Status from './components/_OrderComponents/status'
import OrderTable from './components/_OrderComponents/orderTable'
import Add_Button from './components/_DashComponent/add_button'
import OrderReveiw from './components/_OrderComponents/orderreveiw'
import EditBox from './components/_OrderComponents/EditBox'
import {createContext } from 'react'
import {useState,useEffect } from 'react';


type ShowType = {
  Allvisiable: boolean;
  setVisiableAll: (value: boolean) => void;
};

type ShowContextType = {
  seen: boolean;
  setSeen: (value: boolean) => void;
};

type ActionDataType = {
  SelectedIDs: string[];
};

type DataType = {
  User:string,
  Company:string,
  Amount:number,
  Price:number,
  FabricType:string,
  Unit:string,
  Status:string,
  CreatedAt:string,
  OrderID?:string,
}

type AllDataContextType = {
  AllData: DataType;
  setAllData: (value: any) => void;
};





export const ActionDataContext = createContext<ActionDataType>({
  SelectedIDs: [],
});

type selectedType = {
  selectedAll: number;
  setSelectedAll: (value: number) => void;
};
type CheckedContextType = {
  checked: boolean;
  setChecked: (value: boolean) => void;
};

export const ContextSelectAll= createContext<selectedType>({
  selectedAll: 10,
  setSelectedAll: (value: number) => {value},
});

export const AllDataContext = createContext<AllDataContextType>({
  AllData: {User:'', Company:'', Amount:0, Price:0, FabricType:'', Unit:'', Status:'', CreatedAt:''},
  setAllData: (value: any) => {value},
})

export const ShowContextAllOrders = createContext<ShowType>({
  Allvisiable: false,
  setVisiableAll: (value: boolean) => {value},
})

export const ShowContext = createContext<ShowContextType>({
  seen: false,
  setSeen: (value: boolean) => {value},
})

export const CheckedContext = createContext<CheckedContextType>({
  checked: false,
  setChecked: (value: boolean) => {value},
})




export default function Orders(): JSX.Element {
  const [selectedAll, setSelectedAll] = useState(10);
  const [SelectedIDs] = useState<string[]>([]);
  const [seen, setSeen] = useState(false);
  const [checked, setChecked] = useState(false);
  const [Allvisiable, setVisiableAll] = useState(false);
  const [AllData, setAllData] = useState<any>({
    User:'',
    Company:'',
    Amount:0,
    Price:0,
    FabricType:'',
    Unit:'',
    Status:'',
    CreatedAt:'',
  });


  
  useEffect(() => {
    setAllData({User:'', Company:'', Amount:0, Price:0, FabricType:'', Unit:'', Status:'', CreatedAt:''});
  },[Allvisiable]);
  




 

    return (
      <>
      <AllDataContext.Provider value={{AllData, setAllData}}>
      <ShowContextAllOrders.Provider value={{Allvisiable, setVisiableAll}}>
      <ShowContext.Provider value={{seen, setSeen}}>
      <ActionDataContext.Provider value={{SelectedIDs}}>
      <ContextSelectAll.Provider value={{selectedAll, setSelectedAll}}>
      <CheckedContext.Provider value={{checked, setChecked}}>
      <h2 className='font-medium text-4xl top-[3vh] left-[12.9vw] relative w-fit text-secondary animate-[400ms_fadeIn_forwards] '>Orders</h2>
      <div className=" h-[89.7vh] w-[81.9vw] bg-bg left-[12.2vw] top-[3.9vh] relative rounded-3xl ">
        <div id='my-div' className=' Background  w-[99.6%] h-[97%] overflow-auto absolute top-[1vh]'>
        <OrderReveiw/>
        <OrderTable />
        <Status/> 
        </div>
     
      </div>
      
      <Add_Button/>
      <EditBox/>
      <Buttons Button={2}/>
      </CheckedContext.Provider>
      </ContextSelectAll.Provider>
      </ActionDataContext.Provider>
      </ShowContext.Provider>
      </ShowContextAllOrders.Provider>
      </AllDataContext.Provider>
      </> 
    )
  }

