import Header from "../components/Header";
import HeroSection from "../components/HeroSection";

const LandingPage = () => {
    return (
        <div className="bg-neutral-50">
            <Header />
            <main className="pt-24.25">
                <HeroSection />

            </main>

        </div>
    );
}

export default LandingPage;