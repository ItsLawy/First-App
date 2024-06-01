import React, { useState, useEffect, useRef } from 'react';

interface AutocompleteProps {
    options: string[];
    value: string;
    placeholder: string;
    onChange: (value: string) => void;
    register: any;
    required: boolean; // Define the required prop
    validationSchema: any;
    name: string;
    errors: any;
    resetInput:boolean;
    setInput:any;

}



const Autocomplete: React.FC<AutocompleteProps> = ({
  options = [],
  value,
  placeholder,
  onChange,
  register,
  validationSchema,
  name,
  errors,
  required,
  resetInput,
 setInput

}) => {





  const autocomplete = useRef<HTMLDivElement>(null);

  const [optionsData, setOptionsData] = useState('' ? [''] : []);
  const [query, setQuery] = useState<string>(value);
  const [isShow, setIsShow] = useState<boolean>(false);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    if (resetInput) {
      setQuery('');
      setInput(!resetInput);  
    }
  }, [resetInput]);

  const handleInputChange = (v: string) => {
    setQuery(v);
    onChange(v);
    v === ''
      ? setOptionsData([])
      : setOptionsData(
          options.filter((x) => x.toLowerCase().includes(v.toLowerCase()))
        );
  };

  const handleClickOutSide = (e: MouseEvent) => {
    errors;
    required;
    if (autocomplete.current && !autocomplete.current.contains(e.target as Node)) {
      setIsShow(false);
    }
  };

  const hilightSearchText = (text: string) => {
    const pattern = new RegExp(`(${query})`, 'gi');
    const new_text = text.replace(pattern, `<b>${query}</b>`);
    return <div dangerouslySetInnerHTML={{ __html: new_text }} />;
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutSide);
    return () => {
      document.removeEventListener('mousedown', handleClickOutSide);
    };
  }, []);

  useEffect(() => {
    setIsShow(optionsData.length !== 0);
  }, [optionsData]);

  return (
    <>
    <div className='Auto-Complete min-w-[14.1vw] h-fit relative m-auto mb-0 flex flex-col' ref={autocomplete}>
      <input {...register(name,validationSchema)}  className='w-[14.1vw] h-[3.5vh] m-auto text-secondary focus:outline-none'
      type='text'
        placeholder={placeholder}
        value={query}
        onChange={(e) => handleInputChange(e.target.value)}
      />
      
      <h1 className='mt-[1.4vh]'></h1>
                
                
               
      {isShow && (
        <div className='Wrapper absolute z-10 bg-white w-full top-[3.7vh] border border-[#E0E0E0] rounded-[5px] max-h-[15vh] overflow-auto'>
          {optionsData.map((x, index) => (
            <button className='Auto-Complete-Change w-full h-8 p-[0.6vh_0.7vw] text-[#4F4F4F] hover:bg-[#e5f4ff] text-left transition duration-75'
              onClick={() => {  
                setQuery(x);
                setIsShow(false);
                onChange(x);
              }}
              key={index}
            >
             {hilightSearchText(x)}
            </button>   
          ))}
        </div>
      )}
     
    </div>
     </>
    
  );
};

export default Autocomplete;
  
