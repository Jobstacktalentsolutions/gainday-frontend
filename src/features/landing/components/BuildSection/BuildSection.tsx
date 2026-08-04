
import StartNowButton from "./StartNowButton";

const BuildSection = () => {
    return (
        <div
            className="py-25 px-6 lg:px-30"
        >
            <div
                className="text-white flex flex-col gap-3 py-12.75 px-5 rounded-[12px] lg:justify-between lg:w-full lg:flex-row lg:px-20 lg:items-center "
                style={{
                    background: `
                        radial-gradient(ellipse at 0% 10%, #e8a035 0%, transparent 50%),
                        radial-gradient(ellipse at 100% 100%, #1B17FF 0%, #0d0b99 30%, transparent 60%),
                        radial-gradient(ellipse at 60% 40%, #3a1550 0%, transparent 60%),
                        linear-gradient(330deg, #0a0030 0%, #1a0a18 33%, #1a0a18 50%, #1a0a18 66%, #2d1500 100%)
                    `,
                }}
            >
                <div className="flex flex-col gap-y-3 lg:w-[336px] lg:gap-6">
                    <h3 className="text-[32px] leading-9.5 tracking-[-0.32px] lg:text-[48px] lg:tracking-[-0.48px] lg:leading-14.5">
                        Built for Proof, not Paper.
                    </h3>
                    <p className="text-base leaading-6 text-neutral-200">
                        Show employers what you can actually do not just what your
                        CV says you've done. Try the live challenge and get on the
                        waitlist for what's next.
                    </p>
                    <div className="hidden lg:block">
                        <StartNowButton
                            label="Start Now"
                        />
                    </div>

                </div>

                <div className="h-55 bg-white w-full rounded-[12px] lg:max-w-[499px] lg:h-[346px]">

                </div>
                <div className="lg:hidden ">
                    <StartNowButton
                        label="Start Now"
                    />
                </div>

            </div>

        </div>
    );
}

export default BuildSection;