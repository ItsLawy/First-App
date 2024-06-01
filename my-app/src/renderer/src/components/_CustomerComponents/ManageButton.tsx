import { EditFormContext,DataContext } from "../../Customers"
import { useContext } from "react"
import { useMutation } from "@tanstack/react-query"
const { ipcRenderer } = require('electron');

export default function ManageButton({id}): JSX.Element {

    const {setData} = useContext(DataContext);
    const Edit = useMutation({
      mutationFn: async () => {
        return await ipcRenderer.invoke('get-customer-details', id);
      },
      onSuccess: (data) => {
        console.log("im being called");
        setData(data);
      }
    });
  
      
    const handleEdit = async (id) => {
      try {
        Edit.mutate(id);
      } catch (error) {
        console.error('An error occurred during mutation:', error);
      }
    };
  

    const {setEditForm} = useContext(EditFormContext);
    return (
                <button onClick={()=>{setEditForm(true);handleEdit(id)}} className="Profile-Buttons mr-auto mb-auto bg-[#E4E2ED] text-[#93B2EF] hover:bg-[#D4D1E4] transition duration-150">Manage Profile</button>
    )
}