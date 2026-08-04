
import StartNowButton from "./StartNowButton";

const BuildSection = () => {
    return (
        <div
            className="py-25 px-6"
        >
            <div
                className="text-white flex flex-col gap-3 py-12.75 px-5 rounded-[12px]"
                style={{
                    background: `
                        radial-gradient(ellipse at 0% 10%, #e8a035 0%, transparent 50%),
                        radial-gradient(ellipse at 100% 100%, #1B17FF 0%, #0d0b99 30%, transparent 60%),
                        radial-gradient(ellipse at 60% 40%, #3a1550 0%, transparent 60%),
                        linear-gradient(330deg, #0a0030 0%, #1a0a18 33%, #1a0a18 50%, #1a0a18 66%, #2d1500 100%)
                    `,
                }}
            >
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
                        label="Start Now"
                    />
                </div>

            </div>

        </div>
    );
}

export default BuildSection;