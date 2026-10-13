import { Header } from "../components/maincomp";
import { Alert, Button, CardRadio, FileCard, Loader, TextArea } from "../components/minicomp";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export function Orienter(){
    const navigate = useNavigate();
    const link = process.env.REACT_APP_LINK;
    const {signalementid} = useParams();
    const [signalement, setSignalement] = useState([]);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("userinfo")));
    const [organisations, setOrganisations] = useState([]);
    const [filteredOrganisation, setFilteredOrganisation] = useState([]);
    const [loader, setLoader] = useState(false);
    const [orientation, setOrientation] = useState({
        organisationid:"",
        commentaire:""
    })
    const loadSignalement = async () => {
        try {
            const response = await fetch(`${link}/signalement/${signalementid}`);
            const data = await response.json();
            setSignalement(data.data);
        } catch (error) {
            console.log(error);
        }
    }
    const loadOrganisations = async () => {
        await fetch(`${link}/organisations`).then((response) => response.json()).then((datas) => {
            if(datas.status =="success"){
                console.log(datas.data);
                setFilteredOrganisation(datas.data);
                setOrganisations(datas.data);
            }else{
                alert(datas.message);
            }
        })
    }

    const searchOrg = async (search) => {
        setFilteredOrganisation(organisations.filter((org) => (org?.designation?.toLowerCase()?.includes(search) || org?.libelle?.toLowerCase()?.includes(search))))
    }

    const orienterDossier = async (event) => {
        event.preventDefault();
        if(!orientation.organisationid){
            alert("Veuillez selectionner une organisation");
            return;
        }
        await fetch(`${link}/suivredossier`, {
            headers:{
                "Content-Type":"application/json",
            },
            method:"post",
            body:JSON.stringify({userid: user.userid, dossierid: signalementid, ...orientation, type:"orientation", status:"en attente" })
        }).then((response) => response.json()).then((resultat) =>{
            if(resultat.status == "success"){
                alert("Signalement orienté avec succès");
                loadSignalement();
            }
            else{
                alert(resultat.message);
            }
        })
        window.history.back();
    }

    useEffect(() => {
        if(!signalementid) return;
        loadSignalement();
    }, [signalementid]);
    useEffect(() => {
        loadOrganisations()
    },[])

    return(
        <>
            {loader && <Loader />}
            <div className="pagestructure">
                <Header title={"Détails du signalement"} retour={true} />
                <div style={{padding: "10px", marginBottom: "10px"}}>
                    <h2>Orienter vers une structure</h2>
                    <p><b>Cas : </b>{signalement?.code_unique} </p>
                </div>
                <form onSubmit={orienterDossier} class="flex-row" style={{padding:"15px"}}>
                    <div class="flex-column flex-1">
                        <div class="card flex-column">
                            <div>
                                <h3>1. Choisir la structure</h3>
                                <div className="search-filter-bar">
                                    <input type="search" placeholder="Rechercher une organisation" onChange={(event) => searchOrg(event.target.value)} />
                                </div>
                                <div class="radio-group">
                                    {
                                        filteredOrganisation.length > 0 ? filteredOrganisation.slice(0, 4).map((org) => <CardRadio title={org.designation} onChange={() => setOrientation({...orientation, organisationid: org.organisationid})} value={org.organisationid == orientation.organisationid} />) : <p>Aucune organisation</p>
                                    }
                                </div>
                            </div>
                            <div>
                                <h3>2. Commentaire</h3>
                                <p>Expliquez brievement pourquoi vous orienter le cas vers l'organisation selectionner</p>
                                <TextArea onChange={(value) => setOrientation({...orientation, commentaire:value})} placeholder={"Commentaire"} value={orientation.commentaire} required={true} />
                            </div>
                        </div>

                    </div>

                    <div class="flex-column flex-8">

                        <div class="card">
                            <div className="flex-column">
                                <div>
                                    <b>Récapitulatif</b>
                                    <p><b>Cas </b>{signalement.code_unique}</p>
                                    <p><b>Orienté vers </b>{organisations.find((org) => org.organisationid == orientation.organisationid)?.designation}</p>
                                </div>
                                <Button 
                                    label="Envoyer l'orientation"
                                    variant="primary"
                                    type="submit"
                                    size="block"
                                />
                                <Button 
                                    label="Annuler"
                                    variant="secondary"
                                    type={"button"}
                                    size="block"
                                    onClick={() => window.history.back()}
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}