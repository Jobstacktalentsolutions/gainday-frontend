import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import { MarqueeStrip } from "../components/MarqueeStrip";

const LandingPage = () => {
    return (
        <div className="bg-neutral-50">
            <Header />
            <main className="pt-24.25">
                <HeroSection />
                <div className="pt-15 pb-25 lg:pt-0">
                    <MarqueeStrip />
                </div>


            </main>

        </div>
    );
}

export default LandingPage;