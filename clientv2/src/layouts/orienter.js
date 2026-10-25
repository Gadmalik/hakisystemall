import { Header } from "../components/maincomp";
import { Alert, Button, CardRadio, Loader, TextArea } from "../components/minicomp";
import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

export function Orienter() {
    const navigate = useNavigate();
    const link = process.env.REACT_APP_LINK || "http://localhost:5001";
    const { signalementid } = useParams();

    const [user] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("userinfo")) || {};
        } catch {
            return {};
        }
    });

    const [signalement, setSignalement] = useState(null);
    const [organisations, setOrganisations] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loader, setLoader] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const [orientation, setOrientation] = useState({
        organisationid: "",
        commentaire: ""
    });

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 5000);
    };

    const loadSignalement = async () => {
        try {
            const response = await fetch(`${link}/signalement/${signalementid}`);
            const data = await response.json();
            if (data.data) {
                setSignalement(data.data);
            }
        } catch (error) {
            console.error("Error loading signalement:", error);
        }
    };

    const loadOrganisations = async () => {
        setLoader(true);
        try {
            const response = await fetch(`${link}/organisations`);
            const data = await response.json();
            if (data.status === "success" || data.success) {
                setOrganisations(data.data || []);
            }
        } catch (error) {
            console.error("Error loading organisations:", error);
        }
        setLoader(false);
    };

    useEffect(() => {
        if (signalementid) loadSignalement();
        loadOrganisations();
    }, [signalementid]);

    const filteredOrganisations = useMemo(() => {
        if (!searchQuery.trim()) return organisations;
        const q = searchQuery.toLowerCase();
        return organisations.filter((org) =>
            `${org.designation || ""} ${org.sigle || ""} ${org.libelle || ""} ${org.ville || ""} ${org.province || ""}`.toLowerCase().includes(q)
        );
    }, [organisations, searchQuery]);

    const selectedOrg = useMemo(() => {
        return organisations.find((org) => String(org.organisationid) === String(orientation.organisationid));
    }, [organisations, orientation.organisationid]);

    const orienterDossier = async (event) => {
        event.preventDefault();
        if (!orientation.organisationid) {
            showToast("Veuillez sélectionner une organisation partenaire", "error");
            return;
        }
        if (!orientation.commentaire.trim()) {
            showToast("Veuillez ajouter une note explicative pour l'orientation", "error");
            return;
        }

        setActionLoading(true);
        try {
            const res = await fetch(`${link}/suivredossier`, {
                headers: { "Content-Type": "application/json" },
                method: "POST",
                body: JSON.stringify({
                    userid: user.userid,
                    dossierid: signalement?.id_incident || signalementid,
                    organisationid: orientation.organisationid,
                    commentaire: orientation.commentaire,
                    type: "orientation",
                    status: "en attente"
                })
            });
            const data = await res.json();
            if (data.status === "success" || data.success) {
                showToast("Dossier orienté avec succès !");
                setTimeout(() => {
                    navigate(`/home/signalement/${signalement?.id_incident || signalementid}`);
                }, 1000);
            } else {
                showToast(data.message || "Erreur lors de l'orientation", "error");
            }
        } catch (error) {
            console.error(error);
            showToast("Erreur de connexion au serveur", "error");
        }
        setActionLoading(false);
    };

    return (
        <div className="pagestructure">
            <Header title="Orientation d'un Dossier" retour={true} />

            {loader && <Loader text="Chargement des structures d'accueil..." />}

            {toast && (
                <div className="toast-container">
                    <div className={`toast-item ${toast.type}`}>
                        <i className={`fa-solid ${toast.type === "success" ? "fa-circle-check" : "fa-triangle-exclamation"}`}></i>
                        <span>{toast.message}</span>
                    </div>
                </div>
            )}

            <div style={{
                background: "white",
                padding: "20px 24px",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border-color)",
                marginBottom: "20px",
                boxShadow: "var(--shadow-sm)"
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                    <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "700" }}>
                        Transfert de dossier
                    </span>
                </div>
                <h2 style={{ fontSize: "1.4rem", fontWeight: "800", color: "var(--text-main)", margin: "0 0 6px 0" }}>
                    Orienter vers une structure partenaire
                </h2>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: 0 }}>
                    Dossier concerné : <strong style={{ color: "var(--primary)", fontFamily: "monospace" }}>{signalement?.code_unique || signalementid}</strong>
                    {signalement?.categorie && ` (${signalement.categorie})`}
                </p>
            </div>

            <form onSubmit={orienterDossier} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
                {/* Structure Selection & Comments */}
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {/* Step 1: Choose structure */}
                    <div className="card" style={{ maxWidth: "100%" }}>
                        <h3 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{
                                width: "26px",
                                height: "26px",
                                background: "var(--primary)",
                                color: "white",
                                borderRadius: "50%",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "0.8rem",
                                fontWeight: "800"
                            }}>1</span>
                            Choisir la structure réceptrice
                        </h3>

                        {/* Search input for organisations */}
                        <div style={{ position: "relative", marginBottom: "16px" }}>
                            <i className="fa-solid fa-magnifying-glass" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}></i>
                            <input
                                type="search"
                                className="form-control"
                                placeholder="Rechercher par nom, ville, type de structure..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ paddingLeft: "38px" }}
                            />
                        </div>

                        {/* Organisations radio list */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "380px", overflowY: "auto", paddingRight: "4px" }}>
                            {filteredOrganisations.length > 0 ? (
                                filteredOrganisations.map((org) => {
                                    const isChecked = String(org.organisationid) === String(orientation.organisationid);
                                    const subtitle = `${org.libelle || "Structure"} • ${org.ville || org.province || "RDC"}`;
                                    return (
                                        <CardRadio
                                            key={org.organisationid}
                                            title={org.designation}
                                            description={subtitle}
                                            value={isChecked}
                                            onChange={() => setOrientation({ ...orientation, organisationid: org.organisationid })}
                                            icone="building"
                                        />
                                    );
                                })
                            ) : (
                                <Alert message="Aucune organisation trouvée correspondant à votre recherche." type="info" icone="circle-info" />
                            )}
                        </div>
                    </div>

                    {/* Step 2: Comment */}
                    <div className="card" style={{ maxWidth: "100%" }}>
                        <h3 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{
                                width: "26px",
                                height: "26px",
                                background: "var(--primary)",
                                color: "white",
                                borderRadius: "50%",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "0.8rem",
                                fontWeight: "800"
                            }}>2</span>
                            Motif et notes d'orientation
                        </h3>
                        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "12px" }}>
                            Expliquez pourquoi ce dossier relève de la compétence de l'organisme sélectionné (ex : assistance juridique, soutien psychologique, enquête de police...).
                        </p>
                        <TextArea
                            placeholder="Précisez les raisons du transfert et les mesures urgentes recommandées..."
                            value={orientation.commentaire}
                            onChange={(val) => setOrientation({ ...orientation, commentaire: val })}
                            required={true}
                            rows={4}
                        />
                    </div>
                </div>

                {/* Recap and Submit Column */}
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <div className="card" style={{ maxWidth: "100%", position: "sticky", top: "90px" }}>
                        <h3 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                            <i className="fa-solid fa-clipboard-check" style={{ color: "var(--primary)" }}></i>
                            Récapitulatif de l'orientation
                        </h3>

                        <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.9rem", marginBottom: "20px" }}>
                            <div className="flex-between" style={{ paddingBottom: "8px", borderBottom: "1px solid #f3f4f6" }}>
                                <span className="text-muted">Numéro du cas :</span>
                                <strong style={{ color: "var(--primary)", fontFamily: "monospace" }}>
                                    {signalement?.code_unique || signalementid}
                                </strong>
                            </div>
                            <div className="flex-between" style={{ paddingBottom: "8px", borderBottom: "1px solid #f3f4f6" }}>
                                <span className="text-muted">Catégorie :</span>
                                <strong>{signalement?.categorie || "Non spécifié"}</strong>
                            </div>
                            <div className="flex-between" style={{ paddingBottom: "8px", borderBottom: "1px solid #f3f4f6" }}>
                                <span className="text-muted">Organisme récepteur :</span>
                                <strong style={{ color: selectedOrg ? "var(--primary)" : "tomato" }}>
                                    {selectedOrg ? selectedOrg.designation : "Aucun sélectionné"}
                                </strong>
                            </div>
                            {selectedOrg && (
                                <div style={{ background: "#f9fafb", padding: "12px", borderRadius: "var(--radius-md)", fontSize: "0.82rem" }}>
                                    <div><strong>Type :</strong> {selectedOrg.libelle || "Partenaire"}</div>
                                    <div><strong>Localisation :</strong> {selectedOrg.ville || selectedOrg.province || "Non renseigné"}</div>
                                    {selectedOrg.email_org && <div><strong>Email :</strong> {selectedOrg.email_org}</div>}
                                </div>
                            )}
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            <Button
                                label="Confirmer et envoyer l'orientation"
                                variant="primary"
                                type="submit"
                                size="md"
                                icone="paper-plane"
                                loader={actionLoading}
                                disabled={!orientation.organisationid || !orientation.commentaire.trim()}
                            />
                            <Button
                                label="Annuler"
                                variant="outline"
                                type="button"
                                size="md"
                                onClick={() => window.history.back()}
                            />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}