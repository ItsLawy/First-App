import { useForm } from "react-hook-form"
import { useMutation ,useQuery,useQueryClient } from '@tanstack/react-query';
import Autocomplete from "@renderer/components/_DashComponent/AutoComplete";
import { useState,useEffect } from "react";
import { useContext } from "react";
import { ShowContextAllOrders } from "@renderer/Orders"; 
import { AllDataContext } from "@renderer/Orders";
import { motion } from "framer-motion";
const { ipcRenderer } = require('electron')

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



export default  function editForm(): JSX.Element {

    const [checked, setChecked] = useState('radio-1');
    const {AllData} = useContext(AllDataContext); 
    useEffect(() => {   
        if (AllData === undefined) {
            return;
        }
        setValue('Amount', AllData.Amount);
        setValue('Price', AllData.Price);
        setValue('CreatedAt', formatDate(AllData.CreatedAt));
        setValue('User', AllData.User);
        setValue('Company', AllData.Company);
        setValue('FabricType', AllData.FabricType);
        setValue('Unit', AllData.Unit);
        setValue('Status', AllData.Status);
        setValue('OrderID', AllData.OrderID);
        AllData.Status === 'Pending' ? setChecked('radio-1') : AllData.Status === 'Paid' ? setChecked('radio-3') : setChecked('radio-2');
    }, [AllData]);

    const queryClient = useQueryClient();
    const [dataNames, setDataNames] = useState<string[]>([]); // Specify string[] as the type
    const [companyNames, setCompanyNames] = useState<string[]>([]); // Specify string[] as the type
    const [fabricType, setFabricType] = useState<string[]>([]); // Specify string[] as the type
    const [empty, isEmpty] = useState(false);
    const {setVisiableAll} = useContext(ShowContextAllOrders);
    const GetAllData =  useQuery({queryKey: ["fetch-All"], queryFn: fetchAll});
    useEffect(() => {

        const data = GetAllData.data as { 
            users: { name: string }[]; 
            companies: { name: string }[]; 
            fabricType: { fabricType: string }[]; 
            // Add other properties as needed 
          };

        if (GetAllData.isSuccess && GetAllData.data!==undefined) {
            const dataNamesSet = new Set<string>(); // Specify string as the type
            const companyNamesSet = new Set<string>(); // Specify string as the type
            const fabricTypeSet = new Set<string>(); // Specify string as the type
            data.users.forEach((user) => {
                dataNamesSet.add(user.name);
            });

            data.companies.forEach((company) => {
                companyNamesSet.add(company.name);
            }
            );

            data.fabricType.forEach((fabric) => {
                fabricTypeSet.add(fabric.fabricType);

            });
            setDataNames(Array.from(dataNamesSet));
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
            defaultValues: 
            {
                User: '',
                Company: '',
                Amount: 0,
                Price: 0,
                FabricType: '',
                Unit: '',
                Status: '',
                CreatedAt: '',
            }
        });
        const { errors } = formState;

        const NewOrder = useMutation({
            mutationFn: submitFormData,
            onError: (error) => {
                    throw error;
            },
            onSuccess: () => {
                setVisiableAll(false);
                isEmpty(!empty);
                reset();
                queryClient.refetchQueries({queryKey: ['orders']});
                queryClient.refetchQueries({queryKey: ['Status']});
                queryClient.refetchQueries({queryKey: ['Percentage']});
                queryClient.refetchQueries({queryKey: ['Company']});
                queryClient.refetchQueries({queryKey: ['allOrders']});
                queryClient.refetchQueries({queryKey: ['fetch-All']});
                queryClient.refetchQueries({queryKey: ['TopCustomers']});
                queryClient.refetchQueries({queryKey: ['GetStoreInfo']});

            },
        }); 
    
        
        const onSubmit = async (formData: any) => {
            try {

                const formattedForData = trimObjectValues(formData);
                const Keys1 = Object.keys(formattedForData);

                for (const key of Keys1) {
                    if (formattedForData[key] !== AllData[key]) {
                        NewOrder.mutate(formData);
                        return;
                    }
                  }
                  setVisiableAll(false);
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
      <div className="form-div absolute w-[34.8vw] h-[39.7vh] bg-default rounded-lg left-[64.1vw] top-[8.9vh] shadow-[0px_4px_23.8px_7px_#68B6FF1C] z-[1]">
        <form className="relative w-[100%] h-[100%] flex" onSubmit={handleSubmit(onSubmit)}>



            <div className="form-box-1 relative h-[32.1vh] w-[14.1vw]  flex flex-col mr-auto ml-auto top-[3.5vh]">
                
                
            <label >NAME</label>
            <Autocomplete setInput={isEmpty} resetInput={empty} required name="User" options={dataNames} placeholder="" value={AllData.User|| ""} register={register} errors={errors} validationSchema={{required:true,minLength:{value: 3}}} onChange={(value) => {
          // Manually set value to the form field
          setValue('User', value, { shouldValidate: true});
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

                    
                    
                    
                
            <label >FABRIC</label>
            <Autocomplete setInput={isEmpty} resetInput={empty} required name="FabricType" options={fabricType} placeholder="" value={AllData.FabricType || ""} register={register} errors={errors} validationSchema={{required:true,minLength: {value: 3}}} onChange={(value) => {
          // Manually set value to the form field
          setValue('FabricType', value, { shouldValidate: true});
        }}/>

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
                                            <div className="tabs flex w-[14vw] ">
                                                    <motion.span style={{backgroundColor:checked==='radio-1'?'#fcf4d5': checked==='radio-3'?'#ebffe4':'#f2d9d9'}} className="glider"
                                                    animate={{ x: checked === 'radio-1' ? 0 : checked === 'radio-3' ? 80: 163 }}
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
            
            
            
         
           
           
                      
            <label >COMPANY</label>
            <Autocomplete setInput={isEmpty} resetInput={empty} required name="Company" options={companyNames} placeholder="" value={AllData.Company || ""} register={register} errors={errors} validationSchema={{required:true,minLength: {value: 3}}} onChange={(value) => {
          // Manually set value to the form field
          setValue('Company', value, { shouldValidate: true});
        }}/>

            </div>

            <input style={{backgroundColor: formState.isValid?'#febf19':'#d6d7d8'
            ,pointerEvents: formState.isValid?'auto':'none'
            , position:"absolute"
            ,top:"29.9vh"
            , left:"23vw"
            ,borderRadius:"8px"
            ,color:"#FEFEFE"
            ,fontSize:"16px"
            ,transitionDuration:"0.2s"
            ,padding:"1.6vh 2.7vw"}} type="submit" value='UPDATE'/>

            <div className=" absolute left-[30vw] top-[16.7vh] h-[3.5vh] w-fit ">
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