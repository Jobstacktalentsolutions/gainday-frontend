import sparkle from "@/assets/sparkle.svg";

const HeroSection = () => {
    return (
        <section className="px-6 pt-20 pb-10">
            <div>
                <div className="flex items-center justify-center gap-4 flex-col">
                    <p className="max-w-65 flex items-center justify-center text-[10px] text-primary-500 gap-x-2.5 px-1.5 py-2 border rounded-[6px] border-primary-500">
                        <img
                            src={sparkle}
                            alt="sparkle icon"
                            className="w-4.25 h-2.75"
                        />
                        THE PERFECT AI-ASSISTED TOOL FOR HIRING
                    </p>

                    <h2 className=" text-[40px] text-neutral-700 leading-12 tracking-tight text-center flex flex-col items-center justify-center ">
                        Stop Screening Applications. {" "} <br/>Start Screening
                        <span className="relative inline-flex items-center justify-center border-2 border-primary-500  px-4 py-1 text-primary-500 align-baseline mt-1.5">
                            <span className="absolute -top-1 -left-1 w-1.5 h-1.5  bg-primary-500 " />
                            <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-primary-500" />
                            <span className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-primary-500" />
                            <span className="absolute -bottom-1 -right-1 w-1.5 h-1.5 bg-primary-500 " />
                            Ability
                        </span>
                    </h2>
                </div>
            </div>
            <div>

            </div>

        </section>
    );
}

export default HeroSection;