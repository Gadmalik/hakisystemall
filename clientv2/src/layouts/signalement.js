import { useNavigate } from "react-router-dom";
import { Header } from "../components/maincomp";
import { Button } from "../components/minicomp";
import { useState } from "react";
import { useEffect } from "react";

export function Signalement({}){
    const navigate = useNavigate();
    const [visibleLoader, setVisibleLoader] = useState(false);
    const [signalements, setSignalements] = useState([]);
    const [filteredSignalements, setFilteredSignalements] = useState([]);
    const [activeTab, setActiveTab] = useState("encours");
    const link = process.env.REACT_APP_LINK;
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

    const loadSignalements = async () => {
        setVisibleLoader(true);
        try{
            await fetch(`${link}/getincident`).then((response) => response.json()).then((data) => {
                console.log(data.data);
                setSignalements(data.data);
                setFilteredSignalements(data.data);
            });
        }catch(error){
            console.log(error);
        }
        setVisibleLoader(false);
    }
    const searchSignalements = (text) => {
        if(activeTab == "encours"){
            const filter = signalements.filter((signalement) =>
                `${signalement.id_incident}
                ${signalement.type_incident}
                ${signalement.lieu}
                ${signalement.description}`.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredSignalements(filter);
        }
    }

    useEffect(() => {
        loadSignalements();
    }, []);
    return(
        <div className="pagestructure">
            <Header title={"Signalements"} retour={true} />
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
                            <th>Priorité</th>
                            <th>Statut</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSignalements.map((signalement) => (
                            <tr>
                            <td><strong>{signalement.code_unique}</strong></td>
                            <td>{signalement.designation}</td>
                            <td>{new Date(signalement.date_incident).toLocaleDateString()}</td>
                            <td><span class={`badge badge-${signalement.niveau == "critique" || signalement.niveau == "elevé" ? "high" : "medium"}`}>{signalement.niveau}</span></td>
                            <td><span class={`badge badge-${signalement.statusinc == "en cours" ? "analysis" : signalement.statusinc == "nouveau" ? "new" : "resolved"}`}>{signalement.statusinc}</span></td>
                            <td><a onClick={() => navigate(`${signalement.id_incident}`)} class="link-action">Ouvrir →</a></td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}