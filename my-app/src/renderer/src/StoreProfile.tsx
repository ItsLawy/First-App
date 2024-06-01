import { useParams } from 'react-router-dom';
import Background from './components/_DashComponent/bg';
import TopBar from './components/_StoreProfile/TopBar';
import BottomBar from './components/_StoreProfile/BottomBar';
import Buttons from './components/_DashComponent/Buttons';
import UpperStore from './components/_StoreProfile/UpperWrapperStore';
import { createContext } from 'react';
import { useState, useEffect } from 'react';
import EditBox from './components/_StoreProfile/EditBoxCompany';

type ShowType = {
    companyVisible: boolean;
    isCompanyVisible: (value: boolean) => void;
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
    DataCompany: DataType;
    setDataCompany: (value: any) => void;
  };
  export const DataContextCompany = createContext<DataContextType>({
    DataCompany: {User:'', Company:'', Amount:0, Price:0, FabricType:'', Unit:'', Status:'', CreatedAt:''},
    setDataCompany: (value: any) => {value},
  })
  
  export const ShowContextCompany = createContext<ShowType>({
    companyVisible: false,
    isCompanyVisible: (value: boolean) => {value},
  })
  
  
  
export default function StoreProfile(): JSX.Element {

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
    id;
    return (

        <>
        <DataContextCompany.Provider value={{DataCompany:Data, setDataCompany:setData}}>
        <ShowContextCompany.Provider value={{companyVisible:visiable, isCompanyVisible:setVisiable}}>
        <h2 className='font-medium text-4xl top-[3vh] left-[12.9vw] relative w-fit text-secondar animate-[400ms_fadeIn_forwards]'>Store Profile</h2>
        <Background/>
        <Buttons Button={4}/>
        <div className='absolute w-[78.9vw] h-[83.3vh] left-[14.4vw] top-[11.2vh]  flex flex-col'>
        <TopBar id={id} />
        <BottomBar id={id} />
        </div>
        <UpperStore id={id} />
        <EditBox />
        </ShowContextCompany.Provider>
        </DataContextCompany.Provider>

        </>
    )
}