




export default function LabelCounters({orders}): JSX.Element {
    return (
        <div className="w-[6vw] h-[3vh] relative ml-auto mr-2  justify-end flex ">
            <div className=" w-[1.8vw] h-[2.3vh] relative right-2 bg-[#E9EFFF] text-[#5D86FC] rounded-xl items-center justify-center flex">{orders}</div>
        </div>

    )   
}