import { useNavigate } from "react-router-dom";
import { Header } from "../components/maincomp";
import { Loader, EmptyState, Badge, Button } from "../components/minicomp";
import { useState, useEffect, useMemo } from "react";

export function AdminUtilisateurs({}) {
    const [users, setUsers] = useState([]);
    const [loaderVisible, setLoaderVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("all");
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

    const toggleUserStatus = async (user) => {
        const nextState = user.etat === "actif" ? "inactif" : "actif";
        if (!window.confirm(`Voulez-vous passer l'utilisateur "${user.nom} ${user.prenom || ''}" à l'état "${nextState}" ?`)) return;

        try {
            await fetch(`${link}/updateprofile`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userid: user.userid, etat: nextState })
            });
            loadUsers();
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const filteredUsers = useMemo(() => {
        return users.filter((u) => {
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
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary btn-sm"
                                                    onClick={() => toggleUserStatus(u)}
                                                    title={isActif ? "Désactiver le compte" : "Activer le compte"}
                                                    style={{ padding: "4px 8px", fontSize: "0.75rem", color: isActif ? "#dc2626" : "#16a34a" }}
                                                >
                                                    <i className={`fa-solid fa-${isActif ? "ban" : "check"}`}></i>
                                                </button>
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

