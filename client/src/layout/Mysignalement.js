import { useEffect, useState } from "react";
import { Header, Modal } from "../components/Essential";
import { CardIncident, FAB, Loader } from "../components/MiniComp";
export function Signalement() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("userinfo")));
    const [incidents, setIncidents] = useState([]);
    const [filteredIncident, setFilteredIncident] = useState([]);
    const [visibleModal, setVisibleModal] = useState(false);
    const [visibleLoader, setVisibleLoader] = useState(false);
    const [openFAB, setOpenFAB] = useState(false);
    const link = process.env.REACT_APP_LINK;
    const loadIncident = async () => {
        setVisibleLoader(true);
        try{
            await fetch(`${link}/incident/${user.userid}`).then((response) => response.json()).then((data) => {
                console.log(data)
                setFilteredIncident(data.data);
                setIncidents(data.data);
            });
        }catch(error){
            console.log(error);
        }
        setVisibleLoader(false);
    }
    const searchDossier = (text) => {
        const filter = incidents.filter((dossier) => `${dossier.id_incident} ${dossier.type_incident} ${dossier.lieu} ${dossier.description}`.toString().includes(text));
        setFilteredIncident(filter);
    }

    const hideModal = () => setVisibleModal(false);
    useEffect(() => {
        loadIncident();

        document.addEventListener("click", (e) => {
            if(e.target.closest(".fab-container") === null) {
                setOpenFAB(false);
            }
        });
    },[])
    return <>
        <Header title={"Dossiers"} searchFunction={(text) => searchDossier(text)} />
        {visibleLoader && <Loader />}
        <div className="main-container">
            <Modal
                data={{form:"formSignaler"}}
                title="Signaler un incident"
                setVisible={setVisibleModal}
                visible={visibleModal}
                hideModal={hideModal}
                onSubmit={loadIncident}
            />
            <div class={`cards-dossiers-container`}>
                    {
                        filteredIncident.length > 0 ? filteredIncident.map((dossier) => (
                            <CardIncident key={dossier.id_incident} incident={dossier} />
                    )) : <div class="empty-state">
                        <i class="fas fa-inbox"></i>
                        <p>Aucun signalement trouvé</p>
                    </div>
                }
                </div>
            <FAB onClickMain={() =>setOpenFAB(!openFAB)} open={openFAB} options={[{icon:'hand-holding-heart', label:'Demande d\'aide', title:'Demande d\'aide', onClick:() => {setVisibleModal(true); setOpenFAB(false)}}, {icon:'exclamation-triangle', label:'Signalement', title:'Signalement', onClick:() => {setVisibleModal(true); setOpenFAB(false)}}]} /> 
        </div>
    </>
}