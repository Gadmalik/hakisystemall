import { Modal, NavBar } from "../components/Essential";
import { useState } from "react";

export function Welcome (){
    const [visibleModal, setVisibleModal] = useState(false);
    const hideModal = () => setVisibleModal(false);
    const action = () => setVisibleModal(true);
    return (
        <>
            <Modal
                data={{form:"formSignaler"}}
                title="Signaler un incident"
                setVisible={setVisibleModal}
                visible={visibleModal}
                hideModal={hideModal}
            />
            <NavBar action={action} />
            
            <section class="hero">
                <div class="hero-container">
                    <div class="hero-content">
                        <h1>Votre voix <span class="accent">compte</span></h1>
                        <p>Plateforme sécurisée de signalement et d'accompagnement juridique. Anonyme, gratuit et confidentiel.</p>
                        <div class="hero-buttons">
                            <button class="btn-hero" onClick={() => setVisibleModal(true)}>
                                <i class="fas fa-shield-alt"></i> Faire un signalement
                            </button>
                            <a href="#" class="btn-hero-outline">
                                <i class="fas fa-info-circle"></i> En savoir plus
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <section class="services">
                <div class="services-container">
                    <div class="service-card">
                        <i class="fas fa-shield-halved"></i>
                        <h3>Signalement anonyme</h3>
                        <p>Dénoncez en toute confidentialité</p>
                    </div>
                    <div class="service-card">
                        <i class="fas fa-scale-balanced"></i>
                        <h3>Conseil juridique</h3>
                        <p>Juristes partenaires disponibles</p>
                    </div>
                    <div class="service-card">
                        <i class="fas fa-hand-holding-heart"></i>
                        <h3>Soutien psychosocial</h3>
                        <p>Accompagnement psychologique</p>
                    </div>
                    <div class="service-card">
                        <i class="fas fa-robot"></i>
                        <h3>LegalBot HAKI</h3>
                        <p>Assistant IA 24h/24</p>
                    </div>
                </div>
            </section>

        </>
    )
} 