import { useNavigate } from "react-router-dom";
import { Header } from "../components/maincomp";
import { StatCard, Loader, EmptyState, Badge } from "../components/minicomp";
import { useState, useEffect } from "react";

export function AdminDashboard({}) {
    const navigate = useNavigate();
    const link = process.env.REACT_APP_LINK;
    const [adminStats, setAdminStats] = useState(null);
    const [pendingOrgs, setPendingOrgs] = useState([]);
    const [loaderVisible, setLoaderVisible] = useState(false);
    const [mailConfig, setMailConfig] = useState(null);

    const loadAdminData = async () => {
        setLoaderVisible(true);
        try {
            const [statsRes, orgsRes, mailRes] = await Promise.all([
                fetch(`${link}/admin/stats`).then(r => r.json()),
                fetch(`${link}/organisations`).then(r => r.json()),
                fetch(`${link}/mail/config`).then(r => r.json())
            ]);

            if (statsRes.success) setAdminStats(statsRes.data);
            if (orgsRes.success && Array.isArray(orgsRes.data)) {
                setPendingOrgs(orgsRes.data.filter(o => o.status === "en attente" || !o.status));
            }
            if (mailRes.success) setMailConfig(mailRes.data);
        } catch (err) {
            console.log("Error loading admin data:", err);
        }
        setLoaderVisible(false);
    };

    const handleValidateOrg = async (orgId) => {
        try {
            const res = await fetch(`${link}/organisation/actif`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ organisations: [orgId] })
            });
            const data = await res.json();
            if (data.success) {
                alert("Organisation validée avec succès !");
                loadAdminData();
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleRejectOrg = async (orgId) => {
        if (!window.confirm("Refuser cette organisation ?")) return;
        try {
            const res = await fetch(`${link}/organisation/refuse`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ organisations: [orgId] })
            });
            const data = await res.json();
            if (data.success) {
                alert("Organisation refusée.");
                loadAdminData();
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        loadAdminData();
    }, []);

    return (
        <div className="pagestructure">
            <Header title={"Tableau de bord Administrateur"} retour={false} />
            {loaderVisible && <Loader />}

            <div style={{ padding: "20px 24px" }}>
                {/* Bandeau d'en-tête */}
                <div style={{
                    background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
                    color: "white",
                    padding: "24px 28px",
                    borderRadius: "var(--radius-lg)",
                    marginBottom: "24px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "16px"
                }}>
                    <div>
                        <span style={{ background: "#fbbf24", color: "#78350f", padding: "3px 8px", borderRadius: "4px", fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase" }}>
                            SUPER-ADMINISTRATION
                        </span>
                        <h2 style={{ margin: "6px 0 4px 0", fontSize: "1.5rem", fontWeight: 800 }}>
                            Supervision Globale de la Plateforme
                        </h2>
                        <p style={{ margin: 0, opacity: 0.85, fontSize: "0.88rem" }}>
                            Gérez les organisations partenaires, les utilisateurs, la configuration des mails et la modération des signalements.
                        </p>
                    </div>

                    <div style={{ display: "flex", gap: "8px" }}>
                        <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => navigate("/admin/organisations")}
                        >
                            <i className="fa-solid fa-building" style={{ marginRight: "6px" }}></i>
                            Organisations
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => navigate("/admin/mails")}
                        >
                            <i className="fa-solid fa-envelope" style={{ marginRight: "6px" }}></i>
                            Centre Mails
                        </button>
                    </div>
                </div>

                {/* KPI Grid */}
                <section style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "16px",
                    marginBottom: "28px"
                }}>
                    <StatCard
                        label="Organisations partenaires"
                        value={adminStats?.organisations?.total || 0}
                        sub={`${adminStats?.organisations?.actives || 0} actives, ${pendingOrgs.length} en attente`}
                        icone="building"
                        color="primary"
                        onClick={() => navigate("/admin/organisations")}
                    />

                    <StatCard
                        label="Utilisateurs enregistrés"
                        value={adminStats?.utilisateurs?.total || 0}
                        sub={`${adminStats?.utilisateurs?.actifs || 0} actifs`}
                        icone="users"
                        color="success"
                        onClick={() => navigate("/admin/utilisateurs")}
                    />

                    <StatCard
                        label="Signalements totaux"
                        value={adminStats?.incidents?.total || 0}
                        sub={`${adminStats?.incidents?.libres || 0} libres, ${adminStats?.incidents?.en_cours || 0} en cours`}
                        icone="bullhorn"
                        color="warning"
                        onClick={() => navigate("/home/signalement")}
                    />

                    <StatCard
                        label="Domaines d'intervention"
                        value={adminStats?.categories?.length || 0}
                        sub="Catégories configurées"
                        icone="tags"
                        color="primary"
                        onClick={() => navigate("/admin/categories-incident")}
                    />
                </section>

                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "24px", alignItems: "start" }}>
                    {/* File d'attente : Organisations en attente de validation */}
                    <div className="card" style={{ margin: 0 }}>
                        <div className="flex-between" style={{ marginBottom: "16px", borderBottom: "1px solid var(--border-color)", paddingBottom: "12px" }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "var(--text-main)" }}>
                                    <i className="fa-solid fa-clock-rotate-left" style={{ color: "#d97706", marginRight: "8px" }}></i>
                                    Organisations en attente de validation ({pendingOrgs.length})
                                </h3>
                                <p style={{ margin: "2px 0 0 0", color: "var(--text-muted)", fontSize: "0.78rem" }}>
                                    Ces structures attendent l'approbation de l'administrateur pour commencer à traiter les signalements.
                                </p>
                            </div>
                            <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                onClick={() => navigate("/admin/organisations")}
                            >
                                Tout voir →
                            </button>
                        </div>

                        {pendingOrgs.length > 0 ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                {pendingOrgs.map((org) => (
                                    <div
                                        key={org.organisationid}
                                        style={{
                                            padding: "12px 14px",
                                            background: "#fffbeb",
                                            border: "1px solid #fde68a",
                                            borderRadius: "8px",
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            gap: "10px"
                                        }}
                                    >
                                        <div>
                                            <strong style={{ color: "#92400e", fontSize: "0.95rem", display: "block" }}>
                                                {org.designation} {org.sigle && `(${org.sigle})`}
                                            </strong>
                                            <span style={{ fontSize: "0.76rem", color: "#b45309" }}>
                                                {org.email_org || org.phone_org || "Sans contact"} • {org.ville || "Ville non précisée"}
                                            </span>
                                        </div>
                                        <div style={{ display: "flex", gap: "6px" }}>
                                            <button
                                                type="button"
                                                className="btn btn-primary btn-sm"
                                                onClick={() => handleValidateOrg(org.organisationid)}
                                                style={{ background: "#16a34a", borderColor: "#16a34a", padding: "5px 10px", fontSize: "0.78rem" }}
                                            >
                                                <i className="fa-solid fa-check"></i> Valider
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-secondary btn-sm"
                                                onClick={() => handleRejectOrg(org.organisationid)}
                                                style={{ color: "#dc2626", padding: "5px 10px", fontSize: "0.78rem" }}
                                            >
                                                <i className="fa-solid fa-xmark"></i> Rejeter
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ padding: "30px 15px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                                <i className="fa-solid fa-circle-check" style={{ fontSize: "1.8rem", color: "#16a34a", display: "block", marginBottom: "8px" }}></i>
                                Aucune organisation en attente de validation ! Toutes les structures sont traitées.
                            </div>
                        )}
                    </div>

                    {/* État des services Système & Notifications */}
                    <div className="card" style={{ margin: 0 }}>
                        <h3 style={{ margin: "0 0 16px 0", fontSize: "1.1rem", fontWeight: 700, color: "var(--text-main)", borderBottom: "1px solid var(--border-color)", paddingBottom: "12px" }}>
                            <i className="fa-solid fa-server" style={{ color: "var(--primary)", marginRight: "8px" }}></i>
                            Statut des services & Alertes
                        </h3>

                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "#f8fafc", borderRadius: "8px" }}>
                                <div>
                                    <strong style={{ fontSize: "0.85rem", color: "var(--text-main)" }}>Notifications Push Web</strong>
                                    <span style={{ display: "block", fontSize: "0.72rem", color: "var(--text-muted)" }}>VAPID Key & Service Worker</span>
                                </div>
                                <span style={{ background: "#dcfce7", color: "#15803d", padding: "3px 8px", borderRadius: "var(--radius-pill)", fontSize: "0.72rem", fontWeight: 700 }}>
                                    <i className="fa-solid fa-check"></i> En veille active
                                </span>
                            </div>

                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "#f8fafc", borderRadius: "8px" }}>
                                <div>
                                    <strong style={{ fontSize: "0.85rem", color: "var(--text-main)" }}>Serveur d'envoi d'e-mails</strong>
                                    <span style={{ display: "block", fontSize: "0.72rem", color: "var(--text-muted)" }}>{mailConfig?.mode || "Vérification..."}</span>
                                </div>
                                <span style={{ background: mailConfig?.configured ? "#dcfce7" : "#fef3c7", color: mailConfig?.configured ? "#15803d" : "#b45309", padding: "3px 8px", borderRadius: "var(--radius-pill)", fontSize: "0.72rem", fontWeight: 700 }}>
                                    {mailConfig?.configured ? "Resend API" : "Simulé (Dev)"}
                                </span>
                            </div>

                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "#f8fafc", borderRadius: "8px" }}>
                                <div>
                                    <strong style={{ fontSize: "0.85rem", color: "var(--text-main)" }}>Base de données PostgreSQL</strong>
                                    <span style={{ display: "block", fontSize: "0.72rem", color: "var(--text-muted)" }}>Pool de connexions actif</span>
                                </div>
                                <span style={{ background: "#dcfce7", color: "#15803d", padding: "3px 8px", borderRadius: "var(--radius-pill)", fontSize: "0.72rem", fontWeight: 700 }}>
                                    <i className="fa-solid fa-check"></i> Connecté
                                </span>
                            </div>
                        </div>

                        <div style={{ marginTop: "16px", paddingTop: "14px", borderTop: "1px solid var(--border-color)", display: "flex", gap: "8px" }}>
                            <button
                                type="button"
                                className="btn btn-secondary btn-sm flex-1"
                                onClick={() => navigate("/admin/mails")}
                            >
                                <i className="fa-solid fa-envelope-open-text" style={{ marginRight: "6px" }}></i>
                                Tester les e-mails
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary btn-sm flex-1"
                                onClick={() => navigate("/admin/parametres")}
                            >
                                <i className="fa-solid fa-sliders" style={{ marginRight: "6px" }}></i>
                                Paramètres
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

