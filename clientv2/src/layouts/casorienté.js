import { useNavigate } from "react-router-dom";
import { Header } from "../components/maincomp";
import { Button } from "../components/minicomp";
import { useState, useEffect } from "react";

export function CasOrientes({}){
    const link = process.env.REACT_APP_LINK;
    const navigate = useNavigate();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
    const [incidents, setIncidents] = useState([]);

    const loadIncidents = async () => {
        await fetch(`${link}/getincidentorientebyuserid/${user.userid}`).then((result) => result.json()).then((data) => {
            setIncidents(data.data);
        });
    }

    useEffect(() => {
        loadIncidents();
    }, []);

    return(
        <div className="pagestructure">
            <Header title={"Orientations"} retour={true} />

            <div style={{padding: "10px", marginBottom: "10px"}}>
                <p>Gérer les cas qui vous ont été orientés depuis d'autres structures.</p>
            </div>
            <div className="flex-between" style={{margin: "10px"}}>
                <div class="chip-group">
                    <button class="chip">Tous</button>
                    <button class="chip">Nouveaux</button>
                    <button class="chip active">En analyse</button>
                    <button class="chip">Cloturés</button>
                    <button class="chip">Orientés</button>
                </div>
                <Button label={"Exporter"} type={"secondary"} size="sm" onClick={() => {}} />
            </div>
            <div class="table-responsive-wrapper">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Type</th>
                            <th>Date</th>
                            <th>Orienté vers</th>
                            <th>Niveau</th>
                            <th>Statut</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {incidents.map((incident) => (
                            <tr>
                                <td><strong>{incident.code_unique}</strong></td>
                                <td>{incident.categorie}</td>
                                <td>{incident.date.split("T")[0]}</td>
                                <td>{incident.organisation.toUpperCase()}</td>
                                <td><span class={`badge badge-${incident.niveau == "critique" || incident.niveau == "elevé" ? "high" : "medium"}`}>{incident.niveau}</span></td>
                                <td><span class={`badge badge-${incident.statusatt == "en attente" ? "new" : incident.statusatt == "refusé" ? "analysis" : "resolved"}`}>{incident.statusatt}</span></td>
                                <td><a onClick={() => navigate(`/home/signalement/${incident.id_incident}`)} class="link-action">Ouvrir →</a></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}