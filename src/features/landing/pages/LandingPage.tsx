import BuildSection from "../components/BuildSection/BuildSection";
import FAQSection from "../components/FAQSection/FAQSection";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import HowItWorksSection from "../components/HowItWorksSection";
import LiveRolesSection from "../components/liveRoles/LiveRolesSection";
import { MarqueeStrip } from "../components/MarqueeStrip";
import ProblemSection from "../components/ProblemSection";
import SolutionSection from "../components/solutionSection/SolutionSection";

const LandingPage = () => {
    return (
        <div className="bg-neutral-50">
            <Header />
            <main className="pt-24.25">
                <HeroSection />
                <div className="pt-15 pb-25 lg:pt-0">
                    <MarqueeStrip />
                </div>
                <div>
                    <ProblemSection />
                </div>
                <div>
                    <HowItWorksSection />
                </div>
                <div>
                    <SolutionSection />
                </div>
                <div>
                    <LiveRolesSection />
                </div>
                <div>
                    <FAQSection />
                </div>
                <div>
                    <BuildSection />
                </div>


            </main>

        </div>
    );
}

export default LandingPage;