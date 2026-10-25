import { useNavigate } from "react-router-dom";
import { Header } from "../components/maincomp";
import { Button, FormGroup, Input, Select, Loader, EmptyState, Modal } from "../components/minicomp";
import { useState, useEffect, useMemo } from "react";

export function CategoriesIncident({}) {
    const [categories, setCategories] = useState([]);
    const [loaderVisible, setLoaderVisible] = useState(false);
    const [actionLoader, setActionLoader] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingCategory, setEditingCategory] = useState(null);
    const [successMsg, setSuccessMsg] = useState("");
    const link = process.env.REACT_APP_LINK;

    const initialCatState = {
        designation: "",
        niveau: "moyen",
    };
    const [formData, setFormData] = useState(initialCatState);
    const [errors, setErrors] = useState({});

    const loadCategories = async () => {
        setLoaderVisible(true);
        try {
            const res = await fetch(`${link}/categorie_incident`);
            const data = await res.json();
            if (data?.data && Array.isArray(data.data)) {
                setCategories(data.data);
            }
        } catch (err) {
            console.log("Error loading categories:", err);
        }
        setLoaderVisible(false);
    };

    const handleCreateCategory = async (e) => {
        e.preventDefault();
        if (!formData.designation?.trim()) {
            setErrors({ designation: "La désignation du domaine est requise" });
            return;
        }

        setErrors({});
        setActionLoader(true);
        try {
            const res = await fetch(`${link}/categorie_incident`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.status === "success" || data.success) {
                setSuccessMsg("Catégorie de signalement ajoutée avec succès !");
                setFormData(initialCatState);
                loadCategories();
                setTimeout(() => setSuccessMsg(""), 5000);
            } else {
                alert(data.message || "Erreur lors de l'ajout");
            }
        } catch (err) {
            console.log(err);
        }
        setActionLoader(false);
    };

    const handleUpdateCategory = async () => {
        if (!editingCategory?.designation?.trim()) return;
        setActionLoader(true);
        try {
            const res = await fetch(`${link}/categorie_incident/${editingCategory.categorie_id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editingCategory)
            });
            const data = await res.json();
            if (data.success || data.status === "success") {
                setSuccessMsg("Catégorie mise à jour avec succès !");
                setEditingCategory(null);
                loadCategories();
                setTimeout(() => setSuccessMsg(""), 5000);
            } else {
                alert(data.message || "Erreur lors de la mise à jour");
            }
        } catch (err) {
            console.log(err);
        }
        setActionLoader(false);
    };

    const toggleEtat = async (id) => {
        try {
            const res = await fetch(`${link}/categorie_incident/${id}/toggle`, {
                method: "POST"
            });
            const data = await res.json();
            if (data.success) {
                loadCategories();
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const filtered = useMemo(() => {
        if (!searchTerm.trim()) return categories;
        const term = searchTerm.toLowerCase();
        return categories.filter(c =>
            (c.designation || "").toLowerCase().includes(term) ||
            (c.niveau || "").toLowerCase().includes(term)
        );
    }, [categories, searchTerm]);

    return (
        <div className="pagestructure">
            <Header title={"Catégories de Signalements & Domaines"} retour={true} />
            {loaderVisible && <Loader />}

            <div style={{ padding: "15px 20px" }}>
                {successMsg && (
                    <div style={{ background: "#dcfce7", color: "#166534", padding: "12px 16px", borderRadius: "8px", border: "1px solid #bbf7d0", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <i className="fa-solid fa-circle-check"></i>
                        {successMsg}
                    </div>
                )}

                <div className="flex-between" style={{ flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
                    <div>
                        <span style={{ fontSize: "0.9rem", color: "var(--text-muted)", fontWeight: 600 }}>
                            {categories.length} domaines d'intervention répertoriés
                        </span>
                        <p style={{ margin: "2px 0 0 0", fontSize: "0.78rem", color: "var(--text-muted)" }}>
                            Les organisations ayant ces domaines dans leur profil recevront automatiquement des notifications push lors d'un nouveau signalement.
                        </p>
                    </div>

                    <div style={{ width: "260px" }}>
                        <input
                            type="search"
                            className="form-control"
                            placeholder="Rechercher un domaine..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ padding: "8px 14px", fontSize: "0.85rem" }}
                        />
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "20px", alignItems: "start" }}>
                    {/* Tableau */}
                    <div className="table-responsive-wrapper" style={{ margin: 0, background: "white", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
                        {filtered.length > 0 ? (
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Domaine / Catégorie</th>
                                        <th>Niveau de priorité</th>
                                        <th>Statut</th>
                                        <th style={{ textAlign: "right" }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((cat) => {
                                        const isCritique = cat.niveau === "critique" || cat.niveau === "elevé";
                                        const isActif = cat.etat === "actif";
                                        return (
                                            <tr key={cat.categorie_id}>
                                                <td>
                                                    <strong style={{ color: "var(--text-main)" }}>{cat.designation}</strong>
                                                </td>
                                                <td>
                                                    <span className={`badge badge-${isCritique ? "high" : "medium"}`}>
                                                        {cat.niveau || "moyen"}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`badge badge-${isActif ? "oriented" : "high"}`}>
                                                        {cat.etat || "actif"}
                                                    </span>
                                                </td>
                                                <td style={{ textAlign: "right" }}>
                                                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "6px" }}>
                                                        <button
                                                            type="button"
                                                            className="btn btn-secondary btn-sm"
                                                            onClick={() => setEditingCategory(cat)}
                                                            title="Modifier"
                                                            style={{ padding: "4px 8px", fontSize: "0.75rem" }}
                                                        >
                                                            <i className="fa-solid fa-pen-to-square"></i>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn btn-secondary btn-sm"
                                                            onClick={() => toggleEtat(cat.categorie_id)}
                                                            title={isActif ? "Désactiver" : "Activer"}
                                                            style={{ padding: "4px 8px", fontSize: "0.75rem", color: isActif ? "#dc2626" : "#16a34a" }}
                                                        >
                                                            <i className={`fa-solid fa-${isActif ? "ban" : "check"}`}></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        ) : (
                            <EmptyState
                                icone="tags"
                                title="Aucun domaine trouvé"
                                message="Aucune catégorie de signalement ne correspond à votre recherche."
                            />
                        )}
                    </div>

                    {/* Formulaire d'ajout */}
                    <form className="card" onSubmit={handleCreateCategory} style={{ margin: 0 }}>
                        <div style={{ marginBottom: "14px", borderBottom: "1px solid var(--border-color)", paddingBottom: "10px" }}>
                            <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, color: "var(--text-main)" }}>
                                <i className="fa-solid fa-tag" style={{ color: "var(--primary)", marginRight: "8px" }}></i>
                                Nouveau domaine d'intervention
                            </h3>
                        </div>

                        <div className="flex-column" style={{ gap: "12px" }}>
                            <FormGroup label={"Désignation de la catégorie"} icone="tag" error={errors.designation}>
                                <Input
                                    type={"text"}
                                    value={formData.designation}
                                    onChange={(value) => setFormData({ ...formData, designation: value })}
                                    placeholder={"Ex: Violences basées sur le genre"}
                                />
                            </FormGroup>

                            <FormGroup label={"Niveau d'urgence par défaut"} icone="triangle-exclamation">
                                <Select
                                    value={formData.niveau}
                                    onChange={(value) => setFormData({ ...formData, niveau: value })}
                                    options={[
                                        { value: "critique", label: "Critique (Urgence immédiate)" },
                                        { value: "elevé", label: "Élevé (Haute priorité)" },
                                        { value: "moyen", label: "Moyen (Priorité standard)" },
                                        { value: "faible", label: "Faible (Suivi standard)" }
                                    ]}
                                    placeholder={"Choisir la priorité"}
                                />
                            </FormGroup>

                            <Button
                                label="Ajouter le domaine"
                                icone="plus"
                                loader={actionLoader}
                                type={"submit"}
                                size={"block"}
                                variant={"primary"}
                            />
                        </div>
                    </form>
                </div>
            </div>

            {/* Modal d'édition */}
            <Modal
                isOpen={!!editingCategory}
                onClose={() => setEditingCategory(null)}
                title="Modifier le domaine"
            >
                {editingCategory && (
                    <div className="flex-column" style={{ gap: "12px" }}>
                        <FormGroup label="Désignation" icone="tag">
                            <Input
                                type="text"
                                value={editingCategory.designation}
                                onChange={(value) => setEditingCategory({ ...editingCategory, designation: value })}
                                placeholder="Désignation"
                            />
                        </FormGroup>

                        <FormGroup label="Niveau de priorité" icone="triangle-exclamation">
                            <Select
                                value={editingCategory.niveau}
                                onChange={(value) => setEditingCategory({ ...editingCategory, niveau: value })}
                                options={[
                                    { value: "critique", label: "Critique" },
                                    { value: "elevé", label: "Élevé" },
                                    { value: "moyen", label: "Moyen" },
                                    { value: "faible", label: "Faible" }
                                ]}
                                placeholder="Priorité"
                            />
                        </FormGroup>

                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "12px" }}>
                            <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                onClick={() => setEditingCategory(null)}
                                disabled={actionLoader}
                            >
                                Annuler
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary btn-sm"
                                onClick={handleUpdateCategory}
                                disabled={actionLoader}
                            >
                                {actionLoader ? (
                                    <>
                                        <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: "6px" }}></i>
                                        Enregistrement...
                                    </>
                                ) : (
                                    <>
                                        <i className="fa-solid fa-check" style={{ marginRight: "6px" }}></i>
                                        Enregistrer
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}

