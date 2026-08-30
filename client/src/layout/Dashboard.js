import { useEffect, useState } from "react";
import { Header } from "../components/Essential";
import { Loader } from "../components/MiniComp";

export function Dashboard() {
    const link = process.env.REACT_APP_LINK;
    const [incident, setIncident] = useState([]);
    const [dossiers, setDossiers] = useState([]);
    const [dossierEncours, setDossierEncours] = useState([]);
    const [utilisateur, setUtilisateur] = useState([]);
    const [dossierLibre, setDossierLibre] = useState([]);
    const [visibleLoader, setVisibleLoader] = useState(false);
    const user = JSON.parse(localStorage.getItem("userinfo"));
    const loadDossiers = async () => {
        setVisibleLoader(true);
        try{
            await fetch(`${link}/getincident?userid=${user.userid}`).then((response) => response.json()).then((data) => {
                setIncident(data.data);
                setDossiers(data.data.filter((dossier) => dossier.statusinc == "cloturer"));
                setDossierEncours(data.data.filter((dossier) => dossier.statusinc == "en cours"));
            });
            await fetch(`${link}/getincident`).then((response) => response.json()).then((data) => {
                setDossierLibre(data.data);
            });
        }catch(error){
            console.log(error);
        }
        setVisibleLoader(false);
    }
    
    useEffect(() => {
        loadDossiers();
    },[])
    return (
        <>
        <Header title="Tableau de Bord" />
        {visibleLoader && <Loader />}
        <div class="dashboard-container" id="dashboard-content">
            <section class="kpi-grid">
                <div class="card">
                    <div class="kpi-header">
                        <div>
                            <div class="kpi-value">{incident.length}</div>
                            <div class="kpi-label">Total Signalements</div>
                        </div>
                        <div class="kpi-icon icon-primary">
                            <i class="fa-solid fa-bullhorn"></i>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="kpi-header">
                        <div>
                            <div class="kpi-value">{dossierEncours.length}</div>
                            <div class="kpi-label">Dossiers en cours</div>
                        </div>
                        <div class="kpi-icon icon-warning">
                            <i class="fa-solid fa-clock"></i>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="kpi-header">
                        <div>
                            <div class="kpi-value">{dossiers.length}</div>
                            <div class="kpi-label">Affaires Résolues</div>
                        </div>
                        <div class="kpi-icon icon-success">
                            <i class="fa-solid fa-check-circle"></i>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="kpi-header">
                        <div>
                            <div class="kpi-value">{dossierLibre.length}</div>
                            <div class="kpi-label">Signalements non assignés</div>
                        </div>
                        <div class="kpi-icon icon-danger">
                            <i class="fa-solid fa-triangle-exclamation"></i>
                        </div>
                    </div>
                </div>
            </section>

            <section class="content-grid">
                <div class="chart-container">
                    <h3>Statistiques des Incidents</h3>
                    {/* <canvas id="incidentChart" style={{maxHeight: "180px"}}></canvas> */}
                </div>
                <div class="recent-activity">
                    <h3>Derniers Juristes</h3>
                    <ul class="activity-list">
                        <li class="activity-item">
                            <div class="avatar" style={{ color: "white", display: "flex", alignItems: "center", justifyContent: "center"}}>M</div>
                            <div>
                                <strong>Me. Claudine</strong><br />
                                <small class="text-muted">Droit familial</small>
                            </div>
                        </li>
                        <li class="activity-item">
                            <div class="avatar" style={{color: "white", display: "flex", alignItems: "center", justifyContent: "center"}}>J</div>
                            <div>
                                <strong>Me. Tabarrow</strong><br />                                
                                <small class="text-muted">Droit pénal</small>
                            </div>
                        </li>
                        <li class="activity-item">
                            <div class="avatar" style={{color: "white", display: "flex", alignItems: "center", justifyContent: "center"}}>S</div>
                            <div>
                                <strong>Me. Gad</strong><br />
                                <small class="text-muted">Droit civil</small>
                            </div>
                        </li>
                    </ul>
                </div>
            </section>

            <h3 class="section-title">Composants : Dossiers & Articles</h3>
            <div class="cards-container">
                <div class="signalement-card">
                    <div class="sig-header">
                        <strong>#DOS-2025-001</strong>
                        <span class="badge bg-danger">Inquiétude : Élevée</span>
                    </div>
                    <div class="sig-body">
                        <h4 class="sig-title">Violences Conjugales</h4>
                        <div class="sig-info"><i class="fa-solid fa-location-dot"></i> Quartier Himbi, Goma</div>
                        <div class="sig-info"><i class="fa-regular fa-calendar"></i> 06 Fév 2026</div>
                        <p class="sig-desc">Victime signale des menaces répétées...</p>
                    </div>
                    <div class="sig-footer">
                        <small>Status: <span class="text-warning">En attente</span></small>
                        <button class="btn-action">Voir</button>
                    </div>
                </div>

                <div class="article-card">
                    <div class="article-img">
                        <i class="fa-solid fa-image fa-2x"></i>
                    </div>
                    <div class="article-content">
                        <div class="article-title">Comment porter plainte ?</div>
                        <p class="article-desc">Guide pratique pour les victimes...</p>
                        <div class="article-meta">
                            <span><i class="fa-solid fa-eye"></i> 1,203 vues</span>
                            <span><i class="fa-solid fa-paperclip"></i> PDF</span>
                        </div>
                    </div>
                </div>

                <div class="signalement-card">
                    <div class="sig-header">
                        <strong>#DOS-2025-042</strong>
                        <span class="badge bg-warning">Inquiétude : Moyenne</span>
                    </div>
                    <div class="sig-body">
                        <h4 class="sig-title">Conflit Foncier</h4>
                        <div class="sig-info"><i class="fa-solid fa-location-dot"></i> Masisi, Centre</div>
                        <div class="sig-info"><i class="fa-regular fa-calendar"></i> 05 Fév 2026</div>
                    </div>
                    <div class="sig-footer">
                        <small>Status: <span class="text-success">Attribué</span></small>
                        <button class="btn-action">Suivre</button>
                    </div>
                </div>

                <div class="article-card">
                    <div class="article-img" style={{background:"#e8eaf6"}}>
                        <i class="fa-solid fa-file-pdf fa-2x" ></i>
                    </div>
                    <div class="article-content">
                        <div class="article-title">Droits des femmes</div>
                        <p class="article-desc">Comprendre vos droits juridiques...</p>
                        <div class="article-meta">
                            <span><i class="fa-solid fa-eye"></i> 845 vues</span>
                            <span><i class="fa-solid fa-paperclip"></i> PDF</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        </>
    )
}