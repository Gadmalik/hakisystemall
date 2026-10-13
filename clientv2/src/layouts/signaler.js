import { useNavigate } from "react-router-dom";
import { HeaderSimple } from "../components/maincomp";
import { Alert, Button, FileCard, Input, Switch, TextArea, Uploader } from "../components/minicomp";
import { useEffect, useState } from "react";

export function Signaler({}){
    const navigate = useNavigate();
    const link = process.env.REACT_APP_LINK;
    const [signalement, setSignalement] = useState({
        categorieid:"",
        description:"",
        date:"",
        lieu:"",
        annexe:{},
        typepersonne:"",
        trancheage:"",
        contact:"",
        iscontact:false,
        status:"new",
    });
    const [mysignalement, setMysignalement] = useState({});
    const [activeTab, setActiveTab] = useState(1);
    const [visibleLoader, setVisibleLoader] = useState(false);
    const [listTypeIncident, setListTypeIncident] = useState([]);
    const [error, setError] = useState(null);
    const handleSubmit = async (event) => {
        event.preventDefault();
        if(signalement.categorieid === "" || signalement.description === "" || signalement.date === "" || signalement.lieu === ""){
            setError("Veuillez remplir tous les champs");
            setVisibleLoader(false);
            return;
        }

        setError(null);
        setVisibleLoader(true);
        try{
            const formData = new FormData();
            console.log(signalement.annexe?.files)
            formData.append("categorieid", signalement.categorieid);
            formData.append("description", signalement.description);
            formData.append("date", signalement.date);
            formData.append("lieu", signalement.lieu);
            Object.keys(signalement.annexe).forEach((key) => {
                formData.append("annexe", signalement.annexe[key]);
            });
            formData.append("typepersonne", signalement.typepersonne);
            formData.append("trancheage", signalement.trancheage);
            formData.append("contact", signalement.contact);
            formData.append("iscontact", signalement.iscontact);
            formData.append("status", signalement.status);
            await fetch(`${link}/incident`, {
                method:"post",
                body: formData
            }).then((reponse) => reponse.json()).then((datas) => {
                console.log(datas);
                if(datas.success){
                    setSignalement({
                        categorieid:"",
                        description:"",
                        date:"",
                        lieu:"",
                        annexe:{},
                        typepersonne:"",
                        trancheage:"",
                        contact:"",
                        iscontact:false,
                        status:"new",
                    });
                    setActiveTab(2);
                    setMysignalement(datas.data);
                }else{
                    setError(datas.message);
                }
            })
            setVisibleLoader(false);
        }catch(error){
            console.log(error);
            setVisibleLoader(false);
            setError("Une erreur s'est produite");
        }
    }
    const loadTypeIncident = async () => {
        setVisibleLoader(true);
        try {
            await fetch(`${link}/get_categorie`, {
                method: "get",
            }).then((reponse) => reponse.json()).then((data) => {
                setListTypeIncident(data?.data);
                setVisibleLoader(false);
            }).catch((error) => {
                console.log(error);
                setVisibleLoader(false);
            });
        } catch (error) {
            console.log(error);
            setVisibleLoader(false);

        }
    }

    useEffect(() => {
        loadTypeIncident();
    }, []);

    useEffect(() => {
        console.log(Object.values(signalement.annexe));
    }, [signalement.annexe])
    return (
        <div style={{marginTop: "40px", flexDirection: "column"}} class="flex-center">
            <HeaderSimple title="HAKI SYSTEM" retour={false} />
            {activeTab == 1 ? <div>
                <div style={{padding: "10px", marginBottom: "10px"}}>
                    <h2>Signaler sans créer de compte</h2>
                    <p>Remplissez le formulaire ci-dessous pour signaler un fait.</p>
                </div>
                <form onSubmit={handleSubmit} className="flex-center">
                    <div className="card flex-column">
                        <b>1. Type de signalement</b>
                        <p style={{fontSize: "0.8rem", color: "var(--text-muted)"}}>Choisissez la catégorie de votre signalement</p>

                        <div class="chip-group">
                            {listTypeIncident?.map((type) => (
                                <button type="button" class={signalement.categorieid === type.categorie_id ? "chip active" : "chip"} key={type.categorie_id} onClick={() => setSignalement({...signalement, categorieid: type.categorie_id})}>{type.designation}</button>
                            ))}
                        </div>
                        <b>2. Que s'est-il passé ?</b>
                        <p style={{fontSize: "0.8rem", color: "var(--text-muted)"}}>Décrivez ce qui s'est passé de façon claire et concise</p>
                        <TextArea placeholder="Détails du signalement" onChange={(value) => setSignalement({...signalement, description: value})} value={signalement.description} required={true} />
                        <div class="flex-row">
                            <div class="flex-column flex-1">
                                <b>3. Quand c'est arrivé ?</b>
                                <p style={{fontSize: "0.8rem", color: "var(--text-muted)"}}>Date du fait</p>
                                <Input type="date" onChange={(value) => setSignalement({...signalement, date: value})} value={signalement.date} required={true} />
                            </div>
                            <div class="flex-column flex-1">
                                <b>4. Où c'est arrivé ?</b>
                                <p style={{fontSize: "0.8rem", color: "var(--text-muted)"}}>Lieu du fait</p>
                                <Input type="text" onChange={(value) => setSignalement({...signalement, lieu: value})} value={signalement.lieu} required={true} placeholder={"Ville / Quartier"} />
                            </div>
                        </div>
                        <b>5. Annexe (facultatif)</b>
                        <p style={{fontSize: "0.8rem", color: "var(--text-muted)"}}>Ajouter des pièces jointes en guise de preuves (facultatif)</p>
                        <Uploader label="Ajouter des preuves" id="preuves" onChange={(e) => setSignalement({...signalement, annexe: e.target.files})} value={signalement.annexe} required={false} accept={""} multiple={true} />
                        {signalement.annexe && Object.values(signalement.annexe)?.map((annexe, key) => (
                            <FileCard key={key} titre={annexe?.name} taille={`${(annexe?.size / 1024 / 1024).toFixed(2)} MB`} button={"Retirer"} onClick={() => setSignalement({...signalement, annexe: Array.from(signalement.annexe).filter((_, i) => i !== key)})}
                             />
                        ))}
                        <div class="flex-row">
                            <div class="flex-column flex-1">
                                <b>6. Genre de la personne concernée (facultatif)</b>
                                <p style={{fontSize: "0.8rem", color: "var(--text-muted)"}}>Précisez le genre de la personne concernée</p>
                                <div className="chip-group">
                                    <button type="button" className={signalement.genre === "F" ? "chip active" : "chip"} onClick={() => setSignalement({...signalement, genre: "F"})}>Femme</button>
                                    <button type="button" className={signalement.genre === "H" ? "chip active" : "chip"} onClick={() => setSignalement({...signalement, genre: "H"})}>Homme</button>
                                    <button type="button" className={signalement.genre === "N" ? "chip active" : "chip"} onClick={() => setSignalement({...signalement, genre: "N"})}>Non spécifié</button>
                                </div>
                            </div>
                            <div class="flex-column flex-1">
                                <b>7. Tranche d'âge de la personne concernée (facultatif)</b>
                                <p style={{fontSize: "0.8rem", color: "var(--text-muted)"}}>Précisez la tranche d'âge de la personne concernée</p>
                                <div className="chip-group">
                                    <button type="button" className={signalement.trancheage === 1 ? "chip active" : "chip"} onClick={() => setSignalement({...signalement, trancheage: 1})}>Moins de 18 ans</button>
                                    <button type="button" className={signalement.trancheage === 2 ? "chip active" : "chip"} onClick={() => setSignalement({...signalement, trancheage: 2})}>18 - 25 ans</button>
                                    <button type="button" className={signalement.trancheage === 3 ? "chip active" : "chip"} onClick={() => setSignalement({...signalement, trancheage: 3})}>25 - 35 ans</button>
                                    <button type="button" className={signalement.trancheage === 4 ? "chip active" : "chip"} onClick={() => setSignalement({...signalement, trancheage: 4})}>35 - 50 ans</button>
                                    <button type="button" className={signalement.trancheage === 5 ? "chip active" : "chip"} onClick={() => setSignalement({...signalement, trancheage: 5})}>50 ans et plus</button>
                                </div>
                            </div>
                        </div>
                        <div class="alert alert-info">
                            <div className="flex-column">
                                <div class="flex-row">
                                    <div class="flex-column flex-1">
                                        <p><b>Je souhaite etre contacté par une structure d'aide (Facultatif)</b> <br/><span>Sans contact vous suivrez l'évolution de votre signalement via le numéro de suivi qui vous sera communiqué.</span></p>
                                    </div>
                                    <Switch value={signalement.iscontact} onChange={(value) => setSignalement({...signalement, iscontact: value})} disabled={false} />
                                </div>
                                {signalement.iscontact && (
                                    <div class="flex-column flex-1">
                                        <Input type="text" placeholder="Email ou numero de telephone" onChange={(value) => setSignalement({...signalement, contact:value})} value={signalement.contact} required={true} />
                                    </div>
                                )}
                            </div>
                        </div>
                        {error && <Alert icone={"triangle-exclamation"} title="Erreur" message={error} type="error" />}
                        <div class="flex-row">
                            <div class="flex-column flex-1">
                                <Button label="Soumettre" onClick={() => {}} type="submit" size="md" variant="primary" />
                            </div>
                        </div>
                    </div>
                </form>
            </div>:
            <div class="card" style={{padding: "10px", marginBottom: "10px"}}>
                <Alert type="success" icone="fa-check" message="Votre signalement a bien été enregistré. Vous pouvez suivre l'évolution de votre signalement en utilisant le numéro de suivi ci-dessous." />
                <div class="file-upload-zone">
                    <p style={{fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "4px"}}>
                        Votre code de suivi
                    </p>
                    <div class="tracking-code">{mysignalement?.code_unique}</div>
                    <p style={{fontSize: "0.75rem", color: "var(--status-analysis-text)", marginTop: "8px"}}>
                        <i class="fa-solid fa-circle-exclamation" style={{marginRight: "4px"}}></i>
                        Notez ce code en lieu sûr : il ne pourra pas être récupéré.
                    </p>
                </div>
                <Button label="Copier le code" onClick={() => {navigator.clipboard.writeText(mysignalement?.code_unique); alert("Code copié!")}} icone="copy" type="button" size="block" variant="primary" />
            </div>
            }
        </div>
    )
}