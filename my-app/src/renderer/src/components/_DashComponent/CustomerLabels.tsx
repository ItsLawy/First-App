import CustomerPic from "./CustomerPhoto";

type customer = {
    id:string;
    name:string;
    phone:string;
    createdAt:Date;
    orders:any;
    UserBackground:string;
}

export default function CustomerLabels({ data }: { data: customer }): JSX.Element {
    
    let total = 0;
    data.orders.forEach((order:any) => {
        total += order.amount * order.price;
    });
    const formattedPrice = `$${total.toFixed(2)}`;
    
    return(
        <>
        <div className="Data-Holder-CustomerCard w-[19vw] min-h-[5.7vh] relative left-[0vw] flex  hover:bg-[#faf9f9] transition duration-150">
            <label className="flex text-nowrap">
                <CustomerPic ColorID={data.UserBackground} Name={data.name}/>
                {data.name}</label>
            <label className="Data-Holder-CustomerCard-Label-Order">{data.orders.length}</label>
            <label className="Data-Holder-CustomerCard-Label-Total">{formattedPrice}</label>

            <h1 className="w-[100%] h-[0.3vh] bg-[#f9f9f9] absolute top-[5.7vh]"  />
        </div>
        
        </>
    )

}