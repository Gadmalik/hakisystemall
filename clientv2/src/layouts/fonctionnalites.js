import { useNavigate } from "react-router-dom";
import { Header } from "../components/maincomp";
import { Button, FormGroup, Input, Select } from "../components/minicomp";
import { useState } from "react";
import { useEffect } from "react";

export function Fonctionnalites({}){
    const [userinfo, setUserinfo] = useState(JSON.parse(localStorage.getItem("userinfo")));
    const link = process.env.REACT_APP_LINK;
    const [visibleModal, setVisibleModal] = useState(false);
    const hideModal = () => setVisibleModal(false);
    const [fonctionnalites, setFonctionnalites] = useState([]);
    const [filteredFonctionnalites, setFilteredFonctionnalites] = useState([]);
    const [loaderVisible, setLoaderVisible] = useState(false);
    const [activefonctionnalite,setActiveFonctionnalite] = useState(null);
    const [fonctionnalite,setFonctionnalite] = useState({
        designation:"",
        description:"",
        route:"",
        icone:"",
        parentid:"",
    });
    const [errors, setErrors] = useState({});
    const [visibleLoader,setVisibleLoader] = useState(false);
    const navigate = useNavigate();
    const loadFonctionnalites = async () => {
        setLoaderVisible(true);
        await fetch(`${link}/fonctionnalites`)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            if(data.status === "success"){
                setFonctionnalites(data.data);
                setFilteredFonctionnalites(data.data);
            }
        })
        setLoaderVisible(false);
    }   
    const submitFonctionnalite = async (event) => {
        event.preventDefault();
        setVisibleLoader(true);
        if(fonctionnalite.designation == "" || fonctionnalite.description == "" || fonctionnalite.route == "" || fonctionnalite.icone == ""){
            fonctionnalite.designation == "" ? setErrors({...errors, designation: "La désignation est requise"}) : setErrors({...errors, designation: ""});
            fonctionnalite.description == "" ? setErrors({...errors, description: "La description est requise"}) : setErrors({...errors, description: ""});
            fonctionnalite.route == "" ? setErrors({...errors, route: "La route est requise"}) : setErrors({...errors, route: ""});
            fonctionnalite.icone == "" ? setErrors({...errors, icone: "L'icone est requise"}) : setErrors({...errors, icone: ""});
            setVisibleLoader(false);
            return;
        }
        try{
            const methode = activefonctionnalite ? "put" : "post";
            const url = `${link}/fonctionnalite`;
            await fetch(url, {
                method: methode,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(fonctionnalite)
            }).then((response) => response.json()).then((data) => {
                if(data.status == "success"){
                    alert(`Fonctionnalité ${activefonctionnalite ? "modifiée" : "ajoutée"} avec succès`);
                    loadFonctionnalites();
                    setVisibleLoader(false);
                    setFonctionnalite({
                        designation:"",
                        description:"",
                        route:"",
                        icone:"",
                        parentid:"",
                    });
                    setActiveFonctionnalite(null)
                }
            })
        }catch(error){
            console.log(error);
            setVisibleLoader(false);
        }
    }
    
    useEffect(() => {
        loadFonctionnalites();
    }, []);
    useEffect(() => {
        if(activefonctionnalite){
            setFonctionnalite(activefonctionnalite);
        }
    }, [activefonctionnalite]);
    return(
        <div className="pagestructure">
            <Header title={"Signalements"} retour={true} />
            <div className="flex-between" style={{margin: "10px"}}>
                <div class="chip-group">
                    <button class="chip">Tous</button>
                    <button class="chip">Nouveaux</button>
                    <button class="chip active">En analyse</button>
                    <button class="chip">Cloturés</button>
                    <button class="chip">Orientés</button>
                </div>
                <Button label={"Ajouter"} variant={"primary"} size="sm" onClick={() => {setActiveFonctionnalite(null); setFonctionnalite({designation:"",description:"",route:"",icone:"",parentid:""})} } />
            </div>
            <div class="flex-row" style={{alignItems:"flex-start"}}>
                <div class="table-responsive-wrapper flex-1">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>
                                    <input type="checkbox" onChange={(e) => {}} />
                                </th>
                                <th>Designation</th>
                                <th>Icone</th>
                                <th>Route</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>

                            {filteredFonctionnalites.map((fonctionnalite, index) => (
                                <tr key={index}>
                                    <td></td>
                                    <td>{fonctionnalite.designation}</td>
                                    <td><i className={`fas fa-${fonctionnalite.icone}`}></i></td>
                                    <td>{fonctionnalite.route}</td>
                                    <td>{fonctionnalite.status}</td>
                                    <td>
                                        <a onClick={() => setActiveFonctionnalite(fonctionnalite)} class="link-action"><i class="fas fa-edit"></i></a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <form class="card flex-6" onSubmit={submitFonctionnalite}>
                    <h3>{activefonctionnalite ? "Modifier" : "Ajouter"} une fonctionnalité</h3>
                    <div>
                        <div className="form-row">  
                            <FormGroup label={"Designation"} icone="tag" error={errors.designation}>
                                <Input type={"text"} value={fonctionnalite.designation} onChange={(value) => setFonctionnalite({...fonctionnalite, designation: value})} placeholder={"Designation"} />
                            </FormGroup>
                            <FormGroup label={"Description"} icone="user" error={errors.description}>
                                <Input type={"text"} value={fonctionnalite.description} onChange={(value) => setFonctionnalite({...fonctionnalite, description: value})} placeholder={"Description"} />
                            </FormGroup>
                        </div>
                        <div className="form-row">
                            <FormGroup label={"Route"} icone="link" error={errors.route}>
                                <Input type={"text"} value={fonctionnalite.route} onChange={(value) => setFonctionnalite({...fonctionnalite, route: value})} placeholder={"Route"} />
                            </FormGroup>
                            <FormGroup label={"Icone"} icone="star" error={errors.icone}>
                                <Input type={"text"} value={fonctionnalite.icone} onChange={(value) => setFonctionnalite({...fonctionnalite, icone: value})} placeholder={"Icone"} />
                            </FormGroup>
                        </div>
                        <Button label={activefonctionnalite ? "Modifier" : "Ajouter"} icone="save" loader={loaderVisible} type={"submit"} size={"box"} variant={"primary"} />
                    </div>
                </form>
            </div>
        </div>
    )
}