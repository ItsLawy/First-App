import Buttons from './components/_DashComponent/Buttons'
import Background from './components/_DashComponent/bg'
import Stats from './components/_DashComponent/dash-status'
import Table from './components/_DashComponent/order-table'
import Company from './components/_DashComponent/company'
import Arrow from './components/_DashComponent/Arrows'
import Labels from './components/_DashComponent/labels'
import Add_Button from './components/_DashComponent/add_button'
import ManageStore from './components/_DashComponent/ManageShopDash'
import { createContext, useState,useEffect } from 'react'
import EditBox from './components/_DashComponent/EditBox'

type ShowType = {
  visiable: boolean;
  setVisiable: (value: boolean) => void;
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
  Data: DataType;
  setData: (value: any) => void;
};

type DataTypeForm = {
  CompanyID: string,
  Name : string,
  Address: string,
  Phone: string,
  CompanyBackground: string,
  CreatedAt: string,
}

type DataContextFormType = {
  Data: DataTypeForm;
  setData: (value: any) => void;
};

export const DataContext = createContext<DataContextType>({
  Data: {User:'', Company:'', Amount:0, Price:0, FabricType:'', Unit:'', Status:'', CreatedAt:''},
  setData: (value: any) => {value},
})

export const ShowContext = createContext<ShowType>({
  visiable: false,
  setVisiable: (value: boolean) => {value},
})

export const EditFormContext = createContext({
  editForm: false,
  setEditForm: (value: boolean) => {value},
})


export const DataContextForm = createContext<DataContextFormType>({
  Data: {Name:'', Address:'', Phone:'',CompanyBackground:'',CompanyID:'',CreatedAt:''},
  setData: (value: any) => {value},
})




export default function App(): JSX.Element {
  const [visiable, setVisiable] = useState(false);
  const [editForm, setEditForm] = useState(false);
  const [DataForm, setDataForm] = useState<DataTypeForm>({Name:'', Address:'', Phone:'',CompanyBackground:'',CompanyID:'',CreatedAt:''});
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
  


  return (
    <> 
    <DataContext.Provider value={{Data, setData}}>
    <ShowContext.Provider value={{visiable, setVisiable}}>
    <DataContextForm.Provider value={{Data:DataForm, setData: setDataForm}}>
    <EditFormContext.Provider value={{editForm, setEditForm}}>
    <h2 className='font-medium text-4xl top-[3vh] left-[12.9vw] relative w-fit text-secondary animate-[400ms_fadeIn_forwards]'>Dashboard</h2>
    <Buttons Button={1}/>
    <Background/>
    <Stats/>
    <Table/>
    <Company/>
    <Labels/>
    <Arrow/>
    <Add_Button/>
    <EditBox/>
    <ManageStore/>
    </EditFormContext.Provider>
    </DataContextForm.Provider>
    </ShowContext.Provider>
    </DataContext.Provider>
    </>
  )
}


