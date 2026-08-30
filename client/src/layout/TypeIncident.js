import { useEffect, useState } from "react";
import { Header, Modal } from "../components/Essential";
import { HeaderButton } from "../components/MiniComp";

export default function TypeIncident(){
    const link = process.env.REACT_APP_LINK;
    const [visibleModal, setVisibleModal] = useState(false);
    const [loadedData, setLoadedData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filteredCategorie, setFilteredCategorie] = useState([]);

    const loadDatas = async () => {
        await fetch(`${link}/get_categorie`).then((res) => res.json()).then((data) => {
            setLoadedData(data.data);
        }).catch((error) => console.error(error))
    }
    const searchCategorie = (search) => {
        console.log(search);
        setFilteredCategorie(categories.slice().filter((categorie) => `${categorie.designation} ${categorie.niveau}`.toLowerCase().includes(search.toLowerCase())));
    }
    useEffect(() => {
        setCategories(loadedData);
    },[loadedData])
    useEffect(() => {
        setFilteredCategorie(categories);
    },[categories])
    useEffect(() => {
        loadDatas();
    },[])
    return <>
        <Header title={"Categorie d'incidents"} searchFunction={searchCategorie} />
        <Modal
            hideModal={() => setVisibleModal(false)}
            setVisible={setVisibleModal}
            title={"Ajouter une categorie d'incident"}
            visible={visibleModal} 
            data={{form:"formTypeIncident"}}
        />
        <div className="main-container">
            <HeaderButton onclick={() => setVisibleModal(true)} />
            <div class="card-tableau">
                {/* <div class="card-header"><h3><i class="fas fa-tags"></i> Catégories d'Incidents</h3></div> */}
                <div class="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Designation</th>
                                <th>Niveau d'inquiétude</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                filteredCategorie.map((categorie) => 
                                <tr>
                                    <td>{categorie.designation}</td>
                                    <td>{categorie.niveau}</td>
                                </tr>)
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </>
}