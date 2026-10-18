import { useNavigate } from "react-router-dom";
import { Header } from "../components/maincomp";
import { Button, FormGroup, Input } from "../components/minicomp";
import { useState } from "react";
import { useEffect } from "react";

export function CategorieUtilisateurOrg({}){
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("userinfo")));
    const [visibleModal, setVisibleModal] = useState(false);
    const [categorieUtilisateur, setCategorieUtilisateur] = useState([]);
    const [filteredCategorieUtilisateur, setFilteredCategorieUtilisateur] = useState([]);
    const [selectedCategorieUtilisateur, setSelectedCategorieUtilisateur] = useState([]);
    const [fonctionnalites, setFonctionnalites] = useState([]);
    const [loader, setLoader] = useState(false);
    const [categorieutilisateurorg, setCategorieutilisateurorg] = useState({
        libelle:"",
        description:"",
        organisationid:user.organisationid,
        fonctionnalites:[]
    });
    const [loaderVisible, setLoaderVisible] = useState(false);
    const [error, setError] = useState({});
    const link = process.env.REACT_APP_LINK;
    const hideModal = () => setVisibleModal(false);
    const navigate = useNavigate();

    const loadCategorieUtilisateurs = async () => {
        setLoaderVisible(true)
        try {
            await fetch(`${link}/getcategorieutilisateurorg/${user.organisationid}`).then((response) => response.json()).then((data) => {
                console.log(data, user.organisationid)
                if(data.success){
                    setCategorieUtilisateur(data.data);
                }
                setLoaderVisible(false)
            });
        } catch (error) {
            console.log(error);
            setLoaderVisible(false)
        }
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
    const handleCheckboxChange = (e, categorieutilisateurid) => {
        if (e.target.checked) {
            setSelectedCategorieUtilisateur([...selectedCategorieUtilisateur, categorieutilisateurid]);
        } else {
            setSelectedCategorieUtilisateur(selectedCategorieUtilisateur.filter((id) => id !== categorieutilisateurid));
        }
    }
    const searchCategorieUtilisateur = (e) => {
        const search = e.target.value;
        setFilteredCategorieUtilisateur(categorieUtilisateur.filter((categorie) => `${categorie.libelle} ${categorie.description}`.toLowerCase().includes(search.toLowerCase())));
    }

    const handleFonctionnaliteClick = (fonctionnaliteid) => {
        if(categorieutilisateurorg.fonctionnalites?.includes(fonctionnaliteid)){
            setCategorieutilisateurorg({...categorieutilisateurorg, fonctionnalites:categorieutilisateurorg.fonctionnalites.filter((id) => id !== fonctionnaliteid)});
        }else{
            setCategorieutilisateurorg({...categorieutilisateurorg, fonctionnalites:[...categorieutilisateurorg.fonctionnalites, fonctionnaliteid]});
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

    const ajouter = async (event) => {
        event.preventDefault();

        setError({});
        if(categorieutilisateurorg.libelle == ""){
            setError({libelle:"Veuillez saisir un libelle"});
            return false;
        }
        if(categorieutilisateurorg.description == ""){
            setError({description:"Veuillez saisir une description"});
            return false;
        }
        setLoader(true);
        await fetch(`${link}/categorieutilisateurorg`, {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify(categorieutilisateurorg),
        }).then((res) => res.json()).then((dataresponse) => {
            
            setLoader(false);
            if(dataresponse.status =="success"){
                alert("Categorie d'utilisateur d'organisation ajoutée avec succès !");
                loadCategorieUtilisateurs();
                setCategorieutilisateurorg({
                    libelle:"",
                    description:"",
                    organisationid:user.organisationid,
                    fonctionnalites:[]
                });
                setError("");
            }else{
                setError(dataresponse.message);
            }
        }).catch((error) => {
            setError("Une erreur s'est produite ! ");
            console.error(error);
            setLoader(false);
        })
    }
    useEffect(() => {
        loadCategorieUtilisateurs();
        loadFonctionnalites();
    }, [])
    useEffect(() => {
        setFilteredCategorieUtilisateur(categorieUtilisateur);
        console.log(user);
    },[categorieUtilisateur])
    return(
        <div className="pagestructure">
            <Header title={"Categorie d'utilisateurs"} retour={true} />
            <div className="flex-between" style={{margin: "10px"}}>
                <div class="chip-group">
                    {/* <button class="chip">Tous</button>
                    <button class="chip">Nouveaux</button>
                    <button class="chip active">En analyse</button>
                    <button class="chip">Cloturés</button>
                    <button class="chip">Orientés</button> */}
                </div>
                <Button label={"Ajouter"} variant={"primary"} icone={"plus"} size="sm" onClick={() => {}} />
            </div>
            <div class="flex-row">
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
                                <td>{categorieutilisateur.libelle}</td>
                                <td>{categorieutilisateur.description}</td>
                                <td><span class={`badge badge-${categorieutilisateur.status == "actif" ? "success" : "danger"}`}>{categorieutilisateur.status}</span></td>
                                <td><a onClick={() => null} class="link-action"><i class="fas fa-edit"></i></a></td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <form class="card flex-6" onSubmit={ajouter}>
                    <h3>Ajouter</h3>
                    <div>
                        <FormGroup label={"Designation"} icone={"tag"} error={error.libelle}>
                            <Input type={"text"} value={categorieutilisateurorg.libelle} onChange={(value) => setCategorieutilisateurorg({...categorieutilisateurorg, libelle:value})} placeholder={"Designation"} />
                        </FormGroup>
                        <FormGroup label={"Description"} icone={"pen"} error={error.description}>
                            <Input type={"text"} value={categorieutilisateurorg.description} onChange={(value) => setCategorieutilisateurorg({...categorieutilisateurorg, description:value})} placeholder={"Description"} />
                        </FormGroup>
                        <FormGroup label={"Fonctionnalites"} icone={"users"}>
                            <div className="chip-group">
                                {fonctionnalites.map((fonctionnalite) => (
                                    <button type="button" class={`chip ${categorieutilisateurorg.fonctionnalites?.includes(fonctionnalite.fonctionnaliteid) ? "active" : ""}`} onClick={() => handleFonctionnaliteClick(fonctionnalite.fonctionnaliteid)}>{categorieutilisateurorg.fonctionnalites?.includes(fonctionnalite.fonctionnaliteid) ? <i class="fas fa-check"></i> : <i class="fas fa-plus"></i>}{fonctionnalite.designation}</button>
                                ))}
                            </div>
                        </FormGroup>
                        <Button label={"Ajouter"} onClick={() => {}} icone="save" loader={loader} type={"submit"} size={"box"} variant={"primary"} />
                    </div>
                </form>
            </div>
        </div>
    )
}