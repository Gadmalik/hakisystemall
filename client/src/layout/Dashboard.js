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
    const [filteredDossierLibre, setFilteredDossierLibre] = useState([]);
    const user = JSON.parse(localStorage.getItem("userinfo"));

    
     const suivreDossier = async (id) => {
        await fetch(`${link}/suivredossier`, {
            headers:{
                "Content-Type":"application/json",
            },
            method:"post",
            body:JSON.stringify({userid: user.userid, dossierid: id})
        }).then((response) => response.json()).then((resultat) =>{
            if(resultat.status == "success"){
                alert("Dossier suivi avec succès");
                loadDossiers();
            }
            else{
                alert("Erreur lors du suivi du dossier");
            }
        })
    }

    const loadDossiers = async () => {
        setVisibleLoader(true);
        try{
            await fetch(`${link}/getincident?limit=4`).then((response) => response.json()).then((data) => {
                setFilteredDossierLibre(data.data);
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

            <h3 class="section-title">Dossiers récent</h3>
            <div class={`cards-dossiers-container`}>
                {
                    filteredDossierLibre.map((dossier) => (
                    <div class="signalement-card">
                        <div class="sig-header">
                            <strong>#DOS-{new Date(dossier.date_create).getFullYear()}-{dossier.id_incident}</strong>
                            <span class={`badge bg-${dossier.niveau == "critique" || dossier.niveau =="eleve" ? "danger" : "warning"}`}>Inquiétude : {dossier.niveau}</span>
                        </div>
                        <div class="sig-body">
                            <h4 class="sig-title">{dossier.type_incident}</h4>
                            <div class="sig-info"><i class="fa-solid fa-location-dot"></i> {dossier.lieu}</div>
                            <div class="sig-info"><i class="fa-regular fa-calendar"></i> {(dossier.date_incident)}</div>
                            <p class="sig-desc">{dossier.description}</p>
                        </div>
                        <div class="sig-footer">
                            <small>Status: <span class={`text-${dossier.statusinc == 'en cours' ? 'warning' : dossier.statusinc == 'resolut' ? 'success' : 'danger'}`}>{dossier.statusinc && dossier.userid == user.id ? dossier.statusinc : 'libre'}</span></small>
                            <button class="btn-action" onClick={() => suivreDossier(dossier.id_incident)}><i className="fas fa-plus"></i> Suivre</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        </>
    )
}