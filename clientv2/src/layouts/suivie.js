import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge, Button, Loader } from "../components/minicomp";

export function SuivieDossier() {
    const link = process.env.REACT_APP_LINK || "http://localhost:5001";
    const navigate = useNavigate();
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [signalement, setSignalement] = useState(null);
    const [searched, setSearched] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const loadSignalement = async (codeToSearch) => {
        const queryCode = (codeToSearch || code).trim().toUpperCase();
        if (!queryCode) {
            setErrorMessage("Veuillez saisir votre code de suivi");
            return;
        }

        setLoading(true);
        setErrorMessage("");
        setSearched(true);
        try {
            const response = await fetch(`${link}/signalement/${encodeURIComponent(queryCode)}/code`);
            const data = await response.json();
            if (data.data) {
                setSignalement(data.data);
            } else {
                setSignalement(null);
                setErrorMessage("Aucun dossier correspondant à ce code de suivi. Vérifiez la saisie et réessayez.");
            }
        } catch (error) {
            console.error(error);
            setErrorMessage("Erreur de connexion lors de la recherche du dossier.");
        }
        setLoading(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            loadSignalement();
        }
    };

    const isResolved = signalement?.statusatt === "résolu" || signalement?.statusatt === "resolu" || signalement?.statusatt === "cloturé";
    const isInProgress = signalement?.statusatt === "en cours" || signalement?.statusatt === "accepté";
    const isOriented = signalement?.type_attribut === "orientation";

    return (
        <main className="waiting-container" style={{ padding: "40px 16px", maxWidth: "720px", margin: "0 auto" }}>
            <div style={{ marginBottom: "24px", textAlign: "center" }}>
                <div style={{
                    width: "56px",
                    height: "56px",
                    background: "var(--primary-light)",
                    color: "var(--primary)",
                    borderRadius: "50%",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                    marginBottom: "12px"
                }}>
                    <i className="fa-solid fa-route"></i>
                </div>
                <h1 style={{ fontSize: "1.75rem", fontWeight: "800", color: "var(--text-main)", marginBottom: "6px" }}>
                    Suivi en direct de votre dossier
                </h1>
                <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", maxWidth: "520px", margin: "0 auto" }}>
                    Entrez votre code de suivi unique pour consulter l'avancement des démarches entreprises pour votre signalement.
                </p>
            </div>

            {/* Search card */}
            <div className="card" style={{ marginBottom: "24px" }}>
                <div className="form-group" style={{ marginBottom: "8px" }}>
                    <label htmlFor="trackingInput" style={{ fontWeight: "700" }}>
                        Code unique de suivi
                    </label>
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value.toUpperCase())}
                            onKeyDown={handleKeyDown}
                            id="trackingInput"
                            className="form-control"
                            placeholder="Ex : HSY-7N2-MNC"
                            style={{
                                flex: 1,
                                minWidth: "220px",
                                textTransform: "uppercase",
                                letterSpacing: "0.08em",
                                fontWeight: "700",
                                fontSize: "1.05rem",
                                padding: "12px 18px"
                            }}
                            autoFocus
                        />
                        <button
                            className="btn btn-primary"
                            id="searchBtn"
                            style={{ flexShrink: 0, padding: "12px 24px" }}
                            onClick={() => loadSignalement()}
                            disabled={loading}
                        >
                            <i className={`fa-solid ${loading ? "fa-spinner fa-spin" : "fa-magnifying-glass"}`} style={{ marginRight: "8px" }}></i>
                            Rechercher
                        </button>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px", fontSize: "0.78rem", color: "var(--text-muted)" }}>
                        <span>
                            <i className="fa-solid fa-circle-info" style={{ marginRight: "4px" }}></i>
                            Code confidentiel à 11 caractères fourni lors du dépôt.
                        </span>
                        <button
                            onClick={() => {
                                setCode("HSY-7N2-MNC");
                                loadSignalement("HSY-7N2-MNC");
                            }}
                            style={{ background: "transparent", border: "none", color: "var(--primary)", cursor: "pointer", fontWeight: "600", fontSize: "0.78rem" }}
                        >
                            Tester un code démo
                        </button>
                    </div>
                </div>

                {errorMessage && (
                    <div className="alert alert-error" style={{ marginTop: "16px", marginBottom: 0 }}>
                        <i className="fa-solid fa-triangle-exclamation"></i>
                        <span>{errorMessage}</span>
                    </div>
                )}
            </div>

            {loading && <Loader text="Recherche du dossier dans la base sécurisée..." />}

            {!signalement && !loading && (
                <div className="kpi-card track-empty" style={{ background: "white" }}>
                    <div className="track-empty-icon">
                        <i className="fa-solid fa-folder-open"></i>
                    </div>
                    <h3 style={{ marginBottom: "8px", fontSize: "1.2rem", fontWeight: "700" }}>
                        {searched ? "Aucun dossier trouvé" : "Prêt pour la recherche"}
                    </h3>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", maxWidth: "420px", margin: "0 auto 16px auto" }}>
                        {searched
                            ? "Assurez-vous d'avoir bien recopié tous les caractères de votre code, tirets inclus."
                            : "Saisissez votre code ci-dessus pour accéder à la chronologie de traitement de votre demande."}
                    </p>
                    <button onClick={() => navigate("/chatbot")} className="btn btn-secondary btn-sm">
                        <i className="fa-solid fa-headset" style={{ marginRight: "6px" }}></i>
                        Besoin d'aide ? Discuter avec HAKI Bot
                    </button>
                </div>
            )}

            {signalement && (
                <div id="resultState">
                    {/* Status header banner */}
                    <div className="track-status-banner" style={{
                        background: isResolved ? "#dcfce7" : isInProgress ? "var(--status-analysis-bg)" : "var(--status-new-bg)",
                        borderColor: isResolved ? "#16a34a" : isInProgress ? "var(--status-analysis-text)" : "var(--primary)"
                    }}>
                        <div className="track-status-icon" style={{
                            color: isResolved ? "#16a34a" : isInProgress ? "var(--status-analysis-text)" : "var(--primary)"
                        }}>
                            <i className={`fa-solid ${isResolved ? "fa-circle-check" : isInProgress ? "fa-clock" : "fa-inbox"}`}></i>
                        </div>
                        <div>
                            <strong style={{ fontSize: "1.1rem", display: "block", color: "var(--text-main)" }}>
                                {isResolved
                                    ? "Dossier traité et résolu"
                                    : isInProgress
                                        ? "Dossier en cours de traitement"
                                        : "Dossier enregistré • En attente de gestionnaire"}
                            </strong>
                            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                                Code de référence : <strong>{signalement.code_unique}</strong>
                            </span>
                        </div>
                        <div style={{ marginLeft: "auto" }}>
                            <Badge label={signalement.statusatt || "Nouveau"} type={signalement.statusatt || "new"} />
                        </div>
                    </div>

                    {/* Timeline card */}
                    <div className="kpi-card" style={{ marginBottom: "20px", background: "white" }}>
                        <h4 style={{ fontSize: "1.05rem", fontWeight: "700", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                            <i className="fa-solid fa-timeline" style={{ color: "var(--primary)" }}></i>
                            Chronologie des étapes
                        </h4>

                        <div className="track-timeline">
                            {/* Step 1: Enregistrement */}
                            <div className="track-step completed">
                                <div className="track-icon">
                                    <i className="fa-solid fa-check"></i>
                                </div>
                                <div className="track-content">
                                    <strong>1. Signalement enregistré avec succès</strong>
                                    <p>Votre demande a été enregistrée et chiffrée dans le système sécurisé HAKI.</p>
                                    <span className="track-date">
                                        Date : {signalement.date_incident ? new Date(signalement.date_incident).toLocaleDateString("fr-FR") : "-"}
                                    </span>
                                </div>
                            </div>

                            {/* Step 2: Prise en charge */}
                            <div className={`track-step ${isInProgress || isResolved ? "completed" : "current"}`}>
                                <div className="track-icon">
                                    <i className={`fa-solid ${isInProgress || isResolved ? "fa-check" : "fa-spinner fa-spin"}`}></i>
                                </div>
                                <div className="track-content">
                                    <strong>2. Affectation et vérification</strong>
                                    <p>
                                        {isInProgress || isResolved
                                            ? `Pris en charge ${signalement.organisation_nom ? `par ${signalement.organisation_nom}` : "par une structure habilitée"}.`
                                            : "En attente d'attribution auprès de nos gestionnaires qualifiés."}
                                    </p>
                                    {signalement.date_attribut && (
                                        <span className="track-date">
                                            Pris en charge le {new Date(signalement.date_attribut).toLocaleDateString("fr-FR")}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Step 3: Orientation éventuelle */}
                            {isOriented && (
                                <div className="track-step completed">
                                    <div className="track-icon" style={{ background: "var(--primary)", color: "white" }}>
                                        <i className="fa-solid fa-share-nodes"></i>
                                    </div>
                                    <div className="track-content">
                                        <strong>3. Orientation vers un partenaire spécialisé</strong>
                                        <p>Transféré à l'organisme : <strong>{signalement.organisation_nom || "Partenaire agréé"}</strong> pour mesures d'assistance.</p>
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Résolution */}
                            <div className={`track-step ${isResolved ? "completed" : ""}`}>
                                <div className="track-icon">
                                    <i className={`fa-solid ${isResolved ? "fa-check" : "fa-flag-checkered"}`}></i>
                                </div>
                                <div className="track-content">
                                    <strong>{isOriented ? "4" : "3"}. Résolution & Clôture</strong>
                                    <p>
                                        {isResolved
                                            ? "Les mesures nécessaires ont été prises et le dossier est formellement clos."
                                            : "Résolution définitive en attente des conclusions de l'enquête / assistance."}
                                    </p>
                                    {signalement.commentaire_attribut && (
                                        <div style={{ background: "#f9fafb", padding: "10px", borderRadius: "var(--radius-md)", fontSize: "0.82rem", marginTop: "6px" }}>
                                            <strong>Note de clôture :</strong> {signalement.commentaire_attribut}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Case Information Summary */}
                    <div className="kpi-card" style={{ marginBottom: "20px", background: "white" }}>
                        <h4 style={{ fontSize: "1.05rem", fontWeight: "700", marginBottom: "14px" }}>
                            Informations déclarées
                        </h4>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", fontSize: "0.88rem" }}>
                            <div style={{ background: "#f9fafb", padding: "10px 14px", borderRadius: "var(--radius-md)" }}>
                                <span className="text-muted" style={{ display: "block", fontSize: "0.75rem" }}>CATÉGORIE</span>
                                <strong>{signalement.categorie || "Général"}</strong>
                            </div>
                            <div style={{ background: "#f9fafb", padding: "10px 14px", borderRadius: "var(--radius-md)" }}>
                                <span className="text-muted" style={{ display: "block", fontSize: "0.75rem" }}>LIEU</span>
                                <strong>{signalement.lieu || "Non précisé"}</strong>
                            </div>
                            <div style={{ background: "#f9fafb", padding: "10px 14px", borderRadius: "var(--radius-md)" }}>
                                <span className="text-muted" style={{ display: "block", fontSize: "0.75rem" }}>NIVEAU</span>
                                <Badge label={signalement.niveau || "Moyen"} type={signalement.niveau} />
                            </div>
                        </div>

                        <div style={{ marginTop: "14px", fontSize: "0.88rem" }}>
                            <span className="text-muted" style={{ display: "block", fontSize: "0.75rem", marginBottom: "4px" }}>DESCRIPTION DES FAITS</span>
                            <div style={{ background: "#f9fafb", padding: "12px", borderRadius: "var(--radius-md)", lineHeight: "1.6" }}>
                                {signalement.description}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
                        <Button
                            label="Imprimer le récépissé de suivi"
                            variant="primary"
                            size="md"
                            icone="print"
                            onClick={() => window.print()}
                        />
                        <Button
                            label="Poser une question à HAKI Bot"
                            variant="secondary"
                            size="md"
                            icone="robot"
                            onClick={() => navigate("/chatbot")}
                        />
                    </div>
                </div>
            )}

            <div style={{ textAlign: "center", marginTop: "32px" }}>
                <a href="/" className="btn btn-ghost btn-sm" style={{ color: "var(--text-muted)" }}>
                    <i className="fa-solid fa-arrow-left" style={{ marginRight: "6px" }}></i>
                    Retour à l'accueil
                </a>
            </div>
        </main>
    );
}