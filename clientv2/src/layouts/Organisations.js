import { useNavigate } from "react-router-dom";
import { Header } from "../components/maincomp";
import { Button, Loader, EmptyState, Badge, Modal } from "../components/minicomp";
import { useState, useEffect, useMemo } from "react";

export function Organisations({}) {
    const [organisations, setOrganisations] = useState([]);
    const [selectedOrganisations, setSelectedOrganisations] = useState([]);
    const [loaderVisible, setLoaderVisible] = useState(false);
    const [activeTab, setActiveTab] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [viewOrg, setViewOrg] = useState(null);
    const [categories, setCategories] = useState([]);
    const [assignDomainOrg, setAssignDomainOrg] = useState(null);
    const [selectedDomains, setSelectedDomains] = useState([]);
    const link = process.env.REACT_APP_LINK;
    const [user] = useState(JSON.parse(localStorage.getItem("userinfo") || "{}"));

    const loadOrganisations = async () => {
        setLoaderVisible(true);
        try {
            const response = await fetch(`${link}/organisations`);
            const data = await response.json();
            if (data.success && Array.isArray(data.data)) {
                setOrganisations(data.data);
            }
        } catch (error) {
            console.log(error);
        }
        setLoaderVisible(false);
    };

    const loadCategories = async () => {
        try {
            const res = await fetch(`${link}/get_categorie`);
            const data = await res.json();
            if (data?.data) {
                setCategories(data.data);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleCheckboxChange = (organisationid) => {
        if (selectedOrganisations.includes(organisationid)) {
            setSelectedOrganisations(selectedOrganisations.filter((id) => id !== organisationid));
        } else {
            setSelectedOrganisations([...selectedOrganisations, organisationid]);
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedOrganisations(filteredOrganisations.map(o => o.organisationid));
        } else {
            setSelectedOrganisations([]);
        }
    };

    const executeAction = async (action, orgId = null) => {
        const targets = orgId ? [orgId] : selectedOrganisations;
        if (targets.length === 0) return;
        if (!window.confirm(`Confirmer l'action "${action}" sur ${targets.length} organisation(s) ?`)) return;

        setLoaderVisible(true);
        try {
            const res = await fetch(`${link}/organisation/${action}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ organisations: targets })
            });
            const data = await res.json();
            if (data.success) {
                alert(data.message || "Statut de l'organisation mis à jour !");
                setSelectedOrganisations([]);
                loadOrganisations();
            } else {
                alert(data.message || "Erreur lors de la mise à jour");
            }
        } catch (error) {
            console.log(error);
        }
        setLoaderVisible(false);
    };

    const handleSaveDomains = async () => {
        if (!assignDomainOrg) return;
        setLoaderVisible(true);
        try {
            const res = await fetch(`${link}/assignerdomaine`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    organisationid: assignDomainOrg.organisationid,
                    domaineintervention: selectedDomains,
                    userid: user.userid
                })
            });
            const data = await res.json();
            if (data.success || data.status === "success") {
                alert("Domaines d'intervention assignés avec succès ! Cette organisation recevra désormais les alertes push correspondantes.");
                setAssignDomainOrg(null);
                setSelectedDomains([]);
            } else {
                alert(data.message || "Erreur lors de l'assignation des domaines");
            }
        } catch (err) {
            console.log(err);
        }
        setLoaderVisible(false);
    };

    useEffect(() => {
        loadOrganisations();
        loadCategories();
    }, []);

    const filteredOrganisations = useMemo(() => {
        return organisations.filter((org) => {
            if (activeTab === "actif" && org.status !== "actif") return false;
            if (activeTab === "attente" && org.status !== "en attente" && org.status !== null && org.status !== "") return false;
            if (activeTab === "suspendu" && org.status !== "désactivé" && org.status !== "refuse") return false;

            if (searchTerm.trim() !== "") {
                const term = searchTerm.toLowerCase();
                const nom = (org.designation || "").toLowerCase();
                const sigle = (org.sigle || "").toLowerCase();
                const email = (org.email_org || "").toLowerCase();
                const ville = (org.ville || "").toLowerCase();
                const type = (org.libelle || "").toLowerCase();
                return nom.includes(term) || sigle.includes(term) || email.includes(term) || ville.includes(term) || type.includes(term);
            }
            return true;
        });
    }, [organisations, activeTab, searchTerm]);

    return (
        <div className="pagestructure">
            <Header title={"Gestion des Organisations"} retour={true} />
            {loaderVisible && <Loader />}

            <div style={{ padding: "15px 20px" }}>
                {/* Filtres et recherche */}
                <div className="flex-between" style={{ flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
                    <div className="chip-group">
                        <button
                            type="button"
                            className={`chip ${activeTab === "all" ? "active" : ""}`}
                            onClick={() => setActiveTab("all")}
                        >
                            Toutes ({organisations.length})
                        </button>
                        <button
                            type="button"
                            className={`chip ${activeTab === "attente" ? "active" : ""}`}
                            onClick={() => setActiveTab("attente")}
                        >
                            <i className="fa-solid fa-clock" style={{ color: "#d97706", marginRight: "4px" }}></i>
                            En attente ({organisations.filter(o => o.status === "en attente" || !o.status).length})
                        </button>
                        <button
                            type="button"
                            className={`chip ${activeTab === "actif" ? "active" : ""}`}
                            onClick={() => setActiveTab("actif")}
                        >
                            <i className="fa-solid fa-circle-check" style={{ color: "#16a34a", marginRight: "4px" }}></i>
                            Actives ({organisations.filter(o => o.status === "actif").length})
                        </button>
                        <button
                            type="button"
                            className={`chip ${activeTab === "suspendu" ? "active" : ""}`}
                            onClick={() => setActiveTab("suspendu")}
                        >
                            <i className="fa-solid fa-ban" style={{ color: "#dc2626", marginRight: "4px" }}></i>
                            Suspendues ({organisations.filter(o => o.status === "désactivé" || o.status === "refuse").length})
                        </button>
                    </div>

                    <div style={{ width: "260px" }}>
                        <input
                            type="search"
                            className="form-control"
                            placeholder="Rechercher organisation, ville..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ padding: "8px 14px", fontSize: "0.85rem" }}
                        />
                    </div>
                </div>

                {/* Barre d'action groupée flottante */}
                {selectedOrganisations.length > 0 && (
                    <div style={{
                        background: "#1e1b4b",
                        color: "white",
                        padding: "10px 18px",
                        borderRadius: "var(--radius-md)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "16px"
                    }}>
                        <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                            {selectedOrganisations.length} organisation(s) sélectionnée(s)
                        </span>
                        <div style={{ display: "flex", gap: "8px" }}>
                            <button
                                type="button"
                                className="btn btn-sm"
                                style={{ background: "#16a34a", color: "white" }}
                                onClick={() => executeAction("actif")}
                            >
                                <i className="fa-solid fa-check"></i> Activer
                            </button>
                            <button
                                type="button"
                                className="btn btn-sm"
                                style={{ background: "#f59e0b", color: "white" }}
                                onClick={() => executeAction("en attente")}
                            >
                                <i className="fa-solid fa-clock"></i> Mettre en attente
                            </button>
                            <button
                                type="button"
                                className="btn btn-sm"
                                style={{ background: "#dc2626", color: "white" }}
                                onClick={() => executeAction("désactivé")}
                            >
                                <i className="fa-solid fa-ban"></i> Suspendre
                            </button>
                            <button
                                type="button"
                                className="btn btn-sm"
                                style={{ background: "rgba(255,255,255,0.2)", color: "white" }}
                                onClick={() => setSelectedOrganisations([])}
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                )}

                {/* Tableau */}
                <div className="table-responsive-wrapper" style={{ margin: 0, background: "white", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
                    {filteredOrganisations.length > 0 ? (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th style={{ width: "36px" }}>
                                        <input
                                            type="checkbox"
                                            checked={selectedOrganisations.length > 0 && selectedOrganisations.length === filteredOrganisations.length}
                                            onChange={handleSelectAll}
                                        />
                                    </th>
                                    <th>Organisation</th>
                                    <th>Type</th>
                                    <th>Localisation</th>
                                    <th>Représentant</th>
                                    <th>Statut</th>
                                    <th style={{ textAlign: "right" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrganisations.map((org) => {
                                    const isActif = org.status === "actif";
                                    const isAttente = org.status === "en attente" || !org.status;
                                    return (
                                        <tr key={org.organisationid}>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedOrganisations.includes(org.organisationid)}
                                                    onChange={() => handleCheckboxChange(org.organisationid)}
                                                />
                                            </td>
                                            <td>
                                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                    <div style={{
                                                        width: "36px",
                                                        height: "36px",
                                                        borderRadius: "8px",
                                                        background: "#e0e7ff",
                                                        color: "var(--primary)",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        fontWeight: 700,
                                                        fontSize: "0.85rem",
                                                        flexShrink: 0
                                                    }}>
                                                        {org.sigle ? org.sigle.substring(0, 3) : <i className="fa-solid fa-building"></i>}
                                                    </div>
                                                    <div>
                                                        <strong style={{ color: "var(--text-main)", display: "block" }}>{org.designation}</strong>
                                                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                                                            {org.email_org || org.phone_org || "-"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{org.libelle || "ONG / Structure"}</td>
                                            <td style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                                                <i className="fa-solid fa-location-dot" style={{ marginRight: "4px" }}></i>
                                                {org.ville ? `${org.ville}, ${org.pays || ''}` : org.adresse_org || "-"}
                                            </td>
                                            <td>
                                                <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>
                                                    {org.nom ? `${org.nom.toUpperCase()} ${org.prenom || ''}` : "Responsable"}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`badge badge-${isActif ? "oriented" : isAttente ? "analysis" : "high"}`}>
                                                    {org.status || "en attente"}
                                                </span>
                                            </td>
                                            <td style={{ textAlign: "right" }}>
                                                <div style={{ display: "flex", justifyContent: "flex-end", gap: "6px" }}>
                                                    {isAttente && (
                                                        <button
                                                            type="button"
                                                            className="btn btn-primary btn-sm"
                                                            onClick={() => executeAction("actif", org.organisationid)}
                                                            title="Valider l'organisation"
                                                            style={{ padding: "4px 8px", fontSize: "0.75rem", background: "#16a34a", borderColor: "#16a34a" }}
                                                        >
                                                            <i className="fa-solid fa-check"></i> Valider
                                                        </button>
                                                    )}
                                                    <button
                                                        type="button"
                                                        className="btn btn-secondary btn-sm"
                                                        onClick={() => { setAssignDomainOrg(org); setSelectedDomains([]); }}
                                                        title="Assigner des domaines d'intervention"
                                                        style={{ padding: "4px 8px", fontSize: "0.75rem" }}
                                                    >
                                                        <i className="fa-solid fa-tags"></i> Domaines
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-secondary btn-sm"
                                                        onClick={() => setViewOrg(org)}
                                                        title="Voir les détails"
                                                        style={{ padding: "4px 8px", fontSize: "0.75rem" }}
                                                    >
                                                        <i className="fa-solid fa-eye"></i>
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
                            icone="building"
                            title="Aucune organisation trouvée"
                            message="Aucune structure ne correspond à vos critères de recherche."
                        />
                    )}
                </div>
            </div>

            {/* Modal Détails Organisation */}
            <Modal
                isOpen={!!viewOrg}
                onClose={() => setViewOrg(null)}
                title={`Détails : ${viewOrg?.designation || ''}`}
            >
                {viewOrg && (
                    <div style={{ fontSize: "0.88rem", display: "flex", flexDirection: "column", gap: "12px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color)", paddingBottom: "10px" }}>
                            <div>
                                <h4 style={{ margin: 0, color: "var(--text-main)" }}>{viewOrg.designation} ({viewOrg.sigle})</h4>
                                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Type : {viewOrg.libelle}</span>
                            </div>
                            <span className={`badge badge-${viewOrg.status === "actif" ? "oriented" : "analysis"}`}>
                                {viewOrg.status || "en attente"}
                            </span>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                            <div>
                                <span style={{ color: "var(--text-muted)", fontSize: "0.75rem", display: "block" }}>Email officiel</span>
                                <strong>{viewOrg.email_org || "-"}</strong>
                            </div>
                            <div>
                                <span style={{ color: "var(--text-muted)", fontSize: "0.75rem", display: "block" }}>Téléphone</span>
                                <strong>{viewOrg.phone_org || "-"}</strong>
                            </div>
                            <div>
                                <span style={{ color: "var(--text-muted)", fontSize: "0.75rem", display: "block" }}>Localisation</span>
                                <strong>{viewOrg.ville}, {viewOrg.province || ''} {viewOrg.pays || ''}</strong>
                            </div>
                            <div>
                                <span style={{ color: "var(--text-muted)", fontSize: "0.75rem", display: "block" }}>Site Web</span>
                                <strong>{viewOrg.site_web || "-"}</strong>
                            </div>
                        </div>

                        <div style={{ marginTop: "14px", display: "flex", justifyContent: "flex-end", gap: "8px", borderTop: "1px solid var(--border-color)", paddingTop: "12px" }}>
                            {viewOrg.status !== "actif" ? (
                                <button
                                    type="button"
                                    className="btn btn-primary btn-sm"
                                    onClick={() => { executeAction("actif", viewOrg.organisationid); setViewOrg(null); }}
                                >
                                    <i className="fa-solid fa-check"></i> Valider cette organisation
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => { executeAction("désactivé", viewOrg.organisationid); setViewOrg(null); }}
                                    style={{ color: "#dc2626" }}
                                >
                                    <i className="fa-solid fa-ban"></i> Suspendre l'organisation
                                </button>
                            )}
                            <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                onClick={() => setViewOrg(null)}
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Modal Assigner Domaines */}
            <Modal
                isOpen={!!assignDomainOrg}
                onClose={() => setAssignDomainOrg(null)}
                title={`Assigner des domaines : ${assignDomainOrg?.designation || ''}`}
            >
                {assignDomainOrg && (
                    <div>
                        <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "14px" }}>
                            Sélectionnez les catégories de signalements pour lesquelles cette organisation recevra des notifications push et des alertes automatiques :
                        </p>

                        <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "250px", overflowY: "auto", marginBottom: "16px" }}>
                            {categories.map((cat) => {
                                const isChecked = selectedDomains.includes(cat.categorie_id);
                                return (
                                    <label
                                        key={cat.categorie_id}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "10px",
                                            padding: "8px 12px",
                                            borderRadius: "6px",
                                            background: isChecked ? "#f0fdf4" : "#f8fafc",
                                            border: isChecked ? "1px solid #86efac" : "1px solid #e2e8f0",
                                            cursor: "pointer"
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() => {
                                                if (isChecked) {
                                                    setSelectedDomains(selectedDomains.filter(id => id !== cat.categorie_id));
                                                } else {
                                                    setSelectedDomains([...selectedDomains, cat.categorie_id]);
                                                }
                                            }}
                                        />
                                        <div style={{ flex: 1 }}>
                                            <strong style={{ fontSize: "0.85rem", color: "var(--text-main)" }}>{cat.designation}</strong>
                                            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "block" }}>Priorité : {cat.niveau || "Moyen"}</span>
                                        </div>
                                    </label>
                                );
                            })}
                        </div>

                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", borderTop: "1px solid var(--border-color)", paddingTop: "12px" }}>
                            <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                onClick={() => setAssignDomainOrg(null)}
                            >
                                Annuler
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary btn-sm"
                                onClick={handleSaveDomains}
                            >
                                Enregistrer les domaines ({selectedDomains.length})
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}