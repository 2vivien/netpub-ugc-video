import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import PillNavBar from './components/PillNavBar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import About from './pages/About';
import Contact from './pages/Contact';
import LegalMentions from './pages/LegalMentions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Chatbot from './components/Chatbot';
import { ChatbotProvider } from './contexts/ChatbotContext';
import useScreenWidth from './hooks/useScreenWidth';

// This component scrolls the window to the top on every route change.
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  const screenWidth = useScreenWidth();
  const isMobile = screenWidth < 768;

  return (
    <ChatbotProvider>
      <Router>
        <ScrollToTop />
        {isMobile ? <PillNavBar /> : <Header />}
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/legal-mentions" element={<LegalMentions />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
          </Routes>
        </main>
        <Footer />
        <Chatbot />
      </Router>
    </ChatbotProvider>
  );
}

export default App;