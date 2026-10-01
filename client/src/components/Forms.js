'use client';
import { useEffect, useState } from "react";
import { InputForm, Loader, MiniLoader, SelectForm } from "./MiniComp";
import { Editor } from "./Editor";
import countries from "i18n-iso-countries";
import frLocale from "i18n-iso-countries/langs/fr.json";
import { useNavigate } from "react-router-dom";

// Enregistrer la langue française
countries.registerLocale(frLocale);

// Obtenir un objet { FR: "France", BE: "Belgique", ... }
const countryList = countries.getNames("fr", { select: "official" });

const link = process.env.REACT_APP_LINK;
export function FormUser({data, hideModal}){
    const [user, setUser] = useState({
        nom: data?.nom,
        prenom: data?.prenom,
        telephone: data?.telephone,
        email: data?.email,
        mdp: data?.mdp,
        confirm_mdp: data?.confirm_mdp,
        nom_utilisateur: data?.nom_utilisateur,
        categorie: data?.categorie,
        adresse: data?.adresse,
    });
    const [userinfo, setUserinfo] = useState(JSON.parse(localStorage.getItem("userinfo")));
    const [categorieUtilisateur, setCategorieUtilisateur] = useState([]);
    const [loaderVisible, setLoaderVisible] = useState(false);
    const [error, setError] = useState({});

    const ajouterUser = async (event) => {
        event.preventDefault();
        const newErrors = {};
        if (!user.nom.trim()) newErrors.nom = "Le nom est requis";
        if (!user.prenom.trim()) newErrors.prenom = "Le prénom est requis";
        if (!user.telephone.trim()) newErrors.telephone = "Le téléphone est requis";
        if (!user.email.trim()) newErrors.email = "L'email est requis";
        if (!user.nom_utilisateur.trim()) newErrors.nom_utilisateur = "Le nom d'utilisateur est requis";
        if (!user.categorie.trim()) newErrors.categorie = "La catégorie est requise";
        if (!user.adresse.trim()) newErrors.adresse = "L'adresse est requise";

        if (user.nom_utilisateur.trim() && user.nom_utilisateur.includes(" ")) {
            newErrors.nom_utilisateur = "Le nom d'utilisateur ne peut pas contenir d'espace";
        }
        if (Object.keys(newErrors).length > 0) {
            setError(newErrors);
            return;
        }

        setError({});
        setLoaderVisible(true);
        try {
            const response = await fetch(`${link}/user/${userinfo.organisationid}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nom: user.nom,
                    prenom: user.prenom,
                    phone: user.telephone,
                    email: user.email,
                    username: user.nom_utilisateur,
                    categorie: user.categorie,
                    adresse: user.adresse,
                }),
            });

            const dataresponse = await response.json();

            if (dataresponse.status === "success") {
                alert(dataresponse.message);
                data?.onSubmit();
                hideModal();
            } else {
                const serverErrors = { message: dataresponse.message };

                if (dataresponse.code === 'username_used') {
                    serverErrors.nom_utilisateur = "Le nom d'utilisateur est déjà utilisé";
                    setUser(prev => ({ ...prev, nom_utilisateur: "" }));
                } else if (dataresponse.code === 'email_used') {
                    serverErrors.email = "L'email est déjà utilisé";
                    setUser(prev => ({ ...prev, email: "" }));
                } else if (dataresponse.code === 'phone_used') {
                    serverErrors.telephone = "Le numéro de téléphone est déjà utilisé";
                    setUser(prev => ({ ...prev, telephone: "" }));
                }

                setError(serverErrors);
            }
        } catch (err) {
            console.error(err);
            setError({ global: "Une erreur s'est produite" });
            
            setTimeout(() => {
                setError({});
            }, 8000);
        }
        setLoaderVisible(false);
    }

    useEffect(() => {
        setCategorieUtilisateur(data?.categories || [] );
    }, [data]);
    return (
        <form id="userForm" onSubmit={(event) => ajouterUser(event)}>
            <p class="modal-subtitle">Tous les champs marqués d'un <span class="required">*</span> sont obligatoires.</p>
            <div class="modal-form-grid">
                <InputForm value={user.nom} onchange={(value) => setUser({...user, nom: value})} placeholder="Ex: Curie" type="text" label="Nom" id="nom" require={true} error={error.nom} icon="user"/>
                
                <InputForm value={user.prenom} onchange={(value) => setUser({...user, prenom: value})} placeholder="Ex: Marie" type="text" label="Prenom" id="prenom" require={true} error={error.prenom} icon="user"/>
                
                <InputForm value={user.telephone} onchange={(value) => setUser({...user, telephone: value})} placeholder="Ex: 243 812 345 678" type="tel" label="Téléphone" id="telephone" require={true} error={error.telephone} icon="phone"/>
                
                <InputForm value={user.email} onchange={(value) => setUser({...user, email: value})} placeholder="Ex: marie.curie@example.com" type="email" label="Email" id="email" require={true} error={error.email} icon="envelope"/>
                
                <InputForm value={user.nom_utilisateur} onchange={(value) => setUser({...user, nom_utilisateur: value})} placeholder="Ex: mariecurie" type="text" label="Nom d'utilisateur" id="nom_utilisateur" require={true} error={error.nom_utilisateur} icon="user"/>
                
                <SelectForm value={user.categorie} onchange={(value) => setUser({...user, categorie: value})} placeholder="Ex: Juriste" type="text" label="Catégorie" id="categorie" require={true} error={error.categorie} options={categorieUtilisateur?.map((cu) => ({value:cu.categorieutilisateurorgid, label:cu.libelle}))} icon="user-tag"/>
                
                <InputForm value={user.adresse} onchange={(value) => setUser({...user, adresse: value})} placeholder="Ex: 123 Rue de la Paix" label="Adresse" id="adresse" require={true} error={error.adresse} icon="map-marker"/>
            </div>
            <div class="form-actions" style={{display:"flex",justifyContent:"flex-end"}}>
                <button type="submit" class="btn btn-primary"><i class={`fas fa-${ loaderVisible ? "spinner fa-pulse fa-fw loader-text" : "save"}`}></i> Enregistrer</button>
            </div>
        </form>
    )
}

export function FormFonctionnalite ({data, hideModal, onSubmit}) {
    
    const [fonctionnalite,setFonctionnalite] = useState({
        designation:"",
        description:"",
        route:"",
        icone:"",
        parentid:"",
    });
    const [errors, setErrors] = useState({});
    const [visibleLoader,setVisibleLoader] = useState(false);
    const [listfonctionnalite, setListFonctionnalites] = useState([]);
    const submitFonctionnalite = async (event) => {
        event.preventDefault();
        setVisibleLoader(true);
        if(fonctionnalite.designation == "" || fonctionnalite.description == "" || fonctionnalite.route == "" || fonctionnalite.icone == ""){
            fonctionnalite.designation == "" ? setErrors({...errors, designation: "La désignation est requise"}) : setErrors({...errors, designation: ""});
            fonctionnalite.description == "" ? setErrors({...errors, description: "La description est requise"}) : setErrors({...errors, description: ""});
            fonctionnalite.route == "" ? setErrors({...errors, route: "La route est requise"}) : setErrors({...errors, route: ""});
            fonctionnalite.icone == "" ? setErrors({...errors, icone: "L'icone est requise"}) : setErrors({...errors, icone: ""});
            setVisibleLoader(false);
            return;
        }
        try{
            await fetch(`${link}/fonctionnalite`, {
                method: "post",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(fonctionnalite)
            }).then((response) => response.json()).then((data) => {
                if(data.status == "success"){
                    alert("Fonctionnalité ajoutée avec succès");
                    hideModal();
                    onSubmit();
                }
            })
        }catch(error){
            console.log(error);
        }
    }
    
    useEffect(() => {
        setListFonctionnalites(data?.fonctionnalites || [])
    },[data])
    return (
        <>
            <form id="formfonctionnalite" onSubmit={submitFonctionnalite}>
                <div className="modal-form-grid">
                    <InputForm value={fonctionnalite.designation} onchange={(value)=> setFonctionnalite({...fonctionnalite, designation: value})} placeholder="Ex: gestion des utilisateurs" type="text" label="Désignation" id="designation" require={true} error={errors.designation} icon="user"/>
                    <InputForm value={fonctionnalite.description} onchange={(value)=> setFonctionnalite({...fonctionnalite, description: value})} placeholder="Ex: gestion des utilisateurs" type="text" label="Description" id="description" require={true} error={errors.description} icon="comment"/>
                    <SelectForm value={fonctionnalite.parentid} onchange={(value)=> setFonctionnalite({...fonctionnalite, parentid: value})} placeholder="Ex: gestion des utilisateurs" type="text" label="Parent" id="parent" require={false} error={errors.parentid} icon="user-tag" options={listfonctionnalite?.map((f) => ({value:f.fonctionnaliteid, label:f.designation}))}/>
                    <InputForm value={fonctionnalite.route} onchange={(value)=> setFonctionnalite({...fonctionnalite, route: value})} placeholder="Ex: /gestion/utilisateurs" type="text" label="Route" id="route" require={true} error={errors.route} icon="path"/>
                    <InputForm value={fonctionnalite.icone} onchange={(value)=> setFonctionnalite({...fonctionnalite, icone: value})} placeholder="Ex: fa fa-user" type="text" label="Icône" id="icone" require={true} error={errors.icone} icon="icon"/>
                    {/* icone preview */}
                    {fonctionnalite.icone && (
                        <div className="form-group">
                            <label htmlFor="icone">Aperçu</label>
                            <div className="form-control">
                                <i className={`fas fa-${fonctionnalite.icone} fa-lg`}></i>
                            </div>
                        </div>
                    )}
                </div>
                <div className="form-actions">
                    <button type="submit" className="btn btn-primary"><i class={`fas fa-${ visibleLoader ? "spinner fa-pulse fa-fw loader-text" : "save"}`}></i> Enregistrer</button>
                </div>
            </form>
        </>
    )
}

export function FormSignaler ({data, hideModal, onSubmit}) {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("userinfo")));
    const [visibleLoader, setVisibleLoader] = useState(false);
    const [listTypeIncident, setListTypeIncident] = useState([]);
    const [nomfichier, setNomFichier] = useState("");
    const [Signalement, setSignalement] = useState({
        type: "",
        date: "",
        lieu: "",
        description: "",
        piecesJointes: [],
    });

    const envoyerindicent = async (event) => {
        event.preventDefault();
        setVisibleLoader(true);
        try{
            await fetch(`${link}/incident`, {
                method:"post",
                headers:{"Content-Type": "application/json"},
                body: JSON.stringify({...Signalement, userid: user.userid})
            }).then((reponse) => reponse.json()).then((datas) => {
                if(datas.status == "success"){
                    alert("Signalement envoyé avec succès");
                    hideModal();
                    onSubmit();
                }
            })
            setVisibleLoader(false);
        }catch(error){
            console.log(error);
            setVisibleLoader(false);
        }
    }
    const loadTypeIncident = async () => {
        setVisibleLoader(true);
        try {
            await fetch(`${link}/get_categorie`, {
                method: "get",
            }).then((reponse) => reponse.json()).then((data) => {
                setListTypeIncident(data?.data);
                setVisibleLoader(false);
            }).catch((error) => {
                console.log(error);
                setVisibleLoader(false);
            });
        } catch (error) {
            console.log(error);
            setVisibleLoader(false);

        }
    }
    useEffect(() => {
        loadTypeIncident();
    }, [])
    return (
    <>
        {visibleLoader &&<Loader />}
        <p class="modal-subtitle">Tous les champs marqués d'un <span class="required">*</span> sont obligatoires.</p>

            <form id="reportForm" onSubmit={(event) => envoyerindicent(event)}>

                <div class="modal-form-group required">
                    <label>Type d'incident</label>
                    <select required onChange={(e) => setSignalement({...Signalement, type: e.target.value})}>
                        <option value="" disabled selected>Choisissez une catégorie</option>
                        {listTypeIncident.map((item) => (
                            <option key={item.categorie_id} value={item.categorie_id}>{item.designation}</option>
                        ))}
                    </select>
                </div>
                <div class="modal-form-grid">
                    <div class="modal-form-group required">
                        <label>Date</label>
                        <input type="date" required onChange={(e) => setSignalement({...Signalement, date: e.target.value})}/>
                    </div>
                    <div class="modal-form-group required">
                        <label>Lieu</label>
                        <input type="text" placeholder="Ville, quartier..." required onChange={(e) => setSignalement({...Signalement, lieu: e.target.value})}/>
                    </div>
                </div>

                <div class="modal-form-group required">
                    <label>Description des faits</label>
                    <textarea rows="4" placeholder="Décrivez ce qui s'est passé..." required onChange={(e) => setSignalement({...Signalement, description: e.target.value})}>{Signalement.description}</textarea>
                </div>
                {/* <div class="modal-form-group">
                    <label>Pièces jointes (photos, documents)</label>
                    <div class="file-upload">
                        <i class="fas fa-cloud-upload-alt"></i>
                        <p>Cliquez pour ajouter des fichiers</p>
                        {}
                        <small>Max 20 Mo (PDF, JPG, PNG)</small>
                        <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => {setNomFichier(e.target.files[0].name); setSignalement({...Signalement, piecesJointes: e.target.files})}}  />
                    </div>
                </div> */}

                <div class="modal-form-group required">
                    <label class="checkbox">
                        <input type="checkbox" required/>
                        <span>Je certifie l'exactitude des informations</span>
                    </label>
                </div>

                <div align="right">
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-paper-plane"></i> Envoyer
                    </button>
                </div>
            </form>
            <div class="modal-footer">
                <i class="fas fa-lock"></i>
                <span>Signalement chiffré et confidentiel</span>
            </div>
    </>)
}

export function FormOrganisation ({data, hideModal, onSubmit}){
    
    const link = process.env.REACT_APP_LINK;
    const navigate = useNavigate();
    const [userinfo,setUserInfo] = useState(JSON.parse(localStorage.getItem("userinfo")));
    const [visibleLoader, setVisibleLoader] = useState(false);
    const [listTypeOrganisation, setListTypeOrganisation] = useState([]);
    const [activePart, setActivePart] = useState(1);
    const [domaineintervention,setDomaineIntervention] = useState([])
    const [organisation, setOrganisation] = useState({
        designation:"",
        sigle:"",
        typeorganisationid:"",
        pays:"",
        province:"",
        ville:"",
        adresse_org:"",
        telephone_org:"",
        email_org:"",
        site_web:"",
        reseaux_sociaux:"",
        logo_url:"",
        userid:userinfo?.userid,
        domaineintervention:[]
    })
    const [errors, setErrors] = useState({
        designation:"",
        sigle:"",
        typeorganisationid:"",
        pays:"",
        province:"",
        ville:"",
        adresse_org:"",
        telephone_org:"",
        email_org:"",
        site_web:"",
        reseaux_sociaux:"",
        logo_url:"",
        userid:""
    })
    const loadTypeOrganisation = async () => {
        try {
            await fetch(`${link}/typeorganisation`, {
                method: "get",
            }).then((reponse) => reponse.json()).then((data) => {
                console.log(data);
                setListTypeOrganisation(data?.data);
                setVisibleLoader(false);
            }).catch((error) => {
                console.log(error);
                setVisibleLoader(false);
            });
        } catch (error) {
            console.log(error);
            setVisibleLoader(false);

        }
    }

    const ajouter = async (event) => {
        const formData = new FormData();
        setErrors({});
        formData.append("designation", organisation.designation);
        formData.append("sigle", organisation.sigle);
        formData.append("typeorganisationid", organisation.typeorganisationid);
        formData.append("pays", organisation.pays);
        formData.append("province", organisation.province);
        formData.append("ville", organisation.ville);
        formData.append("adresse_org", organisation.adresse_org);
        formData.append("telephone_org", organisation.telephone_org);
        formData.append("email_org", organisation.email_org);
        formData.append("site_web", organisation.site_web);
        formData.append("reseaux_sociaux", organisation.reseaux_sociaux);
        formData.append("logo_url", organisation.logo_url);
        formData.append("userid", userinfo.userid);

        try {
            setVisibleLoader(true);
            await fetch(`${link}/organisation/add`, {
                method: "post",
                body: formData,
            }).then((reponse) => reponse.json()).then((returneddata) => {
                console.log(returneddata);
                if(returneddata.success){
                    setVisibleLoader(false);
                    setActivePart(2);
                    setOrganisation({...organisation, organisationid: returneddata.data.organisationid});
                    // alert(data.message);
                    // hideModal();
                    // setErrors({});
                    // setOrganisation({...organisation, designation: "", sigle: "", typeorganisationid: "", pays: "", province: "", ville: "", adresse_org: "", telephone_org: "", email_org: "", site_web: "", reseaux_sociaux: "", logo_url: ""});
                    // navigate("/welcome");
                }else{
                    setVisibleLoader(false);
                    setErrors({message:returneddata.message});
                }
            }).catch((error) => {
                console.log(error);
                setVisibleLoader(false);
            });
        } catch (error) {
            console.log(error);
            setVisibleLoader(false);

        }
    }

    const assignerDomaine = async (event) => {
        console.log(organisation);
        const data = {
            organisationid: organisation.organisationid,
            domaineintervention: organisation.domaineintervention
        }
        try {
            setVisibleLoader(true);
            await fetch(`${link}/assignerdomaine`, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            }).then((reponse) => reponse.json()).then((returneddata) => {
                console.log(returneddata?.message);
                if(returneddata.success){
                    setVisibleLoader(false);
                    alert(returneddata.message);
                    hideModal();
                    setErrors({});
                    setOrganisation({...organisation, designation: "", sigle: "", typeorganisationid: "", pays: "", province: "", ville: "", adresse_org: "", telephone_org: "", email_org: "", site_web: "", reseaux_sociaux: "", logo_url: ""});
                    navigate("/welcome");
                }else{
                    setVisibleLoader(false);
                    setErrors({message:returneddata.message});
                }
            }).catch((error) => {
                console.log(error);

                setVisibleLoader(false);
            });
        } catch (error) {
            console.log(error);
            setVisibleLoader(false);

        }
    }

    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
        setOrganisation(prevOrganisation => {
            let updatedIntervention = [...prevOrganisation.domaineintervention];
            
            if (checked) {
                // Ajouter le domaine si coché
                updatedIntervention.push(parseInt(value, 10));
            } else {
                // Retirer le domaine si décoché
                updatedIntervention = updatedIntervention.filter(
                    item => item !== parseInt(value, 10)
                );
            }
            
            return {
                ...prevOrganisation,
                domaineintervention: updatedIntervention
            };
        });
    };
    
    useEffect(() => {
        loadTypeOrganisation();
    }, [])
    useEffect(() => {
        if(data){
            setDomaineIntervention(data?.domaineintervention ? data?.domaineintervention : []);
        }
    }, [data])

    useEffect(() => {
        console.log(errors);
    }, [errors])

    return (
        <form id="incidentForm" onSubmit={(event) => ajouter(event)}>

            <div class="stepper" style={{padding:"10px 0"}}>
                <div class="stepper-progress" id="progress" style={{width: `${(activePart - 1) * 100}%`}}></div>

                <div class={`step ${activePart == 1 ? 'active' : activePart > 1 ? 'completed' : ''}`}>
                    <div class="step-number">{activePart > 1 ? '✓' : 1}</div>
                    <div class="step-label">Informations</div>
                </div>
                
                <div class={`step ${activePart == 2 ? 'active' : activePart > 2 ? 'completed' : ''}`}>
                    <div class="step-number">{activePart > 2 ? '✓' : 2}</div>
                    <div class="step-label">Domaines</div>
                </div>
            </div>
            {activePart == 1 && 
            <>
                <div class="modal-form-grid">
                    <InputForm value={organisation.designation} onchange={(value) => setOrganisation({...organisation, designation: value})} placeholder="Ex: Lonford" type="text" label="Designation de l'organisation" id="designation" require={true} error={errors.designation} icon="building"/>
                    <InputForm value={organisation.sigle} onchange={(value) => setOrganisation({...organisation, sigle: value})} placeholder="Ex: LFD" type="text" label="Sigle de l'organisation" id="designation" require={true} error={errors.sigle} icon="tag"/>
                    <SelectForm error={errors.typeorganisationid} icon={"building"} label={"Categorie d'organisation"} require={true} options={listTypeOrganisation.map((item) => {return {label: item.libelle, value: item.typeorganisationid}})} onchange={(value) => setOrganisation({...organisation, typeorganisationid: value})} />
                    <SelectForm icon={"globe"} label={"Pays"} require={true} options={Object.entries(countryList).map(([key, value]) => {return {label: value, value: key}})} onchange={(value) => setOrganisation({...organisation, pays: value})} />
                    <InputForm value={organisation.province} onchange={(value) => setOrganisation({...organisation, province: value})} placeholder="Ex: Sud Ouest" type="text" label="Province" id="province" require={true} error={errors.province} icon="map-marker"/>
                    <InputForm value={organisation.ville} onchange={(value) => setOrganisation({...organisation, ville: value})} placeholder="Ex: Buea" type="text" label="Ville" id="ville" require={true} error={errors.ville} icon="map-marker"/>
                    <InputForm value={organisation.adresse_org} onchange={(value) => setOrganisation({...organisation, adresse_org: value})} placeholder="Ex: Rue de la paix" type="text" label="Adresse" id="adresse" require={true} error={errors.adresse} icon="map-marker"/>
                    <InputForm value={organisation.telephone_org} onchange={(value) => setOrganisation({...organisation, telephone_org: value})} placeholder="Ex: 699 99 99 99" type="text" label="Telephone" id="telephone" require={true} error={errors.telephone_org} icon="phone"/>
                    <InputForm value={organisation.email_org} onchange={(value) => setOrganisation({...organisation, email_org: value})} placeholder="Ex: [EMAIL_ADDRESS]" type="text" label="Email" id="email" require={true} error={errors.email_org} icon="envelope"/>
                    <InputForm value={organisation.site_web} onchange={(value) => setOrganisation({...organisation, site_web: value})} placeholder="Ex: www.lonford.org" type="text" label="Site Web" id="site_web" require={false} error={errors.site_web} icon="globe"/>
                    <InputForm value={organisation.reseaux_sociaux} onchange={(value) => setOrganisation({...organisation, reseaux_sociaux: value})} placeholder="Ex: www.lonford.org" type="text" label="Reseaux Sociaux" id="reseaux_sociaux" require={false} error={errors.reseaux_sociaux} icon="globe"/>
                </div>
                <div class="modal-form-group">
                    <div className="flex items-center">
                        <i className="fa-solid fa-upload"></i>
                        <label>Logo de l'organisation</label>
                    </div>
                    <div class="file-upload">
                        <i class="fas fa-cloud-upload-alt"></i>
                        <p>Cliquez pour ajouter des fichiers</p>
                        <small>Max 20 Mo (PDF, JPG, PNG)</small>
                        <input type="file" multiple id="logo-input" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => { setOrganisation({...organisation, logo_url: e.target.files[0]})}}  />
                    </div>
                    <div className="logo-container" align="center">
                        {organisation.logo_url && (
                            <div className="image-wrapper">
                                <img src={URL.createObjectURL(organisation.logo_url)} alt="Aperçu" className="uploaded-image" />
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setOrganisation({...organisation, logo_url: null});
                                        document.getElementById('logo-input').value = '';
                                    }}
                                    className="remove-btn"
                                    title="Supprimer l'image"
                                >
                                    <i class="fa-solid fa-times"></i>
                                </button>
                            </div>
                        )}
                        {!organisation.logo_url && (
                            <div className="placeholder">
                                <i className="fas fa-image"></i>
                                <p>Aucune image sélectionnée</p>
                            </div>
                        )}
                    </div>
                </div> 
                {/* error */}
                {errors.message && <div class="form-error" style={{color:"red", fontSize:"13px" }} align="center">{errors.message}</div>}
                
                <div class="form-actions" style={{display:"flex",justifyContent:"flex-end"}}>
                    <button type="button" onClick={() => ajouter()} class="btn btn-primary"><i class={`fas fa-${ visibleLoader ? "spinner fa-pulse fa-fw loader-text" : "arrow-right"}`}></i> Suivant</button>
                </div>
            </>
            }
            {activePart == 2 && 
                <>
                <div>
                    <div className="flex items-center">
                        <i className="fa-solid fa-map-marker"></i>
                        <label>Domaines d'intervention de l'organisation</label>
                        {
                            domaineintervention.map((item, index) => {
                                return(
                                    <div style={{display: "flex", gap: "5px"}} key={index}>
                                        <input className="form-check-input" type="checkbox" id={`domaine-${index}`} value={item.categorie_id} onChange={(event) => handleCheckboxChange(event)} checked={organisation.domaineintervention.includes(item.categorie_id)} />
                                        <label className="form-check-label" htmlFor={`domaine-${index}`}>{item.designation}</label>
                                    </div>
                                )
                            })
                        }
                    </div>
                        {errors.message && <div class="form-error" style={{color:"red", fontSize:"13px"}} align="center">{errors.message}</div>}
                    <div class="form-actions" style={{display:"flex",justifyContent:"flex-end"}}>
                        <button type="button" onClick={() => assignerDomaine()} class="btn btn-primary"><i class={`fas fa-${ visibleLoader ? "spinner fa-pulse fa-fw loader-text" : "save"}`}></i> Enregistrer</button>
                    </div>
                </div>
                </>
            }
        </form>
    )
}

export function FormassignerDomaine({data, hideModal}){
    const link = process.env.REACT_APP_LINK;
    const navigate = useNavigate();
    const [userinfo,setUserInfo] = useState(JSON.parse(localStorage.getItem("userinfo")));
    const [visibleLoader, setVisibleLoader] = useState(false);
    const [listDomaine, setListDomaine] = useState(data?.domaineintervention || []);
    const [domaine, setDomaine] = useState({
        organisationid:userinfo.organisationid,
        domaineintervention:[],
        userid:userinfo?.userid
    });
    const [errors, setErrors] = useState({
        organisationid:"",
        domaineintervention:"",
        userid:""
    })

    const assignerDomaine = async (event) => {
        console.log(domaine);
        try {
            setVisibleLoader(true);
            await fetch(`${link}/assignerdomaine`, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(domaine),
            }).then((reponse) => reponse.json()).then((returneddata) => {
                console.log(returneddata?.message);
                if(returneddata.success){
                    setVisibleLoader(false);
                    alert(returneddata.message);
                    hideModal();
                    setErrors({});
                    localStorage.setItem("userinfo",JSON.stringify(returneddata?.data));
                    setDomaine({organisationid:data?.organisationid, domaineintervention:[], userid:userinfo?.userid});
                }else{
                    setVisibleLoader(false);
                    setErrors({message:returneddata.message});
                }
            }).catch((error) => {
                console.log(error);

                setVisibleLoader(false);
            });
        } catch (error) {
            console.log(error);
            setVisibleLoader(false);

        }
    }

    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
        setDomaine(prevDomaine => {
            let updatedIntervention = [...prevDomaine.domaineintervention];
            
            if (checked) {
                // Ajouter le domaine si coché
                updatedIntervention.push(parseInt(value, 10));
            } else {
                // Retirer le domaine si décoché
                updatedIntervention = updatedIntervention.filter(
                    item => item !== parseInt(value, 10)
                );
            }
            
            return {
                ...prevDomaine,
                domaineintervention: updatedIntervention
            };
        });
    };
    useEffect(() => {
        setListDomaine(data?.domaineintervention || []);
    }, [data]);

    return (
        <div>
            <div className="flex items-center">
                <i className="fa-solid fa-map-marker"></i>
                <label>Domaines d'interventions</label>
                {
                    listDomaine.map((item, index) => {
                        return(
                            <div style={{display: "flex", gap: "5px"}} key={index}>
                                <input className="form-check-input" type="checkbox" id={`domaine-${index}`} value={item.categorie_id} onChange={(event) => handleCheckboxChange(event)} checked={domaine.domaineintervention.includes(item.categorie_id)} />
                                <label className="form-check-label" htmlFor={`domaine-${index}`}>{item.designation}</label>
                            </div>
                        )
                    })
                }
            </div>
                {errors.message && <div class="form-error" style={{color:"red", fontSize:"13px"}} align="center">{errors.message}</div>}
            <div class="form-actions" style={{display:"flex",justifyContent:"flex-end"}}>
                <button type="button" onClick={() => assignerDomaine()} class="btn btn-primary"><i class={`fas fa-${ visibleLoader ? "spinner fa-pulse fa-fw loader-text" : "save"}`}></i> Enregistrer</button>
            </div>
        </div>
    )
    
}

export function FormCategorieutilisateurOrg({data, hideModal}){
    const link = process.env.REACT_APP_LINK;
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("userinfo")));
    const [activePart, setActivePart] = useState(1);
    const [categorieutilisateurorg, setCategorieutilisateurorg] = useState({
        libelle:"",
        description:"",
        organisationid:user.organisationid,
        fonctionnalites:[]
    });
    const [fonctionnalites, setFonctionnalites] = useState(data?.fonctionnalites ? data?.fonctionnalites : []);
    const [error, setError] = useState("");
    const [visibleLoader, setVisibleLoader] = useState(false);

    const verifStep1 = async () => {
        setError({});
        if(categorieutilisateurorg.libelle == ""){
            setError({libelle:"Veuillez saisir un libelle"});
            return false;
        }
        if(categorieutilisateurorg.description == ""){
            setError({description:"Veuillez saisir une description"});
            return false;
        }
        setActivePart(2);
        return true;
    }
    const ajouter = async (event) => {
        event.preventDefault();

        setVisibleLoader(true);
        await fetch(`${link}/categorieutilisateurorg`, {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify(categorieutilisateurorg),
        }).then((res) => res.json()).then((dataresponse) => {
            
            setVisibleLoader(false);
            if(dataresponse.status =="success"){
                alert("Categorie d'utilisateur d'organisation ajoutée avec succès !");
                hideModal();
                data?.onSubmit();
                setActivePart(1);
                setCategorieutilisateurorg({
                    libelle:"",
                    description:"",
                    organisationid:user.organisationid,
                    fonctionnalites:[]
                });
                setError("");
            }else{
                setError(dataresponse.message);
            }
        }).catch((error) => {
            setError("Une erreur s'est produite ! ");
            console.error(error);
            setVisibleLoader(false);
        })
    }

    useEffect(() => {
        setFonctionnalites(data?.fonctionnalites ? data?.fonctionnalites : []);
        setCategorieutilisateurorg(data?.categorieutilisateurorg ? data?.categorieutilisateurorg : {
            libelle:"",
            description:"",
            organisationid:user.organisationid,
            fonctionnalites:[]
        });
    }, [data]);

    return(
        <form onSubmit={ajouter} className="form-container">
            <div class="stepper" style={{padding:"10px 0"}}>
                <div class="stepper-progress" id="progress" style={{width: `${(activePart - 1) * 100}%`}}></div>

                <div class={`step ${activePart == 1 ? 'active' : activePart > 1 ? 'completed' : ''}`}>
                    <div class="step-number">{activePart > 1 ? '✓' : 1}</div>
                    <div class="step-label">Informations</div>
                </div>
                
                <div class={`step ${activePart == 2 ? 'active' : activePart > 2 ? 'completed' : ''}`}>
                    <div class="step-number">{activePart > 2 ? '✓' : 2}</div>
                    <div class="step-label">Rôles</div>
                </div>
            </div>
            {activePart == 1 && (
            <div style={{margin:"10px"}}>
                <div class="modal-form-grid">
                    <InputForm value={categorieutilisateurorg.libelle} onchange={(value) => setCategorieutilisateurorg({...categorieutilisateurorg, libelle:value})} placeholder="Ex: Redacteur" type="text" label="libelle" id="libelle" require={true} error={error.libelle} icon="user"/>
                    <InputForm value={categorieutilisateurorg.description} onchange={(value) => setCategorieutilisateurorg({...categorieutilisateurorg, description:value})} placeholder="Ex: Utilisateurs redacteur" type="text" label="Description" id="description" require={true} error={error.description} icon="info"/>
                </div>
                <div className="form-actions" style={{display:"flex",justifyContent:"flex-end"}}>
                    <button type="button" className="btn btn-primary" onClick={() => verifStep1()}>Suivant</button>
                </div>
            </div>
            )}
            {activePart == 2 && (
                <div style={{margin:"10px"}}>
                    <p style={{display:"flex",alignItems:"center",gap:"10px",padding:"10px",fontSize:"1.2rem",fontWeight:"bold"}}><i className="fas fa-list"></i> Listes des fonctionnalites</p>
                    {
                        fonctionnalites.map((fonctionnalite) => (
                            <div key={fonctionnalite.fonctionnaliteid} className="form-check" style={{display:"flex",alignItems:"center",gap:"10px",padding:"10px",borderRadius:"5px",textAlign:"left"}}>
                                <input type="checkbox" id={fonctionnalite.fonctionnaliteid} style={{width:"20px",height:"20px"}} onChange={(event) => event.target.checked ? setCategorieutilisateurorg({...categorieutilisateurorg, fonctionnalites: [...categorieutilisateurorg.fonctionnalites, fonctionnalite.fonctionnaliteid]}) : setCategorieutilisateurorg({...categorieutilisateurorg, fonctionnalites: categorieutilisateurorg.fonctionnalites.filter((id) => id !== fonctionnalite.fonctionnaliteid)})  } />
                                <span className="checkmark"><i className={`fas fa-${fonctionnalite.icone}`}></i></span>
                                <label htmlFor={fonctionnalite.fonctionnaliteid}>{fonctionnalite.designation}</label>
                            </div>
                        ))
                    }
                    <div className="form-actions" style={{display:"flex",justifyContent:"space-between"}}>
                        <button type="button" className="btn" onClick={() => setActivePart(activePart - 1)}>Retour</button>
                        <button type="submit" className="btn btn-primary"><i className={`fas fa-${visibleLoader ? "spinner fa-pulse fa-fw loader-text" : "save"}`}></i> Enregistrer</button>
                    </div>
                </div>
            )}
        </form>
    )
}


export function FormCategorieUtilisateur({data, hideModal}){
    const link = process.env.REACT_APP_LINK;
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("userinfo")));
    const [activePart, setActivePart] = useState(1);
    const [categorieutilisateur, setCategorieutilisateur] = useState({
        designation:"",
        description:"",
        confirm: false,
        organisation: false,
        fonctionnalites: []
    });
    const [fonctionnalites, setFonctionnalites] = useState(data?.fonctionnalites ? data?.fonctionnalites : []);
    const [error, setError] = useState({});
    const [visibleLoader, setVisibleLoader] = useState(false);

    const verifStep1 = async () => {
        setError({});
        if(categorieutilisateur.designation == ""){
            setError({designation:"Veuillez saisir une designation"});
            return false;
        }
        if(categorieutilisateur.description == ""){
            setError({description:"Veuillez saisir une description"});
            return false;
        }
        setActivePart(2);
        return true;
    }
    const ajouter = async (event) => {
        event.preventDefault();

        setVisibleLoader(true);
        await fetch(`${link}/categorieutilisateur`, {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify(categorieutilisateur),
        }).then((res) => res.json()).then((data) => {
            console.log(data);
            
            setVisibleLoader(false);
            if(data.status =="success"){
                alert("Categorie d'utilisateur ajoutée avec succès !");
                hideModal();
                setCategorieutilisateur({
                    designation:"",
                    description:"",
                    confirm: true,
                    organisation: true,
                    fonctionnalites: []
                });
                setError("")
            }else{
                setError(data.message);
            }
        }).catch((error) => {
            setError("Une erreur s'est produite ! ");
            console.error(error);
            setVisibleLoader(false);
        })
    }

    useEffect(() => {
        setFonctionnalites(data?.fonctionnalites ? data?.fonctionnalites : []);
    },[data])
    return(
        <form onSubmit={ajouter} className="form-container">
            <div class="stepper" style={{padding: "5px"}}>
                <div class="stepper-progress" id="progress" style={{width: `${(activePart - 1) * 100}%`}}></div>

                <div class={`step ${activePart == 1 ? 'active' : activePart > 1 ? 'completed' : ''}`}>
                    <div class="step-number">{activePart > 1 ? '✓' : 1}</div>
                    <div class="step-label">Informations</div>
                </div>
                
                <div class={`step ${activePart == 2 ? 'active' : activePart > 2 ? 'completed' : ''}`}>
                    <div class="step-number">{activePart > 2 ? '✓' : 2}</div>
                    <div class="step-label">Rôles</div>
                </div>
            </div>
            {activePart == 1 && (
            <div> 
                <div class="modal-form-grid">
                    <InputForm value={categorieutilisateur.designation} onchange={(value) => setCategorieutilisateur({...categorieutilisateur, designation:value})} placeholder="Ex: Administrateur" type="text" label="Designation" id="designation" require={true} error={error.designation} icon="user"/>
                    <InputForm value={categorieutilisateur.description} onchange={(value) => setCategorieutilisateur({...categorieutilisateur, description:value})} placeholder="Ex: Utilisateurs administrateurs" type="text" label="Description" id="description" require={true} error={error.description} icon="info"/>
                    <InputForm value={categorieutilisateur.confirm} onchange={(value) => setCategorieutilisateur({...categorieutilisateur, confirm:value})} type="checkbox" label="Confirm" id="confirm" require={true} error={error.confirm} icon="info"/>
                    <InputForm value={categorieutilisateur.organisation} onchange={(value) => setCategorieutilisateur({...categorieutilisateur, organisation:value})} type="checkbox" label="Organisation" id="organisation" require={true} error={error.organisation} icon="info"/>
                </div>
                <div className="form-actions" style={{display:"flex",justifyContent:"flex-end"}}>
                    <button type="button" className="btn btn-primary" onClick={() => verifStep1()}>Suivant</button>
                </div>
            </div>
            )}
            {activePart == 2 && (
                <div>
                    <p style={{display:"flex",alignItems:"center",gap:"10px",padding:"10px",fontSize:"1.2rem",fontWeight:"bold"}}><i className="fas fa-list"></i> Listes des fonctionnalites</p>
                    {
                        fonctionnalites.map((fonctionnalite) => (
                            <div key={fonctionnalite.fonctionnaliteid} className="form-check" style={{display:"flex",alignItems:"center",gap:"10px",padding:"10px",borderRadius:"5px",textAlign:"left"}}>
                                <input type="checkbox" id={fonctionnalite.fonctionnaliteid} style={{width:"20px",height:"20px"}} onChange={(event) => event.target.checked ? setCategorieutilisateur({...categorieutilisateur, fonctionnalites: [...categorieutilisateur.fonctionnalites, fonctionnalite.fonctionnaliteid]}) : setCategorieutilisateur({...categorieutilisateur, fonctionnalites: categorieutilisateur.fonctionnalites.filter((id) => id !== fonctionnalite.fonctionnaliteid)})  } />
                                <span className="checkmark"><i className={`fas fa-${fonctionnalite.icone}`}></i></span>
                                <label htmlFor={fonctionnalite.fonctionnaliteid}>{fonctionnalite.designation}</label>
                            </div>
                        ))
                    }
                    <div className="form-actions" style={{display:"flex",justifyContent:"space-between"}}>
                        <button type="button" className="btn" onClick={() => setActivePart(activePart - 1)}>Retour</button>
                        <button type="submit" className="btn btn-primary"><i className={`fas fa-${visibleLoader ? "spinner fa-pulse fa-fw loader-text" : "save"}`}></i> Enregistrer</button>
                    </div>
                </div>
            )}
        </form>
    )
}

export function FormTypeIncident ({data, hideModal}){

    const link = process.env.REACT_APP_LINK;
    const [typeincident, setTypeincident] = useState({
        designation:"",
        niveau:"",
    })
    const [error, setError] = useState("");
    const [visibleLoader, setVisibleLoader] = useState(false);
    const ajouter = async (event) => {
        event.preventDefault();

        setVisibleLoader(true);
        await fetch(`${link}/add_categorie`, {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify(typeincident),
        }).then((res) => res.json()).then((data) => {
            console.log(data);
            
            setVisibleLoader(false);
            if(data.status =="success"){
                alert("Categorie d'incident ajoutée avec succès !");
                hideModal();
                setTypeincident({
                    designation:"",
                    niveau:""
                });
                setError("")
            }else{
                setError(data.message);
            }
        }).catch((error) => {
            setError("Une erreur s'est produite ! ");
            console.error(error);
            setVisibleLoader(false);
        })
    } 
    return (
        <form id="incidentForm" onSubmit={(event) => ajouter(event)}>
            <div class="modal-form-grid">
                <div class="modal-form-group required">
                    <label>Designation de l'incident</label>
                    <input type="text" placeholder="Ex: Fraude, Corruption..." value={typeincident.designation} onChange={(event) => setTypeincident({...typeincident, designation:event.target.value})} required />
                </div>
                
                <div class="modal-form-group required">
                    <label>Niveau d'inquiétude</label>
                    <select id="incidentNiveau" value={typeincident.niveau} onChange={(event) => setTypeincident({...typeincident, niveau:event.target.value})} required>
                        <option value="">Sélectionner...</option>
                        <option value="faible">Faible</option>
                        <option value="moyen">Moyen</option>
                        <option value="eleve">Élevé</option>
                        <option value="critique">Critique</option>
                    </select>
                </div>
            </div>
            {error && <div class="error-message" align="center">
                <i class="fas fa-exclamation-circle"></i>
                <span> {error}</span>
            </div>}

            <div class="modal-footer">
                <button class="btn btn-secondary" type="button" onClick={hideModal}>Annuler</button>
                <button class="btn btn-primary" type="submit" disabled={visibleLoader}>{visibleLoader && <MiniLoader />} Enregistrer</button>
            </div>
        </form>);
}

export function FormArticle({data, hideModal, loadArticles}){
    const [article, setArticle] = useState({
        titre:"",
        file:[],
        contenu:""
    });
    const addArticle = async (event) => {
        console.log(data);
        event.preventDefault();
        console.log(article);
        const formData = new FormData();
        formData.append("titre", article.titre);
        formData.append("contenu", article.contenu);
        formData.append("file", article.file);
        formData.append("userid", data.userid);
        await fetch(`${link}/add_article`, {
            method:"post",
            body: formData,
        }).then((res) => res.json()).then((data) => {
            if(data.status == "success"){
                alert("Article ajouté avec succès !");
                setArticle({
                    titre:"",
                    file:[],
                    contenu:""
                });
                hideModal();
                data.loadArticles();
            }else{
                alert(data.message);
            }
            
        }).catch((error) => {
            console.error(error);
        })
    }
    return <form onSubmit={(event) => addArticle(event)}>
        <div class="modal-form-group required">
            <label>Titre de l'article</label>
            <input type="text" placeholder="Titre" value={article.titre} onChange={(event) => setArticle({...article, titre:event.target.value})} required />
        </div>
        <div class="modal-form-group required">
            <label>Contenu de l'article</label>
            <Editor content={article.contenu} setContent={(value) => setArticle({...article, contenu:value})} />
        </div>
        <div class="modal-form-group required">
            <label>Pièces jointes (photos, documents)</label>
            <div class="file-upload">
                <i class="fas fa-cloud-upload-alt"></i>
                <p>Cliquez pour ajouter des fichiers</p>
                <small>Max 20 Mo (PDF, JPG, PNG)</small>
                <input type="file" name="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(event) => setArticle({...article, file:event.target.files[0]})} />
            </div>
            {/* {(article.file != []) && (
                <div class="file-preview">
                    <i class={`fas fa-file-${article.file.type.split("/")[1] === "jpeg" ? "image" : article.file.type.split("/")[1] === "pdf" ? "pdf" : "file"}`}></i>
                    <span>{article.file.name}</span>
                </div>
            )} */}
        </div>
        <div class="modal-form-group required">
            <label class="checkbox">
                <input type="checkbox" required/>
                <span>Je certifie l'exactitude des informations</span>
            </label>
        </div>
        <div class="modal-buttons">
            <button type="button" class="btn btn-cancel" id="cancelReportBtn">Annuler</button>
            <button type="submit" class="btn btn-primary">
                <i class="fas fa-paper-plane"></i> Envoyer
            </button>
        </div>
    </form>
} 

export function FormEditProfile({data, hideModal}){
    const [userinfo, setUserinfo] = useState({...data, password:"", confirmPassword:"", oldPassword:""});
    const [error, setError] = useState("");
    const [visibleLoader, setVisibleLoader] = useState(false);
    const updateProfile = async (event) => {
        event.preventDefault();
        if(userinfo.password !== userinfo.confirmPassword){
            setError("Les mots de passe ne correspondent pas !");
            return;
        }
        setVisibleLoader(true);
        await fetch(`${link}/updateprofile`, {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify(userinfo),
        }).then((res) => res.json()).then((data) => {
            console.log(data);
            
            setVisibleLoader(false);
            if(data.status =="success"){
                alert("Profil mis à jour avec succès !");
                hideModal();
                setError("")
            }else{
                setError(data.message);
            }
        }).catch((error) => {
            setError("Une erreur s'est produite ! ");
            console.error(error);
            setVisibleLoader(false);
        })
    } 
    useEffect(() => {
        if(data){
            setUserinfo({
                noms:data.noms ? data.noms : "",
                adresse:data.adresse ? data.adresse : "",
                phone:data.phone ? data.phone : "",
                email:data.email ? data.email : "",
                password:data.password ? data.password : "",
                username:data.username ? data.username : "",
                confirmPassword:data.confirmPassword ? data.confirmPassword : "",
                oldPassword:data.oldPassword ? data.oldPassword : "",
            });
        }
    }, [data]);
    return (
        <form id="profileForm" onSubmit={(event) => updateProfile(event)}>
            <div class="modal-form-grid">
                <div class="modal-form-group required">
                    <label>Noms</label>
                    <input type="text" placeholder="Noms" value={userinfo.noms} onChange={(event) => setUserinfo({...userinfo, noms:event.target.value})} required />
                </div>
                <div class="modal-form-group required">
                    <label>Adresse</label>
                    <input type="text" placeholder="Adresse" value={userinfo.adresse} onChange={(event) => setUserinfo({...userinfo, adresse:event.target.value})} required />
                </div>
                <div class="modal-form-group required">
                    <label>Telephone</label>
                    <input type="text" placeholder="Telephone" value={userinfo.phone} onChange={(event) => setUserinfo({...userinfo, phone:event.target.value})} required />
                </div>
                <div class="modal-form-group required">
                    <label>Email</label>
                    <input type="email" placeholder="Email" value={userinfo.email} onChange={(event) => setUserinfo({...userinfo, email:event.target.value})} required />
                </div>
                {/* ancien mot de passe  */}
                <div class="modal-form-group required">
                    <label>Ancien mot de passe</label>
                    <input type="password" placeholder="Ancien mot de passe" value={userinfo.oldPassword} onChange={(event) => setUserinfo({...userinfo, oldPassword:event.target.value})} required />
                </div>
                <div class="modal-form-group required">
                    <label>Nouveau mot de passe</label>
                    <input type="password" placeholder="Nouveau mot de passe" value={userinfo.password} onChange={(event) => setUserinfo({...userinfo, password:event.target.value})} required />
                </div>
                <div class="modal-form-group required">
                    <label>Confirmer le nouveau mot de passe</label>
                    <input type="password" placeholder="Confirmer le nouveau mot de passe" value={userinfo.confirmPassword} onChange={(event) => setUserinfo({...userinfo, confirmPassword:event.target.value})} required />
                </div>
            </div>
            {error && <div class="error-message" align="center">
                <i class="fas fa-exclamation-circle"></i>
                <span> {error}</span>
            </div>}

            <div class="modal-footer">
                <button class="btn btn-secondary" type="button" onClick={hideModal}>Annuler</button>
                <button class="btn btn-primary" type="submit" disabled={visibleLoader}>{visibleLoader && <MiniLoader />} Enregistrer</button>
            </div>
        </form>);
}
