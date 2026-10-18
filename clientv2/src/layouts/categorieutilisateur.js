import { useNavigate } from "react-router-dom";
import { Header } from "../components/maincomp";
import { Button, FormGroup, Input, Switch, Loader, EmptyState, Badge } from "../components/minicomp";
import { useState, useEffect, useMemo } from "react";

export function CategorieUtilisateur({}) {
    const [categorieUtilisateurs, setCategorieUtilisateurs] = useState([]);
    const [fonctionnalites, setFonctionnalites] = useState([]);
    const [loaderVisible, setLoaderVisible] = useState(false);
    const [actionLoader, setActionLoader] = useState(false);
    const [activeTab, setActiveTab] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState({});
    const [activeCategorieId, setActiveCategorieId] = useState(null);
    const [successMsg, setSuccessMsg] = useState("");
    const link = process.env.REACT_APP_LINK;

    const initialCategoryState = {
        designation: "",
        description: "",
        confirm: false,
        organisation: false,
        fonctionnalites: []
    };
    const [formData, setFormData] = useState(initialCategoryState);

    const loadCategorieUtilisateurs = async () => {
        setLoaderVisible(true);
        try {
            const res = await fetch(`${link}/categorieutilisateur`);
            const data = await res.json();
            if (data.success && Array.isArray(data.data)) {
                setCategorieUtilisateurs(data.data);
            }
        } catch (error) {
            console.log(error);
        }
        setLoaderVisible(false);
    };

    const loadFonctionnalites = async () => {
        try {
            const res = await fetch(`${link}/fonctionnalites`);
            const data = await res.json();
            if (data.status === "success" && Array.isArray(data.data)) {
                setFonctionnalites(data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleFonctionnaliteClick = (fonctionnaliteid) => {
        const current = formData.fonctionnalites || [];
        if (current.includes(fonctionnaliteid)) {
            setFormData({ ...formData, fonctionnalites: current.filter((id) => id !== fonctionnaliteid) });
        } else {
            setFormData({ ...formData, fonctionnalites: [...current, fonctionnaliteid] });
        }
    };

    const selectAllFonctionnalites = () => {
        setFormData({ ...formData, fonctionnalites: fonctionnalites.map((f) => f.fonctionnaliteid) });
    };

    const deselectAllFonctionnalites = () => {
        setFormData({ ...formData, fonctionnalites: [] });
    };

    const startEdit = (cat) => {
        setActiveCategorieId(cat.categorieutilisateurid);
        setFormData({
            designation: cat.designation || "",
            description: cat.description || "",
            confirm: !!cat.confirm,
            organisation: !!cat.organisation,
            fonctionnalites: cat.fonctionnalites || []
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const cancelEdit = () => {
        setActiveCategorieId(null);
        setFormData(initialCategoryState);
        setError({});
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const newErrors = {};
        if (!formData.designation?.trim()) newErrors.designation = "Veuillez saisir une désignation";
        if (!formData.description?.trim()) newErrors.description = "Veuillez saisir une description";

        if (Object.keys(newErrors).length > 0) {
            setError(newErrors);
            return;
        }

        setError({});
        setActionLoader(true);
        try {
            const endpoint = activeCategorieId ? `${link}/update_categorieutilisateur` : `${link}/categorieutilisateur`;
            const method = activeCategorieId ? "PUT" : "POST";

            const res = await fetch(endpoint, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    categorieutilisateurid: activeCategorieId,
                    ...formData
                }),
            });
            const data = await res.json();

            if (data.status === "success" || data.success) {
                setSuccessMsg(activeCategorieId ? "Rôle mis à jour avec succès !" : "Catégorie d'utilisateur créée avec succès !");
                setFormData(initialCategoryState);
                setActiveCategorieId(null);
                loadCategorieUtilisateurs();
                setTimeout(() => setSuccessMsg(""), 5000);
            } else {
                setError({ global: data.message || "Une erreur s'est produite" });
            }
        } catch (err) {
            console.error(err);
            setError({ global: "Erreur de communication avec le serveur" });
        }
        setActionLoader(false);
    };

    useEffect(() => {
        loadCategorieUtilisateurs();
        loadFonctionnalites();
    }, []);

    const filteredCategories = useMemo(() => {
        return categorieUtilisateurs.filter((cat) => {
            if (activeTab === "actif" && cat.status !== "actif") return false;
            if (activeTab === "inactif" && cat.status !== "inactif") return false;

            if (searchTerm.trim() !== "") {
                const term = searchTerm.toLowerCase();
                const matchDesig = (cat.designation || "").toLowerCase().includes(term);
                const matchDesc = (cat.description || "").toLowerCase().includes(term);
                return matchDesig || matchDesc;
            }
            return true;
        });
    }, [categorieUtilisateurs, activeTab, searchTerm]);

    return (
        <div className="pagestructure">
            <Header title={"Catégories d'utilisateurs & Rôles"} retour={true} />
            {loaderVisible && <Loader />}

            <div style={{ padding: "15px 20px" }}>
                {successMsg && (
                    <div style={{ background: "#dcfce7", color: "#166534", padding: "12px 16px", borderRadius: "8px", border: "1px solid #bbf7d0", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <i className="fa-solid fa-circle-check"></i>
                        {successMsg}
                    </div>
                )}

                {/* Filtres et recherche */}
                <div className="flex-between" style={{ flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
                    <div className="chip-group">
                        <button
                            type="button"
                            className={`chip ${activeTab === "all" ? "active" : ""}`}
                            onClick={() => setActiveTab("all")}
                        >
                            Tous les rôles ({categorieUtilisateurs.length})
                        </button>
                        <button
                            type="button"
                            className={`chip ${activeTab === "actif" ? "active" : ""}`}
                            onClick={() => setActiveTab("actif")}
                        >
                            <i className="fa-solid fa-circle" style={{ color: "#16a34a", fontSize: "0.6rem", marginRight: "4px" }}></i>
                            Actifs ({categorieUtilisateurs.filter(c => c.status === "actif").length})
                        </button>
                    </div>

                    <div style={{ width: "260px" }}>
                        <input
                            type="search"
                            className="form-control"
                            placeholder="Rechercher une catégorie..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ padding: "8px 14px", fontSize: "0.85rem" }}
                        />
                    </div>
                </div>

                {/* Grille : Tableau des rôles & Formulaire */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: "20px", alignItems: "start" }}>
                    {/* Tableau */}
                    <div className="table-responsive-wrapper" style={{ margin: 0, background: "white", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
                        {filteredCategories.length > 0 ? (
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Désignation</th>
                                        <th>Description</th>
                                        <th>Options</th>
                                        <th>Statut</th>
                                        <th style={{ textAlign: "right" }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCategories.map((cat) => (
                                        <tr key={cat.categorieutilisateurid}>
                                            <td>
                                                <strong style={{ color: "var(--primary)" }}>{cat.designation}</strong>
                                            </td>
                                            <td style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                                                {cat.description}
                                            </td>
                                            <td>
                                                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                                                    {cat.confirm && (
                                                        <span style={{ background: "#fef3c7", color: "#b45309", padding: "2px 6px", borderRadius: "4px", fontSize: "0.7rem", fontWeight: 600 }}>
                                                            Validation admin
                                                        </span>
                                                    )}
                                                    {cat.organisation && (
                                                        <span style={{ background: "#e0e7ff", color: "var(--primary)", padding: "2px 6px", borderRadius: "4px", fontSize: "0.7rem", fontWeight: 600 }}>
                                                            Organisation
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`badge badge-${cat.status === "actif" ? "oriented" : "high"}`}>
                                                    {cat.status || "actif"}
                                                </span>
                                            </td>
                                            <td style={{ textAlign: "right" }}>
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary btn-sm"
                                                    onClick={() => startEdit(cat)}
                                                    title="Modifier cette catégorie"
                                                    style={{ padding: "4px 8px", fontSize: "0.75rem" }}
                                                >
                                                    <i className="fa-solid fa-pen-to-square"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <EmptyState
                                icone="tags"
                                title="Aucune catégorie trouvée"
                                message="Aucune catégorie d'utilisateur ne correspond à votre recherche."
                            />
                        )}
                    </div>

                    {/* Formulaire */}
                    <form className="card" onSubmit={handleSubmit} style={{ margin: 0 }}>
                        <div className="flex-between" style={{ marginBottom: "14px", borderBottom: "1px solid var(--border-color)", paddingBottom: "10px" }}>
                            <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, color: "var(--text-main)" }}>
                                <i className={`fa-solid fa-${activeCategorieId ? "pen-to-square" : "plus"}`} style={{ color: "var(--primary)", marginRight: "8px" }}></i>
                                {activeCategorieId ? "Modifier la catégorie" : "Ajouter une catégorie"}
                            </h3>
                            {activeCategorieId && (
                                <button
                                    type="button"
                                    onClick={cancelEdit}
                                    style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "0.8rem", cursor: "pointer" }}
                                >
                                    Annuler
                                </button>
                            )}
                        </div>

                        {error.global && (
                            <div style={{ background: "#fee2e2", color: "#b91c1c", padding: "8px 12px", borderRadius: "6px", fontSize: "0.8rem", marginBottom: "12px" }}>
                                {error.global}
                            </div>
                        )}

                        <div className="flex-column" style={{ gap: "12px" }}>
                            <FormGroup label={"Désignation du rôle"} icone={"tag"} error={error.designation}>
                                <Input
                                    type={"text"}
                                    value={formData.designation}
                                    onChange={(value) => setFormData({ ...formData, designation: value })}
                                    placeholder={"Ex: Juriste Conseiller"}
                                />
                            </FormGroup>

                            <FormGroup label={"Description des responsabilités"} icone={"pen"} error={error.description}>
                                <Input
                                    type={"text"}
                                    value={formData.description}
                                    onChange={(value) => setFormData({ ...formData, description: value })}
                                    placeholder={"Rôle responsable de la prise en charge..."}
                                />
                            </FormGroup>

                            <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                                <div className="flex-between" style={{ marginBottom: "8px" }}>
                                    <span style={{ fontSize: "0.82rem", color: "var(--text-main)" }}>
                                        Validation administrateur requise
                                    </span>
                                    <Switch
                                        onChange={(value) => setFormData({ ...formData, confirm: value })}
                                        value={formData.confirm}
                                    />
                                </div>
                                <div className="flex-between">
                                    <span style={{ fontSize: "0.82rem", color: "var(--text-main)" }}>
                                        Rôle affilié à une organisation
                                    </span>
                                    <Switch
                                        onChange={(value) => setFormData({ ...formData, organisation: value })}
                                        value={formData.organisation}
                                    />
                                </div>
                            </div>

                            <FormGroup label={`Permissions attribuées (${(formData.fonctionnalites || []).length}/${fonctionnalites.length})`} icone={"sliders"}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Sélectionnez les accès autorisés :</span>
                                    <div style={{ display: "flex", gap: "6px" }}>
                                        <button
                                            type="button"
                                            onClick={selectAllFonctionnalites}
                                            style={{ background: "none", border: "none", color: "var(--primary)", fontSize: "0.72rem", cursor: "pointer", fontWeight: 600 }}
                                        >
                                            Tout cocher
                                        </button>
                                        <span style={{ color: "#cbd5e1" }}>|</span>
                                        <button
                                            type="button"
                                            onClick={deselectAllFonctionnalites}
                                            style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "0.72rem", cursor: "pointer" }}
                                        >
                                            Effacer
                                        </button>
                                    </div>
                                </div>

                                <div className="chip-group" style={{ maxHeight: "180px", overflowY: "auto", padding: "4px" }}>
                                    {fonctionnalites.map((fonct) => {
                                        const isSelected = (formData.fonctionnalites || []).includes(fonct.fonctionnaliteid);
                                        return (
                                            <button
                                                key={fonct.fonctionnaliteid}
                                                type="button"
                                                className={`chip ${isSelected ? "active" : ""}`}
                                                onClick={() => handleFonctionnaliteClick(fonct.fonctionnaliteid)}
                                                style={{ fontSize: "0.75rem", padding: "4px 10px" }}
                                            >
                                                <i className={`fa-solid fa-${isSelected ? "check" : "plus"}`} style={{ marginRight: "4px" }}></i>
                                                {fonct.designation}
                                            </button>
                                        );
                                    })}
                                </div>
                            </FormGroup>

                            <Button
                                label={activeCategorieId ? "Enregistrer les modifications" : "Créer la catégorie"}
                                icone="floppy-disk"
                                loader={actionLoader}
                                type={"submit"}
                                size={"block"}
                                variant={"primary"}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}