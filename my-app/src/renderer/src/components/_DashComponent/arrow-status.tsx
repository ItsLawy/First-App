import Arrow_Up from '../../public/arrow-up.svg'
import Arrow_Down from '../../public/arrow-down.svg'
import Arrow_Equal from '../../public/Equal.svg'



props: {
    img: {
        type: String;
    }
    percentage:{
        type: String;
    }
}
export default  function Arrows({percentage,type}): JSX.Element {
  let img = '';

  if (percentage.length > 4) {
    percentage = percentage.slice(0,4);
}
  
  if(type === 'percentage') {
    checker();
    percentage= percentage.toString()+'%'
    percentage = percentage.replace('-', '')
  }
  else
  {
    checker();
  }
 
  
  function checker () {

    if (percentage > 0) {
      img = 'up'
     }
     else if  (percentage < 0) {
       img = 'down'
     }
     else {
       img = 'equal'
     }
  }



    const ImgSrc:any = img === 'up' ? Arrow_Up : img === 'down' ? Arrow_Down : Arrow_Equal;

    return (
      <>
      <div className='flex items-center justify-center h-[4.47vh] w-[fit] m-auto'>
      <img className='h-[24px] w-[24px]' src={ImgSrc}/>
        <label className='text-[16px]' style={{color:img==='up'?'#7cbe81':img==='down'?'#F75891':'#42b8d2'}}>{percentage}</label>
        </div>
      </>
     
      
    ) 
  }