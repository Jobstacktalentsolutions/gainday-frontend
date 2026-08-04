import CTAButton from "../solutionSection/CTAButton";
import StartNowButton from "./StartNowButton";

const BuildSection = () => {
    return (
        <div
            className="py-25 px-6"
        >
            <div className="bg-primary-500 text-white flex flex-col gap-3 py-12.75 px-5 rounded-[12px]">
                <h3 className="text-[32px] leading-9.5 tracking-[-0.32px]">
                    Built for Proof, not Paper.
                </h3>
                <p className="text-base leaading-6 text-neutral-200">
                    Show employers what you can actually do not just what your
                    CV says you've done. Try the live challenge and get on the
                    waitlist for what's next.
                </p>
                <div className="h-55 bg-white w-full rounded-[12px]">

                </div>
                <div>
                    <StartNowButton 
                    label = "Start Now"
                    />
                </div>

            </div>

        </div>
    );
}

export default BuildSection;