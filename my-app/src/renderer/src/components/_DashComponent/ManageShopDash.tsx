import { useContext } from "react"
import { EditFormContext,DataContextForm } from "@renderer/App"
import { motion,AnimatePresence } from "framer-motion"
import FormPhoto from "./../_StoreComponents/FormPhoto"
import { useState,useEffect } from "react";
import { useForm } from "react-hook-form"
import { useMutation,useQueryClient } from "@tanstack/react-query";
const { ipcRenderer } = require('electron')

type FormData = {
    CompanyID: string,
    Name : string,
    Address: string,
    Phone: string,
    CompanyBackground: string,
    CreatedAt: string,

}
export default function ManageStore (): JSX.Element {
   
    const {editForm, setEditForm} = useContext(EditFormContext);
    const [warning, setWarning] = useState<boolean>(false);
    const {Data} = useContext(DataContextForm);
    const [name, setName] = useState<string>('');

    return (
        <>
        <AnimatePresence>
        { editForm && <><Blackout setWarning={setWarning} setForm={setEditForm}/>
        <motion.div className="  absolute w-[38.3vw] h-[48.4vh] left-[34.6vw] top-[25.7vh] rounded-[14px] bg-default z-[1000] "
        initial={{ scale: 0.8, opacity: 0}}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.15 }}
        exit={{ scale: 0.8, opacity: 0 }}
        >
                    <AnimatePresence>

            {
                warning && <ShowWarning setWarning={setWarning} setForm={setEditForm}/>
            }
        </AnimatePresence>

            
            <div className="absolute w-fit h-fit left-[3.35vw] top-[3vh]">
            <FormPhoto Name={name} ColorID={Data.CompanyBackground} />
            </div>
            <Form setName={setName} setWarning={setWarning} setForm={setEditForm} />
            
            </motion.div>
            
            </>
           
            }
        </AnimatePresence>
        </>
    )
}

function Blackout ({setForm,setWarning}){

    const handleClick = () => {
        setForm(false);
        setWarning(false);
    }
    return (
        
        <motion.div onClick={handleClick} className="absolute w-[100%] h-[100%] left-[0] top-[0] bg-black bg-opacity-50 rounded-[14px] z-[999]"
        initial={{ opacity: 0}}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
        exit={{ opacity: 0 }}
        >
            
        </motion.div>
    )
}



const submitFormData = async (formData: FormData): Promise<void> => {
    
    try {
    await ipcRenderer.invoke('edit-company', formData);
    } catch (error) {   
        // Handle errors
        console.error('Mutation failed:', error);
        throw error;
    }
};


