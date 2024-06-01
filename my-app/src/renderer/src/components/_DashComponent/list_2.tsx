import { useQueryClient,useMutation } from "@tanstack/react-query";
const { ipcRenderer } = require('electron');




const Change = async (status) => {
    await ipcRenderer.invoke('change-status',status);
  }
  
  
  function List_2({id,setShow,Position,setHover}): JSX.Element {
  
    const queryClient = useQueryClient();
  
    const change = useMutation({
    
      mutationFn: Change,
      onSuccess: () => {
        queryClient.refetchQueries({queryKey: ['orders'] });
        queryClient.refetchQueries({queryKey: ['Status'] });
        queryClient.refetchQueries({queryKey: ['Percentage']});
        queryClient.refetchQueries({queryKey: ['Company']});
        queryClient.refetchQueries({queryKey: ['allOrders']});
        queryClient.refetchQueries({queryKey: ['Overview']});
        queryClient.refetchQueries({queryKey: ['CustomerStatus']});
        queryClient.refetchQueries({queryKey: ['CustomerOverview']});
        queryClient.refetchQueries({queryKey: ['Customer']});
        queryClient.refetchQueries({queryKey: ['TopCustomers']});
        queryClient.refetchQueries({queryKey: ['GetStoreStatus']});
        queryClient.refetchQueries({queryKey: ['CompanyOrdersFetching']});
        queryClient.refetchQueries({queryKey: ['GetStoreInfo']});
        queryClient.refetchQueries({queryKey: ['Companyfetching']});
        queryClient.refetchQueries({queryKey: ['GetAnalytics']});
      }
    });
      
  
    const changeStatus = (status,id) => {
      try {
        change.mutate({status,id});
      }
      catch (error) {
        console.error('Mutation failed:', error);
      }
    }
    
  
    return(
       
        <ul className="List-2" style={{top:Position?'-7vh':'2.9vh'}}>
         <li onClick={()=>{setShow(pervsetsgate => !pervsetsgate);setHover(pervsetsgate => !pervsetsgate); changeStatus("Paid",id)}}>Paid</li>
         <li onClick={()=>{setShow(pervsetsgate => !pervsetsgate);setHover(pervsetsgate => !pervsetsgate); changeStatus("Pending",id)}}>Pending</li>
         <li onClick={()=>{setShow(pervsetsgate => !pervsetsgate);setHover(pervsetsgate => !pervsetsgate); changeStatus("Cancelled",id)}}>Cancelled </li>
        </ul>
       
    )
  }
  
  
export default List_2;  