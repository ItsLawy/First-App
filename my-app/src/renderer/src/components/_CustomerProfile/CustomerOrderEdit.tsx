import { useForm } from "react-hook-form"
import { useMutation ,useQuery,useQueryClient } from '@tanstack/react-query';
import Autocomplete from "../_DashComponent/AutoComplete";
import { useState,useEffect } from "react";
import { DataContextCustomer,ShowContextCustomer } from "@renderer/CustomerProfile";
import { motion } from "framer-motion";
import { useContext } from "react";
const { ipcRenderer } = require('electron')
const date = new Date();

type DataType  = {
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
const submitFormData = async (formData: FormData): Promise<void> => {


    
    
    try {
        console.log(formData);
        // Send data via ipcRenderer
      await ipcRenderer.invoke('edit-order', formData);
    } catch (error) {   
        // Handle errors
        console.error('Mutation failed:', error);
        throw error;
    }
};

const fetchAll = async () => {
    return await ipcRenderer.invoke('fetch-All');
};



export default  function CustomerAddForm(): JSX.Element {
    const queryClient = useQueryClient();
    const [companyNames, setCompanyNames] = useState<string[]>([]); // Specify string[] as the type
    const [fabricType, setFabricType] = useState<string[]>([]); // Specify string[] as the type
    const {DataCustomer} = useContext(DataContextCustomer);
    const [empty, isEmpty] = useState(false);
    const {isCustomerVisible} = useContext(ShowContextCustomer);
    const [checked, setChecked] = useState('radio-1');
    const GetAllData =  useQuery({queryKey: ["fetch-All"], queryFn: fetchAll});


    useEffect(() => {   
        if (DataCustomer === undefined) {
            return;
        }
        setValue('Amount', DataCustomer.Amount);
        setValue('Price', DataCustomer.Price);
        setValue('CreatedAt', formatDate(DataCustomer.CreatedAt));
        setValue('User', DataCustomer.User);
        setValue('Company', DataCustomer.Company);
        setValue('FabricType', DataCustomer.FabricType);
        setValue('Unit', DataCustomer.Unit);
        setValue('Status', DataCustomer.Status);
        setValue('OrderID', DataCustomer.OrderID);
        DataCustomer.Status === 'Pending' ? setChecked('radio-1') : DataCustomer.Status === 'Paid' ? setChecked('radio-3') : setChecked('radio-2');
    }, [DataCustomer]);


    useEffect(() => {

        const data = GetAllData.data as { 
            users: { name: string }[]; 
            companies: { name: string }[]; 
            fabricType: { fabricType: string }[]; 
            // Add other properties as needed 
          };

        if (GetAllData.isSuccess && GetAllData.data!==undefined) {
            const companyNamesSet = new Set<string>(); // Specify string as the type
            const fabricTypeSet = new Set<string>(); // Specify string as the type

            data.companies.forEach((company) => {
                companyNamesSet.add(company.name);
            }
            );

            data.fabricType.forEach((fabric) => {
                fabricTypeSet.add(fabric.fabricType);

            });
            setCompanyNames(Array.from(companyNamesSet));
            setFabricType(Array.from(fabricTypeSet));
        }
    }, [GetAllData.isSuccess, GetAllData.data]);



    const {
         register,
            formState,
            handleSubmit,
            reset,
            setValue,


        } = useForm<DataType>({
            defaultValues: {
                User: '',
                Company: '',
                Amount: 0,
                Price: 0,
                FabricType: '',
                Unit: '',
                Status: '',
                CreatedAt: formatDate(date),
            },
            mode: 'onBlur',
            reValidateMode: 'onChange',
            criteriaMode: 'firstError',
            shouldFocusError: true,
            shouldUnregister: true,
            
        });
        const { errors } = formState;

        const NewOrder = useMutation({
            mutationFn: submitFormData,
            onError: (error) => {
                    throw error;
            },
            onSuccess: () => {
                isEmpty(!empty);
                reset();
                queryClient.refetchQueries({queryKey: ['CustomerStatus']});
                queryClient.refetchQueries({queryKey: ['CustomerOverview']});
                queryClient.refetchQueries({queryKey: ['Customer']});
                queryClient.refetchQueries({queryKey: ['fetch-All']});

            },
        }); 
    
        
        const onSubmit = async (formData: any) => {
            try {

                const formattedForData = trimObjectValues(formData);
                const Keys1 = Object.keys(formattedForData);

                for (const key of Keys1) {
                    if (formattedForData[key] !== DataCustomer[key]) {
                        NewOrder.mutate(formData);
                        return;
                    }
                  }
                  isCustomerVisible(false);
                  isEmpty(!empty);
                    reset();
            } catch (error) {
                console.error('Mutation failed:', error);
            }
        };

        const handleTabChange = (value) => {
            value === 'radio-1' ? setChecked('radio-1') : value === 'radio-3' ? setChecked('radio-3') : setChecked('radio-2');
            value === 'radio-1' ? setValue('Status','Pending') : value === 'radio-3' ? setValue('Status','Paid') : setValue('Status','Cancelled');
          };

    return (
      <>
      <div className="form-div absolute w-[34.8vw] h-[39.7vh] bg-default rounded-lg right-[3vw] bottom-[51vh] shadow-[0px_4px_23.8px_7px_#68B6FF1C] z-[999]">
        <form className="relative w-[100%] h-[100%] flex" onSubmit={handleSubmit(onSubmit)}>



            <div className="form-box-1 relative h-[23.7vh] w-[14.1vw]  flex flex-col mr-auto ml-auto top-[3.5vh]">
                 
                      
            <label >COMPANY</label>
            <Autocomplete setInput={isEmpty} resetInput={empty} required name="Company" options={companyNames} placeholder="" value={DataCustomer.Company} register={register} errors={errors} validationSchema={{required:true,minLength: {value: 3}}} onChange={(value) => {
          // Manually set value to the form field
          setValue('Company', value, { shouldValidate: true});
        }}/>

                    
                
         

            <label >AMOUNT</label>

            <input type="number" step=".01"{...register("Amount" ,{required:true ,valueAsNumber:true})} />
            {errors.Amount ? (
                <h1 style={{ backgroundColor:"#FF6D6D"}}>
                    <p className="text-[12px] text-[#FF6D6D]">Please insert a proper amount</p>
                </h1>

                ) : (
                <h1></h1>
                )}

        
        

                      <label >DATE</label>
                <input type="date" {...register("CreatedAt" ,{required:true})} />
                {errors.CreatedAt ? (
                <h1 style={{ backgroundColor:"#FF6D6D"}}>
                    <p className="text-[12px] text-[#FF6D6D]">Please type a proper address</p>
                </h1>

                ) : (
                <h1></h1>
                )}

               
        

            </div>

            <div className="form-box-2 relative h-[23.7vh] w-[14.1vw] flex flex-col ml-auto mr-auto top-[3.8vh]">

            <label >STATUS</label>
               <div className="w-[14.1vw] h-[3.5vh] m-auto  flex ">
                        <div className="container">
                            <div className="tabs-edit flex  justify-between">
                                    <motion.span style={{backgroundColor:checked==='radio-1'?'#fcf4d5': checked==='radio-3'?'#ebffe4':'#f2d9d9'}} className="glider"
                                    animate={{ x: checked === 'radio-1' ? 0 : checked === 'radio-3' ? 95: 190 }}
                                    transition={{ duration: 0.15 }}

                                    ></motion.span>
                                <div className="  flex justify-center items-center h-[3vh] w-[4.2vw] rounded-[99px] " onClick={()=>{handleTabChange('radio-1')}}>
                                <label style={{color:checked==='radio-1'?'#fcbd21':'#fcde8e'}} className="tab z-10">Pending</label>
                                <input type="radio" id="radio-1"  checked={checked==='radio-1'} {...register("Status")} value={"Pending"} />
                                </div>
                                
                                <div className="  flex justify-center items-center h-[3vh] w-[4.2vw] rounded-[99px] " onClick={()=>{handleTabChange('radio-3')}}>
                                <input  type="radio" id="radio-3" checked={checked==='radio-3'}{...register("Status")} value={"Paid"} />
                                <label style={{color:checked==='radio-3'?'#79be79':'#a4d49c'}} className="tab z-10" >Paid</label>
                                </div>

                                <div className="  flex justify-center items-center h-[3vh] w-[4.2vw] rounded-[99px] " onClick={()=>{handleTabChange('radio-2')}}>
                                <input  type="radio" id="radio-2" checked={checked==='radio-2'}{...register("Status")} value={"Cancelled"} />
                                <label style={{color:checked==='radio-2'?'#cc3636':'#e48c8c'}} className="tab z-10" >Cancelled</label>
                                </div>

                                
                                

      
                                
                                
                        
                            </div>
                           
                    </div>
                </div>
                      
                      
            <label >UNIT PRICE</label>
            <input className="unit" type="number" step=".01" {...register("Price" ,{required:true , valueAsNumber:true})} />
            {errors.Price ? (
                <h1 className="unit-h1 " style={{ backgroundColor:"#FF6D6D"}}>
                    <p className="text-[12px] text-[#FF6D6D]">Please insert a value.</p>
                </h1>

                ) : (
                <h1 className="unit-h1"></h1>
                )}
            
            
            
         
            <label >FABRIC</label>
            <Autocomplete setInput={isEmpty} resetInput={empty} required name="FabricType" options={fabricType} placeholder="" value={DataCustomer.FabricType} register={register} errors={errors} validationSchema={{required:true,minLength: {value: 3}}} onChange={(value) => {
          // Manually set value to the form field
          setValue('FabricType', value, { shouldValidate: true});
        }}/>
           
           
            </div>

            <input style={{backgroundColor: formState.isValid?'#febf19':'#d6d7d8'
            ,pointerEvents: formState.isValid?'auto':'none'
            , position:"absolute"
            ,top:"29.9vh"
            , left:"25vw"
            ,borderRadius:"8px"
            ,color:"#FEFEFE"
            ,fontSize:"16px"
            ,transitionDuration:"0.2s"
            ,padding:"1.6vh 2.7vw"}} type="submit" value='UPDATE'/>

            <div className=" absolute left-[30vw] top-[16.5vh] h-[3.5vh] w-fit ">
            <input className="unit-type" {...register("Unit" ,{required:true ,maxLength:6})} />
            <h1 className="unit-type-h1"></h1> 
            </div>  
                           
        </form>
        

      </div>
      
      </>
      
    ) 
  }


  function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
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