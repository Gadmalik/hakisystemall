import { useNavigate } from "react-router-dom";
import { Header } from "../components/maincomp";
import { Button, FormGroup, Input, Loader, EmptyState, Badge } from "../components/minicomp";
import { useState, useEffect, useMemo } from "react";

export function CategorieUtilisateurOrg({}) {
    const [user] = useState(JSON.parse(localStorage.getItem("userinfo") || "{}"));
    const [categorieUtilisateur, setCategorieUtilisateur] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategorieUtilisateur, setSelectedCategorieUtilisateur] = useState([]);
    const [fonctionnalites, setFonctionnalites] = useState([]);
    const [loader, setLoader] = useState(false);
    const [loaderVisible, setLoaderVisible] = useState(false);
    const [errors, setErrors] = useState({});
    const [successMsg, setSuccessMsg] = useState("");
    const link = process.env.REACT_APP_LINK;
    const navigate = useNavigate();

    const [categorieutilisateurorg, setCategorieutilisateurorg] = useState({
        libelle: "",
        description: "",
        organisationid: user?.organisationid,
        fonctionnalites: []
    });

    const loadCategorieUtilisateurs = async () => {
        if (!user?.organisationid) return;
        setLoaderVisible(true);
        try {
            const response = await fetch(`${link}/getcategorieutilisateurorg/${user.organisationid}`);
            const data = await response.json();
            if (data.success && Array.isArray(data.data)) {
                setCategorieUtilisateur(data.data);
            }
        } catch (error) {
            console.error("Erreur chargement catégories organisation:", error);
        } finally {
            setLoaderVisible(false);
        }
    };

    const loadFonctionnalites = async () => {
        try {
            const response = await fetch(`${link}/fonctionnalites`);
            const data = await response.json();
            if (data.success && Array.isArray(data.data)) {
                setFonctionnalites(data.data);
            }
        } catch (error) {
            console.error("Erreur chargement fonctionnalités:", error);
        }
    };

    const filteredCategories = useMemo(() => {
        if (!searchTerm) return categorieUtilisateur;
        const q = searchTerm.toLowerCase();
        return categorieUtilisateur.filter((cat) =>
            `${cat.libelle || ""} ${cat.description || ""}`.toLowerCase().includes(q)
        );
    }, [categorieUtilisateur, searchTerm]);

    const handleCheckboxChange = (e, id) => {
        if (e.target.checked) {
            setSelectedCategorieUtilisateur([...selectedCategorieUtilisateur, id]);
        } else {
            setSelectedCategorieUtilisateur(selectedCategorieUtilisateur.filter((item) => item !== id));
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedCategorieUtilisateur(filteredCategories.map((c) => c.categorieutilisateurorgid));
        } else {
            setSelectedCategorieUtilisateur([]);
        }
    };

    const handleFonctionnaliteClick = (fonctionnaliteid) => {
        if (categorieutilisateurorg.fonctionnalites?.includes(fonctionnaliteid)) {
            setCategorieutilisateurorg({
                ...categorieutilisateurorg,
                fonctionnalites: categorieutilisateurorg.fonctionnalites.filter((id) => id !== fonctionnaliteid)
            });
        } else {
            setCategorieutilisateurorg({
                ...categorieutilisateurorg,
                fonctionnalites: [...categorieutilisateurorg.fonctionnalites, fonctionnaliteid]
            });
        }
    };

    const handleSelectAllFonctionnalites = () => {
        if (categorieutilisateurorg.fonctionnalites.length === fonctionnalites.length) {
            setCategorieutilisateurorg({ ...categorieutilisateurorg, fonctionnalites: [] });
        } else {
            setCategorieutilisateurorg({
                ...categorieutilisateurorg,
                fonctionnalites: fonctionnalites.map((f) => f.fonctionnaliteid)
            });
        }
    };

    const ajouter = async (event) => {
        event.preventDefault();
        setSuccessMsg("");
        const newErrors = {};

        if (!categorieutilisateurorg.libelle.trim()) {
            newErrors.libelle = "Veuillez saisir un intitulé pour ce rôle.";
        }
        if (!categorieutilisateurorg.description.trim()) {
            newErrors.description = "Veuillez saisir une description.";
        }
        if (categorieutilisateurorg.fonctionnalites.length === 0) {
            newErrors.fonctionnalites = "Veuillez associer au moins une fonctionnalité.";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoader(true);
        try {
            const res = await fetch(`${link}/categorieutilisateurorg`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...categorieutilisateurorg,
                    organisationid: user?.organisationid
                }),
            });
            const dataresponse = await res.json();

            if (dataresponse.status === "success" || dataresponse.success) {
                setSuccessMsg("Rôle / profil créé avec succès pour votre organisation !");
                loadCategorieUtilisateurs();
                setCategorieutilisateurorg({
                    libelle: "",
                    description: "",
                    organisationid: user?.organisationid,
                    fonctionnalites: []
                });
                setErrors({});
            } else {
                setErrors({ global: dataresponse.message || "Erreur lors de l'enregistrement" });
            }
        } catch (err) {
            setErrors({ global: "Une erreur réseau s'est produite !" });
            console.error(err);
        } finally {
            setLoader(false);
        }
    };

    useEffect(() => {
        loadCategorieUtilisateurs();
        loadFonctionnalites();
    }, []);

    return (
        <div className="pagestructure">
            <Header title={"Rôles & Profils de l'Organisation"} retour={true} onSearch={setSearchTerm} />

            <div className="dashboard-content" style={{ padding: "20px" }}>
                {/* En-tête info */}
                <div style={{
                    background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
                    color: "white",
                    padding: "20px 24px",
                    borderRadius: "14px",
                    marginBottom: "24px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "12px"
                }}>
                    <div>
                        <h2 style={{ margin: "0 0 6px 0", fontSize: "1.25rem", fontWeight: 700 }}>
                            <i className="fas fa-id-badge" style={{ marginRight: "10px", color: "#60a5fa" }}></i>
                            Gestion des profils d'accès internes
                        </h2>
                        <p style={{ margin: 0, opacity: 0.85, fontSize: "0.85rem" }}>
                            Définissez les rôles et attribuez des permissions granulaires aux membres de votre organisation.
                        </p>
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                        <span style={{
                            background: "rgba(255,255,255,0.15)",
                            padding: "6px 14px",
                            borderRadius: "20px",
                            fontSize: "0.85rem",
                            fontWeight: 600
                        }}>
                            {categorieUtilisateur.length} rôle(s) actif(s)
                        </span>
                    </div>
                </div>

                <div className="flex-row" style={{ alignItems: "flex-start", gap: "20px" }}>
                    {/* Tableau des catégories existantes */}
                    <div className="flex-1" style={{ minWidth: "320px" }}>
                        <div className="card" style={{ padding: "16px" }}>
                            <div className="flex-between" style={{ marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
                                <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
                                    <i className="fas fa-search" style={{
                                        position: "absolute",
                                        left: "12px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        color: "#94a3b8"
                                    }}></i>
                                    <input
                                        type="text"
                                        placeholder="Rechercher un rôle..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        style={{
                                            width: "100%",
                                            padding: "8px 12px 8px 36px",
                                            border: "1px solid #cbd5e1",
                                            borderRadius: "8px",
                                            fontSize: "0.85rem"
                                        }}
                                    />
                                </div>
                                <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                                    {filteredCategories.length} résultat(s)
                                </span>
                            </div>

                            {loaderVisible ? (
                                <div style={{ padding: "40px 0" }}><Loader /></div>
                            ) : filteredCategories.length === 0 ? (
                                <EmptyState
                                    icone="id-badge"
                                    titre="Aucun profil configuré"
                                    message={searchTerm ? "Aucun profil ne correspond à votre recherche." : "Vous n'avez pas encore défini de profils pour votre organisation. Créez-en un via le formulaire ci-contre."}
                                />
                            ) : (
                                <div className="table-responsive-wrapper">
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th style={{ width: "30px" }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={filteredCategories.length > 0 && selectedCategorieUtilisateur.length === filteredCategories.length}
                                                        onChange={handleSelectAll}
                                                    />
                                                </th>
                                                <th>Intitulé du rôle</th>
                                                <th>Description</th>
                                                <th>Statut</th>
                                                <th style={{ textAlign: "right" }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredCategories.map((categorie) => (
                                                <tr key={categorie.categorieutilisateurorgid || categorie.libelle}>
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedCategorieUtilisateur.includes(categorie.categorieutilisateurorgid)}
                                                            onChange={(e) => handleCheckboxChange(e, categorie.categorieutilisateurorgid)}
                                                        />
                                                    </td>
                                                    <td style={{ fontWeight: 600, color: "#1e293b" }}>
                                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                            <i className="fas fa-shield-alt" style={{ color: "#384bb6" }}></i>
                                                            {categorie.libelle}
                                                        </div>
                                                    </td>
                                                    <td style={{ color: "#475569", fontSize: "0.85rem" }}>
                                                        {categorie.description || "Aucune description"}
                                                    </td>
                                                    <td>
                                                        <Badge
                                                            text={categorie.status || "actif"}
                                                            variant={categorie.status === "actif" || !categorie.status ? "success" : "danger"}
                                                        />
                                                    </td>
                                                    <td style={{ textAlign: "right" }}>
                                                        <button
                                                            className="btn-icon"
                                                            title="Utiliser comme modèle"
                                                            onClick={() => {
                                                                setCategorieutilisateurorg({
                                                                    ...categorieutilisateurorg,
                                                                    libelle: `${categorie.libelle} (Copie)`,
                                                                    description: categorie.description || "",
                                                                });
                                                            }}
                                                            style={{
                                                                border: "none",
                                                                background: "#f1f5f9",
                                                                padding: "6px 10px",
                                                                borderRadius: "6px",
                                                                color: "#384bb6",
                                                                cursor: "pointer"
                                                            }}
                                                        >
                                                            <i className="fas fa-copy"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Formulaire de création */}
                    <div style={{ width: "380px", flexShrink: 0 }}>
                        <form className="card" onSubmit={ajouter} style={{ padding: "20px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                                <i className="fas fa-plus-circle" style={{ color: "#384bb6", fontSize: "1.2rem" }}></i>
                                <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700 }}>Créer un nouveau profil</h3>
                            </div>

                            {successMsg && (
                                <div style={{
                                    background: "#dcfce7",
                                    color: "#166534",
                                    padding: "10px 14px",
                                    borderRadius: "8px",
                                    marginBottom: "16px",
                                    fontSize: "0.85rem",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px"
                                }}>
                                    <i className="fas fa-check-circle"></i>
                                    {successMsg}
                                </div>
                            )}

                            {errors.global && (
                                <div style={{
                                    background: "#fee2e2",
                                    color: "#991b1b",
                                    padding: "10px 14px",
                                    borderRadius: "8px",
                                    marginBottom: "16px",
                                    fontSize: "0.85rem"
                                }}>
                                    {errors.global}
                                </div>
                            )}

                            <FormGroup label={"Intitulé du rôle"} icone={"tag"} error={errors.libelle}>
                                <Input
                                    type={"text"}
                                    value={categorieutilisateurorg.libelle}
                                    onChange={(value) => setCategorieutilisateurorg({ ...categorieutilisateurorg, libelle: value })}
                                    placeholder={"Ex: Juriste Référent, Médiateur..."}
                                />
                            </FormGroup>

                            <FormGroup label={"Description"} icone={"align-left"} error={errors.description}>
                                <Input
                                    type={"text"}
                                    value={categorieutilisateurorg.description}
                                    onChange={(value) => setCategorieutilisateurorg({ ...categorieutilisateurorg, description: value })}
                                    placeholder={"Ex: Gestion et accompagnement des victimes"}
                                />
                            </FormGroup>

                            <FormGroup label={"Permissions attribuées"} icone={"sliders"}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                                    <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                                        {categorieutilisateurorg.fonctionnalites.length} sélectionnée(s)
                                    </span>
                                    <button
                                        type="button"
                                        onClick={handleSelectAllFonctionnalites}
                                        style={{
                                            border: "none",
                                            background: "none",
                                            color: "#384bb6",
                                            fontSize: "0.75rem",
                                            cursor: "pointer",
                                            fontWeight: 600,
                                            padding: 0
                                        }}
                                    >
                                        {categorieutilisateurorg.fonctionnalites.length === fonctionnalites.length ? "Tout désélectionner" : "Tout sélectionner"}
                                    </button>
                                </div>

                                <div className="chip-group" style={{ display: "flex", flexWrap: "wrap", gap: "6px", maxHeight: "200px", overflowY: "auto", padding: "4px 0" }}>
                                    {fonctionnalites.map((fonctionnalite) => {
                                        const isSelected = categorieutilisateurorg.fonctionnalites?.includes(fonctionnalite.fonctionnaliteid);
                                        return (
                                            <button
                                                key={fonctionnalite.fonctionnaliteid}
                                                type="button"
                                                className={`chip ${isSelected ? "active" : ""}`}
                                                onClick={() => handleFonctionnaliteClick(fonctionnalite.fonctionnaliteid)}
                                                style={{
                                                    fontSize: "0.75rem",
                                                    padding: "4px 10px",
                                                    borderRadius: "16px",
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: "6px"
                                                }}
                                            >
                                                <i className={`fas fa-${isSelected ? "check" : "plus"}`} style={{ fontSize: "0.7rem" }}></i>
                                                {fonctionnalite.designation}
                                            </button>
                                        );
                                    })}
                                </div>
                                {errors.fonctionnalites && (
                                    <span style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "4px", display: "block" }}>
                                        {errors.fonctionnalites}
                                    </span>
                                )}
                            </FormGroup>

                            <div style={{ marginTop: "20px" }}>
                                <Button
                                    label={"Créer le profil"}
                                    icone="check"
                                    loader={loader}
                                    type={"submit"}
                                    size={"box"}
                                    variant={"primary"}
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}