import { useContext } from "react"
import { FormContext } from "../../Stores"
import { motion,AnimatePresence } from "framer-motion"
import FormPhoto from "./FormPhoto"
import { useState,useEffect } from "react";
import { useForm } from "react-hook-form"
import { useMutation,useQueryClient } from "@tanstack/react-query";

const { ipcRenderer } = require('electron')

const date = new Date();
type FormData = {
    address: string;
    createdAt: string;
    phone: string;
    name: string;
}
export default function StoreForm (): JSX.Element {

    const {form, setForm} = useContext(FormContext);
    const [name, setName] = useState<string>('');

    useEffect(() => {
        if (!form) {
            setName('');
        } 
    }, [form]);

   

    return (
        <>
        <AnimatePresence>
        {form && <><Blackout setForm={setForm}/>
        <motion.div className="  absolute w-[38.3vw] h-[48.4vh] left-[34.6vw] top-[25.7vh] rounded-[14px] bg-default z-[1000]"
        initial={{ scale: 0.8, opacity: 0}}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.15 }}
        exit={{ scale: 0.8, opacity: 0 }}
        >
            <div className="absolute w-fit h-fit left-[3.35vw] top-[3vh]">
            <FormPhoto Name={name} ColorID="11" />
            </div>
            <Form setName={setName} setForm={setForm} />
            </motion.div></>}
        </AnimatePresence>
        </>
    )
}

function Blackout ({setForm}){

    const handleClick = () => {
        setForm(false);
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
        // Send data via ipcRenderer
       
     await ipcRenderer.invoke('add-company', formData);
    } catch (error) {   
        // Handle errors
        console.error('Mutation failed:', error);
        throw error;
    }
};


function  Form ({setName,setForm}){


const queryClient = useQueryClient();



    const {
        register,
           formState,
           handleSubmit,
           reset,


       } = useForm<FormData>({
           defaultValues: {
               address: "",
               createdAt: formatDate(date),
               name: "",   
           }
       })


       const NewCustomer = useMutation({
        mutationFn: submitFormData,
        onError: (error) => {
                throw error;
        },
        onSuccess: () => {
            reset();
            setForm(false);
            queryClient.invalidateQueries({queryKey: ["GetStores"]});
            queryClient.invalidateQueries({queryKey: ["getActiveStorePage"]});
        },
    }); 
       const onSubmit = async (formData: any) => {
        try {

            NewCustomer.mutate(formData)
        } catch (error) {
            console.error('Mutation failed:', error);
        }
    };


    return (
        <div className=" form-div absolute h-[100%] w-[50%]  left-[40%] justify-center items-center">

        <form className="relative w-[100%] h-[65%] top-[8vh] flex flex-col justify-center items-center CompanyForm " onSubmit={handleSubmit(onSubmit)}>
            <label className="relative right-[3.6vw] w-[7vw] CompanyFormLabels">NAME</label>
            <input type="text" {...register("name" ,{required:true ,minLength:3})} onChange={(e) => {
                setName(e.target.value);
            }}/>
            <h1 className="CompanyForm-h1"></h1>
            <label className="relative right-[3.6vw] w-[7vw] CompanyFormLabels">PHONE NUMBER</label>
            <input type="text" {...register("phone")}/>
            <h1 className="CompanyForm-h1"></h1>
            <label className="relative right-[3.6vw] w-[7vw] CompanyFormLabels">ADDRESS</label>
            <input type="text" {...register("address")}/>
            <h1 className="CompanyForm-h1"></h1>
            <input style={{backgroundColor: formState.isValid?'#61AC68':'#d6d7d8'
            ,pointerEvents: formState.isValid?'auto':'none'
            ,position:"absolute"
            ,top:"32.5vh"
            , left:"13vw"
            ,borderRadius:"8px"
            ,color:"#FEFEFE"
            ,fontSize:"16px"
            ,transitionDuration:"0.2s"
            ,padding:"1.6vh 2.7vw"}} type="submit" value='ADD'/>

           </form>

        </div>
        
    )


}




const formatDate = (date: Date) => {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
}
