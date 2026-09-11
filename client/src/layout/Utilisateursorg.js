import { useEffect, useState } from "react";
import { Header, Modal } from "../components/Essential";
import { useNavigate } from "react-router-dom";
import { HeaderButton } from "../components/MiniComp";

export function UtilisateursOrg() {
    const user = JSON.parse(localStorage.getItem("userinfo"));
    const [visibleModal, setVisibleModal] = useState(false);
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [categorieUtilisateur, setCategorieUtilisateur] = useState([]);
    const [loaderVisible, setLoaderVisible] = useState(false);
    const [error, setError] = useState("");
    const link = process.env.REACT_APP_LINK;
    const hideModal = () => setVisibleModal(false);
    const navigate = useNavigate();

    const fetchUsers = async () => {
        try {
            await fetch(`${link}/users/${user.organisationid}`).then((response) => response.json()).then((data) => {
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
    useEffect(() => {
        fetchUsers();
        loadCategorieUtilisateurs();
    }, [])
    useEffect(() => {
        setFilteredUsers(users);
    },[users])
    useEffect(() => {
        if(user?.etat !== "actif"){
            navigate("/login");
        }else{

        }
    },[user])
    return (
        <>
            <Header title={"Utilisateurs"} searchFunction={searchUser} />
            <Modal 
                data={{form:"formuser", categories: categorieUtilisateur }}
                title={"Ajouter un utilisateur"}
                setVisible={setVisibleModal}
                visible={visibleModal}
                hideModal={hideModal}
            />
            {/* bouton confirmer, annuler, supprimer ---- flotant */}
            {selectedUsers.length > 0 && <div className="floating-actions">
                <button className="btn btn-success" onClick={() => executeAction('actif')}><i className="fas fa-check"></i> Confirmer</button>
                <button className="btn btn-warning" onClick={() => executeAction('en attente')}><i className="fas fa-times"></i> Annuler</button>
                <button className="btn btn-danger" onClick={() => executeAction('désactivé')}><i className="fas fa-trash"></i> Supprimer</button>
            </div>}
            <div className="main-container">
                <HeaderButton onclick={() => setVisibleModal(true)}/>
                <div class="card-tableau">
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Noms</th>
                                    <th>Categorie</th>
                                    <th>Adresse</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    filteredUsers.map((user) => (
                                        <tr key={user.id}>
                                            <td align="center">
                                                <input type="checkbox" value={user.id} onChange={(e) => handleCheckboxChange(e, user.utilisateurid)} />
                                            </td>
                                            <td><b>{user.nom} {user.prenom}</b></td>
                                            <td>{user.type}</td>
                                            <td>{user.adresse}</td>
                                            <td><span className={`badge badge-${user.etat === "actif" ? "success" : "warn"}`}>{user.etat}</span></td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}