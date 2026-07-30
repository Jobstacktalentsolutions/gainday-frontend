

export interface StatCardProps {
    label : string;
    value : string | number;
}


const StatCard = ( {label, value} : StatCardProps)=> {
    return(
        <div className = "flex flex-1 flex-col gap-2 rounded-lg border border-neutral-200 bg-white p-5">
            <p className = "text-[13px] font-medium text-neutral-500">{label}</p>
            <p className="text-[32px] font-semibold text-neutral-900">{value}</p>
        </div>
    );
}

export default StatCard;