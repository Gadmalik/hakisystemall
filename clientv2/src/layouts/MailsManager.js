import { useNavigate } from "react-router-dom";
import { Header } from "../components/maincomp";
import { Button, FormGroup, Input, Select, Loader } from "../components/minicomp";
import { useState, useEffect } from "react";

export function MailsManager({}) {
    const link = process.env.REACT_APP_LINK;
    const [mailConfig, setMailConfig] = useState(null);
    const [activeTemplate, setActiveTemplate] = useState("alert_domaine");
    const [loaderVisible, setLoaderVisible] = useState(false);
    const [sendingLoader, setSendingLoader] = useState(false);
    const [sendResult, setSendResult] = useState(null);

    // Formulaire d'envoi test
    const [testForm, setTestForm] = useState({
        to: "",
        template: "alert_domaine",
        nom: "Maître Joseph Kabila",
        organisation: "Clinique Juridique du Kivu",
        code: "HSY-92A-48B"
    });

    const loadConfig = async () => {
        setLoaderVisible(true);
        try {
            const res = await fetch(`${link}/mail/config`);
            const data = await res.json();
            if (data?.data) {
                setMailConfig(data.data);
            }
        } catch (err) {
            console.log(err);
        }
        setLoaderVisible(false);
    };

    const handleSendTestMail = async (e) => {
        e.preventDefault();
        if (!testForm.to) return alert("Veuillez saisir une adresse email de destination.");

        setSendingLoader(true);
        setSendResult(null);
        try {
            const res = await fetch(`${link}/mail/test`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(testForm)
            });
            const data = await res.json();
            setSendResult(data);
        } catch (err) {
            setSendResult({ success: false, message: "Erreur réseau lors de l'envoi" });
        }
        setSendingLoader(false);
    };

    useEffect(() => {
        loadConfig();
    }, []);

    // Génération dynamique du contenu HTML de prévisualisation
    const getPreviewHtml = () => {
        if (activeTemplate === "confirm") {
            return `
                <div style="font-family: Arial, sans-serif; max-width: 550px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                    <div style="background: #384bb6; color: white; padding: 24px; text-align: center;">
                        <h2 style="margin: 0; font-size: 1.4rem;">HAKI SYSTEM</h2>
                        <p style="margin: 4px 0 0; opacity: 0.9; font-size: 0.85rem;">Plateforme citoyenne de défense des droits</p>
                    </div>
                    <div style="padding: 24px; color: #334155; line-height: 1.6;">
                        <p>Bonjour <strong>${testForm.nom || 'Utilisateur'}</strong>,</p>
                        <p>Voici votre code de confirmation pour activer votre compte ou réinitialiser votre mot de passe :</p>
                        <div style="background: #f1f5f9; border: 2px dashed #384bb6; border-radius: 8px; padding: 16px; text-align: center; margin: 20px 0;">
                            <span style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; color: #384bb6; font-weight: 700; display: block;">Code de vérification</span>
                            <span style="font-size: 2.2rem; font-weight: 800; letter-spacing: 6px; color: #384bb6; font-family: monospace;">${testForm.code || '784109'}</span>
                        </div>
                        <p style="font-size: 0.8rem; color: #64748b;">Ce code expire dans 10 minutes. Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer ce message.</p>
                    </div>
                    <div style="background: #f8fafc; padding: 14px; text-align: center; font-size: 0.75rem; color: #94a3b8; border-top: 1px solid #e2e8f0;">
                        &copy; 2026 HAKI SYSTEM. Tous droits réservés.
                    </div>
                </div>
            `;
        } else if (activeTemplate === "confirm_org") {
            return `
                <div style="font-family: Arial, sans-serif; max-width: 550px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; border: 1px solid #e2e8f0;">
                    <div style="background: #384bb6; color: white; padding: 24px; text-align: center;">
                        <h2 style="margin: 0; font-size: 1.4rem;">HAKI SYSTEM</h2>
                        <p style="margin: 4px 0 0; opacity: 0.9; font-size: 0.85rem;">Invitation Organisation</p>
                    </div>
                    <div style="padding: 24px; color: #334155; line-height: 1.6;">
                        <p>Bonjour <strong>${testForm.nom || 'Collaborateur'}</strong>,</p>
                        <p>L'organisation <strong>${testForm.organisation || 'Clinique Juridique'}</strong> vous a invité(e) à rejoindre son équipe sur la plateforme <strong>HAKI SYSTEM</strong>.</p>
                        <div style="text-align: center; margin: 24px 0;">
                            <a href="#" style="background: #384bb6; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 700; display: inline-block;">
                                Rejoindre l'organisation
                            </a>
                        </div>
                        <p style="font-size: 0.8rem; color: #64748b;">Ce lien vous permettra de configurer votre mot de passe et vos accès.</p>
                    </div>
                </div>
            `;
        } else if (activeTemplate === "alert_domaine") {
            return `
                <div style="font-family: Arial, sans-serif; max-width: 550px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; border: 1px solid #e2e8f0;">
                    <div style="background: linear-gradient(135deg, #4338ca 0%, #1e1b4b 100%); color: white; padding: 24px; text-align: center;">
                        <span style="background: #ef4444; color: white; padding: 3px 8px; border-radius: 4px; font-size: 0.72rem; font-weight: 700; text-transform: uppercase;">Alerte Prioritaire</span>
                        <h2 style="margin: 8px 0 0; font-size: 1.4rem;">Nouveau Signalement dans votre Domaine</h2>
                    </div>
                    <div style="padding: 24px; color: #334155; line-height: 1.6;">
                        <p>Bonjour à l'équipe de <strong>${testForm.organisation || 'Organisation Partenaire'}</strong>,</p>
                        <p>Un citoyen vient d'enregistrer un signalement correspondant à votre domaine d'intervention déclaré :</p>
                        <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; margin: 16px 0;">
                            <div style="margin-bottom: 6px;"><strong>Code Dossier :</strong> <code style="color: #4338ca; font-weight: 700;">${testForm.code || 'HSY-92A-48B'}</code></div>
                            <div style="margin-bottom: 6px;"><strong>Domaine :</strong> Violences basées sur le genre</div>
                            <div style="margin-bottom: 6px;"><strong>Lieu :</strong> Goma, Quartier Himbi</div>
                            <div><strong>Urgence :</strong> <span style="background: #fee2e2; color: #b91c1c; padding: 2px 6px; border-radius: 4px; font-size: 0.75rem; font-weight: 700;">Élevé</span></div>
                        </div>
                        <div style="text-align: center; margin: 24px 0;">
                            <a href="#" style="background: #4338ca; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 700; display: inline-block;">
                                Prendre en charge ce dossier
                            </a>
                        </div>
                    </div>
                </div>
            `;
        } else {
            return `
                <div style="font-family: Arial, sans-serif; max-width: 550px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; border: 1px solid #e2e8f0;">
                    <div style="background: #16a34a; color: white; padding: 24px; text-align: center;">
                        <h2 style="margin: 0;">Organisation Validée</h2>
                        <p style="margin: 4px 0 0; opacity: 0.9;">Votre compte partenaire est actif</p>
                    </div>
                    <div style="padding: 24px; color: #334155;">
                        <p>Bonjour <strong>${testForm.organisation || 'Organisation'}</strong>,</p>
                        <p>L'administration de HAKI SYSTEM a approuvé votre demande d'adhésion. Vous pouvez désormais vous connecter et recevoir les signalements orientés.</p>
                    </div>
                </div>
            `;
        }
    };

    return (
        <div className="pagestructure">
            <Header title={"Centre des Mails & Notifications"} retour={true} />
            {loaderVisible && <Loader />}

            <div style={{ padding: "15px 20px" }}>
                {/* Statut du service d'envoi */}
                <div style={{
                    background: mailConfig?.configured ? "#ecfdf5" : "#fffbeb",
                    border: mailConfig?.configured ? "1px solid #a7f3d0" : "1px solid #fde68a",
                    borderRadius: "var(--radius-md)",
                    padding: "16px 20px",
                    marginBottom: "20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "12px"
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                        <div style={{
                            width: "42px",
                            height: "42px",
                            borderRadius: "50%",
                            background: mailConfig?.configured ? "#dcfce7" : "#fef3c7",
                            color: mailConfig?.configured ? "#16a34a" : "#d97706",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "1.2rem"
                        }}>
                            <i className="fa-solid fa-paper-plane"></i>
                        </div>
                        <div>
                            <strong style={{ color: mailConfig?.configured ? "#065f46" : "#92400e", fontSize: "0.95rem" }}>
                                {mailConfig?.configured ? "Service d'envoi opérationnel (Resend API)" : "Service d'envoi en mode simulation (Développement)"}
                            </strong>
                            <p style={{ margin: "2px 0 0 0", fontSize: "0.8rem", color: mailConfig?.configured ? "#047857" : "#b45309" }}>
                                Expéditeur configuré : <code>{mailConfig?.fromEmail || "no-reply@hakisystem.net"}</code>
                            </p>
                        </div>
                    </div>

                    <span style={{
                        background: mailConfig?.configured ? "#16a34a" : "#f59e0b",
                        color: "white",
                        padding: "4px 10px",
                        borderRadius: "var(--radius-pill)",
                        fontSize: "0.75rem",
                        fontWeight: 700
                    }}>
                        {mailConfig?.configured ? "Production" : "Mode Test"}
                    </span>
                </div>

                {/* Sélecteur de gabarit d'e-mail */}
                <div className="chip-group" style={{ marginBottom: "18px" }}>
                    <button
                        type="button"
                        className={`chip ${activeTemplate === "alert_domaine" ? "active" : ""}`}
                        onClick={() => { setActiveTemplate("alert_domaine"); setTestForm({ ...testForm, template: "alert_domaine" }); }}
                    >
                        <i className="fa-solid fa-bullhorn" style={{ marginRight: "6px" }}></i>
                        Alerte Signalement (Domaine)
                    </button>
                    <button
                        type="button"
                        className={`chip ${activeTemplate === "confirm_org" ? "active" : ""}`}
                        onClick={() => { setActiveTemplate("confirm_org"); setTestForm({ ...testForm, template: "confirm_org" }); }}
                    >
                        <i className="fa-solid fa-user-plus" style={{ marginRight: "6px" }}></i>
                        Invitation Organisation
                    </button>
                    <button
                        type="button"
                        className={`chip ${activeTemplate === "confirm" ? "active" : ""}`}
                        onClick={() => { setActiveTemplate("confirm"); setTestForm({ ...testForm, template: "confirm" }); }}
                    >
                        <i className="fa-solid fa-key" style={{ marginRight: "6px" }}></i>
                        Confirmation de Compte (OTP)
                    </button>
                    <button
                        type="button"
                        className={`chip ${activeTemplate === "status_org" ? "active" : ""}`}
                        onClick={() => { setActiveTemplate("status_org"); setTestForm({ ...testForm, template: "status_org" }); }}
                    >
                        <i className="fa-solid fa-building-circle-check" style={{ marginRight: "6px" }}></i>
                        Statut Organisation
                    </button>
                </div>

                {/* Grille : Prévisualisation & Test d'envoi */}
                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "24px", alignItems: "start" }}>
                    {/* Cadre de Prévisualisation */}
                    <div className="card" style={{ margin: 0 }}>
                        <div className="flex-between" style={{ marginBottom: "14px", borderBottom: "1px solid var(--border-color)", paddingBottom: "10px" }}>
                            <strong style={{ fontSize: "0.95rem", color: "var(--text-main)" }}>
                                <i className="fa-solid fa-eye" style={{ color: "var(--primary)", marginRight: "8px" }}></i>
                                Aperçu en direct du courriel
                            </strong>
                            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Rendu HTML interactif</span>
                        </div>

                        <div
                            style={{
                                background: "#f8fafc",
                                border: "1px solid var(--border-color)",
                                borderRadius: "8px",
                                padding: "20px",
                                minHeight: "380px"
                            }}
                            dangerouslySetInnerHTML={{ __html: getPreviewHtml() }}
                        />
                    </div>

                    {/* Formulaire de Test d'Envoi */}
                    <form className="card" onSubmit={handleSendTestMail} style={{ margin: 0 }}>
                        <div style={{ marginBottom: "14px", borderBottom: "1px solid var(--border-color)", paddingBottom: "10px" }}>
                            <strong style={{ fontSize: "0.95rem", color: "var(--text-main)" }}>
                                <i className="fa-solid fa-paper-plane" style={{ color: "var(--primary)", marginRight: "8px" }}></i>
                                Tester l'envoi d'un courriel
                            </strong>
                            <p style={{ margin: "2px 0 0 0", fontSize: "0.76rem", color: "var(--text-muted)" }}>
                                Envoyez un exemple réel ou simulé pour vérifier la délivrabilité.
                            </p>
                        </div>

                        {sendResult && (
                            <div style={{
                                background: sendResult.success ? "#dcfce7" : "#fee2e2",
                                color: sendResult.success ? "#166534" : "#b91c1c",
                                padding: "10px 14px",
                                borderRadius: "6px",
                                fontSize: "0.82rem",
                                marginBottom: "14px"
                            }}>
                                <i className={`fa-solid fa-${sendResult.success ? "circle-check" : "circle-exclamation"}`} style={{ marginRight: "6px" }}></i>
                                {sendResult.message}
                            </div>
                        )}

                        <div className="flex-column" style={{ gap: "12px" }}>
                            <FormGroup label="Adresse email de destination" icone="envelope">
                                <Input
                                    type="email"
                                    value={testForm.to}
                                    onChange={(value) => setTestForm({ ...testForm, to: value })}
                                    placeholder="contact@organisation.org"
                                    required
                                />
                            </FormGroup>

                            <FormGroup label="Modèle sélectionné" icone="layer-group">
                                <Select
                                    value={testForm.template}
                                    onChange={(value) => { setTestForm({ ...testForm, template: value }); setActiveTemplate(value); }}
                                    options={[
                                        { value: "alert_domaine", label: "Alerte Signalement (Domaine)" },
                                        { value: "confirm_org", label: "Invitation Organisation" },
                                        { value: "confirm", label: "Confirmation de Compte (OTP)" },
                                        { value: "status_org", label: "Statut Organisation" }
                                    ]}
                                    placeholder="Choisir un modèle"
                                />
                            </FormGroup>

                            <FormGroup label="Nom du destinataire" icone="user">
                                <Input
                                    type="text"
                                    value={testForm.nom}
                                    onChange={(value) => setTestForm({ ...testForm, nom: value })}
                                    placeholder="Nom du destinataire"
                                />
                            </FormGroup>

                            <FormGroup label="Nom de l'organisation" icone="building">
                                <Input
                                    type="text"
                                    value={testForm.organisation}
                                    onChange={(value) => setTestForm({ ...testForm, organisation: value })}
                                    placeholder="Nom de la structure"
                                />
                            </FormGroup>

                            <FormGroup label="Code de test" icone="hashtag">
                                <Input
                                    type="text"
                                    value={testForm.code}
                                    onChange={(value) => setTestForm({ ...testForm, code: value })}
                                    placeholder="Ex: HSY-92A-48B"
                                />
                            </FormGroup>

                            <Button
                                label="Envoyer l'e-mail test"
                                icone="paper-plane"
                                loader={sendingLoader}
                                type="submit"
                                size="block"
                                variant="primary"
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

