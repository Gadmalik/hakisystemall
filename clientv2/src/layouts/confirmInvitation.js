import logo from "../assets/logo.png";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Alert, Button, FormGroup, Input, Loader, Logo } from "../components/minicomp";
import { useEffect, useState, useCallback } from "react";

export function ConfirmInvitation() {
    const link = process.env.REACT_APP_LINK || "http://localhost:5001";
    const navigate = useNavigate();
    const { code: paramCode, email: paramEmail } = useParams();

    const [activePart, setActivePart] = useState(1);
    const [loaderVisible, setLoaderVisible] = useState(false);
    const [visiblemdp, setVisiblemdp] = useState(false);
    const [visiblemdp2, setVisiblemdp2] = useState(false);
    const [invitationData, setInvitationData] = useState({
        code: paramCode || "",
        email: paramEmail ? decodeURIComponent(paramEmail) : "",
        userid: "",
        nom: "",
        organisation: ""
    });

    const [userRegister, setUserRegister] = useState({
        mdp: "",
        confirm_mdp: ""
    });

    const [error, setError] = useState({});
    const [successMessage, setSuccessMessage] = useState("");

    const verifInfosInvitation = useCallback(async (codeToVerif, emailToVerif) => {
        const c = codeToVerif || invitationData.code;
        const e = emailToVerif || invitationData.email;

        if (!c || !e) {
            setError({ message: "Veuillez fournir le code de vérification et votre adresse e-mail." });
            return;
        }

        setLoaderVisible(true);
        setError({});

        try {
            const response = await fetch(`${link}/user/code`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    code: c,
                    email: e
                })
            });

            const data = await response.json();

            if (data.status === "success" || data.success) {
                setInvitationData(prev => ({
                    ...prev,
                    userid: data.data?.userid,
                    nom: data.data?.nom ? `${data.data.nom} ${data.data.prenom || ""}` : "",
                    organisation: data.data?.organisation_nom || ""
                }));
                setActivePart(2);
            } else {
                setError({ message: data.message || "Code ou adresse e-mail invalide ou expiré." });
            }
        } catch (err) {
            console.error("Error verifInfosInvitation:", err);
            setError({ message: "Impossible de joindre le serveur. Veuillez vérifier votre connexion." });
        } finally {
            setLoaderVisible(false);
        }
    }, [link, invitationData.code, invitationData.email]);

    const setMdp = async (event) => {
        event.preventDefault();
        setError({});

        if (!userRegister.mdp || !userRegister.confirm_mdp) {
            setError({ message: "Veuillez renseigner et confirmer votre mot de passe." });
            return;
        }

        if (userRegister.mdp.length < 8) {
            setError({ mdp: "Le mot de passe doit comporter au moins 8 caractères." });
            return;
        }

        if (userRegister.mdp !== userRegister.confirm_mdp) {
            setError({ confirm_mdp: "Les deux mots de passe ne correspondent pas." });
            return;
        }

        setLoaderVisible(true);
        try {
            const response = await fetch(`${link}/user/mdp`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    mdp: userRegister.mdp,
                    userid: invitationData.userid,
                }),
            });

            const data = await response.json();

            if (data.success || data.status === "success") {
                setSuccessMessage("Compte configuré et activé avec succès ! Redirection en cours...");
                if (data.data) {
                    const savedUser = data.data.user || data.data;
                    localStorage.setItem("userinfo", JSON.stringify(savedUser));
                }

                setTimeout(() => {
                    navigate("/home/dashboard");
                }, 2000);
            } else {
                const serverErrors = { message: data.message || "Erreur lors de la configuration du compte." };
                if (data.code === 'mdp_invalid') {
                    serverErrors.mdp = "Le mot de passe choisi est invalide.";
                }
                setError(serverErrors);
            }
        } catch (err) {
            console.error("Error setMdp:", err);
            setError({ message: "Une erreur réseau s'est produite lors de la validation." });
        } finally {
            setLoaderVisible(false);
        }
    };

    useEffect(() => {
        if (paramCode && paramEmail) {
            verifInfosInvitation(paramCode, decodeURIComponent(paramEmail));
        }
    }, [paramCode, paramEmail, verifInfosInvitation]);

    return (
        <div className="auth-container">
            {/* Sidebar gauche avec branding */}
            <div className="auth-sidebar" style={{ background: "var(--primary-gradient)" }}>
                <div className="logo" style={{ color: "white", fontSize: "1.3rem", fontWeight: "800", display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ background: "white", borderRadius: "10px", padding: "4px", display: "flex", alignItems: "center", justifyContent: "center", width: "42px", height: "42px", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
                        <Logo size={34} />
                    </div>
                    <span>HAKI System</span>
                </div>

                <h2>Invitation à rejoindre l'organisation</h2>
                <p>
                    Bienvenue sur la plateforme sécurisée de signalement et de protection citoyenne HAKI System.
                </p>

                <ul style={{ margin: "20px 0", paddingLeft: "20px", lineHeight: "1.8", fontSize: "0.9rem" }}>
                    <li>Validation chiffrée de votre invitation par code à usage unique</li>
                    <li>Configuration de vos identifiants d'accès sécurisés</li>
                    <li>Accès immédiat à l'espace de traitement des signalements</li>
                </ul>

                <div style={{ marginTop: "auto", borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: "16px", fontSize: "0.82rem", opacity: 0.9 }}>
                    <i className="fa-solid fa-shield-halved" style={{ marginRight: "6px" }}></i>
                    Chiffrement de bout en bout et protection de votre identité professionnelle.
                </div>
            </div>

            {/* Formulaire droit */}
            <div className="auth-form" style={{ overflowY: "auto", padding: "20px", maxHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: "100%", maxWidth: "480px", background: "white", padding: "32px", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-color)", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
                    <div style={{ textAlign: "center", marginBottom: "24px" }}>
                        <div style={{ display: "inline-flex", background: "#f1f5f9", padding: "8px", borderRadius: "12px", marginBottom: "12px" }}>
                            <img src={logo} alt="HAKI" style={{ width: "40px", height: "40px", objectFit: "contain" }} />
                        </div>
                        <h2 style={{ fontSize: "1.4rem", fontWeight: "800", margin: "0 0 6px 0", color: "var(--text-main)" }}>
                            Activation de votre compte
                        </h2>
                        <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--text-muted)" }}>
                            {activePart === 1 ? "Vérification des informations d'invitation" : "Définissez votre mot de passe pour finaliser l'accès"}
                        </p>
                    </div>

                    {/* Stepper */}
                    <div className="stepper-container" style={{ margin: "16px auto 24px auto" }}>
                        <div className="stepper">
                            <div className="stepper-progress" style={{ width: activePart === 1 ? "0%" : "100%" }}></div>

                            <div className={`step ${activePart === 1 ? 'active' : 'completed'}`}>
                                <div className="step-number">{activePart > 1 ? '✓' : 1}</div>
                                <div className="step-label">Vérification</div>
                            </div>
                            <div className={`step ${activePart === 2 ? 'active' : ''}`}>
                                <div className="step-number">2</div>
                                <div className="step-label">Sécurité</div>
                            </div>
                        </div>
                    </div>

                    {error.message && (
                        <div style={{ marginBottom: "16px" }}>
                            <Alert type="error" icone="triangle-exclamation" message={error.message} />
                        </div>
                    )}

                    {successMessage && (
                        <div style={{ marginBottom: "16px" }}>
                            <Alert type="success" icone="circle-check" message={successMessage} />
                        </div>
                    )}

                    {/* Étape 1 : Vérification */}
                    {activePart === 1 && (
                        <div>
                            {loaderVisible ? (
                                <div style={{ textAlign: "center", padding: "30px 0" }}>
                                    <Loader />
                                    <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: "12px" }}>
                                        Validation de votre invitation en cours...
                                    </p>
                                </div>
                            ) : (
                                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                                    <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", lineHeight: "1.5" }}>
                                        Entrez votre code de vérification et votre adresse e-mail pour confirmer votre invitation :
                                    </p>

                                    <FormGroup icone="envelope" label="Adresse E-mail" error={error.email}>
                                        <Input
                                            type="email"
                                            placeholder="nom@exemple.com"
                                            value={invitationData.email}
                                            onChange={(val) => setInvitationData({ ...invitationData, email: val })}
                                            required
                                        />
                                    </FormGroup>

                                    <FormGroup icone="key" label="Code de confirmation" error={error.code}>
                                        <Input
                                            type="text"
                                            placeholder="Code à 6 chiffres"
                                            value={invitationData.code}
                                            onChange={(val) => setInvitationData({ ...invitationData, code: val })}
                                            required
                                        />
                                    </FormGroup>

                                    <div style={{ marginTop: "10px" }}>
                                        <Button
                                            label="Vérifier l'invitation"
                                            variant="primary"
                                            size="block"
                                            icone="arrow-right"
                                            onClick={() => verifInfosInvitation()}
                                            loader={loaderVisible}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Étape 2 : Configuration du mot de passe */}
                    {activePart === 2 && (
                        <form onSubmit={setMdp} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                            {invitationData.nom && (
                                <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "10px 14px", borderRadius: "8px", fontSize: "0.85rem", color: "#166534" }}>
                                    <i className="fa-solid fa-user-check" style={{ marginRight: "6px" }}></i>
                                    Compte identifié pour : <strong>{invitationData.nom}</strong>
                                </div>
                            )}

                            <FormGroup icone="lock" label="Nouveau mot de passe" error={error.mdp}>
                                <Input
                                    type={visiblemdp ? "text" : "password"}
                                    placeholder="Minimum 8 caractères"
                                    value={userRegister.mdp}
                                    onChange={(val) => setUserRegister({ ...userRegister, mdp: val })}
                                    button={visiblemdp ? "Masquer" : "Afficher"}
                                    onClick={() => setVisiblemdp(!visiblemdp)}
                                    required
                                />
                            </FormGroup>

                            <FormGroup icone="lock" label="Confirmer le mot de passe" error={error.confirm_mdp}>
                                <Input
                                    type={visiblemdp2 ? "text" : "password"}
                                    placeholder="Répétez le mot de passe"
                                    value={userRegister.confirm_mdp}
                                    onChange={(val) => setUserRegister({ ...userRegister, confirm_mdp: val })}
                                    button={visiblemdp2 ? "Masquer" : "Afficher"}
                                    onClick={() => setVisiblemdp2(!visiblemdp2)}
                                    required
                                />
                            </FormGroup>

                            <div style={{ marginTop: "8px" }}>
                                <Button
                                    label="Activer mon compte & Continuer"
                                    variant="primary"
                                    size="block"
                                    type="submit"
                                    icone="circle-check"
                                    loader={loaderVisible}
                                />
                            </div>
                        </form>
                    )}

                    <div style={{ textAlign: "center", marginTop: "24px", paddingTop: "16px", borderTop: "1px solid var(--border-color)", fontSize: "0.82rem", color: "var(--text-muted)" }}>
                        Vous possédez déjà un compte configuré ? <Link to="/" style={{ color: "var(--primary)", fontWeight: 600 }}>Se connecter</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConfirmInvitation;