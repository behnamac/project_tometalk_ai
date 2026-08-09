import LandingNavigation from "./LandingNavigation";
import HeroSection from "./HeroSection";
import DocumentReadingScene from "./DocumentReadingScene";
import KnowledgeScene from "./KnowledgeScene";
import ConversationScene from "./ConversationScene";
import UseCasesSection from "./UseCasesSection";
import CapabilitiesSection from "./CapabilitiesSection";
import FinalCTA from "./FinalCTA";

const LandingPage = () => {
    return (
        <div className="landing-dark min-h-screen bg-background text-foreground">
            <LandingNavigation />
            <main>
                <HeroSection />
                <DocumentReadingScene />
                <KnowledgeScene />
                <ConversationScene />
                <UseCasesSection />
                <CapabilitiesSection />
                <FinalCTA />
            </main>
        </div>
    );
};

export default LandingPage;
