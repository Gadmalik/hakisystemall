import { useNavigate } from "react-router-dom";
import { Header } from "../components/maincomp";
import { Loader, EmptyState, Badge, Button } from "../components/minicomp";
import { useState, useEffect, useMemo } from "react";

export function AdminUtilisateurs({}) {
    const [users, setUsers] = useState([]);
    const [loaderVisible, setLoaderVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("all");
    const [feedbackMsg, setFeedbackMsg] = useState("");
    const link = process.env.REACT_APP_LINK;

    const loadUsers = async () => {
        setLoaderVisible(true);
        try {
            const res = await fetch(`${link}/users`);
            const data = await res.json();
            if (data.status === "success" && Array.isArray(data.data)) {
                setUsers(data.data);
            }
        } catch (err) {
            console.log(err);
        }
        setLoaderVisible(false);
    };

    const toggleUserStatus = async (user, targetState = null) => {
        const nextState = targetState || (user.etat === "actif" ? "inactif" : "actif");
        const actionLabel = nextState === "actif" ? "activer et valider" : "désactiver";
        if (!window.confirm(`Voulez-vous ${actionLabel} le compte de "${user.nom} ${user.prenom || ''}" ? Une notification et un e-mail lui seront automatiquement envoyés.`)) return;

        setLoaderVisible(true);
        try {
            const res = await fetch(`${link}/user/status`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userid: user.userid, etat: nextState })
            });
            const data = await res.json();
            if (data.success || data.status === "success") {
                setFeedbackMsg(nextState === "actif" ? `✓ Compte de ${user.nom} validé avec succès ! Notification envoyée.` : `Compte de ${user.nom} désactivé.`);
                setTimeout(() => setFeedbackMsg(""), 6000);
                loadUsers();
            } else {
                alert(data.message || "Erreur lors de la mise à jour");
            }
        } catch (err) {
            console.log(err);
        }
        setLoaderVisible(false);
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const pendingCount = users.filter(u => u.etat === "en attente" || !u.etat).length;

    const filteredUsers = useMemo(() => {
        return users.filter((u) => {
            if (activeTab === "pending" && u.etat !== "en attente" && u.etat) return false;
            if (activeTab === "main" && u.type !== "main") return false;
            if (activeTab === "second" && u.type !== "second") return false;
            if (activeTab === "actif" && u.etat !== "actif") return false;
            if (activeTab === "inactif" && u.etat !== "inactif" && u.etat !== "désactivé") return false;

            if (searchTerm.trim() !== "") {
                const term = searchTerm.toLowerCase();
                const nom = `${u.nom || ""} ${u.prenom || ""}`.toLowerCase();
                const email = (u.email || "").toLowerCase();
                const phone = (u.phone || "").toLowerCase();
                const username = (u.username || "").toLowerCase();
                return nom.includes(term) || email.includes(term) || phone.includes(term) || username.includes(term);
            }
            return true;
        });
    }, [users, activeTab, searchTerm]);

    return (
        <div className="pagestructure">
            <Header title={"Utilisateurs Globaux de la Plateforme"} retour={true} />
            {loaderVisible && <Loader />}

            <div style={{ padding: "15px 20px" }}>
                {feedbackMsg && (
                    <div style={{ background: "#dcfce7", color: "#166534", padding: "12px 16px", borderRadius: "8px", border: "1px solid #bbf7d0", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px", fontWeight: 600 }}>
                        <i className="fa-solid fa-circle-check"></i>
                        {feedbackMsg}
                    </div>
                )}

                <div className="flex-between" style={{ flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
                    <div className="chip-group">
                        <button
                            type="button"
                            className={`chip ${activeTab === "all" ? "active" : ""}`}
                            onClick={() => setActiveTab("all")}
                        >
                            Tous les comptes ({users.length})
                        </button>
                        <button
                            type="button"
                            className={`chip ${activeTab === "pending" ? "active" : ""}`}
                            onClick={() => setActiveTab("pending")}
                            style={{ position: "relative" }}
                        >
                            En attente de validation
                            {pendingCount > 0 && (
                                <span style={{ marginLeft: "6px", background: "#f59e0b", color: "white", padding: "1px 6px", borderRadius: "10px", fontSize: "0.72rem", fontWeight: 700 }}>
                                    {pendingCount}
                                </span>
                            )}
                        </button>
                        <button
                            type="button"
                            className={`chip ${activeTab === "main" ? "active" : ""}`}
                            onClick={() => setActiveTab("main")}
                        >
                            Comptes principaux ({users.filter(u => u.type === "main").length})
                        </button>
                        <button
                            type="button"
                            className={`chip ${activeTab === "second" ? "active" : ""}`}
                            onClick={() => setActiveTab("second")}
                        >
                            Membres structures ({users.filter(u => u.type === "second").length})
                        </button>
                        <button
                            type="button"
                            className={`chip ${activeTab === "actif" ? "active" : ""}`}
                            onClick={() => setActiveTab("actif")}
                        >
                            Actifs ({users.filter(u => u.etat === "actif").length})
                        </button>
                    </div>

                    <div style={{ width: "260px" }}>
                        <input
                            type="search"
                            className="form-control"
                            placeholder="Rechercher utilisateur..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ padding: "8px 14px", fontSize: "0.85rem" }}
                        />
                    </div>
                </div>

                <div className="table-responsive-wrapper" style={{ margin: 0, background: "white", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
                    {filteredUsers.length > 0 ? (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Utilisateur</th>
                                    <th>Nom d'utilisateur</th>
                                    <th>Type de compte</th>
                                    <th>Contact</th>
                                    <th>Date d'inscription</th>
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
                                                    <strong style={{ color: "var(--text-main)", fontSize: "0.9rem" }}>
                                                        {u.nom} {u.prenom || ""}
                                                    </strong>
                                                </div>
                                            </td>
                                            <td>
                                                <code style={{ background: "#f8fafc", padding: "2px 6px", borderRadius: "4px", fontSize: "0.78rem" }}>
                                                    @{u.username ? u.username.trim() : "user"}
                                                </code>
                                            </td>
                                            <td>
                                                <span style={{
                                                    background: u.type === "main" ? "#e0e7ff" : "#f1f5f9",
                                                    color: u.type === "main" ? "var(--primary)" : "var(--text-muted)",
                                                    padding: "3px 8px",
                                                    borderRadius: "4px",
                                                    fontSize: "0.72rem",
                                                    fontWeight: 600,
                                                    textTransform: "uppercase"
                                                }}>
                                                    {u.type === "main" ? "Principal / Admin" : "Sous-compte"}
                                                </span>
                                            </td>
                                            <td style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                                                <div><i className="fa-regular fa-envelope" style={{ marginRight: "4px" }}></i>{u.email || "-"}</div>
                                                <div><i className="fa-solid fa-phone" style={{ marginRight: "4px" }}></i>{u.phone || "-"}</div>
                                            </td>
                                            <td style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                                                {u.date_create ? new Date(u.date_create).toLocaleDateString() : "-"}
                                            </td>
                                            <td>
                                                <span className={`badge badge-${isActif ? "oriented" : "high"}`}>
                                                    {u.etat || "en attente"}
                                                </span>
                                            </td>
                                            <td style={{ textAlign: "right" }}>
                                                <div style={{ display: "flex", justifyContent: "flex-end", gap: "6px" }}>
                                                    {(!u.etat || u.etat === "en attente") ? (
                                                        <>
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm"
                                                                onClick={() => toggleUserStatus(u, "actif")}
                                                                title="Valider le compte"
                                                                style={{ background: "#16a34a", color: "white", padding: "4px 10px", fontSize: "0.75rem", display: "inline-flex", alignItems: "center", gap: "4px" }}
                                                            >
                                                                <i className="fa-solid fa-check"></i> Valider
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="btn btn-secondary btn-sm"
                                                                onClick={() => toggleUserStatus(u, "inactif")}
                                                                title="Refuser"
                                                                style={{ padding: "4px 8px", fontSize: "0.75rem", color: "#dc2626" }}
                                                            >
                                                                <i className="fa-solid fa-xmark"></i>
                                                            </button>
                                                        </>
                                                    ) : isActif ? (
                                                        <button
                                                            type="button"
                                                            className="btn btn-secondary btn-sm"
                                                            onClick={() => toggleUserStatus(u, "inactif")}
                                                            title="Désactiver le compte"
                                                            style={{ padding: "4px 8px", fontSize: "0.75rem", color: "#dc2626" }}
                                                        >
                                                            <i className="fa-solid fa-ban" style={{ marginRight: "4px" }}></i> Désactiver
                                                        </button>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            className="btn btn-secondary btn-sm"
                                                            onClick={() => toggleUserStatus(u, "actif")}
                                                            title="Réactiver le compte"
                                                            style={{ padding: "4px 8px", fontSize: "0.75rem", color: "#16a34a" }}
                                                        >
                                                            <i className="fa-solid fa-check" style={{ marginRight: "4px" }}></i> Activer
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    ) : (
                        <EmptyState
                            icone="users"
                            title="Aucun utilisateur trouvé"
                            message="Aucun compte ne correspond à votre filtre de recherche."
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

