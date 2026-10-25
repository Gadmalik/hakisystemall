import { useNavigate } from "react-router-dom";
import { Header } from "../components/maincomp";
import { Button, Badge, FilterBar, EmptyState, Loader, exportToCSV } from "../components/minicomp";
import { useState, useEffect, useMemo } from "react";

export function CasOrientes() {
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
            const res = await fetch(`${link}/getincidentorientebyuserid/${user.userid}`);
            const data = await res.json();
            if (data.data) {
                setIncidents(data.data);
            }
        } catch (err) {
            console.error("Error loading oriented cases:", err);
        }
        setLoader(false);
    };

    useEffect(() => {
        loadIncidents();
    }, [user?.userid]);

    const filteredIncidents = useMemo(() => {
        return incidents.filter((item) => {
            if (searchTerm.trim()) {
                const q = searchTerm.toLowerCase();
                const matchCode = (item.code_unique || "").toLowerCase().includes(q);
                const matchCat = (item.categorie || "").toLowerCase().includes(q);
                const matchOrg = (item.organisation || "").toLowerCase().includes(q);
                const matchDesc = (item.description || "").toLowerCase().includes(q);
                if (!matchCode && !matchCat && !matchOrg && !matchDesc) return false;
            }

            const st = (item.statusatt || "").toLowerCase();
            if (activeTab === "attente") {
                if (st !== "en attente" && st !== "nouveau") return false;
            } else if (activeTab === "accepte") {
                if (st !== "accepté" && st !== "en cours") return false;
            } else if (activeTab === "resolu") {
                if (st !== "résolu" && st !== "resolu") return false;
            }

            if (selectedNiveau) {
                if ((item.niveau || "").toLowerCase() !== selectedNiveau.toLowerCase()) return false;
            }

            return true;
        });
    }, [incidents, searchTerm, activeTab, selectedNiveau]);

    const counts = useMemo(() => {
        let attente = 0;
        let accepte = 0;
        let resolu = 0;
        incidents.forEach((item) => {
            const st = (item.statusatt || "").toLowerCase();
            if (st === "en attente" || st === "nouveau") attente++;
            if (st === "accepté" || st === "en cours") accepte++;
            if (st === "résolu" || st === "resolu") resolu++;
        });
        return { all: incidents.length, attente, accepte, resolu };
    }, [incidents]);

    const tabs = [
        { id: "all", label: "Tous les cas orientés", count: counts.all, icon: "share-nodes" },
        { id: "attente", label: "En attente chez le partenaire", count: counts.attente, icon: "clock" },
        { id: "accepte", label: "Acceptés par le partenaire", count: counts.accepte, icon: "handshake" },
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
            Structure_Destinataire: s.organisation || "",
            Priorité: s.niveau || "Moyen",
            Statut: s.statusatt || "En attente"
        }));
        exportToCSV(exportData, `cas_orientes_${new Date().toISOString().split("T")[0]}.csv`);
    };

    return (
        <div className="pagestructure">
            <Header
                title="Cas Orientés vers des Structures"
                retour={true}
                searchValue={searchTerm}
                onSearch={setSearchTerm}
                searchPlaceholder="Rechercher un cas orienté..."
            />

            {loader && <Loader text="Chargement des cas orientés..." />}

            <div style={{ padding: "0 0 16px 0" }}>
                <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", margin: 0 }}>
                    Suivez l'évolution des signalements que vous avez transférés vers d'autres partenaires ou services compétents.
                </p>
            </div>

            <FilterBar
                searchValue={searchTerm}
                onSearchChange={setSearchTerm}
                searchPlaceholder="Rechercher par code, catégorie, organisation destinataire..."
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
                                    <th>Date d'orientation</th>
                                    <th>Transféré à</th>
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
                                            <strong style={{ color: "var(--text-main)" }}>
                                                {incident.organisation ? incident.organisation.toUpperCase() : "Organisation partenaire"}
                                            </strong>
                                        </td>
                                        <td>
                                            <Badge label={incident.niveau || "Moyen"} type={incident.niveau} />
                                        </td>
                                        <td>
                                            <Badge label={incident.statusatt || "En attente"} type={incident.statusatt} />
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => navigate(`/home/signalement/${incident.id_incident}`)}
                                                className="btn btn-outline btn-sm"
                                                style={{ padding: "4px 12px", fontSize: "0.82rem" }}
                                            >
                                                Détails →
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
                                    <span>Transféré à : <strong>{incident.organisation || "Partenaire"}</strong></span>
                                    <Badge label={incident.statusatt || "En attente"} type={incident.statusatt} />
                                </div>
                            </div>
                        ))}
                    </div>
                )
            ) : (
                <EmptyState
                    icon="share-nodes"
                    title="Aucun cas orienté vers des structures"
                    description="Lorsque vous orientez des signalements vers d'autres organismes, ils s'affichent ici."
                    actionLabel="Voir les signalements"
                    onAction={() => navigate("/home/signalement")}
                />
            )}
        </div>
    );
}