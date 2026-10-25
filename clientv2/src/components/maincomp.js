import { useNavigate, useLocation } from "react-router-dom";
import { Badge, Logo, MenuItem } from "./minicomp";
import { useEffect, useState, useRef } from "react";

export function SideBar({ fonctionnalites }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [user] = useState(JSON.parse(localStorage.getItem("userinfo") || "{}"));

    const handleLogout = () => {
        if (window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
            localStorage.removeItem("userinfo");
            navigate("/");
        }
    };

    const isAdmin = user?.type === "admin" || user?.role?.toLowerCase()?.includes("admin") || user?.designation?.toLowerCase()?.includes("admin");

    return (
        <nav className="responsive-nav">
            <div className="nav-brand" onClick={() => navigate("/home/dashboard")} style={{ cursor: "pointer" }}>
                <Logo />
                <span className="logo-text">HAKI System</span>
            </div>
            <div className="nav-links">
                {fonctionnalites && fonctionnalites.length > 0 ? (
                    fonctionnalites.map((fonct) => {
                        const cleanRoute = fonct.route.startsWith("/") ? fonct.route.substring(1) : fonct.route;
                        const fullPath = `/home/${cleanRoute}`;
                        const isActive = location.pathname === fullPath || (cleanRoute === "dashboard" && location.pathname === "/home");
                        return (
                            <MenuItem
                                key={fonct.fonctionnaliteid || fonct.route}
                                icone={fonct.icone || "circle"}
                                title={fonct.designation}
                                link={fullPath}
                                active={isActive}
                                onClick={() => navigate(fullPath)}
                            />
                        );
                    })
                ) : (
                    <MenuItem
                        icone="chart-line"
                        title="Tableau de bord"
                        active={location.pathname.includes("dashboard")}
                        onClick={() => navigate("/home/dashboard")}
                    />
                )}

                <MenuItem
                    icone="gear"
                    title="Paramètres"
                    active={location.pathname === "/home/parametres"}
                    onClick={() => navigate("/home/parametres")}
                />
                {isAdmin && (
                    <MenuItem
                        icone="shield-halved"
                        title="Administration"
                        active={location.pathname.startsWith("/admin")}
                        onClick={() => navigate("/admin")}
                    />
                )}
                <MenuItem
                    icone="arrow-right-from-bracket"
                    title="Déconnexion"
                    active={false}
                    onClick={handleLogout}
                />
            </div>
        </nav>
    );
}

export function AdminSideBar() {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        if (window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
            localStorage.removeItem("userinfo");
            navigate("/");
        }
    };

    const adminNav = [
        { route: "/admin", title: "Vue d'ensemble", icone: "chart-pie" },
        { route: "/admin/organisations", title: "Organisations", icone: "building" },
        { route: "/admin/utilisateurs", title: "Utilisateurs globaux", icone: "users" },
        { route: "/admin/categories-incident", title: "Catégories & Domaines", icone: "tags" },
        { route: "/admin/categorieutilisateur", title: "Rôles & Permissions", icone: "user-shield" },
        { route: "/admin/fonctionnalites", title: "Fonctionnalités", icone: "sliders" },
        { route: "/admin/mails", title: "Mails & Alertes", icone: "envelope-open-text" },
        { route: "/admin/parametres", title: "Paramètres système", icone: "gear" },
    ];

    return (
        <nav className="responsive-nav admin-nav">
            <div className="nav-brand" onClick={() => navigate("/admin")} style={{ cursor: "pointer" }}>
                <Logo />
                <div>
                    <span className="logo-text">HAKI Admin</span>
                    <span style={{ display: "block", fontSize: "0.65rem", color: "#fbbf24", fontWeight: 700, letterSpacing: "1px" }}>BACK-OFFICE</span>
                </div>
            </div>
            <div className="nav-links">
                {adminNav.map((item) => {
                    const isActive = location.pathname === item.route || (item.route === "/admin" && location.pathname === "/admin/");
                    return (
                        <MenuItem
                            key={item.route}
                            icone={item.icone}
                            title={item.title}
                            active={isActive}
                            onClick={() => navigate(item.route)}
                        />
                    );
                })}

                <div style={{ margin: "15px 0 5px 0", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "10px" }}>
                    <MenuItem
                        icone="arrow-left"
                        title="Espace Utilisateur"
                        active={false}
                        onClick={() => navigate("/home/dashboard")}
                    />
                    <MenuItem
                        icone="arrow-right-from-bracket"
                        title="Déconnexion"
                        active={false}
                        onClick={handleLogout}
                    />
                </div>
            </div>
        </nav>
    );
}

