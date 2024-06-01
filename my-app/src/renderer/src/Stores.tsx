import Buttons from './components/_DashComponent/Buttons'
import Background from './components/_DashComponent/bg'
import StoreHolder from './components/_StoreComponents/StoreHolder'
import PageSwitch from './components/_StoreComponents/StorePageSwitch';
import SortDropDown from './components/_CustomerComponents/SortDropDown';
import AddStore from './components/_StoreComponents/AddStore';
import ManageStore from './components/_StoreComponents/ManageShop';
import { createContext, useEffect } from 'react';
import { useContext } from 'react';
import { ButtonContext } from './main';
import { useState } from 'react';
import StoreForm from './components/_StoreComponents/StoreForm';

type PageContextType = {
  Page: number;
  setPageSwitch: (value: number) => void;
};

type DataType = {
  CompanyID: string,
  Name : string,
  Address: string,
  Phone: string,
  CompanyBackground: string,
  CreatedAt: string,
}

type DataContextType = {
  Data: DataType;
  setData: (value: any) => void;
};
export const FormContext = createContext({
  form: false,
  setForm: (value: boolean) => {value},
})

export const EditFormContext = createContext({
  editForm: false,
  setEditForm: (value: boolean) => {value},
})


export const DataContext = createContext<DataContextType>({
  Data: {Name:'', Address:'', Phone:'',CompanyBackground:'',CompanyID:'',CreatedAt:''},
  setData: (value: any) => {value},
})

export const PageContext = createContext<PageContextType>({  
  Page: 1,
  setPageSwitch: (value: number) => {value},
  
});
export default function Money(): JSX.Element {

const {setButton} = useContext(ButtonContext);
 const [Page, setPageSwitch] = useState<number>(1);
 const [form, setForm] = useState(false);
 const [editForm, setEditForm] = useState(false);
 const [Data, setData] = useState<DataType>({Name:'', Address:'', Phone:'',CompanyBackground:'',CompanyID:'',CreatedAt:''});
 useEffect(() => {
  setButton(4);   
},[setButton]);
    return (
      <>
      <FormContext.Provider value={{form, setForm}}>
      <PageContext.Provider value={{Page, setPageSwitch}}>
      <EditFormContext.Provider value={{editForm, setEditForm}}>
      <DataContext.Provider value={{Data, setData}}>
      <h2 className='font-medium text-4xl top-[3vh] left-[12.9vw] relative w-fit text-secondary animate-[400ms_fadeIn_forwards] '>Stores</h2>
      <Background />
      <StoreHolder />
      <Buttons Button={4}/>
      <PageSwitch />
      <SortDropDown Type={1}/>
      <AddStore />
      <StoreForm />
      <ManageStore />
      </DataContext.Provider>
      </EditFormContext.Provider>
      </PageContext.Provider>
      </FormContext.Provider>
      </> 
    )
  }