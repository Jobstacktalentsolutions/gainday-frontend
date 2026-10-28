import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { fadeUp } from "@/lib/motion/variants";
import { useTryChallengePath } from "../../utils/useTryChallengePath";
import StartNowButton from "./StartNowButton";

const BuildSection = () => {
    const navigate = useNavigate();
    const tryChallengePath = useTryChallengePath();
    const start = () => navigate(tryChallengePath);

    return (
        <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            className="px-6 py-25 lg:px-30"
        >
            <div
                className="flex flex-col gap-6 rounded-xl px-5 py-12.75 text-white lg:w-full lg:flex-row lg:items-center lg:justify-between lg:px-20"
                style={{
                    background: `
                        radial-gradient(ellipse at 0% 10%, #e8a035 0%, transparent 50%),
                        radial-gradient(ellipse at 100% 100%, #1B17FF 0%, #0d0b99 30%, transparent 60%),
                        radial-gradient(ellipse at 60% 40%, #3a1550 0%, transparent 60%),
                        linear-gradient(330deg, #0a0030 0%, #1a0a18 33%, #1a0a18 50%, #1a0a18 66%, #2d1500 100%)
                    `,
                }}
            >
                <div className="flex flex-col gap-y-3 lg:w-84 lg:gap-6">
                    <h2 className="heading-2">Built for Proof, not Paper.</h2>
                    <p className="text-base leading-6 text-neutral-200">
                        Show employers what you can actually do not just what your CV says you&rsquo;ve done.
                        Try the live challenge and get on the waitlist for what&rsquo;s next.
                    </p>
                    <div className="hidden lg:block">
                        <StartNowButton label="Start Now" onClick={start} />
                    </div>
                </div>

                <div className="h-55 w-full overflow-hidden rounded-xl bg-white/10 ring-1 ring-white/20 lg:h-86.5 lg:max-w-124.75">
                    <img
                        src="/images/landing/cta.png"
                        alt="A smiling professional working on a laptop"
                        width={500}
                        height={346}
                        loading="lazy"
                        className="size-full object-cover"
                    />
                </div>

                <div className="lg:hidden">
                    <StartNowButton label="Start Now" onClick={start} />
                </div>
            </div>
        </motion.div>
    );
};

export default BuildSection;