function  Form ({setForm,setWarning,setName}){


const queryClient = useQueryClient();


    const {
        register,
           formState,
           handleSubmit,
           reset,
           setValue,


       } = useForm<FormData>({
           defaultValues: {
                CompanyID: '',
                Address: '',
                CreatedAt: '',
                Phone: '',
                Name: '',
                CompanyBackground: ''
           }
       })
       const {Data} = useContext(DataContextForm);
         useEffect(() => {
                setValue('CompanyID', Data.CompanyID);
                setValue('Address', Data.Address);
                setValue('Phone', Data.Phone);
                setValue('Name', Data.Name);
                setValue('CreatedAt', Data.CreatedAt);
                setValue('CompanyBackground', Data.CompanyBackground);
                setName(Data.Name);
         }, [Data]);    


       const EditCompany = useMutation({
        mutationFn: submitFormData,
        onError: (error) => {
                throw error;
        },
        onSuccess: () => {
            reset();
            setForm(false);
            queryClient.invalidateQueries({queryKey: ["Companyfetching"]});
            queryClient.invalidateQueries({queryKey: ["orders"]});
        },  
    }); 
       const onSubmit = async (formData: any) => {
        try {
            const trimmedData:any = trimObjectValues(formData);
            const Keys1 = Object.keys(trimmedData);
            for (const key of Keys1) {
                if (trimmedData[key] !== Data[key]) {
                    EditCompany.mutate(formData)
                }
              }
            reset();
            setForm(false);
        } catch (error) {
            console.error('Mutation failed:', error);
        }
    };




    return (
        <div className=" form-div absolute h-[100%] w-[50%]  left-[40%] justify-center items-center">

        <form className="absolute w-[100%] h-[65%] top-[8vh] flex flex-col justify-center items-center CompanyForm " onSubmit={handleSubmit(onSubmit)}>
            <label className="relative right-[3.6vw] w-[7vw] CompanyFormLabels">NAME</label>
            <input type="text" {...register("Name" ,{required:true ,minLength:3})} onChange={
                (e) => {setName(e.target.value)}
            }/>
            <h1 className="CompanyForm-h1"></h1>
            <label className="relative right-[3.6vw] w-[7vw] CompanyFormLabels">PHONE NUMBER</label>
            <input type="text" {...register("Phone")}/>
            <h1 className="CompanyForm-h1"></h1>
            <label className="relative right-[3.6vw] w-[7vw] CompanyFormLabels">ADDRESS</label>
            <input type="text" {...register("Address")}/>
            <h1 className="CompanyForm-h1"></h1>

            <div>

            <input style={{backgroundColor: formState.isValid?'#febf19':'#d6d7d8'
            ,pointerEvents: formState.isValid?'auto':'none'
            ,position:"absolute"
            ,top:"31vh"
            , left:"11.5vw"
            ,borderRadius:"8px"
            ,color:"#FEFEFE"
            ,fontSize:"16px"
            ,transitionDuration:"0.2s"
            ,padding:"1.6vh 2.7vw"}} type="submit" value='UPDATE'/>


            </div>
            
           </form>
            <motion.button className="absolute top-[40.1vh] p-[1vh_0.5vw] left-[1vw] text-[#FF6347] rounded-xl border-2 border-[#FF6347] hover:bg-[#FF6347] hover:text-bg transition duration-150"
            onClick={() => {setWarning(true)}}
            
            >Delete</motion.button>
        </div>
        
    )


}






function ShowWarning({setWarning,setForm}):JSX.Element {

    const {Data} = useContext(DataContextForm);
    const queryClient = useQueryClient();

    const DeleteCompany = useMutation({
        mutationFn: async (id:string) => {
            return await ipcRenderer.invoke('delete-company', id);
        },
        onError: (error) => {
            throw error;
        },
        onSuccess: () => {
            setForm(false);
            queryClient.invalidateQueries({queryKey: ["GetStores"]});
            queryClient.invalidateQueries({queryKey: ["getActiveStorePage"]});
        },
    });

    const handleSubmit = async (id) => {
        try {
            DeleteCompany.mutate(id);
        } catch (error) {
            console.error('An error occurred during mutation:', error);
        }
    };

    return (
        <div>
        <motion.div className=" absolute w-[25vw]  h-[20vh] rounded-[14px] bg-default flex flex-col justify-center items-center z-[1000] shadow-[4px_6px_12px_#232A300D] top-[25%] left-[20%] transform -translate-x-[-50%] -translate-y-[-50%]"

        initial={{ scale: 0.8, opacity: 0}}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.15 }}
        exit={{ scale: 0.8, opacity: 0 }}
        >
            <h1 className="text-2xl font-medium text-secondary relative text-center">Are you sure you want to delete this store?</h1>
            <div className="w-[70%] h-[10vh] relative flex">

            <motion.button className="relative p-[2vh_1.5vw] text-[#FF6347] rounded-xl m-auto border-2 border-[#FF6347] hover:bg-[#FF6347] hover:text-bg transition duration-150"
            onClick={() => {setForm(false);setWarning(false);handleSubmit(Data.CompanyID)}}
            >Yes</motion.button>
            <motion.button className="relative  p-[2vh_1.5vw] text-default rounded-xl m-auto border-2 border-[#61AC68] bg-[#61AC68] "
           onClick={() => {setWarning(false)}}
            >No</motion.button>

            </div>
           
        </motion.div>
        </div>
        
    )

}


function trimObjectValues(obj) {
    const trimmedObj = {};
  
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
  
        // Check if the value is a string
        if (typeof value === 'string') {
          // Trim spaces from start and end
          trimmedObj[key] = value.trim();
        } else {
          // Keep non-string values as is
          trimmedObj[key] = value;
        }
      }
    }
  
    return trimmedObj;
  }