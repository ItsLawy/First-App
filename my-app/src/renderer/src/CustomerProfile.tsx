
import { useParams } from 'react-router-dom';
import Buttons from './components/_DashComponent/Buttons';
import Background from './components/_DashComponent/bg';
import Stats from './components/_CustomerProfile/Stats';
import CustomerWidgets from './components/_CustomerProfile/CustomerWidgets';
import CustomerTable from './components/_CustomerProfile/CustomerTable';
import UpperWrapper from './components/_CustomerProfile/UpperWrapper';
import EditBox from './components/_CustomerProfile/CustomerEditBox';
import { createContext } from 'react';
import { useState, useEffect } from 'react';

type ShowType = {
  customerVisible: boolean;
  isCustomerVisible: (value: boolean) => void;
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

type DataContextType = {
  DataCustomer: DataType;
  setDataCustomer: (value: any) => void;
};
export const DataContextCustomer = createContext<DataContextType>({
  DataCustomer: {User:'', Company:'', Amount:0, Price:0, FabricType:'', Unit:'', Status:'', CreatedAt:''},
  setDataCustomer: (value: any) => {value},
})

export const ShowContextCustomer = createContext<ShowType>({
  customerVisible: false,
  isCustomerVisible: (value: boolean) => {value},
})



export default function CustomerProfile(): JSX.Element {

  const [visiable, setVisiable] = useState(false);
  const [Data, setData] = useState<any>({
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
    setData({User:'', Company:'', Amount:0, Price:0, FabricType:'', Unit:'', Status:'', CreatedAt:''});
  },[visiable]);
  


    const { id } = useParams<{ id: string }>();



    return (
      <> 
      
      <DataContextCustomer.Provider value={{DataCustomer: Data, setDataCustomer: setData}}>
      <ShowContextCustomer.Provider value={{customerVisible: visiable, isCustomerVisible: setVisiable}}>
      <h2 className='font-medium text-4xl top-[3vh] left-[12.9vw] relative w-fit text-secondary animate-[400ms_fadeIn_forwards]'>Customer Profile</h2>
      <Background />
      
        <Buttons Button={3}/>
        <Stats id={id} />
        <div className='w-[77.9vw] h-fit absolute top-[31.9vh] left-[14.8vw] flex'>
        <CustomerWidgets id={id} />
        <CustomerTable id={id}/>
        </div>
        <UpperWrapper id={id} />
        <EditBox/>
      </ShowContextCustomer.Provider>
      </DataContextCustomer.Provider>
      </>
    )
  }
  
  