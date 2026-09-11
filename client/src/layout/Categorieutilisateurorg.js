import { useEffect, useState } from "react";
import { Header, Modal } from "../components/Essential";
import { useNavigate } from "react-router-dom";
import { HeaderButton, Loader } from "../components/MiniComp";

export function CategorieUtilisateursOrg() {
    const user = JSON.parse(localStorage.getItem("userinfo"));
    const [visibleModal, setVisibleModal] = useState(false);
    const [categorieUtilisateur, setCategorieUtilisateur] = useState([]);
    const [filteredCategorieUtilisateur, setFilteredCategorieUtilisateur] = useState([]);
    const [selectedCategorieUtilisateur, setSelectedCategorieUtilisateur] = useState([]);
    const [loaderVisible, setLoaderVisible] = useState(false);
    const [error, setError] = useState("");
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
    }, [])
    useEffect(() => {
        setFilteredCategorieUtilisateur(categorieUtilisateur);
    },[categorieUtilisateur])
    useEffect(() => {
        if(user?.etat !== "actif"){
            navigate("/login");
        }else{

        }
    },[user])
    return (
        <>
            <Header title={"Categories d'utilisateurs"} searchFunction={searchCategorieUtilisateur} />
            {loaderVisible && <Loader />}
            <Modal 
                data={{form:"formcategorieutilisateurorg"}}
                title={"Ajouter une catégorie d'utilisateur"}
                setVisible={setVisibleModal}
                visible={visibleModal}
                hideModal={hideModal}
            />
            {/* bouton confirmer, annuler, supprimer ---- flotant */}
            {selectedCategorieUtilisateur.length > 0 && <div className="floating-actions">
                <button className="btn btn-danger" onClick={() => executeAction('désactivé')}><i className="fas fa-trash"></i></button>
            </div>}
            <div className="main-container">
                <HeaderButton onclick={() => setVisibleModal(true)}/>
                <div class="card-tableau">
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Designation</th>
                                    <th>Description</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    filteredCategorieUtilisateur.map((categorieutilisateur) => (
                                        <tr key={categorieutilisateur.categorieutilisateurid}>
                                            <td align="center">
                                                <input type="checkbox" value={categorieutilisateur.categorieutilisateurid} onChange={(e) => handleCheckboxChange(e, categorieutilisateur.categorieutilisateurid)} />
                                            </td>
                                            <td><b>{categorieutilisateur.libelle}</b></td>
                                            <td>{categorieutilisateur.description}</td>
                                            <td><span className={`badge badge-${categorieutilisateur.status === "actif" ? "success" : "warn"}`}>{categorieutilisateur.status}</span></td>
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