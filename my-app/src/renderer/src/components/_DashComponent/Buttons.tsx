
import { Link } from 'react-router-dom';



export default  function Buttons({Button}): JSX.Element { 

  



  return (
    <nav>
    <div className="flex flex-col absolute w-[10.1vw] h-[25.6vh] top-[23.6vh] left-[0.7vw] ">
       <Link className='w-fit h-[5.7vh] mb-auto'  to={"/"}>
      <button   className="primary-btn img-1" style={{backgroundColor:Button===1?'#F7F5F7':'' }}><label>Dashboard</label></button>
      </Link> 
      <Link className='w-fit h-[5.7vh] mb-auto ' to={"/Orders"}>
      <button  className="primary-btn img-2" style={{backgroundColor:Button===2?'#F7F5F7':''  }}><label>Orders</label></button>
      </Link>
      
      <Link className='w-fit h-[5.7vh] mb-auto ' to={"/Customers"}>
      <button  className="primary-btn img-3" style={{backgroundColor:Button===3?'#F7F5F7':''  }}><label>Customers</label></button>
      </Link>
      <Link className='w-fit h-[5.7vh] mb-auto '  to={"/Stores"}>
      <button  className="primary-btn img-4" style={{backgroundColor:Button===4?'#F7F5F7':''  }}><label>Companies</label></button>
      </Link>
    </div>
    </nav>
  )
}

