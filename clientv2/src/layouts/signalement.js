import { useNavigate, useSearchParams } from "react-router-dom";
import { Header } from "../components/maincomp";
import { Button, Loader, EmptyState } from "../components/minicomp";
import { useState, useEffect, useMemo } from "react";

export function Signalement({}) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [visibleLoader, setVisibleLoader] = useState(false);
    const [signalements, setSignalements] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeTab, setActiveTab] = useState("libres"); // Par défaut : signalements libres
    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedPriority, setSelectedPriority] = useState("");
    const link = process.env.REACT_APP_LINK;
    const [user] = useState(JSON.parse(localStorage.getItem("userinfo") || "{}"));

    const loadSignalements = async () => {
        setVisibleLoader(true);
        try {
            const res = await fetch(`${link}/getincident`);
            const data = await res.json();
            if (data?.data && Array.isArray(data.data)) {
                setSignalements(data.data);
            }
        } catch (error) {
            console.log("Error loading signalements:", error);
        }
        setVisibleLoader(false);
    };

    const loadCategories = async () => {
        try {
            const res = await fetch(`${link}/get_categorie`);
            const data = await res.json();
            if (data?.data) {
                setCategories(data.data);
            }
        } catch (error) {
            console.log("Error loading categories:", error);
        }
    };

    const handlePrendreEnCharge = async (e, id_incident) => {
        e.stopPropagation();
        if (!user?.userid) return alert("Veuillez vous reconnecter pour prendre en charge un dossier.");
        if (!window.confirm("Voulez-vous prendre en charge ce signalement ? Il sera assigné à votre compte et ne sera plus disponible dans la liste libre.")) return;

        try {
            const response = await fetch(`${link}/suivredossier`, {
                headers: { "Content-Type": "application/json" },
                method: "POST",
                body: JSON.stringify({
                    userid: user.userid,
                    dossierid: id_incident,
                    organisationid: user.organisationid || null,
                    type: "prise",
                    status: "en cours"
                })
            });
            const result = await response.json();
            if (result.status === "success") {
                alert("Dossier pris en charge avec succès ! Il a été transféré dans vos dossiers suivis.");
                loadSignalements();
            } else {
                alert(result.message || "Erreur lors de la prise en charge");
            }
        } catch (err) {
            console.log("Takeover error:", err);
            alert("Une erreur s'est produite lors de la prise en charge.");
        }
    };

    // Export CSV fonctionnel
    const exportCSV = () => {
        if (filteredSignalements.length === 0) return alert("Aucun signalement à exporter");
        const headers = ["Code Unique", "Categorie", "Date", "Lieu", "Niveau", "Statut", "Gestionnaire", "Organisation"];
        const rows = filteredSignalements.map(s => [
            `"${s.code_unique || ''}"`,
            `"${s.categorie || s.designation || ''}"`,
            `"${new Date(s.date_incident).toLocaleDateString()}"`,
            `"${(s.lieu || '').replace(/"/g, '""')}"`,
            `"${s.niveau || ''}"`,
            `"${s.statusatt || 'Libre'}"`,
            `"${(s.nom_gestionnaire ? `${s.nom_gestionnaire} ${s.prenom_gestionnaire || ''}` : '').trim()}"`,
            `"${s.organisation_nom || ''}"`
        ]);
        const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(";"), ...rows.map(e => e.join(";"))].join("\n");
        const encodedUri = encodeURI(csvContent);
        const linkElem = document.createElement("a");
        linkElem.setAttribute("href", encodedUri);
        linkElem.setAttribute("download", `signalements_${activeTab}_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(linkElem);
        linkElem.click();
        document.body.removeChild(linkElem);
    };

    useEffect(() => {
        loadSignalements();
        loadCategories();
    }, []);

    // Détermination stricte : Est-ce qu'un signalement est suivi/pris en charge ?
    const isDossierSuivi = (sig) => {
        const st = (sig.statusatt || "").toLowerCase();
        return st === "en cours" || st === "accepté" || st === "analyse" || st === "résolu" || st === "cloturé";
    };

    // Calcul des compteurs d'onglets
    const tabCounts = useMemo(() => {
        let libres = 0;
        let encours = 0;
        let orientes = 0;
        let resolus = 0;

        signalements.forEach(s => {
            const st = (s.statusatt || "").toLowerCase();
            const tp = (s.type_attribut || "").toLowerCase();

            if (tp === "orientation") {
                orientes++;
            } else if (st === "résolu" || st === "cloturé") {
                resolus++;
            } else if (st === "en cours" || st === "accepté") {
                encours++;
            } else if (!isDossierSuivi(s)) {
                libres++;
            }
        });

        return { libres, encours, orientes, resolus, tous: signalements.length };
    }, [signalements]);

    // Filtrage dynamique
    const filteredSignalements = useMemo(() => {
        return signalements.filter(sig => {
            const st = (sig.statusatt || "").toLowerCase();
            const tp = (sig.type_attribut || "").toLowerCase();

            // 1. Filtre par onglet
            if (activeTab === "libres") {
                // IMPORTANT : Dans "Signalements libres", SEULS les cas non suivis par qui que ce soit sont visibles !
                if (isDossierSuivi(sig) || tp === "orientation") return false;
            } else if (activeTab === "encours") {
                if (st !== "en cours" && st !== "accepté" && st !== "analyse") return false;
            } else if (activeTab === "orientes") {
                if (tp !== "orientation") return false;
            } else if (activeTab === "resolus") {
                if (st !== "résolu" && st !== "cloturé") return false;
            }

            // 2. Recherche textuelle
            if (searchTerm.trim() !== "") {
                const term = searchTerm.toLowerCase();
                const matchCode = (sig.code_unique || "").toLowerCase().includes(term);
                const matchDesc = (sig.description || "").toLowerCase().includes(term);
                const matchLieu = (sig.lieu || "").toLowerCase().includes(term);
                const matchCat = (sig.categorie || sig.designation || "").toLowerCase().includes(term);
                if (!matchCode && !matchDesc && !matchLieu && !matchCat) return false;
            }

            // 3. Filtre par catégorie
            if (selectedCategory && sig.categorieid != selectedCategory) {
                return false;
            }

            // 4. Filtre par priorité
            if (selectedPriority && (sig.niveau || "").toLowerCase() !== selectedPriority.toLowerCase()) {
                return false;
            }

            return true;
        });
    }, [signalements, activeTab, searchTerm, selectedCategory, selectedPriority]);

    return (
        <div className="pagestructure">
            <Header 
                title={"Signalements"} 
                retour={true} 
                onSearch={(term) => setSearchTerm(term)}
            />

            {visibleLoader && <Loader />}

            {/* Barre de navigation par onglets */}
            <div style={{ padding: "0 15px", marginTop: "15px" }}>
                <div className="flex-between" style={{ flexWrap: "wrap", gap: "10px" }}>
                    <div className="chip-group">
                        <button
                            type="button"
                            className={`chip ${activeTab === "libres" ? "active" : ""}`}
                            onClick={() => setActiveTab("libres")}
                            style={{ position: "relative" }}
                        >
                            <i className="fa-solid fa-bell-concierge" style={{ marginRight: "6px" }}></i>
                            Signalements libres ({tabCounts.libres})
                        </button>
                        <button
                            type="button"
                            className={`chip ${activeTab === "encours" ? "active" : ""}`}
                            onClick={() => setActiveTab("encours")}
                        >
                            <i className="fa-solid fa-clock-rotate-left" style={{ marginRight: "6px" }}></i>
                            En analyse ({tabCounts.encours})
                        </button>
                        <button
                            type="button"
                            className={`chip ${activeTab === "orientes" ? "active" : ""}`}
                            onClick={() => setActiveTab("orientes")}
                        >
                            <i className="fa-solid fa-share-nodes" style={{ marginRight: "6px" }}></i>
                            Orientés ({tabCounts.orientes})
                        </button>
                        <button
                            type="button"
                            className={`chip ${activeTab === "resolus" ? "active" : ""}`}
                            onClick={() => setActiveTab("resolus")}
                        >
                            <i className="fa-solid fa-circle-check" style={{ marginRight: "6px" }}></i>
                            Clôturés ({tabCounts.resolus})
                        </button>
                        <button
                            type="button"
                            className={`chip ${activeTab === "tous" ? "active" : ""}`}
                            onClick={() => setActiveTab("tous")}
                        >
                            Tous ({tabCounts.tous})
                        </button>
                    </div>

                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <Button 
                            label="Exporter CSV" 
                            variant="secondary" 
                            size="sm" 
                            icone="file-export"
                            onClick={exportCSV} 
                        />
                        <button 
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => navigate("/signaler")}
                            style={{ display: "flex", alignItems: "center", gap: "6px" }}
                        >
                            <i className="fa-solid fa-plus"></i> Nouveau signalement
                        </button>
                    </div>
                </div>

                {/* Filtres secondaires */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", margin: "14px 0", background: "white", padding: "12px 16px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", alignItems: "center" }}>
                    <div style={{ flex: 1, minWidth: "200px" }}>
                        <input
                            type="search"
                            className="form-control"
                            placeholder="Filtrer par mot-clé, code, lieu..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: "100%", padding: "8px 12px", fontSize: "0.85rem" }}
                        />
                    </div>

                    <div style={{ width: "200px" }}>
                        <select
                            className="form-control"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            style={{ width: "100%", padding: "8px 12px", fontSize: "0.85rem" }}
                        >
                            <option value="">Tous les domaines</option>
                            {categories.map((c) => (
                                <option key={c.categorie_id} value={c.categorie_id}>
                                    {c.designation}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={{ width: "160px" }}>
                        <select
                            className="form-control"
                            value={selectedPriority}
                            onChange={(e) => setSelectedPriority(e.target.value)}
                            style={{ width: "100%", padding: "8px 12px", fontSize: "0.85rem" }}
                        >
                            <option value="">Toutes priorités</option>
                            <option value="critique">Critique</option>
                            <option value="elevé">Élevé</option>
                            <option value="moyen">Moyen</option>
                            <option value="faible">Faible</option>
                        </select>
                    </div>

                    {(searchTerm || selectedCategory || selectedPriority) && (
                        <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => { setSearchTerm(""); setSelectedCategory(""); setSelectedPriority(""); }}
                            style={{ padding: "8px 12px" }}
                        >
                            Réinitialiser
                        </button>
                    )}
                </div>
            </div>

            {/* Notice explicative pour l'onglet libre */}
            {activeTab === "libres" && (
                <div style={{ margin: "0 15px 12px", padding: "10px 14px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", fontSize: "0.82rem", color: "#166534", display: "flex", alignItems: "center", gap: "8px" }}>
                    <i className="fa-solid fa-shield-heart" style={{ fontSize: "1rem" }}></i>
                    <span>
                        <strong>Espace Signalements Libres :</strong> Ces dossiers n'ont pas encore été pris en charge. Dès qu'un intervenant ou une organisation prend en charge un dossier, celui-ci quitte automatiquement cette liste pour garantir l'unicité du suivi.
                    </span>
                </div>
            )}

            {/* Tableau des signalements */}
            <div className="table-responsive-wrapper" style={{ margin: "0 15px 25px 15px" }}>
                {filteredSignalements.length > 0 ? (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Code Dossier</th>
                                <th>Domaine / Type</th>
                                <th>Lieu</th>
                                <th>Date</th>
                                <th>Priorité</th>
                                <th>Statut</th>
                                <th style={{ textAlign: "right" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSignalements.map((signalement) => {
                                const isSuivi = isDossierSuivi(signalement);
                                const isCritique = signalement.niveau === "critique" || signalement.niveau === "elevé";
                                return (
                                    <tr 
                                        key={signalement.id_incident} 
                                        onClick={() => navigate(`${signalement.id_incident}`)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <td>
                                            <strong style={{ color: "var(--primary)" }}>{signalement.code_unique}</strong>
                                        </td>
                                        <td>
                                            <span style={{ fontWeight: 600 }}>{signalement.categorie || signalement.designation}</span>
                                        </td>
                                        <td>
                                            <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                                                <i className="fa-solid fa-location-dot" style={{ marginRight: "4px" }}></i>
                                                {signalement.lieu || "Non spécifié"}
                                            </span>
                                        </td>
                                        <td>{new Date(signalement.date_incident).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`badge badge-${isCritique ? "high" : "medium"}`}>
                                                {signalement.niveau || "Moyen"}
                                            </span>
                                        </td>
                                        <td>
                                            {isSuivi ? (
                                                <span className={`badge badge-${signalement.statusatt === "résolu" ? "closed" : "analysis"}`}>
                                                    {signalement.statusatt}
                                                    {signalement.nom_gestionnaire && ` (${signalement.nom_gestionnaire})`}
                                                </span>
                                            ) : (
                                                <span className="badge badge-new" style={{ background: "#dcfce7", color: "#15803d", fontWeight: 700 }}>
                                                    Libre (Non suivi)
                                                </span>
                                            )}
                                        </td>
                                        <td style={{ textAlign: "right" }}>
                                            <div style={{ display: "flex", justifyContent: "flex-end", gap: "6px" }} onClick={(e) => e.stopPropagation()}>
                                                {!isSuivi && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary btn-sm"
                                                        onClick={(e) => handlePrendreEnCharge(e, signalement.id_incident)}
                                                        title="Prendre en charge ce signalement"
                                                        style={{ padding: "4px 10px", fontSize: "0.78rem" }}
                                                    >
                                                        <i className="fa-solid fa-hand-holding-hand" style={{ marginRight: "4px" }}></i>
                                                        Suivre
                                                    </button>
                                                )}
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary btn-sm"
                                                    onClick={() => navigate(`${signalement.id_incident}`)}
                                                    style={{ padding: "4px 10px", fontSize: "0.78rem" }}
                                                >
                                                    Ouvrir →
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
                        icone={activeTab === "libres" ? "circle-check" : "inbox"}
                        title={activeTab === "libres" ? "Aucun signalement libre" : "Aucun dossier trouvé"}
                        message={
                            activeTab === "libres" 
                                ? "Tous les signalements enregistrés sont actuellement pris en charge par des organisations ou ont été résolus."
                                : "Aucun signalement ne correspond à vos critères de recherche pour le moment."
                        }
                        actionLabel={activeTab === "libres" ? "Voir tous les signalements" : "Réinitialiser les filtres"}
                        onAction={() => {
                            if (activeTab === "libres") {
                                setActiveTab("tous");
                            } else {
                                setSearchTerm("");
                                setSelectedCategory("");
                                setSelectedPriority("");
                            }
                        }}
                    />
                )}
            </div>
        </div>
    );
}