import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function LandingPage({}){
    const link = process.env.REACT_APP_LINK;
    const navigate = useNavigate();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("userinfo")));
    const [infos, setInfos] = useState({});
    const [loader, setLoader] = useState(false);
    const verifEtatUtilisateur = async () => {
        setLoader(true);
        try {
            const response = await fetch(link+`/user/`+user.userid, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            if (data.success) {
                setInfos(data.data)
                console.log(data.data)
                if(data.data.status === "actif"){
                    if(data.data.organisationid){
                        if(data.data.ogstatus === "actif"){
                            localStorage.setItem("userinfo", JSON.stringify(data.data));
                            navigate("/home");
                        }
                    }else{
                        localStorage.setItem("userinfo", JSON.stringify(data.data));
                        navigate("/home");
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
        setLoader(false);
    }

    useEffect(() => {
        verifEtatUtilisateur();
    }, []);
    return (
        <main class="waiting-container">
            
            <div class="card" style={{padding: "32px 24px"}}>
                
                <div class="waiting-icon-circle">
                    <i class="fa-solid fa-hourglass-half"></i>
                </div>
                <div style={{textAlign: "center", marginBottom:" 24px"}}>
                    <h1 style={{fontSize: "1.5rem", marginBottom:" 8px"}}>Demande en cours de validation</h1>
                    <p style={{color: "var(--text-muted)", fontSize:" 0.9rem"}}>
                        {user.nom} {user.prenoms}, votre demande a été reçue. Notre équipe l'examine et vous recevrez une confirmation par e-mail très bientôt.
                    </p>
                </div>

                <div style={{textAlign: "center", marginBottom:" 24px"}}>
                    <span style={{fontSize: "0.85rem", padding: "6px 16px"}}>
                        <i class="fa-solid fa-clock" style={{marginRight: "4px"}}></i>
                        En attente de validation
                    </span>
                </div>

                <div style={{borderTop: "1px solid var(--border-color)", paddingTop: "20px", marginBottom: "20px"}}>
                    <h4 style={{fontSize: "0.9rem", textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "0.05em", marginBottom: "16px"}}>
                        Étapes de votre demande
                    </h4>

                    <div class="timeline-step completed">
                        <div class="timeline-icon">
                            <i class="fa-solid fa-check"></i>
                        </div>
                        <div class="timeline-content">
                            <strong>Demande soumise</strong>
                            <span>Reçue le {user.created_at.split("T")[0]} à {user.created_at.split("T")[1].split(".")[0]}</span>
                        </div>
                    </div>

                    <div class="timeline-step current">
                        <div class="timeline-icon">
                            <i class="fa-solid fa-spinner"></i>
                        </div>
                        <div class="timeline-content">
                            <strong>Vérification des informations</strong>
                            <span>Notre équipe examine votre dossier (24-48h)</span>
                        </div>
                    </div>

                    <div class="timeline-step">
                        <div class="timeline-icon">
                            <i class="fa-solid fa-envelope"></i>
                        </div>
                        <div class="timeline-content">
                            <strong>Confirmation par e-mail</strong>
                            <span>Vous recevrez un lien d'activation</span>
                        </div>
                    </div>
                </div>
                <div style={{display: "flex", flexDirection: "column", gap: "12px", marginTop: "20px"}}>
                    <button class="btn btn-outline btn-block" onClick={verifEtatUtilisateur}>
                        <i class={`fa-solid fa-${loader ? "spinner fa-spin" : "rotate-right"}`} style={{marginRight: "8px"}}></i>
                        Actualiser le statut
                    </button>
                </div>

            </div>

            <div class="alert alert-info" style={{marginTop: "20px"}}>
                <i class="fa-solid fa-circle-info" style={{fontSize: "1.1rem"}}></i>
                <div>
                    <strong>Une question ?</strong> Si vous n'avez pas reçu de confirmation sous 48h, contactez notre support à <a href="mailto:support@hak-system.org" style={{color: "var(--status-new-text)", fontWeight: "600"}}>support@hak-system.org</a>
                </div>
            </div>

            <div style={{textAlign: "center", marginTop: "24px"}}>
                <a href="#" class="btn btn-ghost btn-sm">
                    <i class="fa-solid fa-arrow-left" style={{marginRight: "6px"}}></i>
                    Retour à l'accueil
                </a>
            </div>

        </main>
    )
}