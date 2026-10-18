import { useEffect, useState, useMemo } from "react";
import { Header } from "../components/maincomp";
import { StatCard, Button, Loader, EmptyState, Badge } from "../components/minicomp";
import { useNavigate } from "react-router-dom";

export function Dashboard({}) {
    const navigate = useNavigate();
    const link = process.env.REACT_APP_LINK;
    const [user] = useState(JSON.parse(localStorage.getItem("userinfo") || "{}"));
    const [fonctionnalites, setFonctionnalites] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        nouveaux: 0,
        encours: 0,
        resolus: 0,
        orientes: 0,
        categories: [],
        niveaux: [],
    });
    const [dossiersLibres, setDossiersLibres] = useState([]);
    const [mesDossiers, setMesDossiers] = useState([]);
    const [orientations, setOrientations] = useState([]);
    const [orgUsersCount, setOrgUsersCount] = useState(0);
    const [visibleLoader, setVisibleLoader] = useState(false);
    const [pushStatus, setPushStatus] = useState("checking");

    // 1. Charger les fonctionnalités autorisées de l'utilisateur
    const loadFonctionnalites = async () => {
        if (!user?.categorieutilisateurid) return;
        try {
            const res = await fetch(`${link}/getfonctionnalitebycategorieutilisateur/${user.categorieutilisateurid}/${user.type || "main"}`);
            const data = await res.json();
            if (data.success && Array.isArray(data.data)) {
                setFonctionnalites(data.data);
            }
        } catch (err) {
            console.log("Error loading fonctionnalites in dashboard:", err);
        }
    };

    // Vérifier si l'utilisateur a accès à une fonctionnalité (par nom de route)
    const canAccess = (routeKey) => {
        if (!fonctionnalites || fonctionnalites.length === 0) return true; // Par défaut tolérant pendant chargement
        return fonctionnalites.some((f) => {
            const clean = f.route.startsWith("/") ? f.route.substring(1) : f.route;
            return clean === routeKey && f.status;
        });
    };

    // 2. Charger les statistiques globales
    const loadStats = async () => {
        try {
            const res = await fetch(`${link}/incident/stats`);
            const data = await res.json();
            if (data?.data) {
                setStats(data.data);
            }
        } catch (err) {
            console.log("Error loading stats:", err);
        }
    };

    // 3. Charger les signalements libres (non pris en charge)
    const loadDossiersLibres = async () => {
        try {
            const res = await fetch(`${link}/getincident?libre=true&limit=6`);
            const data = await res.json();
            if (data?.data && Array.isArray(data.data)) {
                setDossiersLibres(data.data);
            }
        } catch (err) {
            console.log("Error loading libres:", err);
        }
    };

    // 4. Charger les dossiers suivis par cet utilisateur
    const loadMesDossiers = async () => {
        if (!user?.userid) return;
        try {
            const res = await fetch(`${link}/getincidentsuiviebyuserid/${user.userid}`);
            const data = await res.json();
            if (data?.data && Array.isArray(data.data)) {
                setMesDossiers(data.data);
            }
        } catch (err) {
            console.log("Error loading mes dossiers:", err);
        }
    };

    // 5. Charger les orientations reçues
    const loadOrientations = async () => {
        if (!user?.organisationid || !user?.userid) return;
        try {
            const res = await fetch(`${link}/getincidentorientebyorganisationid/${user.organisationid}/${user.userid}`);
            const data = await res.json();
            if (data?.data && Array.isArray(data.data)) {
                setOrientations(data.data);
            }
        } catch (err) {
            console.log("Error loading orientations:", err);
        }
    };

    // 6. Charger les membres de l'organisation
    const loadOrgUsers = async () => {
        if (!user?.organisationid) return;
        try {
            const res = await fetch(`${link}/users/${user.organisationid}`);
            const data = await res.json();
            if (data?.data && Array.isArray(data.data)) {
                setOrgUsersCount(data.data.length);
            }
        } catch (err) {
            console.log("Error loading org users:", err);
        }
    };

    // Vérifier l'état de la permission push
    const checkPushPermission = () => {
        if (!("Notification" in window)) {
            setPushStatus("unsupported");
        } else if (Notification.permission === "granted") {
            setPushStatus("granted");
        } else if (Notification.permission === "denied") {
            setPushStatus("denied");
        } else {
            setPushStatus("default");
        }
    };

    // Demander la permission push et souscrire
    const requestPushActivation = async () => {
        if (!("Notification" in window)) return alert("Votre navigateur ne supporte pas les notifications push.");
        const perm = await Notification.requestPermission();
        if (perm === "granted") {
            setPushStatus("granted");
            alert("Notifications Push activées ! Vous recevrez des alertes instantanées lors des nouveaux signalements dans votre domaine.");
        } else {
            setPushStatus(perm);
        }
    };

    // Prendre en charge un signalement libre en 1 clic
    const handlePrendreEnCharge = async (id_incident) => {
        if (!user?.userid) return alert("Veuillez vous reconnecter.");
        if (!window.confirm("Prendre en charge ce signalement ? Il sera assigné à votre compte et ne sera plus visible dans les dossiers libres.")) return;

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
                alert("Dossier pris en charge avec succès !");
                loadDossiersLibres();
                loadMesDossiers();
                loadStats();
            } else {
                alert(result.message || "Erreur lors de la prise en charge");
            }
        } catch (err) {
            console.log("Error takeover:", err);
        }
    };

    useEffect(() => {
        const init = async () => {
            setVisibleLoader(true);
            await Promise.all([
                loadFonctionnalites(),
                loadStats(),
                loadDossiersLibres(),
                loadMesDossiers(),
                loadOrientations(),
                loadOrgUsers()
            ]);
            setVisibleLoader(false);
            checkPushPermission();
        };
        init();
    }, []);

    // Détection des droits d'accès
    const hasSignalement = canAccess("signalement");
    const hasCasSuivie = canAccess("cassuivie");
    const hasOrientation = canAccess("orientation") || canAccess("casorientes");
    const hasUtilisateurOrg = canAccess("utilisateurorg");
    const hasCategorieOrg = canAccess("categorieutilisateurorg");
    const isAdmin = user?.type === "admin" || user?.role?.toLowerCase()?.includes("admin");

    return (
        <div className="pagestructure">
            <Header title={"Tableau de bord"} retour={false} />
            {visibleLoader && <Loader />}

            <div style={{ padding: "20px 24px" }}>
                {/* 1. Bannière d'accueil personnalisée */}
                <div style={{
                    background: "linear-gradient(135deg, #384bb6 0%, #1e1b4b 100%)",
                    color: "white",
                    padding: "24px 28px",
                    borderRadius: "var(--radius-lg)",
                    marginBottom: "24px",
                    boxShadow: "0 10px 25px -5px rgba(56, 75, 182, 0.3)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "16px"
                }}>
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                            <span style={{ background: "rgba(255,255,255,0.2)", padding: "4px 10px", borderRadius: "var(--radius-pill)", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                {user?.role || user?.designation || "Intervenant"}
                            </span>
                            {user?.organisation_nom && (
                                <span style={{ background: "#fbbf24", color: "#78350f", padding: "4px 10px", borderRadius: "var(--radius-pill)", fontSize: "0.75rem", fontWeight: 700 }}>
                                    <i className="fa-solid fa-building" style={{ marginRight: "4px" }}></i>
                                    {user.organisation_nom}
                                </span>
                            )}
                        </div>
                        <h2 style={{ margin: "0 0 6px 0", fontSize: "1.6rem", fontWeight: 800 }}>
                            Bonjour, {user?.nom ? `${user.nom.toUpperCase()} ${user.prenom || ""}` : "Bienvenue"} !
                        </h2>
                        <p style={{ margin: 0, opacity: 0.9, fontSize: "0.9rem", maxWidth: "600px" }}>
                            Espace de gestion des signalements, veille et orientation juridique de HAKI SYSTEM.
                        </p>
                    </div>

                    {/* Statut Notifications Push */}
                    <div style={{
                        background: "rgba(255, 255, 255, 0.12)",
                        backdropFilter: "blur(8px)",
                        padding: "12px 18px",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        textAlign: "right",
                        minWidth: "220px"
                    }}>
                        <div style={{ fontSize: "0.75rem", opacity: 0.85, marginBottom: "4px" }}>Notifications d'alerte</div>
                        {pushStatus === "granted" ? (
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "6px", color: "#4ade80", fontWeight: 700, fontSize: "0.85rem" }}>
                                <i className="fa-solid fa-circle-check"></i> Push activé (En veille)
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={requestPushActivation}
                                style={{
                                    background: "#fbbf24",
                                    color: "#78350f",
                                    border: "none",
                                    padding: "6px 12px",
                                    borderRadius: "var(--radius-pill)",
                                    fontSize: "0.78rem",
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    marginLeft: "auto"
                                }}
                            >
                                <i className="fa-solid fa-bell"></i> Activer alertes push
                            </button>
                        )}
                    </div>
                </div>

                {/* 2. Cartes KPI dynamiques adaptées aux fonctionnalités */}
                <section style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "16px",
                    marginBottom: "28px"
                }}>
                    {hasSignalement && (
                        <StatCard
                            label="Signalements libres"
                            value={dossiersLibres.length}
                            sub="Non assignés / En attente"
                            icone="triangle-exclamation"
                            color="danger"
                            onClick={() => navigate("/home/signalement")}
                        />
                    )}

                    {hasCasSuivie && (
                        <StatCard
                            label="Mes dossiers suivis"
                            value={mesDossiers.length}
                            sub="Pris en charge par vous"
                            icone="folder-open"
                            color="primary"
                            onClick={() => navigate("/home/cassuivie")}
                        />
                    )}

                    {hasOrientation && (
                        <StatCard
                            label="Dossiers orientés"
                            value={orientations.length || stats.orientes}
                            sub="Reçus ou transmis"
                            icone="share-nodes"
                            color="warning"
                            onClick={() => navigate("/home/orientation")}
                        />
                    )}

                    <StatCard
                        label="Affaires résolues"
                        value={stats.resolus}
                        sub="Clôturées avec succès"
                        icone="circle-check"
                        color="success"
                    />

                    {hasUtilisateurOrg && (
                        <StatCard
                            label="Membres de l'organisation"
                            value={orgUsersCount}
                            sub="Collaborateurs actifs"
                            icone="users"
                            color="primary"
                            onClick={() => navigate("/home/utilisateurorg")}
                        />
                    )}

                    {isAdmin && (
                        <StatCard
                            label="Total Signalements"
                            value={stats.total}
                            sub="Sur toute la plateforme"
                            icone="chart-bar"
                            color="primary"
                            onClick={() => navigate("/admin")}
                        />
                    )}
                </section>

                {/* 3. Barre de raccourcis rapides adaptés */}
                <div style={{
                    background: "white",
                    padding: "16px 20px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-color)",
                    marginBottom: "28px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "12px"
                }}>
                    <strong style={{ fontSize: "0.9rem", color: "var(--text-main)" }}>
                        <i className="fa-solid fa-bolt" style={{ color: "var(--primary)", marginRight: "8px" }}></i>
                        Actions rapides autorisées :
                    </strong>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                        <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => navigate("/signaler")}
                            style={{ display: "flex", alignItems: "center", gap: "6px" }}
                        >
                            <i className="fa-solid fa-plus"></i> Déclarer un incident
                        </button>

                        {hasSignalement && (
                            <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                onClick={() => navigate("/home/signalement")}
                                style={{ display: "flex", alignItems: "center", gap: "6px" }}
                            >
                                <i className="fa-solid fa-list-check"></i> Signalements libres
                            </button>
                        )}

                        {hasCasSuivie && (
                            <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                onClick={() => navigate("/home/cassuivie")}
                                style={{ display: "flex", alignItems: "center", gap: "6px" }}
                            >
                                <i className="fa-solid fa-folder-open"></i> Mes dossiers
                            </button>
                        )}

                        {hasUtilisateurOrg && (
                            <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                onClick={() => navigate("/home/utilisateurorg")}
                                style={{ display: "flex", alignItems: "center", gap: "6px" }}
                            >
                                <i className="fa-solid fa-user-plus"></i> Inviter un membre
                            </button>
                        )}

                        <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => navigate("/home/parametres")}
                            style={{ display: "flex", alignItems: "center", gap: "6px" }}
                        >
                            <i className="fa-solid fa-gear"></i> Paramètres
                        </button>
                    </div>
                </div>

                {/* 4. Section 1 : Signalements Libres & Disponibles (Si l'utilisateur a accès aux signalements) */}
                {hasSignalement && (
                    <div style={{ marginBottom: "32px" }}>
                        <div className="flex-between" style={{ marginBottom: "14px" }}>
                            <div>
                                <h3 style={{ margin: "0 0 4px 0", fontSize: "1.15rem", fontWeight: 700, color: "var(--text-main)" }}>
                                    <i className="fa-solid fa-bullhorn" style={{ color: "var(--primary)", marginRight: "8px" }}></i>
                                    Signalements libres disponibles ({dossiersLibres.length})
                                </h3>
                                <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.82rem" }}>
                                    Ces dossiers ne sont pas encore pris en charge. En cliquant sur "Suivre", ils seront assignés à votre compte.
                                </p>
                            </div>
                            <Button
                                label="Voir tous les signalements"
                                variant="secondary"
                                size="sm"
                                onClick={() => navigate("/home/signalement")}
                            />
                        </div>

                        {dossiersLibres.length > 0 ? (
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                                gap: "16px"
                            }}>
                                {dossiersLibres.slice(0, 4).map((dossier) => {
                                    const isCritique = dossier.niveau === "critique" || dossier.niveau === "elevé";
                                    return (
                                        <div
                                            key={dossier.id_incident}
                                            className="card"
                                            style={{
                                                margin: 0,
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "space-between",
                                                borderLeft: isCritique ? "4px solid #ef4444" : "4px solid var(--primary)"
                                            }}
                                        >
                                            <div>
                                                <div className="flex-between" style={{ marginBottom: "8px" }}>
                                                    <strong style={{ color: "var(--primary)", fontSize: "0.95rem" }}>
                                                        {dossier.code_unique}
                                                    </strong>
                                                    <span className={`badge badge-${isCritique ? "high" : "medium"}`}>
                                                        {dossier.niveau || "Moyen"}
                                                    </span>
                                                </div>
                                                <h4 style={{ margin: "0 0 8px 0", fontSize: "1rem", color: "var(--text-main)" }}>
                                                    {dossier.categorie || dossier.designation || "Signalement"}
                                                </h4>
                                                <p style={{
                                                    fontSize: "0.84rem",
                                                    color: "var(--text-muted)",
                                                    margin: "0 0 12px 0",
                                                    display: "-webkit-box",
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: "vertical",
                                                    overflow: "hidden"
                                                }}>
                                                    {dossier.description}
                                                </p>
                                                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", display: "flex", gap: "12px", marginBottom: "14px" }}>
                                                    <span><i className="fa-solid fa-location-dot" style={{ marginRight: "4px" }}></i>{dossier.lieu || "Lieu non précisé"}</span>
                                                    <span><i className="fa-regular fa-calendar" style={{ marginRight: "4px" }}></i>{new Date(dossier.date_incident).toLocaleDateString()}</span>
                                                </div>
                                            </div>

                                            <div style={{ display: "flex", gap: "8px", borderTop: "1px solid #f1f5f9", paddingTop: "12px" }}>
                                                <button
                                                    type="button"
                                                    className="btn btn-primary btn-sm flex-1"
                                                    onClick={() => handlePrendreEnCharge(dossier.id_incident)}
                                                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                                                >
                                                    <i className="fa-solid fa-hand-holding-hand"></i> Prendre en charge
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary btn-sm"
                                                    onClick={() => navigate(`/home/signalement/${dossier.id_incident}`)}
                                                >
                                                    Détails →
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <EmptyState
                                icone="circle-check"
                                title="Tous les signalements sont pris en charge"
                                message="Aucun dossier n'est actuellement en attente d'attribution dans vos domaines d'intervention."
                                actionLabel="Consulter l'historique"
                                onAction={() => navigate("/home/signalement")}
                            />
                        )}
                    </div>
                )}

                {/* 5. Section 2 : Mes Dossiers en cours (Si l'utilisateur a accès à cassuivie) */}
                {hasCasSuivie && (
                    <div style={{ marginBottom: "32px" }}>
                        <div className="flex-between" style={{ marginBottom: "14px" }}>
                            <div>
                                <h3 style={{ margin: "0 0 4px 0", fontSize: "1.15rem", fontWeight: 700, color: "var(--text-main)" }}>
                                    <i className="fa-solid fa-clock" style={{ color: "#f59e0b", marginRight: "8px" }}></i>
                                    Mes dossiers en cours ({mesDossiers.length})
                                </h3>
                                <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.82rem" }}>
                                    Dossiers actuellement sous votre responsabilité directe.
                                </p>
                            </div>
                            <Button
                                label="Gérer mes dossiers"
                                variant="secondary"
                                size="sm"
                                onClick={() => navigate("/home/cassuivie")}
                            />
                        </div>

                        {mesDossiers.length > 0 ? (
                            <div className="table-responsive-wrapper" style={{ margin: 0 }}>
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Code</th>
                                            <th>Domaine</th>
                                            <th>Date prise en charge</th>
                                            <th>Priorité</th>
                                            <th>Statut</th>
                                            <th style={{ textAlign: "right" }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {mesDossiers.slice(0, 5).map((m) => (
                                            <tr key={m.id_incident} onClick={() => navigate(`/home/signalement/${m.id_incident}`)} style={{ cursor: "pointer" }}>
                                                <td><strong style={{ color: "var(--primary)" }}>{m.code_unique}</strong></td>
                                                <td>{m.categorie}</td>
                                                <td>{m.dateatt ? new Date(m.dateatt).toLocaleDateString() : (m.date ? new Date(m.date).toLocaleDateString() : "-")}</td>
                                                <td>
                                                    <span className={`badge badge-${m.niveau === "critique" || m.niveau === "elevé" ? "high" : "medium"}`}>
                                                        {m.niveau || "Moyen"}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="badge badge-analysis">
                                                        {m.statusatt || "En cours"}
                                                    </span>
                                                </td>
                                                <td style={{ textAlign: "right" }}>
                                                    <button
                                                        type="button"
                                                        className="btn btn-secondary btn-sm"
                                                        onClick={() => navigate(`/home/signalement/${m.id_incident}`)}
                                                    >
                                                        Traiter →
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <EmptyState
                                icone="folder-plus"
                                title="Aucun dossier sous votre responsabilité pour l'instant"
                                message="Vous pouvez prendre en charge des signalements libres depuis la liste des nouveaux signalements."
                                actionLabel="Prendre en charge un dossier"
                                onAction={() => navigate("/home/signalement")}
                            />
                        )}
                    </div>
                )}

                {/* 6. Section 3 : Domaines d'intervention & Priorités */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "20px",
                    marginTop: "10px"
                }}>
                    {/* Répartition par catégorie */}
                    <div className="card" style={{ margin: 0 }}>
                        <h4 style={{ margin: "0 0 14px 0", fontSize: "0.95rem", fontWeight: 700 }}>
                            <i className="fa-solid fa-tags" style={{ color: "var(--primary)", marginRight: "8px" }}></i>
                            Répartition des signalements par domaine
                        </h4>
                        {stats.categories && stats.categories.length > 0 ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                {stats.categories.slice(0, 5).map((cat) => {
                                    const percent = stats.total > 0 ? Math.round((cat.count / stats.total) * 100) : 0;
                                    return (
                                        <div key={cat.categorie_id}>
                                            <div className="flex-between" style={{ fontSize: "0.82rem", marginBottom: "4px" }}>
                                                <span>{cat.designation}</span>
                                                <strong>{cat.count} ({percent}%)</strong>
                                            </div>
                                            <div style={{ height: "6px", background: "#f1f5f9", borderRadius: "3px", overflow: "hidden" }}>
                                                <div style={{ width: `${percent}%`, height: "100%", background: "var(--primary)", borderRadius: "3px" }}></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: 0 }}>Aucune donnée de catégorie disponible</p>
                        )}
                    </div>

                    {/* Synthèse globale du système */}
                    <div className="card" style={{ margin: 0 }}>
                        <h4 style={{ margin: "0 0 14px 0", fontSize: "0.95rem", fontWeight: 700 }}>
                            <i className="fa-solid fa-shield-halved" style={{ color: "#16a34a", marginRight: "8px" }}></i>
                            État de la veille juridique et citoyenne
                        </h4>
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.85rem" }}>
                            <div className="flex-between" style={{ padding: "8px 10px", background: "#f8fafc", borderRadius: "6px" }}>
                                <span><i className="fa-solid fa-clock-rotate-left" style={{ color: "#d97706", marginRight: "8px" }}></i>Taux de prise en charge</span>
                                <strong>{stats.total > 0 ? `${Math.round(((stats.total - dossiersLibres.length) / stats.total) * 100)}%` : "100%"}</strong>
                            </div>
                            <div className="flex-between" style={{ padding: "8px 10px", background: "#f8fafc", borderRadius: "6px" }}>
                                <span><i className="fa-solid fa-circle-check" style={{ color: "#16a34a", marginRight: "8px" }}></i>Taux de résolution</span>
                                <strong>{stats.total > 0 ? `${Math.round((stats.resolus / stats.total) * 100)}%` : "0%"}</strong>
                            </div>
                            <div className="flex-between" style={{ padding: "8px 10px", background: "#f8fafc", borderRadius: "6px" }}>
                                <span><i className="fa-solid fa-bell" style={{ color: "var(--primary)", marginRight: "8px" }}></i>Notifications Push envoyées aux organisations</span>
                                <Badge label="Actif" type="oriented" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}