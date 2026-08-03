import ProblemCardContainer from "./ProblemCardContainer";
import SectionTag from "./SectionTag";

const ProblemSection = () => {
    return (
        <section className="px-6 flex flex-col gap-15">
            <div className="flex flex-col items-center justify-center">
                <SectionTag label="THE PROBLEM" />
                <h2 className="tracking-[-0.32px] text-[32px] leading-9.5 text-center mt-3  lg:my-4 lg:text-[48px]">
                    Hiring Used to Mean Guessing
                </h2>
                <p className="text-neutral-700 text-[16px] text-center mt-1">
                    Hiring still begins with assumptions,
                    and AI has made those assumptions cheaper to fake.
                </p>
            </div>

            <div className="pb-25">
                <ProblemCardContainer />
            </div>

        </section>
    );
}

export default ProblemSection;