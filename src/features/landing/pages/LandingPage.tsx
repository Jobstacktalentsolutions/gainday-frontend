import { MotionConfig } from "motion/react";
import BuildSection from "../components/BuildSection/BuildSection";
import DevRouteLinks from "../components/devRouteLinks/DevRouteLinks";
import { Footer } from "../components/footer/Footer";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import HowItWorksSection from "../components/HowItWorksSection";
import LiveRolesSection from "../components/liveRoles/LiveRolesSection";
import { MarqueeStrip } from "../components/MarqueeStrip";
import ProblemSection from "../components/ProblemSection";
import SolutionSection from "../components/solutionSection/SolutionSection";
import { useScrollToHash } from "../utils/useScrollToHash";

const LandingPage = () => {
    useScrollToHash();

    return (
        // reducedMotion="user" makes every motion component on the page honour the OS setting
        <MotionConfig reducedMotion="user">
            <div className="bg-neutral-50">
                <Header />
                <main className="pt-24.25">
                    <HeroSection />
                    <div className="pb-25 pt-15 lg:pt-0">
                        <MarqueeStrip />
                    </div>
                    <ProblemSection />
                    <HowItWorksSection />
                    <SolutionSection />
                    <LiveRolesSection />
                    <BuildSection />
                    <Footer />
                    <DevRouteLinks />
                </main>
            </div>
        </MotionConfig>
    );
};

export default LandingPage;