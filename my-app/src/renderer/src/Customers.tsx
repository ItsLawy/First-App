import Buttons from './components/_DashComponent/Buttons';
import Background from './components/_DashComponent/bg';
import Dropdown from './components/_CustomerComponents/SortDropDown';
import CustomerHolder from './components/_CustomerComponents/CustomerHolder';
import PageSwitch from './components/_CustomerComponents/PageSwitch';
import CustomerForm from './components/_CustomerComponents/CustomerForm';
import EditCustomerForm from './components/_CustomerComponents/EditCustomerForm';
import { createContext } from 'react';
import { useState } from 'react';
import AddButton from './components/_CustomerComponents/AddCustomer';
export const FormContext = createContext({
  form: false,
  setForm: (value: boolean) => {value},
});

type PageContextType = {
  Page: number;
  setPageSwitch: (value: number) => void;
};


type DataType = {
  CustomerID: string,
  Name : string,
  Address: string,
  Phone: string,
  CustomerBackground: string,
  CreatedAt: string,
  Store : string,
}

type DataContextType = {
  Data: DataType;
  setData: (value: any) => void;
};
export const DataContext = createContext<DataContextType>({
  Data: {Name:'', Address:'', Phone:'',CustomerBackground:'',CustomerID:'',CreatedAt:'',Store:''},
  setData: (value: any) => {value},
})


export const EditFormContext = createContext({
  editForm: false,
  setEditForm: (value: boolean) => {value},
})



export const PageContext = createContext<PageContextType>({  
  Page: 1,
  setPageSwitch: (value: number) => {value},
  
});



export default function Customers(): JSX.Element {
  const [Page, setPageSwitch] = useState<number>(1);
  const [form, setForm] = useState(false);
  const [editForm, setEditForm] = useState(false);
  const [Data, setData] = useState<DataType>({Name:'', Address:'', Phone:'',CustomerBackground:'',CustomerID:'',CreatedAt:'',Store:''});
    return (
      <>
     
      <FormContext.Provider value={{form, setForm}}>
      <PageContext.Provider value={{Page, setPageSwitch}}> 
      <EditFormContext.Provider value={{editForm, setEditForm}}>
      <DataContext.Provider value={{Data, setData}}>
      <h2 className='font-medium text-4xl top-[3vh] left-[12.9vw] relative w-fit text-secondary animate-[400ms_fadeIn_forwards]'>Customers</h2>
      <Background/>
      <CustomerHolder/>
      <Dropdown Type={2}/>
      <PageSwitch/>
      <Buttons Button={3}/>
      <CustomerForm/>
      <AddButton/>
      <EditCustomerForm/>
      </DataContext.Provider>
      </EditFormContext.Provider>
      </PageContext.Provider>
      </FormContext.Provider>
      
      </> 
    )
  }