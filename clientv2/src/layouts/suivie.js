import { useState } from "react";

export function SuivieDossier(){
    const link = process.env.REACT_APP_LINK;
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [signalement, setSignalement] = useState({})
    
    const loadSignalement = async () => {
        setLoading(true);
        try {
            console.log(code);
            const response = await fetch(`${link}/signalement/${code}/code`);
            const data = await response.json();
            console.log(data.data);
            setSignalement(data.data);
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    }

    return (
        <main class="waiting-container">
            <div style={{marginBottom: "24px"}}>
                <h1 style={{fontSize: "1.5rem", marginBottom: "4px"}}>Suivi de dossier</h1>
                <p style={{color: "var(--text-muted)", fontSize: "0.9rem"}}>
                    Entrez votre code de suivi pour consulter l'avancement de votre demande.
                </p>
            </div>

            <div class="card">
                <div class="form-group" style={{marginBottom: "16px"}}>
                    <label for="trackingInput">Code de suivi</label>
                    <div style={{display: "flex", gap: "12px", flexWrap: "wrap"}}>
                        <input type="text" value={code} onChange={(e) => setCode(e.target.value)} id="trackingInput" class="form-control" placeholder="Ex : HK-3A7F-9B2C" style={{flex: "1", minWidth: "200px", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "600"}} />
                        <button class="btn btn-primary" id="searchBtn" style={{flexShrink: "0"}} onClick={loadSignalement} >
                            <i class="fa-solid fa-magnifying-glass" style={{marginRight: "8px"}}></i>
                            Rechercher
                        </button>
                    </div>
                    <p style={{fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "8px"}}>
                        <i class="fa-solid fa-circle-info" style={{marginRight: "4px"}}></i>
                        Le code vous a été fourni lors de la soumission de votre demande.
                    </p>
                </div>
            </div>
            {!signalement?.id_incident ?
            <div id="emptyState" class="kpi-card track-empty">
                <div class="track-empty-icon" style={{textAlign: "center"}}>
                    <i class="fa-solid fa-folder-open"></i>
                </div>
                <h3 style={{marginBottom: "8px", fontSize: "1.1rem", textAlign: "center"}}>Aucun signalement chargé</h3>
                <p style={{color: "var(--text-muted)", fontSize: "0.9rem", maxWidth: "400px", margin: "0 auto"}}>
                    Saisissez votre code de suivi ci-dessus pour afficher les détails et l'avancement de votre demande.
                </p>
            </div>
            :
            <div id="resultState">

                <div class="kpi-card" style={{marginBottom: "24px"}}>
                    <h4 style={{fontSize: "1rem", marginBottom: "16px"}}>Informations du dossier</h4>
                    <b>Categorie : </b>{signalement?.categorie} 
                    <p >{signalement?.description}</p>
                </div>

                <div class="kpi-card" style={{marginBottom: "24px"}}>
                    <h4 style={{fontSize: "1rem", marginBottom: "16px"}}>
                        <i class="fa-solid fa-route" style={{marginRight: "8px", color: "var(--primary)"}}></i>
                        Avancement de votre signalement
                    </h4>

                    <div class="track-timeline">
                        
                        <div class="track-step completed">
                            <div class="track-icon">
                                <i class="fa-solid fa-check"></i>
                            </div>
                            <div class="track-content">
                                <strong>Dossier enregistré</strong>
                                <p>Votre dossier a bien été enregistré dans notre système et signalé au comptes appropriés.</p>
                                <span class="track-date">{signalement?.date_incident}</span>
                            </div>
                        </div>

                        <div class={`track-step ${signalement?.statusatt == "en cours" ? "current" : signalement?.statusatt == "résolu" ? "completed" : ""}`}>
                            <div class="track-icon">
                                <i class={`fa-solid ${signalement?.statusatt == "en cours" ? "fa-spinner" : signalement?.statusatt == "résolu" ? "fa-check" : "fa-exclamation-triangle"}`}></i>
                            </div>
                            <div class="track-content">
                                <strong>En cours d'analyse</strong>
                                <p>Un gestionnaire est entrain de prendre en charge votre dossier et de vérifier les informations fournies.</p>
                                <span class="track-date">En cours depuis le 5 octobre à 14h35</span>
                            </div>
                        </div>

                        <div class="track-step">
                            <div class="track-icon">
                                <i class="fa-solid fa-file-signature"></i>
                            </div>
                            <div class="track-content">
                                <strong>Résolution en cours</strong>
                                <p>Le gestionnaire est entrain de résoudre votre problème.</p>
                                <span class="track-date">À venir</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="kpi-card">
                    <h4 style={{fontSize: "1rem", marginBottom: "16px"}}>Actions disponibles</h4>
                    <div style={{display: "flex", flexDirection: "column", gap: "12px"}}>
                        <button class="btn btn-ghost btn-block">
                            <i class="fa-solid fa-headset" style={{marginRight: "8px"}}></i>
                            Contacter le support
                        </button>
                    </div>
                </div>

                <div class="alert alert-info" style={{marginTop: "20px"}}>
                    <i class="fa-solid fa-circle-info" style={{fontSize: "1.1rem"}}></i>
                    <div>
                        <strong>Besoin d'aide ?</strong> Consultez notre <a href="#" style={{color: "var(--status-new-text)", fontWeight: "600"}}>FAQ</a> ou contactez notre support à <a href="mailto:support@hak-system.org" style={{color: "var(--status-new-text)", fontWeight: "600"}}>support@hak-system.org</a>
                    </div>
                </div>

            </div>}

            <div style={{textAlign: "center", marginTop: "24px"}}>
                <a href="/" class="btn btn-ghost btn-sm">
                    <i class="fa-solid fa-arrow-left" style={{marginRight: "6px"}}></i>
                    Retour à l'accueil
                </a>
            </div>

        </main>
    )
}
    