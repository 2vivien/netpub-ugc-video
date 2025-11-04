import React, { useState, useEffect } from 'react';
import useScreenWidth from '../hooks/useScreenWidth';

const PricingPlans: React.FC = () => {
  const screenWidth = useScreenWidth();
  const [currentIndex, setCurrentIndex] = useState(0); // Start with Plan ÉLAN (index 0)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % 3);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + 3) % 3);
  };

  return (
    <section className="pricing-plans-section">
      <div className="pricing-plans-container">
        <h2 className="pricing-plans-title">
          Choisissez l'expérience qui propulse votre image
        </h2>
        <p className="pricing-plans-subtitle">
          Des solutions pensées pour chaque vision
        </p>

        {screenWidth >= 769 ? (
          // Desktop: Grid statique
          <div className="pricing-plans-grid">
          {/* Plan ÉLAN */}
          <div className="pricing-card elan-card">
            <div className="pricing-badge elan-badge">
              <span>Débuter fort</span>
            </div>

            <div className="pricing-card-content">
              <h3>🌱 Plan ÉLAN</h3>
              <p>Pour poser les bases de votre image</p>

              <div className="pricing-features">
                <div className="feature-group">
                  <h4>🎬 Contenu :</h4>
                  <ul>
                    <li>2 vidéos UGC créées à partir de votre univers produit</li>
                    <li>3 photos produits professionnelles</li>
                    <li>1 influenceur assigné à votre marque</li>
                    <li>1 mini spot publicitaire vertical (Reel/TikTok)</li>
                  </ul>
                </div>


                <div className="feature-group">
                  <h4>📈 Stratégie & analyse :</h4>
                  <ul>
                    <li>Mini audit de votre marque et de votre audience</li>
                    <li>Accompagnement sur la stratégie de contenu</li>
                    <li>Gestion optionnelle des réseaux sociaux (publications + visuels)</li>
                    <li>Optimisation de la première campagne publicitaire</li>
                  </ul>
                </div>

                <div className="pricing-advantage">
                  <p><strong>✨ Avantage clé :</strong> Idéal pour les jeunes marques qui veulent lancer leur communication avec impact.</p>
                  <p><strong>Idéal pour :</strong> les e-commerçants, les entreprises locales et ceux qui débutent.</p>
                </div>
              </div>

              <button className="pricing-cta-button" onClick={() => {
                // Ouvrir le chatbot avec le contexte du plan ÉLAN
                const chatbotButton = document.querySelector('.chatbot-toggler') as HTMLElement;
                if (chatbotButton) {
                  chatbotButton.click();
                  // Attendre un peu puis envoyer le message contextuel
                  setTimeout(() => {
                    const event = new CustomEvent('chatbotContext', {
                      detail: { plan: 'ÉLAN', message: 'Je suis intéressé par le Plan ÉLAN' }
                    });
                    window.dispatchEvent(event);
                  }, 500);
                }
              }}>Choisir ce plan</button>
            </div>
          </div>

          {/* Plan MARQUE */}
          <div className="pricing-card marque-card popular">
            <div className="pricing-badge marque-badge">
              <span>Croissance & expansion</span>
            </div>
            <div className="popular-badge">
              <span>Populaire</span>
            </div>

            <div className="pricing-card-content">
              <h3>🎖️ Plan MARQUE</h3>
              <p>Pour développer votre notoriété</p>

              <div className="pricing-features">
                <div className="feature-group">
                  <h4>🎥 Contenu :</h4>
                  <ul>
                    <li>5 vidéos UGC orientées conversion</li>
                    <li>6 photos produits créatives</li>
                    <li>2 influenceurs dédiés selon votre niche</li>
                    <li>1 série complète de spots publicitaires cinématiques</li>
                    <li>Vidéos verticales multi-format (TikTok, Reels, YouTube Shorts, Meta)</li>
                  </ul>
                </div>


                <div className="feature-group">
                  <h4>📈 Stratégie & analyse :</h4>
                  <ul>
                    <li>Audit complet de votre marque</li>
                    <li>Stratégie marketing sur 3 mois</li>
                    <li>Gestion publicitaire sur Meta Ads + TikTok</li>
                    <li>Suivi mensuel des performances et ajustements</li>
                  </ul>
                </div>

                <div className="pricing-advantage">
                  <p><strong>✨ Avantage clé :</strong> parfait pour les marques qui veulent accélérer avec du contenu régulier, stylé et orienté résultats.</p>
                  <p><strong>Idéal pour :</strong> les marques en pleine croissance et en essor.</p>
                </div>
              </div>

              <button className="pricing-cta-button" onClick={() => {
                // Ouvrir le chatbot avec le contexte du plan MARQUE
                const chatbotButton = document.querySelector('.chatbot-toggler') as HTMLElement;
                if (chatbotButton) {
                  chatbotButton.click();
                  // Attendre un peu puis envoyer le message contextuel
                  setTimeout(() => {
                    const event = new CustomEvent('chatbotContext', {
                      detail: { plan: 'MARQUE', message: 'Je suis intéressé par le Plan MARQUE' }
                    });
                    window.dispatchEvent(event);
                  }, 500);
                }
              }}>Choisir ce plan</button>
            </div>
          </div>

          {/* Plan ENTREPRISE */}
          <div className="pricing-card entreprise-card">
            <div className="pricing-badge entreprise-badge">
              <span>Luxe & performance</span>
            </div>

            <div className="pricing-card-content">
              <h3>👑 Plan ENTREPRISE</h3>
              <p>Pour s'imposer durablement</p>

              <div className="pricing-features">
                <div className="feature-group">
                  <h4>🎬 Contenu :</h4>
                  <ul>
                    <li>10 vidéos UGC 4K premium</li>
                    <li>12 photos produits artistiques</li>
                    <li>3 influenceurs stratégiques selon votre audience</li>
                    <li>1 série complète de spots publicitaires cinématiques</li>
                    <li>Captation drone + motion design avancé</li>
                  </ul>
                </div>


                <div className="feature-group">
                  <h4>📈 Stratégie & analyse :</h4>
                  <ul>
                    <li>Audit approfondi de votre marque & de vos publicités</li>
                    <li>Stratégie marketing personnalisée sur 3 mois</li>
                    <li>Gestion publicitaire multi-plateforme (Meta, TikTok, Google)</li>
                    <li>Analyse comportementale de l'audience</li>
                    <li>Suivi hebdomadaire + optimisations continues</li>
                  </ul>
                </div>

                <div className="pricing-advantage">
                  <p><strong>✨ Avantage clé :</strong> une stratégie de contenu à la hauteur des grandes marques.</p>
                  <p><strong>Idéal pour :</strong> les grandes marques et les entreprises établies.</p>
                </div>
              </div>

              <button className="pricing-cta-button" onClick={() => {
                // Ouvrir le chatbot avec le contexte du plan ENTREPRISE
                const chatbotButton = document.querySelector('.chatbot-toggler') as HTMLElement;
                if (chatbotButton) {
                  chatbotButton.click();
                  // Attendre un peu puis envoyer le message contextuel
                  setTimeout(() => {
                    const event = new CustomEvent('chatbotContext', {
                      detail: { plan: 'ENTREPRISE', message: 'Je suis intéressé par le Plan ENTREPRISE' }
                    });
                    window.dispatchEvent(event);
                  }, 500);
                }
              }}>Choisir ce plan</button>
            </div>
          </div>
         </div>
        ) : (
          // Mobile: Carousel
          <div className="pricing-plans-mobile-carousel">
            <div className="pricing-plans-grid" style={{ transform: `translateX(-${currentIndex * 100}vw)` }}>
            {/* Plan ÉLAN */}
            <div className="pricing-card elan-card">
              <div className="pricing-badge elan-badge">
                <span>Débuter fort</span>
              </div>

              <div className="pricing-card-content">
                <h3>🌱 Plan ÉLAN</h3>
                <p>Pour poser les bases de votre image</p>

                <div className="pricing-features">
                  <div className="feature-group">
                    <h4>🎬 Contenu :</h4>
                    <ul>
                      <li>2 vidéos UGC créées à partir de votre univers produit</li>
                      <li>3 photos produits professionnelles</li>
                      <li>1 influenceur assigné à votre marque</li>
                      <li>1 mini spot publicitaire vertical (Reel/TikTok)</li>
                    </ul>
                  </div>


                  <div className="feature-group">
                    <h4>📈 Stratégie & analyse :</h4>
                    <ul>
                      <li>Mini audit de votre marque et de votre audience</li>
                      <li>Accompagnement sur la stratégie de contenu</li>
                      <li>Gestion optionnelle des réseaux sociaux (publications + visuels)</li>
                      <li>Optimisation de la première campagne publicitaire</li>
                    </ul>
                  </div>

                  <div className="pricing-advantage">
                    <p><strong>✨ Avantage clé :</strong> Idéal pour les jeunes marques qui veulent lancer leur communication avec impact.</p>
                    <p><strong>Idéal pour :</strong> les e-commerçants, les entreprises locales et ceux qui débutent.</p>
                  </div>
                </div>

                <button className="pricing-cta-button" onClick={() => {
                  // Ouvrir le chatbot avec le contexte du plan ÉLAN
                  const chatbotButton = document.querySelector('.chatbot-toggler') as HTMLElement;
                  if (chatbotButton) {
                    chatbotButton.click();
                    // Attendre un peu puis envoyer le message contextuel
                    setTimeout(() => {
                      const event = new CustomEvent('chatbotContext', {
                        detail: { plan: 'ÉLAN', message: 'Je suis intéressé par le Plan ÉLAN' }
                      });
                      window.dispatchEvent(event);
                    }, 500);
                  }
                }}>Choisir ce plan</button>
              </div>
            </div>

            {/* Plan MARQUE */}
            <div className="pricing-card marque-card popular">
              <div className="pricing-badge marque-badge">
                <span>Croissance & expansion</span>
              </div>
              <div className="popular-badge">
                <span>Populaire</span>
              </div>

              <div className="pricing-card-content">
                <h3>🎖️ Plan MARQUE</h3>
                <p>Pour développer votre notoriété</p>

                <div className="pricing-features">
                  <div className="feature-group">
                    <h4>🎥 Contenu :</h4>
                    <ul>
                      <li>5 vidéos UGC orientées conversion</li>
                      <li>6 photos produits créatives</li>
                      <li>2 influenceurs dédiés selon votre niche</li>
                      <li>1 série complète de spots publicitaires cinématiques</li>
                      <li>Vidéos verticales multi-format (TikTok, Reels, YouTube Shorts, Meta)</li>
                    </ul>
                  </div>


                  <div className="feature-group">
                    <h4>📈 Stratégie & analyse :</h4>
                    <ul>
                      <li>Audit complet de votre marque</li>
                      <li>Stratégie marketing sur 3 mois</li>
                      <li>Gestion publicitaire sur Meta Ads + TikTok</li>
                      <li>Suivi mensuel des performances et ajustements</li>
                    </ul>
                  </div>

                  <div className="pricing-advantage">
                    <p><strong>✨ Avantage clé :</strong> parfait pour les marques qui veulent accélérer avec du contenu régulier, stylé et orienté résultats.</p>
                    <p><strong>Idéal pour :</strong> les marques en pleine croissance et en essor.</p>
                  </div>
                </div>

                <button className="pricing-cta-button" onClick={() => {
                  // Ouvrir le chatbot avec le contexte du plan MARQUE
                  const chatbotButton = document.querySelector('.chatbot-toggler') as HTMLElement;
                  if (chatbotButton) {
                    chatbotButton.click();
                    // Attendre un peu puis envoyer le message contextuel
                    setTimeout(() => {
                      const event = new CustomEvent('chatbotContext', {
                        detail: { plan: 'MARQUE', message: 'Je suis intéressé par le Plan MARQUE' }
                      });
                      window.dispatchEvent(event);
                    }, 500);
                  }
                }}>Choisir ce plan</button>
              </div>
            </div>

            {/* Plan ENTREPRISE */}
            <div className="pricing-card entreprise-card">
              <div className="pricing-badge entreprise-badge">
                <span>Luxe & performance</span>
              </div>

              <div className="pricing-card-content">
                <h3>👑 Plan ENTREPRISE</h3>
                <p>Pour s'imposer durablement</p>

                <div className="pricing-features">
                  <div className="feature-group">
                    <h4>🎬 Contenu :</h4>
                    <ul>
                      <li>10 vidéos UGC 4K premium</li>
                      <li>12 photos produits artistiques</li>
                      <li>3 influenceurs stratégiques selon votre audience</li>
                      <li>1 série complète de spots publicitaires cinématiques</li>
                      <li>Captation drone + motion design avancé</li>
                    </ul>
                  </div>


                  <div className="feature-group">
                    <h4>📈 Stratégie & analyse :</h4>
                    <ul>
                      <li>Audit approfondi de votre marque & de vos publicités</li>
                      <li>Stratégie marketing personnalisée sur 3 mois</li>
                      <li>Gestion publicitaire multi-plateforme (Meta, TikTok, Google)</li>
                      <li>Analyse comportementale de l'audience</li>
                      <li>Suivi hebdomadaire + optimisations continues</li>
                    </ul>
                  </div>

                  <div className="pricing-advantage">
                    <p><strong>✨ Avantage clé :</strong> une stratégie de contenu à la hauteur des grandes marques.</p>
                    <p><strong>Idéal pour :</strong> les grandes marques et les entreprises établies.</p>
                  </div>
                </div>

                <button className="pricing-cta-button" onClick={() => {
                  // Ouvrir le chatbot avec le contexte du plan ENTREPRISE
                  const chatbotButton = document.querySelector('.chatbot-toggler') as HTMLElement;
                  if (chatbotButton) {
                    chatbotButton.click();
                    // Attendre un peu puis envoyer le message contextuel
                    setTimeout(() => {
                      const event = new CustomEvent('chatbotContext', {
                        detail: { plan: 'ENTREPRISE', message: 'Je suis intéressé par le Plan ENTREPRISE' }
                      });
                      window.dispatchEvent(event);
                    }, 500);
                  }
                }}>Choisir ce plan</button>
              </div>
            </div>
            </div>

            {/* Navigation buttons for mobile carousel */}
            <div className="carousel-navigation">
              <button className="carousel-nav-btn prev" onClick={prevSlide} aria-label="Plan précédent">
                ‹
              </button>
              <div className="carousel-indicators">
                {[0, 1, 2].map((index) => (
                  <button
                    key={index}
                    className={`indicator ${index === currentIndex ? 'active' : ''}`}
                    onClick={() => setCurrentIndex(index)}
                    aria-label={`Aller au plan ${index + 1}`}
                  />
                ))}
              </div>
              <button className="carousel-nav-btn next" onClick={nextSlide} aria-label="Plan suivant">
                ›
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PricingPlans;