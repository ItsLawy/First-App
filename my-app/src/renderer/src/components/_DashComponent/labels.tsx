import Static from '../../public/Stats.svg';
import Order from '../../public/Order-List.svg';
import Company from '../../public/Company.svg';
import TopCustomer from '../../public/TopCustomer.svg';
export default  function Labels(): JSX.Element {

    return (
        <>
        <div className=' z-3'>
        <div className=' absolute w-fit h-[3vh] flex justify-center align-middle left-[15.7vw] top-[10.3vh] cursor-pointer animate-[500ms_fadeIn_forwards]'>
        <img src={Static} className='h-[24px] w-[24px] relative top-[-0.15vh]'/>
        <label className='text-[#464554] text-lg cursor-pointer relative left-[0.5vw]'>Overview</label>
      </div>        
      <div className=' absolute w-fit h-[3vh] flex justify-center align-middle left-[15.7vw] top-[32.3vh] cursor-pointer animate-[500ms_fadeIn_forwards]'>
        <img src={Order} className='h-[24px] w-[24px] relative top-[-0.15vh]'/>
        <label className='text-[#464554] text-lg cursor-pointer relative left-[0.5vw]'>New Orders</label>
      </div>
      <div className=' absolute w-fit h-[3vh] flex justify-center align-middle left-[73vw] top-[32.3vh] cursor-pointer animate-[500ms_fadeIn_forwards]'>
        <img src={TopCustomer} className='h-[24px] w-[24px] relative top-[-0.15vh]'/>
        <label className='text-[#464554] text-lg cursor-pointer relative left-[0.5vw]'>Top Customers</label>
      </div>
      <div className=' absolute w-fit h-[3vh] flex justify-center align-middle left-[15.7vw] top-[69vh] cursor-pointer animate-[500ms_fadeIn_forwards]'>
        <img src={Company} className='h-[24px] w-[24px] relative top-[-0.15vh]'/>
        <label className='text-[#464554] text-lg cursor-pointer relative left-[0.5vw]'>Top Companies</label>
      </div>
      </div>
        </>         
    ) 
  }