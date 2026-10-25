import { Button, FormGroup, Input } from "../components/minicomp";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Login() {
    const [userLogin, setUserLogin] = useState({
        identifiant: "",
        mdp: ""
    });
    const [visiblemdp, setVisiblemdp] = useState(false);
    const [errors, setErrors] = useState({
        identifiant: "",
        mdp: "",
        message: ""
    });
    const [loaderVisible, setLoaderVisible] = useState(false);
    const navigate = useNavigate();
    const link = process.env.REACT_APP_LINK || "http://localhost:5001";

    const login = async (event) => {
        event.preventDefault();
        if (!userLogin.identifiant || !userLogin.mdp) {
            setErrors({
                identifiant: !userLogin.identifiant ? "Le nom d'utilisateur est requis" : "",
                mdp: !userLogin.mdp ? "Le mot de passe est requis" : "",
                message: ""
            });
            return;
        }

        try {
            const identifiant = encodeURIComponent(userLogin.identifiant.trim());
            const mdp = encodeURIComponent(userLogin.mdp);
            setLoaderVisible(true);
            setErrors({ identifiant: "", mdp: "", message: "" });

            const response = await fetch(`${link}/login?identifiant=${identifiant}&mdp=${mdp}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });
            const data = await response.json();

            if (data.success && data.data) {
                localStorage.setItem("userinfo", JSON.stringify(data.data));
                localStorage.setItem("user", JSON.stringify(data.data));

                if (data.data?.organisation) {
                    if (data.data.organisationid) {
                        if (data.data.ogstatus === "en attente" || data.data.ogstatus === "refuse") {
                            navigate("/waiting");
                        } else {
                            navigate("/home/dashboard");
                        }
                    } else {
                        navigate("/waiting");
                    }
                } else {
                    if (data.status === "en_attente" || data.status === "refuse") {
                        navigate("/waiting");
                    } else {
                        navigate("/home/dashboard");
                    }
                }
            } else {
                setErrors((prev) => ({ ...prev, message: data.message || "Identifiant ou mot de passe incorrect." }));
            }
        } catch (error) {
            console.error("Login error:", error);
            setErrors((prev) => ({ ...prev, message: "Impossible de joindre le serveur. Vérifiez votre connexion." }));
        }
        setLoaderVisible(false);
    };

    return (
        <div className="auth-container">
            <div className="auth-sidebar" style={{ background: "var(--primary-gradient)" }}>
                <div className="logo" style={{ color: "white", fontSize: "1.3rem", fontWeight: "800", display: "flex", alignItems: "center", gap: "10px" }}>
                    <div className="logo-icon" style={{ background: "white", color: "var(--primary)", width: "38px", height: "38px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900" }}>
                        H
                    </div>
                    HAKI System
                </div>
                <h2>Plateforme Professionnelle de Signalement & de Suivi</h2>
                <p>
                    Connectez-vous à votre espace sécurisé pour administrer, orienter et traiter les dossiers en temps réel.
                </p>

                <div style={{ marginTop: "auto", borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: "20px", fontSize: "0.85rem", opacity: 0.9 }}>
                    <p style={{ margin: 0 }}>
                        <i className="fa-solid fa-lock" style={{ marginRight: "6px" }}></i>
                        Chiffrement et intégrité garantis conformes aux normes de protection citoyenne.
                    </p>
                </div>
            </div>

            <div className="auth-form">
                <form
                    style={{
                        maxWidth: "460px",
                        background: "white",
                        padding: "36px 32px",
                        borderRadius: "var(--radius-lg)",
                        border: "1px solid var(--border-color)",
                        boxShadow: "var(--shadow-md)",
                        margin: "auto"
                    }}
                    onSubmit={login}
                >
                    <div style={{ textAlign: "center", marginBottom: "24px" }}>
                        <h1 style={{ fontSize: "1.75rem", fontWeight: "800", color: "var(--text-main)", marginBottom: "6px" }}>
                            Connexion
                        </h1>
                        <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", margin: 0 }}>
                            Accédez à votre tableau de bord de gestion
                        </p>
                    </div>

                    <FormGroup icone="user" label="Nom d'utilisateur" error={errors.identifiant} required={true}>
                        <Input
                            placeholder="Votre nom d'utilisateur ou email"
                            onChange={(value) => setUserLogin({ ...userLogin, identifiant: value })}
                            value={userLogin.identifiant}
                            required={true}
                            type="text"
                            autoFocus
                        />
                    </FormGroup>

                    <FormGroup icone="lock" label="Mot de passe" error={errors.mdp} required={true}>
                        <Input
                            placeholder="Votre mot de passe"
                            onChange={(value) => setUserLogin({ ...userLogin, mdp: value })}
                            value={userLogin.mdp}
                            required={true}
                            type={visiblemdp ? "text" : "password"}
                            button={visiblemdp ? "Masquer" : "Afficher"}
                            onClick={() => setVisiblemdp(!visiblemdp)}
                        />
                    </FormGroup>

                    {errors.message && (
                        <div className="alert alert-error" style={{ marginBottom: "16px", padding: "10px 14px", fontSize: "0.85rem" }}>
                            <i className="fa-solid fa-circle-exclamation"></i>
                            <span>{errors.message}</span>
                        </div>
                    )}

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", fontSize: "0.85rem" }}>
                        <label className="checkbox-label" style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                            <input type="checkbox" defaultChecked />
                            <span>Mémoriser ma session</span>
                        </label>
                        <a href="#reset" onClick={(e) => { e.preventDefault(); alert("Pour réinitialiser votre mot de passe, contactez l'administrateur de votre organisation ou le support HAKI."); }} style={{ color: "var(--primary)", textDecoration: "none", fontWeight: "600" }}>
                            Mot de passe oublié ?
                        </a>
                    </div>

                    <Button
                        label="Se connecter à l'espace de gestion"
                        type="submit"
                        variant="primary"
                        size="block"
                        icone="arrow-right-to-bracket"
                        loader={loaderVisible}
                        style={{ width: "100%", padding: "12px", fontSize: "0.95rem" }}
                    />
                    {/* line avec ou au millieu  */}
                    <div style={{ borderTop: "1px solid var(--border-color)", marginTop: "24px", paddingTop: "20px", textAlign: "center", display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem", transform: "translate(0,0)" }}>
                        <span style={{ color: "var(--text-muted)", position: "absolute", top: "-10px", left: "50%", transform: "translateX(-50%)", backgroundColor: "white", padding: "0 10px" }}>OU</span>
                    </div>
                    <Button
                        label="Rejoindre HAKI"
                        type="button"
                        variant="secondary"
                        size="block"
                        icone="user-plus"
                        onClick={() => navigate("/rejoindre")}
                        style={{ width: "100%", padding: "12px", fontSize: "0.95rem" }}
                    />

                    {/* Quick navigation links */}
                    <div style={{ borderTop: "1px solid var(--border-color)", marginTop: "24px", paddingTop: "20px", textAlign: "center", display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem" }}>
                        <p className="auth-footer" style={{ margin: 0 }}>
                            Citoyen ou témoin ?{" "}
                            <a href="/signaler" style={{ fontWeight: "700" }}>
                                Signaler un fait →
                            </a>
                        </p>
                        <p className="auth-footer" style={{ margin: 0 }}>
                            Vous avez déjà un code ?{" "}
                            <a href="/suiviedossier" style={{ fontWeight: "700" }}>
                                Suivre l'avancement d'un dossier →
                            </a>
                        </p>
                        <p className="auth-footer" style={{ margin: 0 }}>
                            Besoin d'aide ?{" "}
                            <a href="/chatbot" style={{ fontWeight: "700" }}>
                                Discuter avec HAKI Bot
                            </a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}