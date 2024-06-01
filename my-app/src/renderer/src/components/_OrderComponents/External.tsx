

export default function External({isStatus}): JSX.Element {
    return (
        <label className="w-[4vw] h-[3vh] text-lg text-center m-auto font-medium text-[14px]"style={{ color: isStatus === 'Paid' ? '#96CB9C' : (isStatus === 'Pending' ? '#febf19' : '#FF6347')}}>{isStatus}</label>
    )
}
