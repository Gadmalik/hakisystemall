import { useNavigate } from "react-router-dom";
import { Header } from "../components/maincomp";
import { Button, FormGroup, Input, Select, Loader, EmptyState, Badge } from "../components/minicomp";
import { useState, useEffect, useMemo } from "react";

export function UtilisateurOrg({}) {
    const [userinfo] = useState(JSON.parse(localStorage.getItem("userinfo") || "{}"));
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [categorieUtilisateur, setCategorieUtilisateur] = useState([]);
    const [loaderVisible, setLoaderVisible] = useState(false);
    const [actionLoader, setActionLoader] = useState(false);
    const [activeTab, setActiveTab] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [errors, setErrors] = useState({});
    const [editingUserId, setEditingUserId] = useState(null);
    const [successMsg, setSuccessMsg] = useState("");
    const link = process.env.REACT_APP_LINK;

    const initialUserState = {
        nom: "",
        prenom: "",
        telephone: "",
        email: "",
        nom_utilisateur: "",
        categorie: "",
        adresse: ""
    };
    const [formData, setFormData] = useState(initialUserState);

    const fetchUsers = async () => {
        if (!userinfo?.organisationid) return;
        setLoaderVisible(true);
        try {
            const response = await fetch(`${link}/users/${userinfo.organisationid}`);
            const data = await response.json();
            if (data.success && Array.isArray(data.data)) {
                setUsers(data.data);
            }
        } catch (error) {
            console.log("Error fetch users:", error);
        }
        setLoaderVisible(false);
    };

    const loadCategorieUtilisateurs = async () => {
        if (!userinfo?.organisationid) return;
        try {
            const response = await fetch(`${link}/getcategorieutilisateurorg/${userinfo.organisationid}`);
            const data = await response.json();
            if (data.success && Array.isArray(data.data)) {
                setCategorieUtilisateur(data.data);
            }
        } catch (error) {
            console.log("Error load categories:", error);
        }
    };

    const handleSubmitUser = async (event) => {
        event.preventDefault();
        const newErrors = {};
        if (!formData.nom?.trim()) newErrors.nom = "Le nom est requis";
        if (!formData.prenom?.trim()) newErrors.prenom = "Le prénom est requis";
        if (!formData.telephone?.trim()) newErrors.telephone = "Le téléphone est requis";
        if (!formData.email?.trim()) newErrors.email = "L'email est requis";
        if (!formData.nom_utilisateur?.trim()) newErrors.nom_utilisateur = "Le nom d'utilisateur est requis";
        if (!formData.categorie) newErrors.categorie = "La catégorie est requise";
        if (!formData.adresse?.trim()) newErrors.adresse = "L'adresse est requise";

        if (formData.nom_utilisateur?.trim() && formData.nom_utilisateur.includes(" ")) {
            newErrors.nom_utilisateur = "Le nom d'utilisateur ne peut pas contenir d'espace";
        }
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        setActionLoader(true);
        try {
            const response = await fetch(`${link}/user/${userinfo.organisationid}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nom: formData.nom,
                    prenom: formData.prenom,
                    phone: formData.telephone,
                    email: formData.email,
                    username: formData.nom_utilisateur,
                    categorie: formData.categorie,
                    adresse: formData.adresse,
                }),
            });

            const dataresponse = await response.json();

            if (dataresponse.status === "success" || dataresponse.success) {
                setSuccessMsg(editingUserId ? "Membre modifié avec succès !" : "Membre invité avec succès ! Un e-mail d'invitation lui a été envoyé.");
                setFormData(initialUserState);
                setEditingUserId(null);
                fetchUsers();
                setTimeout(() => setSuccessMsg(""), 5000);
            } else {
                const serverErrors = { global: dataresponse.message };
                if (dataresponse.code === "username_used") {
                    serverErrors.nom_utilisateur = "Ce nom d'utilisateur est déjà utilisé";
                } else if (dataresponse.code === "email_used") {
                    serverErrors.email = "Cet email est déjà utilisé";
                } else if (dataresponse.code === "phone_used") {
                    serverErrors.telephone = "Ce numéro est déjà utilisé";
                }
                setErrors(serverErrors);
            }
        } catch (err) {
            console.error(err);
            setErrors({ global: "Une erreur de communication s'est produite" });
        }
        setActionLoader(false);
    };

    const handleCheckboxChange = (e, userId) => {
        if (e.target.checked) {
            setSelectedUsers([...selectedUsers, userId]);
        } else {
            setSelectedUsers(selectedUsers.filter((id) => id !== userId));
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedUsers(filteredUsers.map((u) => u.userid));
        } else {
            setSelectedUsers([]);
        }
    };

    // Actions par lots (Activer / Suspendre)
    const executeBatchAction = async (actionState) => {
        if (selectedUsers.length === 0) return;
        if (!window.confirm(`Passer les ${selectedUsers.length} membres sélectionnés à l'état "${actionState}" ?`)) return;

        setLoaderVisible(true);
        try {
            for (const uid of selectedUsers) {
                await fetch(`${link}/updateprofile`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userid: uid, etat: actionState })
                }).catch(() => {});
            }
            alert("Mise à jour effectuée avec succès !");
            setSelectedUsers([]);
            fetchUsers();
        } catch (err) {
            console.log(err);
        }
        setLoaderVisible(false);
    };

    // Démarrer l'édition d'un utilisateur
    const startEdit = (user) => {
        setEditingUserId(user.userid);
        setFormData({
            nom: user.nom || "",
            prenom: user.prenom || "",
            telephone: user.phone || "",
            email: user.email || "",
            nom_utilisateur: user.username ? user.username.trim() : "",
            categorie: user.categorieutilisateurid || user.categorie || "",
            adresse: user.adresse || ""
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const cancelEdit = () => {
        setEditingUserId(null);
        setFormData(initialUserState);
        setErrors({});
    };

    useEffect(() => {
        fetchUsers();
        loadCategorieUtilisateurs();
    }, []);

    // Filtrage des utilisateurs
    const filteredUsers = useMemo(() => {
        return users.filter((u) => {
            // Filtre par onglet d'état
            if (activeTab === "actif" && u.etat !== "actif") return false;
            if (activeTab === "attente" && u.etat !== "en attente") return false;
            if (activeTab === "inactif" && u.etat !== "inactif" && u.etat !== "désactivé") return false;

            // Filtre par recherche
            if (searchTerm.trim() !== "") {
                const term = searchTerm.toLowerCase();
                const nomComplet = `${u.nom || ""} ${u.prenom || ""}`.toLowerCase();
                const email = (u.email || "").toLowerCase();
                const phone = (u.phone || "").toLowerCase();
                const username = (u.username || "").toLowerCase();
                const role = (u.libelle || u.type || "").toLowerCase();
                return nomComplet.includes(term) || email.includes(term) || phone.includes(term) || username.includes(term) || role.includes(term);
            }
            return true;
        });
    }, [users, activeTab, searchTerm]);

    return (
        <div className="pagestructure">
            <Header title={"Membres de l'organisation"} retour={true} />
            {loaderVisible && <Loader />}

            <div style={{ padding: "15px 20px" }}>
                {successMsg && (
                    <div style={{ background: "#dcfce7", color: "#166534", padding: "12px 16px", borderRadius: "8px", border: "1px solid #bbf7d0", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <i className="fa-solid fa-circle-check"></i>
                        {successMsg}
                    </div>
                )}

                {/* Barre de contrôle et filtres */}
                <div className="flex-between" style={{ flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
                    <div className="chip-group">
                        <button
                            type="button"
                            className={`chip ${activeTab === "all" ? "active" : ""}`}
                            onClick={() => setActiveTab("all")}
                        >
                            Tous ({users.length})
                        </button>
                        <button
                            type="button"
                            className={`chip ${activeTab === "actif" ? "active" : ""}`}
                            onClick={() => setActiveTab("actif")}
                        >
                            <i className="fa-solid fa-circle" style={{ color: "#16a34a", fontSize: "0.6rem", marginRight: "4px" }}></i>
                            Actifs ({users.filter(u => u.etat === "actif").length})
                        </button>
                        <button
                            type="button"
                            className={`chip ${activeTab === "attente" ? "active" : ""}`}
                            onClick={() => setActiveTab("attente")}
                        >
                            <i className="fa-solid fa-circle" style={{ color: "#f59e0b", fontSize: "0.6rem", marginRight: "4px" }}></i>
                            En attente ({users.filter(u => u.etat === "en attente").length})
                        </button>
                        <button
                            type="button"
                            className={`chip ${activeTab === "inactif" ? "active" : ""}`}
                            onClick={() => setActiveTab("inactif")}
                        >
                            <i className="fa-solid fa-circle" style={{ color: "#dc2626", fontSize: "0.6rem", marginRight: "4px" }}></i>
                            Inactifs ({users.filter(u => u.etat === "inactif" || u.etat === "désactivé").length})
                        </button>
                    </div>

                    <div style={{ width: "260px" }}>
                        <input
                            type="search"
                            className="form-control"
                            placeholder="Rechercher par nom, email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ padding: "8px 14px", fontSize: "0.85rem" }}
                        />
                    </div>
                </div>

                {/* Actions groupées flottantes */}
                {selectedUsers.length > 0 && (
                    <div style={{
                        background: "#1e1b4b",
                        color: "white",
                        padding: "10px 18px",
                        borderRadius: "var(--radius-md)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "16px",
                        boxShadow: "var(--shadow-md)"
                    }}>
                        <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                            {selectedUsers.length} membre(s) sélectionné(s)
                        </span>
                        <div style={{ display: "flex", gap: "8px" }}>
                            <button
                                type="button"
                                className="btn btn-sm"
                                style={{ background: "#16a34a", color: "white" }}
                                onClick={() => executeBatchAction("actif")}
                            >
                                <i className="fa-solid fa-check"></i> Activer
                            </button>
                            <button
                                type="button"
                                className="btn btn-sm"
                                style={{ background: "#dc2626", color: "white" }}
                                onClick={() => executeBatchAction("inactif")}
                            >
                                <i className="fa-solid fa-ban"></i> Suspendre
                            </button>
                            <button
                                type="button"
                                className="btn btn-sm"
                                style={{ background: "rgba(255,255,255,0.2)", color: "white" }}
                                onClick={() => setSelectedUsers([])}
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                )}

                {/* Contenu : Tableau des membres (Gauche) & Formulaire (Droite) */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "20px", alignItems: "start" }}>
                    {/* Tableau */}
                    <div className="table-responsive-wrapper" style={{ margin: 0, background: "white", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
                        {filteredUsers.length > 0 ? (
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: "36px" }}>
                                            <input
                                                type="checkbox"
                                                checked={selectedUsers.length > 0 && selectedUsers.length === filteredUsers.length}
                                                onChange={handleSelectAll}
                                            />
                                        </th>
                                        <th>Membre</th>
                                        <th>Rôle / Catégorie</th>
                                        <th>Contact</th>
                                        <th>Statut</th>
                                        <th style={{ textAlign: "right" }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((u) => {
                                        const isActif = u.etat === "actif";
                                        return (
                                            <tr key={u.userid}>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        value={u.userid}
                                                        checked={selectedUsers.includes(u.userid)}
                                                        onChange={(e) => handleCheckboxChange(e, u.userid)}
                                                    />
                                                </td>
                                                <td>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                        <div style={{
                                                            width: "34px",
                                                            height: "34px",
                                                            borderRadius: "50%",
                                                            background: "#e0e7ff",
                                                            color: "var(--primary)",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            fontWeight: 700,
                                                            fontSize: "0.85rem"
                                                        }}>
                                                            {u.nom ? u.nom.charAt(0).toUpperCase() : "U"}
                                                        </div>
                                                        <div>
                                                            <strong style={{ display: "block", color: "var(--text-main)", fontSize: "0.9rem" }}>
                                                                {u.nom} {u.prenom}
                                                            </strong>
                                                            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                                                                @{u.username ? u.username.trim() : "user"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <Badge label={u.libelle || u.type || "Membre"} type="medium" />
                                                </td>
                                                <td style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                                                    <div><i className="fa-regular fa-envelope" style={{ marginRight: "4px" }}></i>{u.email || "-"}</div>
                                                    <div><i className="fa-solid fa-phone" style={{ marginRight: "4px" }}></i>{u.phone || "-"}</div>
                                                </td>
                                                <td>
                                                    <span className={`badge badge-${isActif ? "oriented" : u.etat === "en attente" ? "analysis" : "high"}`}>
                                                        {u.etat || "en attente"}
                                                    </span>
                                                </td>
                                                <td style={{ textAlign: "right" }}>
                                                    <button
                                                        type="button"
                                                        className="btn btn-secondary btn-sm"
                                                        onClick={() => startEdit(u)}
                                                        title="Modifier ce membre"
                                                        style={{ padding: "4px 8px", fontSize: "0.75rem", marginRight: "4px" }}
                                                    >
                                                        <i className="fa-solid fa-pen-to-square"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        ) : (
                            <EmptyState
                                icone="users-slash"
                                title="Aucun membre trouvé"
                                message="Aucun collaborateur ne correspond aux critères de filtre actuels."
                            />
                        )}
                    </div>

                    {/* Formulaire d'ajout / modification */}
                    <form className="card" onSubmit={handleSubmitUser} style={{ margin: 0 }}>
                        <div className="flex-between" style={{ marginBottom: "14px", borderBottom: "1px solid var(--border-color)", paddingBottom: "10px" }}>
                            <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, color: "var(--text-main)" }}>
                                <i className={`fa-solid fa-${editingUserId ? "user-pen" : "user-plus"}`} style={{ color: "var(--primary)", marginRight: "8px" }}></i>
                                {editingUserId ? "Modifier le membre" : "Inviter un collaborateur"}
                            </h3>
                            {editingUserId && (
                                <button
                                    type="button"
                                    onClick={cancelEdit}
                                    style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "0.8rem", cursor: "pointer" }}
                                >
                                    Annuler
                                </button>
                            )}
                        </div>

                        {errors.global && (
                            <div style={{ background: "#fee2e2", color: "#b91c1c", padding: "8px 12px", borderRadius: "6px", fontSize: "0.8rem", marginBottom: "12px" }}>
                                {errors.global}
                            </div>
                        )}

                        <div className="flex-column" style={{ gap: "10px" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                                <FormGroup label={"Nom"} icone="user" error={errors.nom}>
                                    <Input
                                        type={"text"}
                                        value={formData.nom}
                                        onChange={(value) => setFormData({ ...formData, nom: value })}
                                        placeholder={"Ex: Dupont"}
                                    />
                                </FormGroup>
                                <FormGroup label={"Prénom"} icone="user" error={errors.prenom}>
                                    <Input
                                        type={"text"}
                                        value={formData.prenom}
                                        onChange={(value) => setFormData({ ...formData, prenom: value })}
                                        placeholder={"Ex: Jean"}
                                    />
                                </FormGroup>
                            </div>

                            <FormGroup label={"Email professionnel"} icone="envelope" error={errors.email}>
                                <Input
                                    type={"email"}
                                    value={formData.email}
                                    onChange={(value) => setFormData({ ...formData, email: value })}
                                    placeholder={"jean.dupont@organisation.org"}
                                />
                            </FormGroup>

                            <FormGroup label={"Numéro de téléphone"} icone="phone" error={errors.telephone}>
                                <Input
                                    type={"tel"}
                                    value={formData.telephone}
                                    onChange={(value) => setFormData({ ...formData, telephone: value })}
                                    placeholder={"+243 000 000 000"}
                                />
                            </FormGroup>

                            <FormGroup label={"Nom d'utilisateur"} icone="id-badge" error={errors.nom_utilisateur}>
                                <Input
                                    type={"text"}
                                    value={formData.nom_utilisateur}
                                    onChange={(value) => setFormData({ ...formData, nom_utilisateur: value })}
                                    placeholder={"jdupont"}
                                />
                            </FormGroup>

                            <FormGroup label={"Rôle & Permissions"} icone="user-shield" error={errors.categorie}>
                                <Select
                                    value={formData.categorie}
                                    onChange={(value) => setFormData({ ...formData, categorie: value })}
                                    options={categorieUtilisateur.map((cat) => ({
                                        value: cat.categorieutilisateurorgid,
                                        label: cat.libelle
                                    }))}
                                    placeholder={"Sélectionner un rôle"}
                                />
                            </FormGroup>

                            <FormGroup label={"Adresse physique / Ville"} icone="location-dot" error={errors.adresse}>
                                <Input
                                    type={"text"}
                                    value={formData.adresse}
                                    onChange={(value) => setFormData({ ...formData, adresse: value })}
                                    placeholder={"Goma, Nord-Kivu"}
                                />
                            </FormGroup>

                            <div style={{ marginTop: "8px" }}>
                                <Button
                                    label={editingUserId ? "Enregistrer les modifications" : "Envoyer l'invitation"}
                                    icone={editingUserId ? "floppy-disk" : "paper-plane"}
                                    loader={actionLoader}
                                    type={"submit"}
                                    size={"block"}
                                    variant={"primary"}
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}