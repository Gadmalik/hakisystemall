import { useNavigate } from "react-router-dom";
import { Header } from "../components/maincomp";
import { Button, FormGroup, Input, Switch } from "../components/minicomp";
import { useState } from "react";
import { useEffect } from "react";

export function CategorieUtilisateur({}){
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("userinfo")));
    const [categorieUtilisateurs, setCategorieUtilisateurs] = useState([]);
    const [filteredCategorieUtilisateur, setFilteredCategorieUtilisateur] = useState([]);
    const [selectedCategorieUtilisateur, setSelectedCategorieUtilisateur] = useState([]);
    const [fonctionnalites, setFonctionnalites] = useState([]);
    const [categorieutilisateur, setCategorieutilisateur] = useState({
            designation:"",
            description:"",
            confirm: false,
            organisation: false,
            fonctionnalites: []
        });
    const [loaderVisible, setLoaderVisible] = useState(false);
    const [error, setError] = useState("");
    const [activeCategorie, setActiveCategorie] = useState(null);
    const link = process.env.REACT_APP_LINK;
    const navigate = useNavigate();
    const ajouter = async (event) => {
        event.preventDefault();

        setError({});
        if(categorieutilisateur.designation == ""){
            setError({designation:"Veuillez saisir une designation"});
            return false;
        }
        if(categorieutilisateur.description == ""){
            setError({description:"Veuillez saisir une description"});
            return false;
        }
        
        setLoaderVisible(true);
        await fetch(`${link}/categorieutilisateur`, {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify(categorieutilisateur),
        }).then((res) => res.json()).then((data) => {
            console.log(data);
            
            setLoaderVisible(false);
            if(data.status =="success"){
                alert("Categorie d'utilisateur ajoutée avec succès !");
                setCategorieutilisateur({
                    designation:"",
                    description:"",
                    confirm: true,
                    organisation: true,
                    fonctionnalites: []
                });
                setError("")
            }else{
                setError(data.message);
            }
        }).catch((error) => {
            setError("Une erreur s'est produite ! ");
            console.error(error);
            setLoaderVisible(false);
        })
    }
    const loadCategorieUtilisateurs = async () => {
        setLoaderVisible(true)
        try {
            await fetch(`${link}/categorieutilisateur`).then((response) => response.json()).then((data) => {
                if(data.success){
                    setCategorieUtilisateurs(data.data);
                }
                setLoaderVisible(false)
            });
        } catch (error) {
            console.log(error);
            setLoaderVisible(false)
        }
    }
    const handleCheckboxChange = (e, categorieutilisateurid) => {
        if (e.target.checked) {
            setSelectedCategorieUtilisateur([...selectedCategorieUtilisateur, categorieutilisateurid]);
        } else {
            setSelectedCategorieUtilisateur(selectedCategorieUtilisateur.filter((id) => id !== categorieutilisateurid));
        }
    }
    const searchCategorieUtilisateur = (e) => {
        const search = e.target.value;
        setFilteredCategorieUtilisateur(categorieUtilisateurs.filter((categorie) => `${categorie.libelle} ${categorie.description}`.toLowerCase().includes(search.toLowerCase())));
    }
    const loadFonctionnalites = async () => {
        setLoaderVisible(true)
        try {
            await fetch(`${link}/fonctionnalites`).then((response) => response.json()).then((data) => {
                if(data.success){
                    setFonctionnalites(data.data);
                }
                setLoaderVisible(false)
            });
        } catch (error) {
            console.log(error);
            setLoaderVisible(false)
        }
    }

    const handleFonctionnaliteClick = (fonctionnaliteid) => {
        if(categorieutilisateur.fonctionnalites?.includes(fonctionnaliteid)){
            setCategorieutilisateur({...categorieutilisateur, fonctionnalites:categorieutilisateur.fonctionnalites.filter((id) => id !== fonctionnaliteid)});
        }else{
            setCategorieutilisateur({...categorieutilisateur, fonctionnalites:[...categorieutilisateur.fonctionnalites, fonctionnaliteid]});
        }
    }
    const executeAction = async (action) => {
        // try {
        //     const formData = new FormData();
        //     formData.append("op", "changestate");
        //     formData.append("action", action);
        //     formData.append("ids", JSON.stringify(selectedUsers));
        //     formData.append("user", JSON.stringify(user));
        //     await fetch(`${link}/utilisateur/`, {
        //         method: "POST",
        //         body: formData,
        //     }).then((response) => response.json()).then((data) => {
        //         if(data.status == 'success'){
        //             alert("Utilisateur mis a jour avec succès");
        //             setSelectedUsers([]);
        //         }
        //     });
        // } catch (error) {
        //     console.log(error);
        // }
    }
    useEffect(() => {
        loadCategorieUtilisateurs();
        loadFonctionnalites();
    }, [])
    useEffect(() => {
        setFilteredCategorieUtilisateur(categorieUtilisateurs);
    },[categorieUtilisateurs])

    useEffect(() => {
        if(activeCategorie){
            setCategorieutilisateur(activeCategorie);
        }
    },[activeCategorie])
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
                <Button label={"Ajouter une categorie"} variant={"primary"} size="sm" onClick={() => {}} />
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
                                <th>Description</th>
                                <th>Statut</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCategorieUtilisateur.map((categorieutilisateur) => (
                                <tr>
                                <td>
                                    <input type="checkbox" value={categorieutilisateur.categorieutilisateurid} onChange={(e) => handleCheckboxChange(e, categorieutilisateur.categorieutilisateurid)} />
                                </td>
                                <td>{categorieutilisateur.designation}</td>
                                <td>{categorieutilisateur.description}</td>
                                <td><span class={`badge badge-${categorieutilisateur.status == "actif" ? "success" : "danger"}`}>{categorieutilisateur.status}</span></td>
                                <td><a onClick={() => setActiveCategorie(categorieutilisateur)} class="link-action"><i class="fas fa-edit"></i></a></td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <form class="card flex-6" onSubmit={ajouter}>
                    <h3>{activeCategorie ? "Modifier" : "Ajouter"}</h3>
                    <div>

                        <FormGroup label={"Designation"} icone={"tag"} error={error.designation}>
                            <Input type={"text"} value={categorieutilisateur.designation} onChange={(value) => setCategorieutilisateur({...categorieutilisateur, designation:value})} placeholder={"Designation"} />
                        </FormGroup>
                        <FormGroup label={"Description"} icone={"pen"} error={error.description}>
                            <Input type={"text"} value={categorieutilisateur.description} onChange={(value) => setCategorieutilisateur({...categorieutilisateur, description:value})} placeholder={"Description"} />
                        </FormGroup>

                        <div class="flex-row">
                            <div class="flex-column flex-1">
                                <p><span>Cette catégorie de compte aura besoin d'une confirmation de l'administrateur.</span></p>
                            </div>
                            <Switch onChange={(value) => setCategorieutilisateur({...categorieutilisateur, confirm:value})} value={categorieutilisateur.confirm} />
                        </div>
                        <div class="flex-row">
                            <div class="flex-column flex-1">
                                <p><span>Cette catégorie de compte sera liée à une organisation.</span></p>
                            </div>
                            <Switch onChange={(value) => setCategorieutilisateur({...categorieutilisateur, organisation:value})} value={categorieutilisateur.organisation} />
                        </div>

                        <FormGroup label={"Fonctionnalites"} icone={"users"}>
                            <div className="chip-group">
                                {fonctionnalites.map((fonctionnalite) => (
                                    <button type="button" class={`chip ${categorieutilisateur.fonctionnalites?.includes(fonctionnalite.fonctionnaliteid) ? "active" : ""}`} onClick={() => handleFonctionnaliteClick(fonctionnalite.fonctionnaliteid)}>{categorieutilisateur.fonctionnalites?.includes(fonctionnalite.fonctionnaliteid) ? <i class="fas fa-check"></i> : <i class="fas fa-plus"></i>}{fonctionnalite.designation}</button>
                                ))}
                            </div>
                        </FormGroup>
                        <Button label={activeCategorie ? "Modifier" : "Ajouter"} onClick={() => {}} icone="save" loader={loaderVisible} type={"submit"} size={"box"} variant={"primary"} />
                    </div>
                </form>
            </div>
        </div>
    )
}