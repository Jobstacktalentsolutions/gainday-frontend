import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import HowItWorksSection from "../components/HowItWorksSection";
import { MarqueeStrip } from "../components/MarqueeStrip";
import ProblemSection from "../components/ProblemSection";

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


            </main>

        </div>
    );
}

export default LandingPage;