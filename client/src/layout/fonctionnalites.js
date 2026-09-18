import { useEffect, useState } from "react";
import { Header, Modal } from "../components/Essential";
import { HeaderButton, Loader } from "../components/MiniComp";
import { useNavigate } from "react-router-dom";

export function Fonctionnalites() {
    const user = JSON.parse(localStorage.getItem("userinfo"));
    const link = process.env.REACT_APP_LINK;
    const [visibleModal, setVisibleModal] = useState(false);
    const hideModal = () => setVisibleModal(false);
    const [fonctionnalites, setFonctionnalites] = useState([]);
    const [filteredFonctionnalites, setFilteredFonctionnalites] = useState([]);
    const [loaderVisible, setLoaderVisible] = useState(false);
    const navigate = useNavigate();
    const loadFonctionnalites = async () => {
        setLoaderVisible(true);
        await fetch(`${link}/fonctionnalites`)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            if(data.status === "success"){
                setFonctionnalites(data.data);
                setFilteredFonctionnalites(data.data);
            }
        })
        setLoaderVisible(false);
    }   
    useEffect(() => {
        loadFonctionnalites();
    }, []);
    return <>
        <Header title={"Fonctionnalités"} />
        {loaderVisible && <Loader />}
        <Modal
            data={{form:"formfonct", fonctionnalites}}
            title={"Ajouter une fonctionnalité"}
            setVisible={setVisibleModal}
            visible={visibleModal}
            hideModal={hideModal}
        />
        <div className="main-container">

            <HeaderButton onclick={() => setVisibleModal(true)}  />
            <div class="card-tableau">
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Designation</th>
                                    <th>Icone</th>
                                    <th>Route</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredFonctionnalites.map((fonctionnalite, index) => (
                                    <tr key={index}>
                                        <td>{fonctionnalite.fonctionnaliteid}</td>
                                        <td>{fonctionnalite.designation}</td>
                                        <td><i className={`fas fa-${fonctionnalite.icone}`}></i></td>
                                        <td>{fonctionnalite.route}</td>
                                        <td>{fonctionnalite.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
        </div>
    </>
}