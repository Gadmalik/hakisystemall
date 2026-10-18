import { Header } from "../components/maincomp";
import { Alert, Button, FileCard } from "../components/minicomp";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export function SingleSignalement(){
    const navigate = useNavigate();
    const link = process.env.REACT_APP_LINK;
    const {signalementid} = useParams();
    const [signalement, setSignalement] = useState([]);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("userinfo")));
    useEffect(() => {
        if(!signalementid) return;
        loadSignalement();
    }, [signalementid]);

    const loadSignalement = async () => {
        try {
            const response = await fetch(`${link}/signalement/${signalementid}/none`);
            const data = await response.json();
            setSignalement(data.data);
            console.log(data.data);
        } catch (error) {
            console.log(error);
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
                loadSignalement();
            }
            else{
                alert("Erreur lors de la mise à jour de l'état");
            }
        })
    }

    const suivreDossier = async (orientationid = null) => {
        await fetch(`${link}/suivredossier`, {
            headers:{
                "Content-Type":"application/json",
            },
            method:"post",
            body:JSON.stringify({userid: user.userid, dossierid: signalementid, orientationid: orientationid || null})
        }).then((response) => response.json()).then((resultat) =>{
            if(resultat.status == "success"){
                alert("Dossier suivi avec succès");
                loadSignalement();
            }
            else{
                alert(resultat.message);
            }
        })
    }

    useEffect(() => {
        console.log(user)
    },[user])
    return(
        <>
            <div className="pagestructure">
                <Header title={"Détails du signalement"} retour={true} />
                <div style={{padding: "10px"}}>
                    <h2>{signalement?.code_unique}</h2>
                    <p className="text-muted"><b>Créé le : </b>{new Date(signalement?.date_incident).toLocaleDateString()}</p>
                </div>
                <div class="flex-row" style={{padding:"15px"}}>
                    <div class="flex-column flex-1">
                        <div class="card">
                            <h4>Informations générales</h4>
                            <div>
                                {signalement?.description}
                            </div>
                        </div>

                        <div class="card">
                            <h3>Preuve</h3>
                            <div class="flex-column" style={{margin: "10px"}}>
                                {signalement?.annexes ? signalement?.annexes.map((proof, index) => (
                                    <FileCard key={index} titre={proof.filename} taille={proof.size} button="Voir" onClick={() => null} />
                                )) : <Alert message="Aucun fichier joint" type="info" icone={"exclamation-circle"} />}
                            </div>
                        </div>
                    </div>

                    <div class="flex-column flex-8">
                        <div class="card">
                            <h4>Informations sur le signalement</h4>
                            <div>
                                <p className="flex-between"><span className="text-muted">Date et heure :</span><strong>{new Date(signalement?.date_incident).toLocaleDateString()}</strong></p>
                                <p className="flex-between"><span className="text-muted">Lieu :</span> <strong>{signalement?.lieu}</strong></p>
                                <p className="flex-between"><span className="text-muted">Type :</span> <strong>{signalement?.categorie}</strong></p>
                                <p className="flex-between"><span className="text-muted">Identité :</span> <strong>{signalement?.anonyme ? "Anonyme" : "Utilisateur identifiable"}</strong></p>
                                <p className="flex-between"><span className="text-muted">Genre :</span> <strong>{signalement?.genre == "N" ? "Non precisé" : signalement?.genre == "H" ? "Homme" : "Femme"}</strong></p>
                                <p className="flex-between"><span className="text-muted">Age :</span> <strong>{signalement?.age == 1 ? "Moins de 18 ans" : signalement?.age == 2 ? "18 - 25 ans" : signalement?.age == 3 ? "25 - 35 ans" : signalement?.age == 4 ? "35 - 50 ans" : signalement?.age == 5 ? "50 ans et plus" : "Non precisé"}</strong></p>
                                <p className="flex-between"><span className="text-muted">Contact :</span> <strong>{signalement?.contact}</strong></p>
                                <p className="flex-between"><span className="text-muted">Statut :</span> <strong>{signalement?.statusatt ? signalement?.statusatt : "Nouveau"}</strong></p>
                            </div>
                        </div>

                        <div className="card">
                            <h4>Actions & Prise en charge</h4>
                            {signalement?.statusatt === "résolu" || signalement?.statusatt === "cloturé" ? (
                                <Alert
                                    message="Ce signalement a été clôturé et marqué comme résolu."
                                    type="success"
                                    icone="check-circle"
                                />
                            ) : (
                                <div className="flex-column" style={{ gap: "10px" }}>
                                    {/* Cas 1: Le dossier est suivi en cours par cet utilisateur */}
                                    {signalement?.attribuerid && 
                                     (signalement?.attribuer_userid == user?.userid || signalement?.userid == user?.userid) && 
                                     (signalement?.statusatt === "en cours" || signalement?.statusatt === "accepté") ? (
                                        <>
                                            <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: "8px", padding: "12px", fontSize: "0.82rem", color: "#065f46" }}>
                                                <i className="fa-solid fa-lock" style={{ marginRight: "6px" }}></i>
                                                <strong>Vous assurez le suivi de ce dossier.</strong>
                                                <p style={{ margin: "4px 0 0 0", fontSize: "0.76rem" }}>
                                                    Conformément au protocole, ce dossier ne peut pas être abandonné une fois pris en charge. Vous pouvez le résoudre ou l'orienter.
                                                </p>
                                            </div>
                                            <Button 
                                                label="Classer comme résolu"
                                                variant="primary"
                                                size="block"
                                                icone="check"
                                                onClick={() => {
                                                    if (window.confirm("Confirmer la résolution de ce signalement ?")) {
                                                        setEtat(signalement?.attribuerid, "résolu");
                                                    }
                                                }}
                                            />
                                            <Button 
                                                label="Orienter vers une autre structure"
                                                variant="secondary"
                                                size="block"
                                                icone="share-nodes"
                                                onClick={() => navigate("orienter")}
                                            />
                                        </>
                                    ) : signalement?.attribuerid && signalement?.type_attribut === "orientation" && signalement?.statusatt === "en attente" ? (
                                        /* Cas 2: Cas orienté en attente de validation */
                                        <>
                                            <Alert
                                                message="Ce cas a été orienté vers votre structure et attend votre acceptation."
                                                type="warning"
                                                icone="clock"
                                            />
                                            <Button 
                                                label="Accepter l'orientation"
                                                variant="primary"
                                                size="block"
                                                icone="check"
                                                onClick={() => suivreDossier(signalement?.attribuerid)}
                                            />
                                            <Button 
                                                label="Refuser l'orientation"
                                                variant="secondary"
                                                size="block"
                                                icone="xmark"
                                                onClick={() => setEtat(signalement?.attribuerid, "refusé")}
                                            />
                                        </>
                                    ) : signalement?.attribuerid && signalement?.statusatt !== "refusé" && signalement?.statusatt !== "abandonné" ? (
                                        /* Cas 3: Dossier déjà pris en charge par un autre utilisateur / organisation */
                                        <div style={{ background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "8px", padding: "14px", fontSize: "0.85rem" }}>
                                            <p style={{ margin: 0, fontWeight: 600, color: "var(--text-main)" }}>
                                                <i className="fa-solid fa-user-check" style={{ color: "var(--primary)", marginRight: "6px" }}></i>
                                                Dossier déjà pris en charge
                                            </p>
                                            <p style={{ margin: "6px 0 0 0", color: "var(--text-muted)", fontSize: "0.78rem" }}>
                                                Ce signalement est actuellement suivi par{" "}
                                                <strong>{signalement?.nom_gestionnaire ? `${signalement.nom_gestionnaire} ${signalement.prenom_gestionnaire || ""}` : "un gestionnaire"}</strong>
                                                {signalement?.organisation_nom ? ` (${signalement.organisation_nom})` : ""}.
                                            </p>
                                        </div>
                                    ) : (
                                        /* Cas 4: Signalement libre / non pris en charge */
                                        <>
                                            <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "8px", padding: "10px", fontSize: "0.8rem", color: "#1e40af" }}>
                                                <i className="fa-solid fa-info-circle" style={{ marginRight: "6px" }}></i>
                                                Ce dossier est actuellement <strong>libre et non pris en charge</strong>.
                                            </div>
                                            <Button 
                                                label="Prendre en charge (Suivre ce dossier)"
                                                variant="primary"
                                                size="block"
                                                icone="hand-holding-hand"
                                                onClick={() => suivreDossier()}
                                            />
                                            <Button 
                                                label="Orienter directement"
                                                variant="secondary"
                                                size="block"
                                                icone="share-nodes"
                                                onClick={() => navigate("orienter")}
                                            />
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}