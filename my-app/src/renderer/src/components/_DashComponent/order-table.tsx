
import Dataholder from "./dataholder"
import RecentCustomers from "./RecentCustomers"



export default  function table(): JSX.Element {


  
    return (
      <div className="h-[fit] w-[78.5vw] absolute left-[14.6vw] top-[37.2vh] flex">

        
      <div className="Order-Table w-[49.3vw] h-[30vh] mr-auto flex flex-col bg-default rounded-2xl shadow-[2px_4px_4px_#68B6FF0D] items-center animate-[400ms_slideUp_forwards]">
        <div className="Label-Holder">
        <label>Customer</label>
        <label>Unit Price</label>
        <label>Amount</label>
        <label>Total</label>
        <label>Fabric</label>
        <label>Status</label>
        <label>Action</label>
        </div>
        <Dataholder/>
     

      </div>
      <RecentCustomers/>
      </div>
    )
  }