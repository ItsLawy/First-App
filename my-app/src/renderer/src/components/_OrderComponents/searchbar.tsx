import Search from './../../public/Search.svg';
import { useEffect } from 'react';
import {motion} from 'framer-motion';
  const searchBar = ({data,setOrders,searchTerm,setSearchTerm}) => { 

   
  
  
    useEffect(() => {
      const results = data.filter(order =>
        Object.values(order).some(val => {
          if (typeof val === 'object' && val !== null) {
            // If the value is an object, check its nested properties
            return Object.values(val).some(nestedVal =>
              nestedVal?.toString().toLowerCase().includes(searchTerm)
            );
          }
          // Otherwise, check the top-level properties
          return val?.toString().toLowerCase().includes(searchTerm);
        })
      );
      setOrders(results);
    },[data, searchTerm]);
   
    
    
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
     
      const term = event.target.value.toLowerCase();
      setSearchTerm(term);
      const results = data?.filter(order =>
        Object.values(order).some(val => {
          if (typeof val === 'object' && val !== null) {
            // If the value is an object, check its nested properties
            return Object.values(val).some(nestedVal =>
              nestedVal?.toString().toLowerCase().includes(term)
            );
          }
          // Otherwise, check the top-level properties
          return val?.toString().toLowerCase().includes(term);
        })
      );
      results
      
    };
   
 

    return (
    <>
      <motion.div className="animate-me w-[18.6vw] h-[4vh] bg-default rounded-[8px]">
        <img src={Search} className='absolute h-7 w-7 top-1 left-1' />
        <input onChange={handleSearch}  className="bg-default w-[16.2vw] h-[3.4vh] absolute top-[0.3vh] left-[1.96vw] focus:outline-none text-secondary " type="search" placeholder='Search anything...'  />

      </motion.div> 
    </>
    
    ) 
  }

export default searchBar;