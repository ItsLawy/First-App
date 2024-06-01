import { useContext } from "react"
import { FormContext } from "../../Customers"
import { motion,AnimatePresence } from "framer-motion"
import FormPhoto from "./FormPhoto"
import Autocomplete from "../_DashComponent/AutoComplete"
import { useState,useEffect } from "react";
import { useForm } from "react-hook-form"
import { useQuery,useMutation,useQueryClient } from "@tanstack/react-query";
const { ipcRenderer } = require('electron')

const date = new Date();
type FormData = {
    user: string;
    address: string;
    createdAt: string;
    phone: string;
    company: string;
}
export default function CustomerForm (): JSX.Element {

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
            <FormPhoto Name={name} ColorID="1" />
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

const fetchUsers = async () => {
    return await ipcRenderer.invoke('fetch-orders');
};

const submitFormData = async (formData: FormData): Promise<void> => {
    
    try {
        // Send data via ipcRenderer
     await ipcRenderer.invoke('add-customer', formData);
    } catch (error) {   
        // Handle errors
        console.error('Mutation failed:', error);
        throw error;
    }
};


function  Form ({setName,setForm}){

const [companyNames, setCompanyNames] = useState<string[]>([]); // Specify string[] as the type
const { data: ordersData, isLoading, isError } = useQuery({queryKey: ["orders"], queryFn: fetchUsers});
const queryClient = useQueryClient();
const [empty, isEmpty] = useState(false);
useEffect(() => {
    if (!isLoading && !isError && ordersData) {
        const companyNamesSet = new Set<string>(); // Specify string as the type

        ordersData.forEach((order) => {
            companyNamesSet.add(order.company.name);
        });

        setCompanyNames(Array.from(companyNamesSet));
    }
}, [ordersData, isLoading, isError]);



    const {
        register,
           formState,
           handleSubmit,
           reset,
           setValue,


       } = useForm<FormData>({
           defaultValues: {
               user: "",
               address: "",
               createdAt: formatDate(date),
               company: "",    
           }
       });
       const { errors } = formState;


       const NewCustomer = useMutation({
        mutationFn: submitFormData,
        onError: (error) => {
                throw error;
        },
        onSuccess: () => {
            isEmpty(true);
            reset();
            setForm(false);
            queryClient.invalidateQueries({queryKey: ["CustomerData"]});
            queryClient.invalidateQueries({queryKey: ["getActivePage"]});
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

        <form className="relative w-[100%] h-[65%] top-[8vh] flex flex-col justify-center items-center " onSubmit={handleSubmit(onSubmit)}>
            <label className="relative right-[3.6vw] w-[7vw]">NAME</label>
            <input type="text" {...register("user" ,{required:true ,minLength:3})} onChange={(e) => {
                setName(e.target.value);
            }}/>
            <h1 className="CustomerForm-h1"></h1>
            <label className="relative right-[3.6vw] w-[7vw]">PHONE NUMBER</label>
            <input type="text" {...register("phone")}/>
            <h1 className="CustomerForm-h1"></h1>
            <label className="relative right-[3.6vw] w-[7vw]">COMPANY</label>
            <Autocomplete setInput={isEmpty} resetInput={empty} required name="company" options={companyNames} placeholder="" value={''} register={register} errors={errors} validationSchema={{required:true,minLength: {value: 3}}} onChange={(value) => {
                setValue('company',value);
            }}/>
            <label className="relative right-[3.6vw] w-[7vw]">ADDRESS</label>
            <input type="text" {...register("address")}/>
            <h1 className="CustomerForm-h1"></h1>
            <input style={{backgroundColor: formState.isValid?'#68B6FF':'#d6d7d8'
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
