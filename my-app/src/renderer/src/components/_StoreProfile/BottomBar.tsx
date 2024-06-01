import OrderTable from "./OrderTable"
import StatusHolder from "./StatusHolder"


export default function  BottomBar ({id}): JSX.Element {

    return (
        <div className=" relative w-[78.9vw] h-[36.1vh]  mt-auto flex">
            <OrderTable id={id} />
            <StatusHolder id={id} />
        </div>
    )
    
}