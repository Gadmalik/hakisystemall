import { useNavigate } from "react-router-dom";
import { Header } from "../components/maincomp";
import { Button, FormGroup, Input, Select } from "../components/minicomp";
import { useState } from "react";
import { useEffect } from "react";

export function UtilisateurOrg({}){
    const [userinfo, setUserinfo] = useState(JSON.parse(localStorage.getItem("userinfo")));
    const [visibleModal, setVisibleModal] = useState(false);
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [categorieUtilisateur, setCategorieUtilisateur] = useState([]);
    const [loaderVisible, setLoaderVisible] = useState(false);
    const [error, setError] = useState("");
    const link = process.env.REACT_APP_LINK;
    const hideModal = () => setVisibleModal(false);
    const [data, setData] = useState({});
    const navigate = useNavigate();
    const [user, setUser] = useState({
        nom: data?.nom,
        prenom: data?.prenom,
        telephone: data?.telephone,
        email: data?.email,
        mdp: data?.mdp,
        confirm_mdp: data?.confirm_mdp,
        nom_utilisateur: data?.nom_utilisateur,
        categorie: data?.categorie,
        adresse: data?.adresse,
    });
    
    const ajouterUser = async (event) => {
        event.preventDefault();
        const newErrors = {};
        if (!user.nom.trim()) newErrors.nom = "Le nom est requis";
        if (!user.prenom.trim()) newErrors.prenom = "Le prénom est requis";
        if (!user.telephone.trim()) newErrors.telephone = "Le téléphone est requis";
        if (!user.email.trim()) newErrors.email = "L'email est requis";
        if (!user.nom_utilisateur.trim()) newErrors.nom_utilisateur = "Le nom d'utilisateur est requis";
        if (!user.categorie.trim()) newErrors.categorie = "La catégorie est requise";
        if (!user.adresse.trim()) newErrors.adresse = "L'adresse est requise";

        if (user.nom_utilisateur.trim() && user.nom_utilisateur.includes(" ")) {
            newErrors.nom_utilisateur = "Le nom d'utilisateur ne peut pas contenir d'espace";
        }
        if (Object.keys(newErrors).length > 0) {
            setError(newErrors);
            return;
        }

        setError({});
        setLoaderVisible(true);
        try {
            const response = await fetch(`${link}/user/${userinfo.organisationid}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nom: user.nom,
                    prenom: user.prenom,
                    phone: user.telephone,
                    email: user.email,
                    username: user.nom_utilisateur,
                    categorie: user.categorie,
                    adresse: user.adresse,
                }),
            });

            const dataresponse = await response.json();

            if (dataresponse.status === "success") {
                alert(dataresponse.message);
                fetchUsers();
            } else {
                const serverErrors = { message: dataresponse.message };

                if (dataresponse.code === 'username_used') {
                    serverErrors.nom_utilisateur = "Le nom d'utilisateur est déjà utilisé";
                    setUser(prev => ({ ...prev, nom_utilisateur: "" }));
                } else if (dataresponse.code === 'email_used') {
                    serverErrors.email = "L'email est déjà utilisé";
                    setUser(prev => ({ ...prev, email: "" }));
                } else if (dataresponse.code === 'phone_used') {
                    serverErrors.telephone = "Le numéro de téléphone est déjà utilisé";
                    setUser(prev => ({ ...prev, telephone: "" }));
                }

                setError(serverErrors);
            }
        } catch (err) {
            console.error(err);
            setError({ global: "Une erreur s'est produite" });
            
            setTimeout(() => {
                setError({});
            }, 8000);
        }
        setLoaderVisible(false);
    }
    const fetchUsers = async () => {
        try {
            await fetch(`${link}/users/${userinfo.organisationid}`).then((response) => response.json()).then((data) => {
                console.log(data);
                if(data.success){
                    setUsers(data.data);
                }
            });
        } catch (error) {
            console.log(error);
        }
    }
    
    const loadCategorieUtilisateurs = async () => {
        setLoaderVisible(true)
        try {
            await fetch(`${link}/getcategorieutilisateurorg/${userinfo.organisationid}`).then((response) => response.json()).then((data) => {
                console.log(data, userinfo.organisationid)
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

    const handleCheckboxChange = (e, userId) => {
        if (e.target.checked) {
            setSelectedUsers([...selectedUsers, userId]);
        } else {
            setSelectedUsers(selectedUsers.filter((id) => id !== userId));
        }
    }
    const searchUser = (e) => {
        const search = e.target.value;
        setFilteredUsers(users.filter((user) => `${user.nom} ${user.prenom}`.toLowerCase().includes(search.toLowerCase()) || user.categorie.toLowerCase().includes(search.toLowerCase()) || user.adresse.toLowerCase().includes(search.toLowerCase()) || user.etat.toLowerCase().includes(search.toLowerCase())));
        
    }
    const executeAction = async (action) => {
        try {
            const formData = new FormData();
            formData.append("op", "changestate");
            formData.append("action", action);
            formData.append("ids", JSON.stringify(selectedUsers));
            formData.append("user", JSON.stringify(user));
            await fetch(`${link}/utilisateur/`, {
                method: "POST",
                body: formData,
            }).then((response) => response.json()).then((data) => {
                if(data.status == 'success'){
                    alert("Utilisateur mis a jour avec succès");
                    setSelectedUsers([]);
                }
            });
        } catch (error) {
            console.log(error);
        }
    }

    const onSubmit = async () => {
        fetchUsers();
    }
    useEffect(() => {
        fetchUsers();
        loadCategorieUtilisateurs();
    }, [])
    useEffect(() => {
        setFilteredUsers(users);
    },[users])
    return(
        <div className="pagestructure">
            <Header title={"Organisations"} retour={true} />
            <div className="flex-between" style={{margin: "10px"}}>
                <div class="chip-group">
                    {/* <button class="chip">Tous</button>
                    <button class="chip">Nouveaux</button>
                    <button class="chip active">En analyse</button>
                    <button class="chip">Cloturés</button>
                    <button class="chip">Orientés</button> */}
                </div>
                <Button label={"Exporter"} type={"secondary"} size="sm" onClick={() => {}} />
            </div>
            <div class="flex-row" style={{alignItems:"flex-start"}}>
                <div class="table-responsive-wrapper flex-1">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>
                                    <input type="checkbox" onChange={(e) => {}} />
                                </th>
                                <th>Noms</th>
                                <th>Categorie</th>
                                <th>Adresse</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr>
                                <td>
                                    <input type="checkbox" value={user.userid} onChange={(e) => handleCheckboxChange(e, user.userid)} />
                                </td>
                                <td>{user.nom} {user.prenom}</td>
                                <td>{user.type}</td>
                                <td>{user.adresse}</td>
                                <td><span class={`badge badge-${user.etat == "actif" ? "success" : "danger"}`}>{user.etat}</span></td>
                                <td>
                                    <a onClick={() => null} class="link-action"><i class="fas fa-edit"></i></a>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <form class="card flex-6" onSubmit={ajouterUser}>
                    <h3>Ajouter</h3>
                    <div>

                        <div className="form-row">  
                            <FormGroup label={"Nom"} icone="user" error={error.nom}>
                                <Input type={"text"} value={user.nom} onChange={(value) => setUser({...user, nom: value})} placeholder={"Nom"} />
                            </FormGroup>
                            <FormGroup label={"Prenom"} icone="user" error={error.prenom}>
                                <Input type={"text"} value={user.prenom} onChange={(value) => setUser({...user, prenom: value})} placeholder={"Prenom"} />
                            </FormGroup>
                        </div>
                        <div className="form-row">
                            <FormGroup label={"Telephone"} icone="phone" error={error.telephone}>
                                <Input type={"text"} value={user.telephone} onChange={(value) => setUser({...user, telephone: value})} placeholder={"Telephone"} />
                            </FormGroup>
                            <FormGroup label={"Email"} icone="envelope" error={error.email}>
                                <Input type={"text"} value={user.email} onChange={(value) => setUser({...user, email: value})} placeholder={"Email"} />
                            </FormGroup>
                        </div>
                        <div className="form-row">
                            <FormGroup label={"Nom d'utilisateur"} icone="user" error={error.nom_utilisateur}>
                                <Input type={"text"} value={user.nom_utilisateur} onChange={(value) => setUser({...user, nom_utilisateur: value})} placeholder={"Nom d'utilisateur"} />
                            </FormGroup>
                            <FormGroup label={"Categorie"} icone="users" error={error.categorie}>
                                <Select value={user.categorie} onChange={(value) => setUser({...user, categorie: value})} options={[...categorieUtilisateur.map((cate) => ({value: cate.categorieutilisateurorgid, label: cate.libelle}))]} placeholder={"Selectionner une categorie"} />
                            </FormGroup>
                        </div>
                        <FormGroup label={"Adresse"} icone="map-marker" error={error.adresse}>
                            <Input type={"text"} value={user.adresse} onChange={(value) => setUser({...user, adresse: value})} placeholder={"Adresse"} />
                        </FormGroup>
                        <Button label={"Ajouter"} icone="save" loader={loaderVisible} type={"submit"} size={"box"} variant={"primary"} />
                    </div>
                </form>
            </div>
        </div>
    )
}