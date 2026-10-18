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

                        <div class="card">
                            <h4>Actions</h4>
                            {signalement?.statusatt != "résolu" && <div className="flex-column">
                                {signalement?.attribuerid && signalement?.userid == user?.userid && signalement?.statusatt == "en cours" ? <Button 
                                    label="Classer comme résolu"
                                    variant="primary"
                                    size="block"
                                    onClick={() => setEtat(signalement?.attribuerid, "résolu")}
                                /> :<Button 
                                    label="Accepter le signalement"
                                    variant="primary"
                                    size="block"
                                    onClick={() => suivreDossier(signalement?.attribuerid)}
                                />}
                                {signalement?.attribuerid && signalement?.userid == user?.userid && signalement?.statusatt == "en cours" ? <Button 
                                    label="Abandonner"
                                    variant="secondary"
                                    size="block"
                                    onClick={() => setEtat(signalement?.attribuerid, "refusé")}
                                /> : <Button 
                                    label="Refuser le signalement"
                                    variant="secondary"
                                    size="block"
                                    onClick={() => setEtat(signalement?.attribuerid, "refusé")}
                                />}
                                <Button 
                                    label="Orienter"
                                    variant="secondary"
                                    size="block"
                                    onClick={() => navigate("orienter")}
                                />
                            </div>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}