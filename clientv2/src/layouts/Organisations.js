import { useNavigate } from "react-router-dom";
import { Header } from "../components/maincomp";
import { Button, FormGroup, Input, Loader, Select } from "../components/minicomp";
import { useState } from "react";
import { useEffect } from "react";

export function Organisations({}){
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("userinfo")));
    const [visibleModal, setVisibleModal] = useState(false);
    const [organisations, setOrganisations] = useState([]);
    const [filteredOrganisations, setFilteredOrganisations] = useState([]);
    const [selectedOrganisations, setSelectedOrganisations] = useState([]);
    const [loaderVisible, setLoaderVisible] = useState(false);
    const [error, setError] = useState("");
    const link = process.env.REACT_APP_LINK;
    const hideModal = () => setVisibleModal(false);
    const navigate = useNavigate();

    const loadOrganisation = async () => {
        setLoaderVisible(true);
        try {
            await fetch(`${link}/organisations`).then((response) => response.json()).then((data) => {
                if(data.success){
                    setOrganisations(data.data);
                    setLoaderVisible(false);
                }
            });
        } catch (error) {
            console.log(error);
        }
    }
    const handleCheckboxChange = (e, organisationid) => {
        console.log(organisationid)
        if (e.target.checked) {
            setSelectedOrganisations([...selectedOrganisations, organisationid]);
        } else {
            setSelectedOrganisations(selectedOrganisations.filter((id) => id !== organisationid));
        }
    }
    const searchUser = (e) => {
        const search = e.target.value;
        setFilteredOrganisations(organisations.filter((organisation) => `${organisation.designation}`.toLowerCase().includes(search.toLowerCase()) ));
    }

    const executeAction = async (action) => {
        setLoaderVisible(true);
        fetch(`${link}/organisation/${action}`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                organisations: selectedOrganisations,
            })
        }).then((response) => response.json()).then((data) => {
            if(data.success){
                alert(data.message);
                setSelectedOrganisations([]);
                setLoaderVisible(false);
                loadOrganisation();
            }else{
                setLoaderVisible(false);
                alert(data.message);
            }
        }).catch((error) => {
            console.log(error);
            setLoaderVisible(false);
        });
    }
    useEffect(() => {
        loadOrganisation();
    }, [])
    useEffect(() => {
        setFilteredOrganisations(organisations);
    },[organisations])
    // useEffect(() => {
    //     if(user?.etat !== "actif"){
    //         navigate("/login");
    //     }else{

    //     }
    // },[user]);

    return(
        <div className="pagestructure">
            <Header title={"Organisations"} retour={true} />
            {loaderVisible && <Loader />}
            <div className="flex-between" style={{margin: "10px"}}>
                {/* <div class="chip-group">
                    <button class="chip">Tous</button>
                    <button class="chip">Nouveaux</button>
                    <button class="chip active">En analyse</button>
                    <button class="chip">Cloturés</button>
                    <button class="chip">Orientés</button>
                </div> */}
                {/* <Button label={"Exporter"} variant={"secondary"} size="sm" onClick={() => {}} /> */}

                {selectedOrganisations.length > 0 && <div className="floating-actions">
                    <button className="btn btn-success" onClick={() => executeAction('actif')}><i className="fas fa-check"></i></button>
                    <button className="btn btn-warning" onClick={() => executeAction('en attente')}><i className="fas fa-times"></i></button>
                    <button className="btn btn-danger" onClick={() => executeAction('désactivé')}><i className="fas fa-trash"></i></button>
                </div>}
            </div>
            <div class="flex-row">
                <div class="table-responsive-wrapper flex-1">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Designation</th>
                                <th>Type Organisation</th>
                                <th>Adresse</th>
                                <th>Utilisateur</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                filteredOrganisations.map((organisation) => (
                                    <tr key={organisation.id}>
                                        <td align="center">
                                            <input type="checkbox" value={organisation.organisationid} checked={selectedOrganisations.includes(organisation.organisationid)} onChange={(e) => handleCheckboxChange(e, organisation.organisationid)} />
                                        </td>
                                        <td><b>{`${organisation.designation}`}</b></td>
                                        <td>{organisation.libelle}</td>
                                        <td>{organisation.adresse}</td>
                                        <td>{organisation.prenom} {organisation.nom}</td>
                                        <td><span className={`badge badge-${organisation.status === "actif" ? "success" : "warn"}`}>{organisation.status}</span></td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}