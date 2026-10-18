import { useNavigate } from "react-router-dom";
import { Header } from "../components/maincomp";
import { Button, FormGroup, Input, Switch, Loader } from "../components/minicomp";
import { useState, useEffect } from "react";

export function Settings({}) {
    const link = process.env.REACT_APP_LINK;
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("userinfo") || "{}"));
    const [activeTab, setActiveTab] = useState("profil");
    const [profileData, setProfileData] = useState({
        noms: user?.nom ? `${user.nom} ${user.prenom || ''}`.trim() : "",
        nom: user?.nom || "",
        prenom: user?.prenom || "",
        email: user?.email || "",
        phone: user?.phone || "",
        adresse: user?.adresse || "",
        username: user?.username ? user.username.trim() : ""
    });

    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        password: "",
        confirmPassword: ""
    });

    const [notifPreferences, setNotifPreferences] = useState({
        pushEnabled: Notification?.permission === "granted",
        emailAlerts: true,
        soundAlerts: localStorage.getItem("soundAlerts") !== "false",
        domainAlertsOnly: true
    });

    const [theme, setTheme] = useState(localStorage.getItem("appTheme") || "light");
    const [loader, setLoader] = useState(false);
    const [feedbackMsg, setFeedbackMsg] = useState({ text: "", type: "" });

    // Appliquer le thème sélectionné
    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
        localStorage.setItem("appTheme", newTheme);
        if (newTheme === "dark") {
            document.body.classList.add("dark-theme");
        } else {
            document.body.classList.remove("dark-theme");
        }
    };

    // Mettre à jour le profil
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoader(true);
        setFeedbackMsg({ text: "", type: "" });
        try {
            const res = await fetch(`${link}/updateprofile`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userid: user.userid,
                    username: profileData.username,
                    noms: `${profileData.nom} ${profileData.prenom}`.trim(),
                    adresse: profileData.adresse,
                    phone: profileData.phone,
                    email: profileData.email
                })
            });
            const data = await res.json();
            if (data.status === "success" || data.success) {
                const updated = { ...user, ...profileData };
                localStorage.setItem("userinfo", JSON.stringify(updated));
                setUser(updated);
                setFeedbackMsg({ text: "Profil mis à jour avec succès !", type: "success" });
            } else {
                setFeedbackMsg({ text: data.message || "Erreur lors de la mise à jour", type: "error" });
            }
        } catch (err) {
            setFeedbackMsg({ text: "Erreur réseau", type: "error" });
        }
        setLoader(false);
    };

    // Mettre à jour le mot de passe
    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (!passwordData.oldPassword || !passwordData.password) {
            return alert("Veuillez renseigner votre mot de passe actuel et le nouveau mot de passe.");
        }
        if (passwordData.password !== passwordData.confirmPassword) {
            return alert("Les nouveaux mots de passe ne correspondent pas.");
        }

        setLoader(true);
        setFeedbackMsg({ text: "", type: "" });
        try {
            const res = await fetch(`${link}/updateprofile`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userid: user.userid,
                    username: profileData.username,
                    oldPassword: passwordData.oldPassword,
                    password: passwordData.password
                })
            });
            const data = await res.json();
            if (data.status === "success" || data.success) {
                setFeedbackMsg({ text: "Mot de passe modifié avec succès !", type: "success" });
                setPasswordData({ oldPassword: "", password: "", confirmPassword: "" });
            } else {
                setFeedbackMsg({ text: data.message || "Ancien mot de passe incorrect", type: "error" });
            }
        } catch (err) {
            setFeedbackMsg({ text: "Erreur réseau", type: "error" });
        }
        setLoader(false);
    };

    // Demander permission push
    const handleRequestPush = async () => {
        if (!("Notification" in window)) return alert("Votre navigateur ne supporte pas le push.");
        const perm = await Notification.requestPermission();
        if (perm === "granted") {
            setNotifPreferences(prev => ({ ...prev, pushEnabled: true }));
            alert("Notifications Push Web autorisées avec succès !");
        } else {
            setNotifPreferences(prev => ({ ...prev, pushEnabled: false }));
            alert("L'autorisation push a été refusée dans les paramètres de votre navigateur.");
        }
    };

    // Test de notification push en direct
    const handleSendTestPush = async () => {
        if (!user?.userid) return;
        setLoader(true);
        try {
            const res = await fetch(`${link}/notification/test-push`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userid: user.userid })
            });
            const data = await res.json();
            if (data.success) {
                alert("Notification Push de test envoyée ! Si votre navigateur est compatible et le Service Worker enregistré, vous devriez voir la notification immédiatement.");
            } else {
                alert(data.message || "Erreur lors du test push");
            }
        } catch (err) {
            console.log(err);
        }
        setLoader(false);
    };

    useEffect(() => {
        const savedTheme = localStorage.getItem("appTheme") || "light";
        if (savedTheme === "dark") document.body.classList.add("dark-theme");
    }, []);

    return (
        <div className="pagestructure">
            <Header title={"Paramètres & Préférences"} retour={true} />
            {loader && <Loader />}

            <div style={{ padding: "20px 24px", maxWidth: "900px" }}>
                {feedbackMsg.text && (
                    <div style={{
                        background: feedbackMsg.type === "success" ? "#dcfce7" : "#fee2e2",
                        color: feedbackMsg.type === "success" ? "#166534" : "#b91c1c",
                        padding: "12px 16px",
                        borderRadius: "8px",
                        marginBottom: "16px",
                        border: `1px solid ${feedbackMsg.type === "success" ? "#bbf7d0" : "#fca5a5"}`
                    }}>
                        <i className={`fa-solid fa-${feedbackMsg.type === "success" ? "circle-check" : "circle-exclamation"}`} style={{ marginRight: "8px" }}></i>
                        {feedbackMsg.text}
                    </div>
                )}

                {/* Onglets de navigation des paramètres */}
                <div className="chip-group" style={{ marginBottom: "20px" }}>
                    <button
                        type="button"
                        className={`chip ${activeTab === "profil" ? "active" : ""}`}
                        onClick={() => setActiveTab("profil")}
                    >
                        <i className="fa-solid fa-user" style={{ marginRight: "6px" }}></i>
                        Mon Profil
                    </button>
                    <button
                        type="button"
                        className={`chip ${activeTab === "notifications" ? "active" : ""}`}
                        onClick={() => setActiveTab("notifications")}
                    >
                        <i className="fa-solid fa-bell" style={{ marginRight: "6px" }}></i>
                        Notifications & Push
                    </button>
                    <button
                        type="button"
                        className={`chip ${activeTab === "apparence" ? "active" : ""}`}
                        onClick={() => setActiveTab("apparence")}
                    >
                        <i className="fa-solid fa-palette" style={{ marginRight: "6px" }}></i>
                        Thème & Affichage
                    </button>
                    <button
                        type="button"
                        className={`chip ${activeTab === "securite" ? "active" : ""}`}
                        onClick={() => setActiveTab("securite")}
                    >
                        <i className="fa-solid fa-shield-halved" style={{ marginRight: "6px" }}></i>
                        Sécurité
                    </button>
                </div>

                {/* Contenu Onglet 1 : Profil */}
                {activeTab === "profil" && (
                    <form className="card" onSubmit={handleUpdateProfile} style={{ margin: 0 }}>
                        <div style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "12px", marginBottom: "16px" }}>
                            <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "var(--text-main)" }}>
                                Informations du compte personnel
                            </h3>
                            <p style={{ margin: "2px 0 0 0", color: "var(--text-muted)", fontSize: "0.8rem" }}>
                                Vos coordonnées officielles pour le suivi des signalements.
                            </p>
                        </div>

                        <div className="flex-column" style={{ gap: "14px" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                                <FormGroup label="Nom" icone="user">
                                    <Input
                                        type="text"
                                        value={profileData.nom}
                                        onChange={(val) => setProfileData({ ...profileData, nom: val })}
                                    />
                                </FormGroup>
                                <FormGroup label="Prénom" icone="user">
                                    <Input
                                        type="text"
                                        value={profileData.prenom}
                                        onChange={(val) => setProfileData({ ...profileData, prenom: val })}
                                    />
                                </FormGroup>
                            </div>

                            <FormGroup label="Nom d'utilisateur" icone="id-badge">
                                <Input
                                    type="text"
                                    value={profileData.username}
                                    disable={true}
                                />
                            </FormGroup>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                                <FormGroup label="Adresse email" icone="envelope">
                                    <Input
                                        type="email"
                                        value={profileData.email}
                                        onChange={(val) => setProfileData({ ...profileData, email: val })}
                                    />
                                </FormGroup>
                                <FormGroup label="Téléphone" icone="phone">
                                    <Input
                                        type="tel"
                                        value={profileData.phone}
                                        onChange={(val) => setProfileData({ ...profileData, phone: val })}
                                    />
                                </FormGroup>
                            </div>

                            <FormGroup label="Adresse physique / Bureau" icone="location-dot">
                                <Input
                                    type="text"
                                    value={profileData.adresse}
                                    onChange={(val) => setProfileData({ ...profileData, adresse: val })}
                                />
                            </FormGroup>

                            <div style={{ background: "#f8fafc", padding: "12px 16px", borderRadius: "8px", border: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>Rôle & Organisation</span>
                                    <strong style={{ fontSize: "0.9rem", color: "var(--text-main)" }}>
                                        {user?.role || user?.designation || "Intervenant"} {user?.organisation_nom ? `• ${user.organisation_nom}` : ""}
                                    </strong>
                                </div>
                                <span style={{ background: "#e0e7ff", color: "var(--primary)", padding: "4px 10px", borderRadius: "var(--radius-pill)", fontSize: "0.75rem", fontWeight: 700 }}>
                                    {user?.type === "main" ? "Gestionnaire principal" : "Membre d'équipe"}
                                </span>
                            </div>

                            <div style={{ marginTop: "10px" }}>
                                <Button
                                    label="Enregistrer les modifications"
                                    icone="floppy-disk"
                                    type="submit"
                                    variant="primary"
                                />
                            </div>
                        </div>
                    </form>
                )}

                {/* Contenu Onglet 2 : Notifications & Push */}
                {activeTab === "notifications" && (
                    <div className="card" style={{ margin: 0 }}>
                        <div style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "12px", marginBottom: "16px" }}>
                            <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "var(--text-main)" }}>
                                Alertes & Notifications Push
                            </h3>
                            <p style={{ margin: "2px 0 0 0", color: "var(--text-muted)", fontSize: "0.8rem" }}>
                                Configurez comment vous êtes averti lorsqu'un signalement correspondant à votre domaine d'intervention est enregistré.
                            </p>
                        </div>

                        <div className="flex-column" style={{ gap: "16px" }}>
                            {/* Option 1 : Push Web */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px", background: "#f8fafc", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                                <div>
                                    <strong style={{ fontSize: "0.9rem", color: "var(--text-main)", display: "block" }}>
                                        <i className="fa-solid fa-mobile-screen" style={{ color: "var(--primary)", marginRight: "8px" }}></i>
                                        Notifications Push sur votre appareil
                                    </strong>
                                    <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                                        Recevez un pop-up d'alerte en direct même si l'onglet est en arrière-plan.
                                    </span>
                                </div>
                                <div>
                                    {Notification?.permission === "granted" ? (
                                        <span style={{ background: "#dcfce7", color: "#166534", padding: "5px 12px", borderRadius: "var(--radius-pill)", fontSize: "0.78rem", fontWeight: 700 }}>
                                            <i className="fa-solid fa-check"></i> Activé
                                        </span>
                                    ) : (
                                        <button
                                            type="button"
                                            className="btn btn-primary btn-sm"
                                            onClick={handleRequestPush}
                                        >
                                            Activer le Push
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Option 2 : Test Push */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px", background: "#f8fafc", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                                <div>
                                    <strong style={{ fontSize: "0.9rem", color: "var(--text-main)", display: "block" }}>
                                        <i className="fa-solid fa-bell-ring" style={{ color: "#d97706", marginRight: "8px" }}></i>
                                        Tester la réception des alertes
                                    </strong>
                                    <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                                        Envoie une notification push de test immédiate à votre appareil connecté.
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-secondary btn-sm"
                                    onClick={handleSendTestPush}
                                >
                                    Envoyer un test
                                </button>
                            </div>

                            {/* Option 3 : Alertes Sonores */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px", background: "#f8fafc", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                                <div>
                                    <strong style={{ fontSize: "0.9rem", color: "var(--text-main)", display: "block" }}>
                                        <i className="fa-solid fa-volume-high" style={{ color: "var(--primary)", marginRight: "8px" }}></i>
                                        Signal sonore lors d'un nouveau signalement
                                    </strong>
                                    <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                                        Émettre un bip d'alerte lors d'une notification entrante.
                                    </span>
                                </div>
                                <Switch
                                    value={notifPreferences.soundAlerts}
                                    onChange={(val) => {
                                        setNotifPreferences({ ...notifPreferences, soundAlerts: val });
                                        localStorage.setItem("soundAlerts", val.toString());
                                    }}
                                />
                            </div>

                            {/* Option 4 : Alertes E-mail */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px", background: "#f8fafc", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                                <div>
                                    <strong style={{ fontSize: "0.9rem", color: "var(--text-main)", display: "block" }}>
                                        <i className="fa-solid fa-envelope" style={{ color: "var(--primary)", marginRight: "8px" }}></i>
                                        Alertes par courriel (Organisation)
                                    </strong>
                                    <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                                        Envoyer une copie par courriel à l'adresse de votre structure pour chaque signalement dans votre domaine.
                                    </span>
                                </div>
                                <Switch
                                    value={notifPreferences.emailAlerts}
                                    onChange={(val) => setNotifPreferences({ ...notifPreferences, emailAlerts: val })}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Contenu Onglet 3 : Apparence & Thème */}
                {activeTab === "apparence" && (
                    <div className="card" style={{ margin: 0 }}>
                        <div style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "12px", marginBottom: "16px" }}>
                            <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "var(--text-main)" }}>
                                Apparence de l'interface
                            </h3>
                            <p style={{ margin: "2px 0 0 0", color: "var(--text-muted)", fontSize: "0.8rem" }}>
                                Personnalisez les couleurs et le confort visuel de votre espace de travail.
                            </p>
                        </div>

                        <div className="flex-column" style={{ gap: "16px" }}>
                            <div>
                                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "8px" }}>
                                    Thème d'affichage :
                                </label>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                                    <div
                                        onClick={() => handleThemeChange("light")}
                                        style={{
                                            padding: "16px",
                                            borderRadius: "8px",
                                            border: theme === "light" ? "2px solid var(--primary)" : "1px solid var(--border-color)",
                                            background: "#ffffff",
                                            cursor: "pointer",
                                            textAlign: "center"
                                        }}
                                    >
                                        <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#f1f5f9", color: "#d97706", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
                                            <i className="fa-solid fa-sun"></i>
                                        </div>
                                        <strong style={{ fontSize: "0.9rem", color: "var(--text-main)", display: "block" }}>Thème Clair</strong>
                                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Interface standard claire et contrastée</span>
                                    </div>

                                    <div
                                        onClick={() => handleThemeChange("dark")}
                                        style={{
                                            padding: "16px",
                                            borderRadius: "8px",
                                            border: theme === "dark" ? "2px solid var(--primary)" : "1px solid var(--border-color)",
                                            background: "#0f172a",
                                            color: "white",
                                            cursor: "pointer",
                                            textAlign: "center"
                                        }}
                                    >
                                        <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#1e293b", color: "#60a5fa", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
                                            <i className="fa-solid fa-moon"></i>
                                        </div>
                                        <strong style={{ fontSize: "0.9rem", color: "white", display: "block" }}>Thème Sombre</strong>
                                        <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Réduit la fatigue oculaire de nuit</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Contenu Onglet 4 : Sécurité */}
                {activeTab === "securite" && (
                    <form className="card" onSubmit={handleUpdatePassword} style={{ margin: 0 }}>
                        <div style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "12px", marginBottom: "16px" }}>
                            <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "var(--text-main)" }}>
                                Sécurité & Mot de passe
                            </h3>
                            <p style={{ margin: "2px 0 0 0", color: "var(--text-muted)", fontSize: "0.8rem" }}>
                                Mettez à jour régulièrement votre mot de passe pour sécuriser vos accès.
                            </p>
                        </div>

                        <div className="flex-column" style={{ gap: "14px", maxWidth: "450px" }}>
                            <FormGroup label="Mot de passe actuel" icone="lock">
                                <Input
                                    type="password"
                                    value={passwordData.oldPassword}
                                    onChange={(val) => setPasswordData({ ...passwordData, oldPassword: val })}
                                    placeholder="••••••••"
                                    required
                                />
                            </FormGroup>

                            <FormGroup label="Nouveau mot de passe" icone="key">
                                <Input
                                    type="password"
                                    value={passwordData.password}
                                    onChange={(val) => setPasswordData({ ...passwordData, password: val })}
                                    placeholder="••••••••"
                                    required
                                />
                            </FormGroup>

                            <FormGroup label="Confirmer le nouveau mot de passe" icone="key">
                                <Input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(val) => setPasswordData({ ...passwordData, confirmPassword: val })}
                                    placeholder="••••••••"
                                    required
                                />
                            </FormGroup>

                            <div style={{ marginTop: "10px" }}>
                                <Button
                                    label="Modifier mon mot de passe"
                                    icone="shield-check"
                                    type="submit"
                                    variant="primary"
                                />
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

