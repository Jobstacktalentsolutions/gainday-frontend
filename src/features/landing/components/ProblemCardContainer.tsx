
import fileNotFoundIcon from "@/assets/file-not-found.svg";
import stackOverflowIcon from "@/assets/stackoverflow.svg";
import secureIcon from "@/assets/secure-window.svg";

interface cardDetails {
    title : string;
    description : string;
    icon : string;
}

const tempCardDetails: cardDetails[] = [
    {
        title: "Signals are weakening",
        description: "Tailored CVs and cover letters can be produced in seconds. Application quality no longer tracks capability.",
        icon: fileNotFoundIcon,
    },
    {
        title: "Volume is rising",
        description: "Recruiters face hundreds of near-identical, highly polished profiles per vacancy and screen on proxies.",
        icon: stackOverflowIcon,
    },
    {
        title: "Evidence evaporates",
        description: "Candidates prove themselves in assessments and interviews, then start from zero on the next application.",
        icon: secureIcon,
    }
]

const ProblemCardContainer = () => {

    return (
        <div className="">
            {tempCardDetails.map((card) => (
                <div className="rounded-[12px] border border-primary-200 py-9 px-6 flex flex-col">
                    <p className="rounded-[6px] border border-neutral-200 mb-4">
                        <img
                            src={card.icon}
                            alt={`${card.title} icon`}
                            className="w-6 h-6"
                        />
                    </p>
                    <h3 className="text-[24px] mb-2">
                        {card.title}
                    </h3>
                    <p className="text-base leading-6">
                        {card.description}
                    </p>

                </div>
            ))}
        </div>
    );
}

export default ProblemCardContainer;