export function Header({ title, retour = false, onSearch }) {
    const [user] = useState(JSON.parse(localStorage.getItem("userinfo") || "{}"));
    const [notifications, setNotifications] = useState([]);
    const [showNotifMenu, setShowNotifMenu] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const link = process.env.REACT_APP_LINK;
    const notifRef = useRef(null);
    const profileRef = useRef(null);

    const loadNotifications = async () => {
        if (!user?.userid) return;
        try {
            const res = await fetch(`${link}/notifications/${user.userid}`);
            const data = await res.json();
            if (data.success && Array.isArray(data.data)) {
                setNotifications(data.data);
            }
        } catch (err) {
            console.log("Header notifications fetch note:", err);
        }
    };

    const markAllAsRead = async () => {
        if (!user?.userid) return;
        try {
            await fetch(`${link}/notifications/mark-read`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userid: user.userid })
            });
            setNotifications(prev => prev.map(n => ({ ...n, lu: true })));
        } catch (err) {
            console.log("Mark as read note:", err);
        }
    };

    const handleSearch = (e) => {
        if (e.key === "Enter" || e.type === "submit") {
            if (onSearch) {
                onSearch(searchTerm);
            } else if (searchTerm.trim()) {
                navigate(`/home/signalement?search=${encodeURIComponent(searchTerm.trim())}`);
            }
        }
    };

    useEffect(() => {
        loadNotifications();
        const interval = setInterval(loadNotifications, 30000); // Polling toutes les 30s
        return () => clearInterval(interval);
    }, [user?.userid]);

    // Fermer les dropdowns au clic en dehors
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setShowNotifMenu(false);
            }
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setShowProfileMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const unreadCount = notifications.filter(n => !n.lu).length;
    const isAdmin = user?.type === "admin" || user?.role?.toLowerCase()?.includes("admin") || user?.designation?.toLowerCase()?.includes("admin");

    return (
        <header className="header">
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {retour ? (
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        style={{ background: "none", border: "none", cursor: "pointer", padding: "5px" }}
                        title="Retour"
                    >
                        <i className="fa-solid fa-arrow-left" style={{ fontSize: "1.2rem", color: "var(--primary)" }}></i>
                    </button>
                ) : (
                    <Logo size={30} />
                )}
                <h2 style={{ fontSize: "1.3rem", fontWeight: "700", color: "var(--text-main)", margin: "0" }}>
                    {title}
                </h2>
            </div>

            <div className="menu" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ position: "relative", width: "280px", maxWidth: "100%" }}>
                    <i className="fa-solid fa-magnifying-glass" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: "0.85rem" }}></i>
                    <input
                        type="search"
                        className="form-control"
                        placeholder="Rechercher code, mot-clé..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            if (onSearch) onSearch(e.target.value);
                        }}
                        onKeyDown={handleSearch}
                        style={{ width: "100%", borderRadius: "var(--radius-pill)", padding: "9px 16px 9px 36px", fontSize: "0.85rem" }}
                    />
                </div>


                {/* Profil & Menu Utilisateur */}
                <div ref={profileRef} style={{ position: "relative" }} className="flex-row">
                    {/* Cloche de Notifications Push / In-App */}
                    <div ref={notifRef} style={{ position: "relative" }}>
                        <button
                            type="button"
                            onClick={() => setShowNotifMenu(!showNotifMenu)}
                            style={{
                                position: "relative",
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                border: "1px solid var(--border-color)",
                                background: showNotifMenu ? "var(--status-new-bg)" : "white",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: showNotifMenu ? "var(--primary)" : "var(--text-muted)"
                            }}
                            title="Notifications"
                        >
                            <i className="fa-regular fa-bell" style={{ fontSize: "1.1rem" }}></i>
                            {unreadCount > 0 && (
                                <span
                                    className="notification-badge-pulse"
                                    style={{
                                        position: "absolute",
                                        top: "-2px",
                                        right: "-2px",
                                        background: "#ef4444",
                                        color: "white",
                                        fontSize: "0.68rem",
                                        fontWeight: "700",
                                        width: "18px",
                                        height: "18px",
                                        borderRadius: "50%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        border: "2px solid white"
                                    }}
                                >
                                    {unreadCount > 9 ? "9+" : unreadCount}
                                </span>
                            )}
                        </button>

                        {showNotifMenu && (
                            <div
                                className="notif-popover"
                                style={{
                                    position: "absolute",
                                    right: 0,
                                    top: "48px",
                                    width: "340px",
                                    background: "var(--bg-card, white)",
                                    borderRadius: "var(--radius-md)",
                                    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.15), 0 8px 10px -6px rgba(0,0,0,0.1)",
                                    border: "1px solid var(--border-color)",
                                    zIndex: 1000,
                                    overflow: "hidden"
                                }}
                            >
                                <div style={{
                                    padding: "12px 16px",
                                    borderBottom: "1px solid var(--border-color)",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    background: "#f8fafc"
                                }}>
                                    <strong style={{ fontSize: "0.9rem", color: "var(--text-main)" }}>
                                        <i className="fa-solid fa-bell" style={{ color: "var(--primary)", marginRight: "6px" }}></i>
                                        Notifications ({unreadCount} non lues)
                                    </strong>
                                    {unreadCount > 0 && (
                                        <button
                                            onClick={markAllAsRead}
                                            style={{ background: "none", border: "none", color: "var(--primary)", fontSize: "0.75rem", cursor: "pointer", fontWeight: 600 }}
                                        >
                                            Tout marquer lu
                                        </button>
                                    )}
                                </div>

                                <div style={{ maxHeight: "320px", overflowY: "auto" }}>
                                    {notifications.length > 0 ? (
                                        notifications.map((notif) => (
                                            <div
                                                key={notif.id}
                                                onClick={() => {
                                                    if (notif.url) {
                                                        setShowNotifMenu(false);
                                                        navigate(notif.url.replace("http://localhost:3000", "").replace("http://localhost:5001", ""));
                                                    }
                                                }}
                                                style={{
                                                    padding: "10px 14px",
                                                    borderBottom: "1px solid #f1f5f9",
                                                    background: notif.lu ? "white" : "#f0f4ff",
                                                    cursor: "pointer",
                                                    transition: "background 0.2s"
                                                }}
                                            >
                                                <div style={{ fontSize: "0.82rem", fontWeight: notif.lu ? 500 : 700, color: "var(--text-main)" }}>
                                                    {notif.title}
                                                </div>
                                                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "3px" }}>
                                                    {notif.body}
                                                </div>
                                                <div style={{ fontSize: "0.68rem", color: "#94a3b8", marginTop: "4px" }}>
                                                    {notif.created_at ? new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Récemment"}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div style={{ padding: "25px 15px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                                            <i className="fa-regular fa-bell-slash" style={{ fontSize: "1.5rem", display: "block", marginBottom: "8px", opacity: 0.5 }}></i>
                                            Aucune notification pour l'instant
                                        </div>
                                    )}
                                </div>

                                <div style={{ padding: "8px 14px", textAlign: "center", background: "#f8fafc", borderTop: "1px solid var(--border-color)" }}>
                                    <span onClick={() => { setShowNotifMenu(false); navigate("/home/parametres"); }} style={{ fontSize: "0.75rem", color: "var(--primary)", cursor: "pointer", fontWeight: 600 }}>
                                        Configurer les alertes & push →
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                    <div
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", padding: "4px 8px", borderRadius: "var(--radius-pill)", border: "1px solid transparent", transition: "all 0.2s" }}
                    >
                        <div className="textprofile" style={{ textAlign: "right" }}>
                            <strong style={{ color: "var(--text-main)", fontSize: "0.85rem", display: "block", lineHeight: 1.2 }}>
                                {user?.nom ? `${user.nom.toUpperCase()} ${user.prenom || ""}` : "Utilisateur"}
                            </strong>
                            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                                {user?.role || user?.designation || "Membre"}
                            </span>
                        </div>
                        <div style={{
                            width: "38px",
                            height: "38px",
                            background: "linear-gradient(135deg, var(--primary) 0%, #4338ca 100%)",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontWeight: 700,
                            fontSize: "0.9rem",
                            flexShrink: 0
                        }}>
                            {user?.nom ? user.nom.charAt(0).toUpperCase() : <i className="fa-regular fa-user"></i>}
                        </div>
                    </div>

                    {showProfileMenu && (
                        <div
                            className="notif-popover"
                            style={{
                                position: "absolute",
                                right: 0,
                                top: "48px",
                                width: "220px",
                                background: "var(--bg-card, white)",
                                borderRadius: "var(--radius-md)",
                                boxShadow: "0 10px 25px -5px rgba(0,0,0,0.15)",
                                border: "1px solid var(--border-color)",
                                zIndex: 1000,
                                padding: "6px 0"
                            }}
                        >
                            <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--border-color)", fontSize: "0.8rem" }}>
                                <div style={{ fontWeight: 700, color: "var(--text-main)" }}>{user?.username || "Mon Compte"}</div>
                                <div style={{ color: "var(--text-muted)", fontSize: "0.72rem" }}>{user?.email || ""}</div>
                            </div>
                            <div
                                onClick={() => { setShowProfileMenu(false); navigate("/home/parametres"); }}
                                style={{ padding: "9px 14px", fontSize: "0.82rem", color: "var(--text-main)", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
                            >
                                <i className="fa-solid fa-gear" style={{ color: "var(--text-muted)", width: "16px" }}></i>
                                Paramètres du compte
                            </div>
                            {isAdmin && (
                                <div
                                    onClick={() => { setShowProfileMenu(false); navigate("/admin"); }}
                                    style={{ padding: "9px 14px", fontSize: "0.82rem", color: "#d97706", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
                                >
                                    <i className="fa-solid fa-shield-halved" style={{ width: "16px" }}></i>
                                    Espace Administrateur
                                </div>
                            )}
                            <div
                                onClick={() => {
                                    setShowProfileMenu(false);
                                    if (window.confirm("Se déconnecter ?")) {
                                        localStorage.removeItem("userinfo");
                                        navigate("/");
                                    }
                                }}
                                style={{ padding: "9px 14px", fontSize: "0.82rem", color: "#dc2626", cursor: "pointer", borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: "8px" }}
                            >
                                <i className="fa-solid fa-arrow-right-from-bracket" style={{ width: "16px" }}></i>
                                Déconnexion
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export function HeaderSimple({ title, retour = false }) {
    return (
        <header className="headersimple">
            {retour ? (
                <i
                    className="fa-solid fa-arrow-left logo"
                    style={{ marginRight: "10px", fontSize: "21px", cursor: "pointer" }}
                    onClick={() => window.history.back()}
                ></i>
            ) : (
                <Logo size={30} />
            )}
            <div className="menu">
                <h2 style={{ fontSize: "1.4rem", fontWeight: "600", color: "var(--text-main)", margin: "0" }}>{title}</h2>
                <Badge label={"Quitter"} type="medium" onClick={() => window.history.back()} />
            </div>
        </header>
    );
}
