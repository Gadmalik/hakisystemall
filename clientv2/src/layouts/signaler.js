import { useNavigate } from "react-router-dom";
import { HeaderSimple } from "../components/maincomp";
import { Alert, Button, FileCard, Input, Switch, TextArea, Uploader, Loader } from "../components/minicomp";
import { useEffect, useState } from "react";

export function Signaler() {
    const navigate = useNavigate();
    const link = process.env.REACT_APP_LINK || "http://localhost:5001";

    const [step, setStep] = useState(1); // 1: Formulaire, 2: Confirmation
    const [signalement, setSignalement] = useState({
        categorieid: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
        lieu: "",
        annexes: [],
        genre: "N",
        trancheage: 2,
        contact: "",
        iscontact: false
    });

    const [createdSignalement, setCreatedSignalement] = useState(null);
    const [visibleLoader, setVisibleLoader] = useState(false);
    const [listTypeIncident, setListTypeIncident] = useState([]);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);

    const loadTypeIncident = async () => {
        setVisibleLoader(true);
        try {
            const res = await fetch(`${link}/get_categorie`);
            const data = await res.json();
            if (data?.data && data.data.length > 0) {
                setListTypeIncident(data.data);
                // Preselect first category if available
                setSignalement((prev) => ({
                    ...prev,
                    categorieid: prev.categorieid || data.data[0].categorie_id
                }));
            }
        } catch (err) {
            console.error("Error loading categories:", err);
        }
        setVisibleLoader(false);
    };

    useEffect(() => {
        loadTypeIncident();
    }, []);

    const handleFilesSelected = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;
        setSignalement((prev) => ({
            ...prev,
            annexes: [...prev.annexes, ...files].slice(0, 5) // max 5 files
        }));
    };

    const handleRemoveFile = (indexToRemove) => {
        setSignalement((prev) => ({
            ...prev,
            annexes: prev.annexes.filter((_, i) => i !== indexToRemove)
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);

        if (!signalement.categorieid) {
            setError("Veuillez sélectionner la catégorie de l'incident.");
            return;
        }
        if (!signalement.description.trim()) {
            setError("Veuillez décrire les faits dans le champ de description.");
            return;
        }
        if (!signalement.lieu.trim()) {
            setError("Veuillez indiquer le lieu où les faits se sont produits.");
            return;
        }
        if (!signalement.date) {
            setError("Veuillez renseigner la date de l'événement.");
            return;
        }
        if (signalement.iscontact && !signalement.contact.trim()) {
            setError("Vous avez demandé à être contacté(e) : veuillez renseigner un email ou numéro de téléphone.");
            return;
        }

        setVisibleLoader(true);
        try {
            const formData = new FormData();
            formData.append("categorieid", signalement.categorieid);
            formData.append("description", signalement.description);
            formData.append("date", signalement.date);
            formData.append("lieu", signalement.lieu);
            formData.append("genre", signalement.genre || "N");
            formData.append("trancheage", signalement.trancheage || "");
            formData.append("contact", signalement.iscontact ? signalement.contact : "");
            formData.append("iscontact", String(signalement.iscontact));

            if (signalement.annexes && signalement.annexes.length > 0) {
                signalement.annexes.forEach((file) => {
                    formData.append("annexe", file);
                });
            }

            const response = await fetch(`${link}/incident`, {
                method: "POST",
                body: formData
            });

            const data = await response.json();
            if (data.success || data.status === "success") {
                setCreatedSignalement(data.data);
                setStep(2);
                window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
                setError(data.message || "Erreur lors de l'enregistrement du signalement.");
            }
        } catch (err) {
            console.error(err);
            setError("Une erreur de communication avec le serveur s'est produite.");
        }
        setVisibleLoader(false);
    };

    const handleCopyCode = () => {
        if (createdSignalement?.code_unique) {
            navigator.clipboard.writeText(createdSignalement.code_unique);
            setCopied(true);
            setTimeout(() => setCopied(false), 4000);
        }
    };

    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-body)", paddingBottom: "40px" }}>
            <HeaderSimple title="HAKI SYSTEM - Signalement Sécurisé" retour={true} onBack={() => navigate(-1)} />

            {visibleLoader && <Loader text="Traitement et sécurisation de votre envoi..." />}

            <div style={{ maxWidth: "760px", margin: "90px auto 20px auto", padding: "0 16px" }}>
                {step === 1 ? (
                    <div>
                        {/* Title header */}
                        <div style={{ textAlign: "center", marginBottom: "24px" }}>
                            <div style={{
                                width: "52px",
                                height: "52px",
                                background: "var(--primary-light)",
                                color: "var(--primary)",
                                borderRadius: "50%",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "1.4rem",
                                marginBottom: "10px"
                            }}>
                                <i className="fa-solid fa-shield-halved"></i>
                            </div>
                            <h1 style={{ fontSize: "1.75rem", fontWeight: "800", color: "var(--text-main)", marginBottom: "6px" }}>
                                Déposer un signalement
                            </h1>
                            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", maxWidth: "560px", margin: "0 auto" }}>
                                Dénoncez un fait en toute sérénité. Vos données sont chiffrées et vous pouvez choisir de rester strictement anonyme.
                            </p>
                        </div>

                        {error && (
                            <div style={{ marginBottom: "16px" }}>
                                <Alert type="error" message={error} icone="triangle-exclamation" title="Champs obligatoires" />
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="card" style={{ maxWidth: "100%", padding: "28px" }}>
                            {/* 1. Category */}
                            <div style={{ marginBottom: "24px" }}>
                                <label style={{ display: "block", fontWeight: "700", fontSize: "0.95rem", marginBottom: "6px" }}>
                                    1. De quelle nature est le fait ? <span style={{ color: "tomato" }}>*</span>
                                </label>
                                <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "12px" }}>
                                    Sélectionnez la catégorie la plus proche de la situation observée.
                                </p>

                                <div className="chip-group">
                                    {listTypeIncident.map((type) => {
                                        const isSelected = String(signalement.categorieid) === String(type.categorie_id);
                                        return (
                                            <button
                                                type="button"
                                                key={type.categorie_id}
                                                className={`chip ${isSelected ? "active" : ""}`}
                                                onClick={() => setSignalement({ ...signalement, categorieid: type.categorie_id })}
                                            >
                                                {type.designation}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* 2. Description */}
                            <div style={{ marginBottom: "24px" }}>
                                <label style={{ display: "block", fontWeight: "700", fontSize: "0.95rem", marginBottom: "6px" }}>
                                    2. Que s'est-il passé ? <span style={{ color: "tomato" }}>*</span>
                                </label>
                                <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "8px" }}>
                                    Décrivez les faits avec le maximum de précision factuelle (circonstances, personnes impliquées, conséquences).
                                </p>
                                <TextArea
                                    placeholder="Expliquez clairement ce qui a été constaté..."
                                    value={signalement.description}
                                    onChange={(val) => setSignalement({ ...signalement, description: val })}
                                    rows={5}
                                    required={true}
                                />
                            </div>

                            {/* 3. Date & Lieu */}
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginBottom: "24px" }}>
                                <div>
                                    <label style={{ display: "block", fontWeight: "700", fontSize: "0.95rem", marginBottom: "6px" }}>
                                        3. Quand cela s'est-il produit ? <span style={{ color: "tomato" }}>*</span>
                                    </label>
                                    <Input
                                        type="date"
                                        value={signalement.date}
                                        onChange={(val) => setSignalement({ ...signalement, date: val })}
                                        required={true}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: "block", fontWeight: "700", fontSize: "0.95rem", marginBottom: "6px" }}>
                                        4. Où cela s'est-il produit ? <span style={{ color: "tomato" }}>*</span>
                                    </label>
                                    <Input
                                        type="text"
                                        placeholder="Ex : Ville, commune, quartier, institution..."
                                        value={signalement.lieu}
                                        onChange={(val) => setSignalement({ ...signalement, lieu: val })}
                                        required={true}
                                    />
                                </div>
                            </div>

                            {/* 4. Annexes / Preuves */}
                            <div style={{ marginBottom: "24px" }}>
                                <label style={{ display: "block", fontWeight: "700", fontSize: "0.95rem", marginBottom: "6px" }}>
                                    5. Pièces jointes & Preuves (facultatif)
                                </label>
                                <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "12px" }}>
                                    Vous pouvez joindre des photos, documents PDF, vidéos ou enregistrements audio (max 5 fichiers).
                                </p>
                                <Uploader
                                    label="Déposer des documents ou captures"
                                    id="preuvesInput"
                                    onChange={handleFilesSelected}
                                    multiple={true}
                                />

                                {signalement.annexes.length > 0 && (
                                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "12px" }}>
                                        {signalement.annexes.map((file, idx) => (
                                            <FileCard
                                                key={idx}
                                                titre={file.name}
                                                taille={`${(file.size / (1024 * 1024)).toFixed(2)} MB`}
                                                button="Retirer"
                                                onClick={() => handleRemoveFile(idx)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* 5. Profils et démographie */}
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px", marginBottom: "24px" }}>
                                <div>
                                    <label style={{ display: "block", fontWeight: "700", fontSize: "0.9rem", marginBottom: "6px" }}>
                                        6. Genre de la personne concernée
                                    </label>
                                    <div className="chip-group">
                                        <button
                                            type="button"
                                            className={`chip ${signalement.genre === "F" ? "active" : ""}`}
                                            onClick={() => setSignalement({ ...signalement, genre: "F" })}
                                        >
                                            Femme
                                        </button>
                                        <button
                                            type="button"
                                            className={`chip ${signalement.genre === "H" ? "active" : ""}`}
                                            onClick={() => setSignalement({ ...signalement, genre: "H" })}
                                        >
                                            Homme
                                        </button>
                                        <button
                                            type="button"
                                            className={`chip ${signalement.genre === "N" ? "active" : ""}`}
                                            onClick={() => setSignalement({ ...signalement, genre: "N" })}
                                        >
                                            Non précisé
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: "block", fontWeight: "700", fontSize: "0.9rem", marginBottom: "6px" }}>
                                        7. Tranche d'âge concernée
                                    </label>
                                    <div className="chip-group">
                                        {[
                                            { id: 1, label: "-18 ans" },
                                            { id: 2, label: "18-25" },
                                            { id: 3, label: "25-35" },
                                            { id: 4, label: "35-50" },
                                            { id: 5, label: "50+" }
                                        ].map((t) => (
                                            <button
                                                key={t.id}
                                                type="button"
                                                className={`chip ${signalement.trancheage === t.id ? "active" : ""}`}
                                                onClick={() => setSignalement({ ...signalement, trancheage: t.id })}
                                            >
                                                {t.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* 6. Contact & Anonymat */}
                            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "18px", borderRadius: "var(--radius-md)", marginBottom: "28px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
                                    <div>
                                        <strong style={{ color: "#166534", fontSize: "0.95rem", display: "block", marginBottom: "4px" }}>
                                            <i className="fa-solid fa-phone" style={{ marginRight: "6px" }}></i>
                                            Souhaitez-vous être contacté(e) par une structure d'aide ?
                                        </strong>
                                        <p style={{ fontSize: "0.82rem", color: "#15803d", margin: 0 }}>
                                            Si désactivé, vous restez à 100% anonyme et suivez l'avancement uniquement avec votre code secret de suivi.
                                        </p>
                                    </div>
                                    <Switch
                                        value={signalement.iscontact}
                                        onChange={(val) => setSignalement({ ...signalement, iscontact: val })}
                                    />
                                </div>

                                {signalement.iscontact && (
                                    <div style={{ marginTop: "14px" }}>
                                        <Input
                                            type="text"
                                            placeholder="Numéro de téléphone ou adresse e-mail de contact"
                                            value={signalement.contact}
                                            onChange={(val) => setSignalement({ ...signalement, contact: val })}
                                            required={true}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Submit button */}
                            <Button
                                label="Soumettre le signalement en toute sécurité"
                                variant="primary"
                                size="md"
                                type="submit"
                                icone="shield-halved"
                                loader={visibleLoader}
                                style={{ width: "100%", padding: "14px", fontSize: "1rem" }}
                            />
                        </form>
                    </div>
                ) : (
                    /* Step 2: Confirmation & Secret code */
                    <div className="card" style={{ textAlign: "center", padding: "36px 28px" }}>
                        <div style={{
                            width: "72px",
                            height: "72px",
                            background: "#dcfce7",
                            color: "#16a34a",
                            borderRadius: "50%",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "2rem",
                            marginBottom: "16px"
                        }}>
                            <i className="fa-solid fa-check"></i>
                        </div>

                        <h2 style={{ fontSize: "1.6rem", fontWeight: "800", color: "var(--text-main)", marginBottom: "8px" }}>
                            Signalement enregistré avec succès !
                        </h2>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", maxWidth: "520px", margin: "0 auto 24px auto" }}>
                            Votre signalement a été chiffré et transmis aux gestionnaires habilités de notre plateforme.
                        </p>

                        {/* Secret Tracking Code Box */}
                        <div style={{
                            background: "var(--primary-light)",
                            border: "2px dashed var(--primary)",
                            borderRadius: "var(--radius-lg)",
                            padding: "24px 20px",
                            maxWidth: "460px",
                            margin: "0 auto 24px auto"
                        }}>
                            <span style={{ fontSize: "0.82rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--primary)", display: "block" }}>
                                Votre code unique de suivi
                            </span>
                            <div style={{
                                fontSize: "2.2rem",
                                fontWeight: "800",
                                fontFamily: "monospace",
                                letterSpacing: "0.1em",
                                color: "var(--primary)",
                                margin: "10px 0"
                            }}>
                                {createdSignalement?.code_unique}
                            </div>
                            <p style={{ fontSize: "0.8rem", color: "var(--status-analysis-text)", margin: 0 }}>
                                <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: "4px" }}></i>
                                <strong>Conservez précieusement ce code :</strong> il est indispensable pour suivre le dossier de façon anonyme.
                            </p>
                        </div>

                        {/* Action buttons */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px", margin: "0 auto" }}>
                            <Button
                                label={copied ? "Code copié dans le presse-papier !" : "Copier le code de suivi"}
                                variant="primary"
                                size="md"
                                icone={copied ? "check" : "copy"}
                                onClick={handleCopyCode}
                            />
                            <Button
                                label="Suivre ce dossier immédiatement"
                                variant="secondary"
                                size="md"
                                icone="route"
                                onClick={() => navigate("/suiviedossier")}
                            />
                            <Button
                                label="Imprimer le récépissé"
                                variant="outline"
                                size="sm"
                                icone="print"
                                onClick={() => window.print()}
                            />
                            <button
                                onClick={() => {
                                    setStep(1);
                                    setSignalement({
                                        categorieid: "",
                                        description: "",
                                        date: new Date().toISOString().split("T")[0],
                                        lieu: "",
                                        annexes: [],
                                        genre: "N",
                                        trancheage: 2,
                                        contact: "",
                                        iscontact: false
                                    });
                                }}
                                style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "0.85rem", marginTop: "10px" }}
                            >
                                Déposer un autre signalement
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}