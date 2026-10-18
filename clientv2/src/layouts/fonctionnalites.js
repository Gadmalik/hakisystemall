import { useNavigate } from "react-router-dom";
import { Header } from "../components/maincomp";
import { Button, FormGroup, Input, Loader, EmptyState } from "../components/minicomp";
import { useState, useEffect, useMemo } from "react";

export function Fonctionnalites({}) {
    const link = process.env.REACT_APP_LINK;
    const [fonctionnalites, setFonctionnalites] = useState([]);
    const [loaderVisible, setLoaderVisible] = useState(false);
    const [actionLoader, setActionLoader] = useState(false);
    const [activefonctionnalite, setActiveFonctionnalite] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [fonctionnalite, setFonctionnalite] = useState({
        designation: "",
        description: "",
        route: "",
        icone: "",
        parentid: "",
    });
    const [errors, setErrors] = useState({});

    const loadFonctionnalites = async () => {
        setLoaderVisible(true);
        try {
            const res = await fetch(`${link}/fonctionnalites`);
            const data = await res.json();
            if (data.status === "success" && Array.isArray(data.data)) {
                setFonctionnalites(data.data);
            }
        } catch (err) {
            console.log(err);
        }
        setLoaderVisible(false);
    };

    const submitFonctionnalite = async (event) => {
        event.preventDefault();
        const newErrors = {};
        if (!fonctionnalite.designation?.trim()) newErrors.designation = "La désignation est requise";
        if (!fonctionnalite.description?.trim()) newErrors.description = "La description est requise";
        if (!fonctionnalite.route?.trim()) newErrors.route = "La route est requise (ex: signalement)";
        if (!fonctionnalite.icone?.trim()) newErrors.icone = "L'icône FontAwesome est requise (ex: bullhorn)";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        setActionLoader(true);
        try {
            const methode = activefonctionnalite ? "put" : "post";
            const url = `${link}/fonctionnalite`;
            const res = await fetch(url, {
                method: methode,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(fonctionnalite)
            });
            const data = await res.json();
            if (data.status === "success" || data.success) {
                setSuccessMsg(`Fonctionnalité ${activefonctionnalite ? "modifiée" : "ajoutée"} avec succès !`);
                loadFonctionnalites();
                setFonctionnalite({
                    designation: "",
                    description: "",
                    route: "",
                    icone: "",
                    parentid: "",
                });
                setActiveFonctionnalite(null);
                setTimeout(() => setSuccessMsg(""), 5000);
            }
        } catch (error) {
            console.log(error);
        }
        setActionLoader(false);
    };

    const startEdit = (fonct) => {
        setActiveFonctionnalite(fonct);
        setFonctionnalite({
            fonctionnaliteid: fonct.fonctionnaliteid,
            designation: fonct.designation || "",
            description: fonct.description || "",
            route: fonct.route || "",
            icone: fonct.icone || "",
            parentid: fonct.parentid || "",
        });
    };

    const resetForm = () => {
        setActiveFonctionnalite(null);
        setFonctionnalite({
            designation: "",
            description: "",
            route: "",
            icone: "",
            parentid: "",
        });
        setErrors({});
    };

    useEffect(() => {
        loadFonctionnalites();
    }, []);

    const filteredFonctionnalites = useMemo(() => {
        if (!searchTerm.trim()) return fonctionnalites;
        const term = searchTerm.toLowerCase();
        return fonctionnalites.filter(f =>
            (f.designation || "").toLowerCase().includes(term) ||
            (f.route || "").toLowerCase().includes(term) ||
            (f.description || "").toLowerCase().includes(term)
        );
    }, [fonctionnalites, searchTerm]);

    return (
        <div className="pagestructure">
            <Header title={"Fonctionnalités & Modules"} retour={true} />
            {loaderVisible && <Loader />}

            <div style={{ padding: "15px 20px" }}>
                {successMsg && (
                    <div style={{ background: "#dcfce7", color: "#166534", padding: "12px 16px", borderRadius: "8px", border: "1px solid #bbf7d0", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <i className="fa-solid fa-circle-check"></i>
                        {successMsg}
                    </div>
                )}

                <div className="flex-between" style={{ flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "0.9rem", color: "var(--text-muted)", fontWeight: 600 }}>
                            {fonctionnalites.length} fonctionnalités configurées
                        </span>
                    </div>

                    <div style={{ width: "260px" }}>
                        <input
                            type="search"
                            className="form-control"
                            placeholder="Rechercher une fonctionnalité..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ padding: "8px 14px", fontSize: "0.85rem" }}
                        />
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "20px", alignItems: "start" }}>
                    {/* Tableau */}
                    <div className="table-responsive-wrapper" style={{ margin: 0, background: "white", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
                        {filteredFonctionnalites.length > 0 ? (
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: "50px" }}>Icône</th>
                                        <th>Désignation</th>
                                        <th>Route URL</th>
                                        <th>Description</th>
                                        <th style={{ textAlign: "right" }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredFonctionnalites.map((f) => (
                                        <tr key={f.fonctionnaliteid}>
                                            <td>
                                                <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)" }}>
                                                    <i className={`fa-solid fa-${f.icone || "circle"}`}></i>
                                                </div>
                                            </td>
                                            <td>
                                                <strong style={{ color: "var(--text-main)" }}>{f.designation}</strong>
                                            </td>
                                            <td>
                                                <code style={{ background: "#f8fafc", padding: "2px 6px", borderRadius: "4px", fontSize: "0.8rem", color: "var(--primary)" }}>
                                                    {f.route}
                                                </code>
                                            </td>
                                            <td style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>
                                                {f.description}
                                            </td>
                                            <td style={{ textAlign: "right" }}>
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary btn-sm"
                                                    onClick={() => startEdit(f)}
                                                    style={{ padding: "4px 8px", fontSize: "0.75rem" }}
                                                >
                                                    <i className="fa-solid fa-pen-to-square"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <EmptyState
                                icone="sliders"
                                title="Aucune fonctionnalité trouvée"
                                message="Aucune fonctionnalité ne correspond à votre recherche."
                            />
                        )}
                    </div>

                    {/* Formulaire */}
                    <form className="card" onSubmit={submitFonctionnalite} style={{ margin: 0 }}>
                        <div className="flex-between" style={{ marginBottom: "14px", borderBottom: "1px solid var(--border-color)", paddingBottom: "10px" }}>
                            <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, color: "var(--text-main)" }}>
                                <i className={`fa-solid fa-${activefonctionnalite ? "pen-to-square" : "plus"}`} style={{ color: "var(--primary)", marginRight: "8px" }}></i>
                                {activefonctionnalite ? "Modifier le module" : "Ajouter un module"}
                            </h3>
                            {activefonctionnalite && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "0.8rem", cursor: "pointer" }}
                                >
                                    Annuler
                                </button>
                            )}
                        </div>

                        <div className="flex-column" style={{ gap: "12px" }}>
                            <FormGroup label={"Désignation"} icone="tag" error={errors.designation}>
                                <Input
                                    type={"text"}
                                    value={fonctionnalite.designation}
                                    onChange={(value) => setFonctionnalite({ ...fonctionnalite, designation: value })}
                                    placeholder={"Ex: Signalements"}
                                />
                            </FormGroup>

                            <FormGroup label={"Route URL"} icone="link" error={errors.route}>
                                <Input
                                    type={"text"}
                                    value={fonctionnalite.route}
                                    onChange={(value) => setFonctionnalite({ ...fonctionnalite, route: value })}
                                    placeholder={"Ex: signalement"}
                                />
                            </FormGroup>

                            <FormGroup label={"Icône FontAwesome"} icone="icons" error={errors.icone}>
                                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                    <Input
                                        type={"text"}
                                        value={fonctionnalite.icone}
                                        onChange={(value) => setFonctionnalite({ ...fonctionnalite, icone: value })}
                                        placeholder={"Ex: bullhorn"}
                                    />
                                    {fonctionnalite.icone && (
                                        <div style={{ width: "36px", height: "36px", borderRadius: "6px", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                            <i className={`fa-solid fa-${fonctionnalite.icone}`}></i>
                                        </div>
                                    )}
                                </div>
                            </FormGroup>

                            <FormGroup label={"Description"} icone="pen" error={errors.description}>
                                <Input
                                    type={"text"}
                                    value={fonctionnalite.description}
                                    onChange={(value) => setFonctionnalite({ ...fonctionnalite, description: value })}
                                    placeholder={"Description courte du module"}
                                />
                            </FormGroup>

                            <Button
                                label={activefonctionnalite ? "Enregistrer les modifications" : "Ajouter la fonctionnalité"}
                                icone="floppy-disk"
                                loader={actionLoader}
                                type={"submit"}
                                size={"block"}
                                variant={"primary"}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}