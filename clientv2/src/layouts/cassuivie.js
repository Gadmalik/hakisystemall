import { useNavigate } from "react-router-dom";
import { Header } from "../components/maincomp";
import { Button, Badge, FilterBar, EmptyState, Loader, exportToCSV } from "../components/minicomp";
import { useState, useEffect, useMemo } from "react";

export function CasSuivie() {
    const link = process.env.REACT_APP_LINK || "http://localhost:5001";
    const navigate = useNavigate();
    const [user] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("userinfo")) || {};
        } catch {
            return {};
        }
    });

    const [incidents, setIncidents] = useState([]);
    const [loader, setLoader] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("all");
    const [selectedNiveau, setSelectedNiveau] = useState("");
    const [viewMode, setViewMode] = useState("table");

    const loadIncidents = async () => {
        if (!user?.userid) return;
        setLoader(true);
        try {
            const res = await fetch(`${link}/getincidentsuiviebyuserid/${user.userid}`);
            const data = await res.json();
            if (data.data) {
                setIncidents(data.data);
            }
        } catch (err) {
            console.error("Error loading incidents:", err);
        }
        setLoader(false);
    };

    useEffect(() => {
        loadIncidents();
    }, [user?.userid]);

    // Filtering logic
    const filteredIncidents = useMemo(() => {
        return incidents.filter((item) => {
            if (searchTerm.trim()) {
                const q = searchTerm.toLowerCase();
                const matchCode = (item.code_unique || "").toLowerCase().includes(q);
                const matchCat = (item.categorie || "").toLowerCase().includes(q);
                const matchLieu = (item.lieu || "").toLowerCase().includes(q);
                const matchDesc = (item.description || "").toLowerCase().includes(q);
                if (!matchCode && !matchCat && !matchLieu && !matchDesc) return false;
            }

            const st = (item.statusatt || "").toLowerCase();
            if (activeTab === "encours") {
                if (st !== "en cours" && st !== "en attente" && st !== "accepté") return false;
            } else if (activeTab === "resolu") {
                if (st !== "résolu" && st !== "resolu" && st !== "cloturé") return false;
            }

            if (selectedNiveau) {
                if ((item.niveau || "").toLowerCase() !== selectedNiveau.toLowerCase()) return false;
            }

            return true;
        });
    }, [incidents, searchTerm, activeTab, selectedNiveau]);

    // Counts
    const counts = useMemo(() => {
        let encours = 0;
        let resolu = 0;
        incidents.forEach((item) => {
            const st = (item.statusatt || "").toLowerCase();
            if (st === "en cours" || st === "en attente" || st === "accepté") encours++;
            if (st === "résolu" || st === "resolu" || st === "cloturé") resolu++;
        });
        return { all: incidents.length, encours, resolu };
    }, [incidents]);

    const tabs = [
        { id: "all", label: "Tous mes cas pris en charge", count: counts.all, icon: "layer-group" },
        { id: "encours", label: "En cours d'analyse", count: counts.encours, icon: "clock" },
        { id: "resolu", label: "Résolus", count: counts.resolu, icon: "circle-check" }
    ];

    const resetFilters = () => {
        setSearchTerm("");
        setActiveTab("all");
        setSelectedNiveau("");
    };

    const handleExport = () => {
        const exportData = filteredIncidents.map((s) => ({
            Code: s.code_unique,
            Catégorie: s.categorie,
            Date: s.date ? s.date.split("T")[0] : "",
            Priorité: s.niveau || "Moyen",
            Statut: s.statusatt || "En cours",
            Organisation: s.organisation || ""
        }));
        exportToCSV(exportData, `cas_a_traiter_${new Date().toISOString().split("T")[0]}.csv`);
    };

    return (
        <div className="pagestructure">
            <Header
                title="Cas à Traiter (Pris en charge)"
                retour={true}
                searchValue={searchTerm}
                onSearch={setSearchTerm}
                searchPlaceholder="Rechercher dans mes cas..."
            />

            {loader && <Loader text="Chargement de vos dossiers..." />}

            <div style={{ padding: "0 0 16px 0" }}>
                <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", margin: 0 }}>
                    Consultez et suivez tous les signalements que vous avez personnellement pris en charge pour traitement.
                </p>
            </div>

            <FilterBar
                searchValue={searchTerm}
                onSearchChange={setSearchTerm}
                searchPlaceholder="Rechercher un cas par code, description..."
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                selectedNiveau={selectedNiveau}
                onNiveauChange={setSelectedNiveau}
                onExport={handleExport}
                onReset={resetFilters}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
            />

            {filteredIncidents.length > 0 ? (
                viewMode === "table" ? (
                    <div className="table-responsive-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Code Unique</th>
                                    <th>Catégorie</th>
                                    <th>Date d'affectation</th>
                                    <th>Niveau</th>
                                    <th>Statut</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredIncidents.map((incident) => (
                                    <tr key={incident.id_incident}>
                                        <td>
                                            <strong style={{ color: "var(--primary)", fontFamily: "monospace" }}>
                                                {incident.code_unique}
                                            </strong>
                                        </td>
                                        <td><strong>{incident.categorie}</strong></td>
                                        <td>{incident.date ? incident.date.split("T")[0] : "-"}</td>
                                        <td>
                                            <Badge label={incident.niveau || "Moyen"} type={incident.niveau} />
                                        </td>
                                        <td>
                                            <Badge label={incident.statusatt || "En cours"} type={incident.statusatt} />
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => navigate(`/home/signalement/${incident.id_incident}`)}
                                                className="btn btn-outline btn-sm"
                                                style={{ padding: "4px 12px", fontSize: "0.82rem" }}
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
                    <div className="incident-cards-grid">
                        {filteredIncidents.map((incident) => (
                            <div
                                key={incident.id_incident}
                                className="incident-card"
                                onClick={() => navigate(`/home/signalement/${incident.id_incident}`)}
                            >
                                <div className="incident-card-header">
                                    <span className="incident-card-code">{incident.code_unique}</span>
                                    <Badge label={incident.niveau || "Moyen"} type={incident.niveau} />
                                </div>
                                <h4 style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "6px" }}>
                                    {incident.categorie}
                                </h4>
                                <p className="incident-card-desc">{incident.description}</p>
                                <div className="incident-card-footer">
                                    <span>{incident.date ? incident.date.split("T")[0] : ""}</span>
                                    <Badge label={incident.statusatt || "En cours"} type={incident.statusatt} />
                                </div>
                            </div>
                        ))}
                    </div>
                )
            ) : (
                <EmptyState
                    icon="clock"
                    title="Aucun dossier pris en charge pour l'instant"
                    description="Vous pouvez parcourir la liste des signalements pour accepter de nouveaux cas à traiter."
                    actionLabel="Voir les signalements"
                    onAction={() => navigate("/home/signalement")}
                />
            )}
        </div>
    );
}