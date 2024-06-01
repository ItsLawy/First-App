
import {useMutation,useQueryClient} from '@tanstack/react-query';
import { useContext } from 'react';
import { ShowContext,DataContext } from '../../App';
import { ShowContextAllOrders,AllDataContext } from '@renderer/Orders';
import { ShowContextCustomer,DataContextCustomer } from '@renderer/CustomerProfile';
import { ShowContextCompany,DataContextCompany } from '@renderer/StoreProfile';
import { ActionDataContext,ShowContext as ShowToolBar,CheckedContext } from '@renderer/Orders';
const { ipcRenderer } = require('electron');




function List_1({id,setShow,Position,setHover}): JSX.Element {

  const {setVisiable} = useContext(ShowContext);
  const {setData} = useContext(DataContext);
  

  const {setVisiableAll} = useContext(ShowContextAllOrders);
  const {setAllData} = useContext(AllDataContext);

  const {isCustomerVisible} = useContext(ShowContextCustomer);
  const {setDataCustomer} = useContext(DataContextCustomer);

  const {isCompanyVisible} = useContext(ShowContextCompany);
  const {setDataCompany} = useContext(DataContextCompany);


    //customer removal 
    
    const queryClient = useQueryClient();
    const {SelectedIDs} = useContext(ActionDataContext);
    const {setSeen} = useContext(ShowToolBar);
    const {setChecked} = useContext(CheckedContext);
  const Delete_Mutation = useMutation({
    mutationFn: async (id) => {
      await ipcRenderer.invoke('remove-orders', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['orders'] });
      queryClient.invalidateQueries({queryKey: ['Status'] });
      queryClient.invalidateQueries({queryKey: ['Percentage']});
      queryClient.invalidateQueries({queryKey: ['Company']});
      queryClient.invalidateQueries({queryKey: ['allOrders']});
      queryClient.invalidateQueries({queryKey: ['Overview']});
      queryClient.invalidateQueries({queryKey: ['CustomerStatus']});
      queryClient.invalidateQueries({queryKey: ['CustomerOverview']});
      queryClient.invalidateQueries({queryKey: ['Customer']});
      queryClient.invalidateQueries({queryKey: ['TopCustomers']});
      queryClient.invalidateQueries({queryKey: ['GetStoreStatus']});
      queryClient.invalidateQueries({queryKey: ['CompanyOrdersFetching']});
      queryClient.invalidateQueries({queryKey: ['GetStoreInfo']});
      queryClient.invalidateQueries({queryKey: ['Companyfetching']});
      queryClient.invalidateQueries({queryKey: ['GetAnalytics']});
      setChecked(false);
      setSeen(false);
      SelectedIDs.length = 0;
    }
  });


  
    
  const Delete = (id:any) => {
    try {
      Delete_Mutation.mutate(id);

    }
    catch (error) {
      console.error('Mutation failed:', error);
    }
  }

    const Edit = useMutation({
      mutationFn: async () => {
        return await ipcRenderer.invoke('fetch-order', id);
      },
      onSuccess: (data) => {
        setData(data);
        setAllData(data);
        setDataCustomer(data);
        setDataCompany(data);
      }
    });



    const handleEdit = async (id) => {
      try {
        Edit.mutate(id);
      } catch (error) {
        console.error('An error occurred during mutation:', error);
      }
    };


  
  
     
  
      return(
         
  
        
          <ul className="List-1" style={{top:Position?'-7vh':'2.9vh'}}>
  
           <li className='img-19' onMouseEnter={()=>{setHover(true);}}><span>Status</span></li>
           <li className='img-20' onMouseEnter={()=>{setHover(false);}} onClick={()=>{setShow(pervsetsgate => !pervsetsgate); handleEdit(id);setVisiable(true);setVisiableAll(true);isCustomerVisible(true); isCompanyVisible(true)}}><span>Edit</span></li>
           <li className='li-rem img-21' onMouseEnter={()=>{setHover(false);}} onClick={()=>{setShow(pervsetsgate => !pervsetsgate); Delete(id);} }><span>Remove</span></li>
          </ul> 
         
  
      )
  
  }
  
  export default List_1;