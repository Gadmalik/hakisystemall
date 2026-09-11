import { useState } from "react";
import { Header, Modal } from "../components/Essential"

export function WaitingPage() {
    return (
        <>
            <Header title="Tableau de Bord" />
            <main class="pending-container">

                <div class="pending-card">
                    <div class="pending-icon-wrapper">
                        <div class="pulse-ring"></div>
                        <div class="icon-circle">
                            <i class="fa-solid fa-hourglass-half"></i>
                        </div>
                    </div>

                    <div class="pending-header">
                        <h2>Validation de votre compte en cours</h2>
                        <p>Merci de votre inscription ! Un administrateur examine actuellement vos informations avant d'activer votre accès complet.</p>
                    </div>

                    <div class="status-timeline">
                        <div class="timeline-step completed">
                            <div class="step-icon"><i class="fa-solid fa-check"></i></div>
                            <div class="step-text">Inscription</div>
                        </div>
                        <div class="timeline-line active"></div>
                        <div class="timeline-step active">
                            <div class="step-icon"><i class="fa-solid fa-user-clock"></i></div>
                            <div class="step-text">Revue Admin</div>
                        </div>
                        <div class="timeline-line"></div>
                        <div class="timeline-step">
                            <div class="step-icon"><i class="fa-solid fa-circle-check"></i></div>
                            <div class="step-text">Accès Activé</div>
                        </div>
                    </div>

                    <div class="info-alert">
                        <i class="fa-solid fa-circle-info info-icon"></i>
                        <div>
                            <strong>Quelles sont les prochaines étapes ?</strong>
                            <p>Un e-mail de confirmation vous sera envoyé dès que votre compte sera approuvé. Le délai habituel de traitement est de 24h ouvrées.</p>
                        </div>
                    </div>

                    <div class="pending-actions">
                        <button class="btn-primary-action" id="checkStatusBtn">
                            <i class="fa-solid fa-rotate-right" id="refreshIcon"></i>
                            Vérifier le statut
                        </button>
                        <a href="#" class="btn-secondary-action">
                            <i class="fa-solid fa-headset"></i>
                            Contacter le support
                        </a>
                    </div>

                    <div class="pending-footer">
                        <p>Besoin de modifier vos informations d'inscription ? <a href="#">Accéder à mon profil</a></p>
                    </div>

                </div>
            </main>
        </>
    )
}

export function WaitingOrgPage() {
    const [visibleModal, setVisibleModal] = useState(false);
    
    return (
        <div>
            <Header title="Tableau de Bord" />
            <Modal visible={visibleModal} setVisible={setVisibleModal} title={"Configuration de l'ordanisation"} hideModal={() => setVisibleModal(false)} onSubmit={() => {}} data={{form:"formOrganisation"}} />
            <main class="no-org-container">
                <div class="no-org-card">
                    <div class="setup-badge">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                        Action requise
                    </div>
                    <div class="no-org-icon-wrapper">
                        <div class="pulse-glow"></div>
                        <div class="icon-circle-warning">
                            <i class="fa-solid fa-sitemap"></i>
                            <span class="plus-badge"><i class="fa-solid fa-plus"></i></span>
                        </div>
                    </div>

                    <div class="no-org-header">
                        <h2>Aucune organisation configurée</h2>
                        <p>Bienvenue ! Pour débloquer l'accès complet à votre tableau de bord et à vos fonctionnalités, vous devez d'abord créer une organisation.</p>
                    </div>

                    <div class="features-preview">
                        <div class="feature-item">
                            <div class="feature-icon"><i class="fa-solid fa-users-gear"></i></div>
                            <div class="feature-text">Gérer vos équipes et vos membres</div>
                        </div>
                        <div class="feature-item">
                            <div class="feature-icon"><i class="fa-solid fa-chart-line"></i></div>
                            <div class="feature-text">Accéder aux rapports et statistiques</div>
                        </div>
                        <div class="feature-item">
                            <div class="feature-icon"><i class="fa-solid fa-folder-tree"></i></div>
                            <div class="feature-text">Centraliser toutes vos données</div>
                        </div>
                    </div>

                    <div class="no-org-actions">
                        <button class="btn-setup-org" onClick={() => setVisibleModal(true)}>
                            <i class="fa-solid fa-wand-magic-sparkles"></i>
                            Configurer mon organisation
                        </button>
                    </div>

                    <div class="no-org-footer">
                        <p><i class="fa-solid fa-circle-question"></i> Des questions ? <a href="#">Consulter notre guide de démarrage</a></p>
                    </div>
                </div>
            </main>
        </div>
    )
}