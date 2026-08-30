import { useEffect, useState } from "react";
import { Header } from "../components/Essential";
import { Loader } from "../components/MiniComp";
export function Dossier() {
    const user = JSON.parse(localStorage.getItem("userinfo"));
    const [dossiers, setDossiers] = useState([]);
    const [dossierLibre, setDossierLibre] = useState([]);
    const [filteredDossiers, setFilteredDossiers] = useState([]);
    const [filteredDossierLibre, setFilteredDossierLibre] = useState([]);
    const [filteredDossierResolut, setFilteredDossierResolut] = useState([]);
    const [activeTab, setActiveTab] = useState("encours");
    const [activeDossier, setActiveDossier] = useState(null);
    const [visibleLoader, setVisibleLoader] = useState(false);
    const link = process.env.REACT_APP_LINK;
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
            await fetch(`${link}/getincident?userid=${user.userid}`).then((response) => response.json()).then((data) => {
                console.log(data);
                setDossiers(data.data);
            });
            await fetch(`${link}/getincident`).then((response) => response.json()).then((data) => {
                console.log(data);
                setDossierLibre(data.data);
            });
        }catch(error){
            console.log(error);
        }
        setVisibleLoader(false);
    }
    const searchDossier = (text) => {
        if(activeTab == "encours"){
            const filter = dossiers.filter((dossier) => `${dossier.id_incident} ${dossier.type_incident} ${dossier.lieu} ${dossier.description}`.toString().includes(text));
            setFilteredDossiers(filter);
        }
        else if(activeTab == "resolut"){
            const filter = dossiers.filter((dossier) => `${dossier.id_incident} ${dossier.type_incident} ${dossier.lieu} ${dossier.description}`.toString().includes(text));
            setFilteredDossiers(filter);
        }
        else if(activeTab == "libre"){
            const filter = dossierLibre.filter((dossier) => `${dossier.id_incident} ${dossier.type_incident} ${dossier.lieu} ${dossier.description}`.toString().includes(text));
            setFilteredDossierLibre(filter);
        }
    }
    const setEtat = async (attribuerid, status) => {
        console.log(attribuerid, status);
        
        await fetch(`${link}/set_etat_attribut`, {
            headers:{"Content-Type":"application/json"},
            method:"post",
            body:JSON.stringify({attribuerid: attribuerid, status: status}),
        }).then((response) => response.json()).then((resultat) => {
            if(resultat.status == "success"){
                alert("Etat mis à jour avec succès");
                loadDossiers();
            }
            else{
                alert("Erreur lors de la mise à jour de l'état");
            }
        })
    }
    useEffect(() => {
        loadDossiers();
    },[])
    useEffect(() => {
        if(activeTab == "encours"){
            const filter = dossiers.filter((dossier) => dossier.statusinc == "en cours");
            setFilteredDossiers(filter);
        }
        else if(activeTab == "resolut"){
            const filter = dossiers.filter((dossier) => dossier.statusinc == "cloturer");
            setFilteredDossierResolut(filter);
        }
        else if(activeTab == "libre"){
            setFilteredDossierLibre(dossierLibre);
        }
    },[dossiers, dossierLibre, activeTab])
    return <>
        <Header title={"Dossiers"} searchFunction={(text) => searchDossier(text)} />
        {visibleLoader && <Loader />}
        <div className="main-container" onClick={() => setActiveDossier(null)}>
            <div class="tabs-navigator">
                <button class={`tab-menu ${activeTab == "encours" ? "active-tab-menu" : ""}`} onClick={() => setActiveTab("encours")}>Mes dossier en cours</button>
                <button class={`tab-menu ${activeTab == "resolut" ? "active-tab-menu" : ""}`} onClick={() => setActiveTab("resolut")}>Mes dossier resolut</button>
                <button class={`tab-menu ${activeTab == "libre" ? "active-tab-menu" : ""}`} onClick={() => setActiveTab("libre")}>Dossier non affecté</button>
            </div>
            <div class={`cards-dossiers-container ${activeTab == "encours" ? "" : "hidden"}`}>
                {
                    filteredDossiers.map((dossier) => (
                <div class="signalement-card">
                    <div class="sig-header">
                        <strong>#DOS-{new Date(dossier.date_create).getFullYear()}-{dossier.id_incident}</strong>
                        <span class={`badge bg-${dossier.niveau == "critique" || dossier.niveau =="eleve" ? "danger" : "warning"}`}>Inquiétude : {dossier.niveau}</span>
                    </div>
                    <div class="sig-body">
                        <h4 class="sig-title">{dossier.categorie}</h4>
                        <div class="sig-info"><i class="fa-solid fa-location-dot"></i> {dossier.lieu}</div>
                        <div class="sig-info"><i class="fa-regular fa-calendar"></i> {(dossier.date_incident)}</div>
                        <p class="sig-desc">{dossier.description}</p>
                    </div>
                    <div class="sig-footer">
                        <small>Status: <span class="text-warning">{dossier.statusinc}</span></small>
                        <button class="btn-action" onClick={(event) => {event.stopPropagation(); setActiveDossier(dossier)}}><i className="fas fa-cog"></i> Gerer</button>
                        <div class={`menu-action ${activeDossier == dossier ? "" : "hidden"}`}>
                            <button class="btn-menu" onClick={() => {setEtat(dossier.attribuerid, "abandonner")}}><i className="fas fa-times-circle"></i> Abandonner</button>
                            <button class="btn-menu" onClick={() => {setEtat(dossier.attribuerid, "cloturer")}}><i className="fas fa-check-circle"></i> Cloturer</button>
                        </div>
                    </div>
                </div>
                ))}
            </div>
            <div class={`cards-dossiers-container ${activeTab == "resolut" ? "" : "hidden"}`}>
                {
                    filteredDossierResolut.map((dossier) => (
                <div class="signalement-card">
                    <div class="sig-header">
                        <strong>#DOS-{new Date(dossier.date_create).getFullYear()}-{dossier.id_incident}</strong>
                        <span class={`badge bg-${dossier.niveau == "critique" || dossier.niveau =="eleve" ? "danger" : "warning"}`}>Inquiétude : {dossier.niveau}</span>
                    </div>
                    <div class="sig-body">
                        <h4 class="sig-title">{dossier.categorie}</h4>
                        <div class="sig-info"><i class="fa-solid fa-location-dot"></i> {dossier.lieu}</div>
                        <div class="sig-info"><i class="fa-regular fa-calendar"></i> {(dossier.date_incident)}</div>
                        <p class="sig-desc">{dossier.description}</p>
                    </div>
                    <div class="sig-footer">
                        <small>Status: <span class="text-success">{dossier.statusinc}</span></small>
                    </div>
                </div>
                ))}
            </div>
            <div class={`cards-dossiers-container ${activeTab == "libre" ? "" : "hidden"}`}>
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
}