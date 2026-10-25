import { Alert, Button, FormGroup, Input, Select, Uploader } from "../components/minicomp";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import countries from "i18n-iso-countries";
import frLocale from "i18n-iso-countries/langs/fr.json";


countries.registerLocale(frLocale);

const countryList = countries.getNames("fr", { select: "official" });


export function Rejoindre() {
    const link = process.env.REACT_APP_LINK;
    const navigate = useNavigate();
    const [loaderVisible, setLoaderVisible] = useState(false);
    const [visiblemdp, setVisiblemdp] = useState(false);
    const [activePart, setActivePart] = useState(1);
    const [visibleconfirmmdp, setVisibleconfirmmdp] = useState(false);
    const [domaineintervention, setDomaineintervention] = useState([]);
    const [configurations, setConfigurations] = useState({domaines:[]});
    const [organisme, setOrganisme] = useState({});
    const [user, setUser] = useState({
        nom: "",
        prenom: "",
        phone: "",
        email: "",
        mdp: "",
        confirm_mdp: "",
        username: "",
        categorie: "",
        adresse: "",
        code:""
    });
    const [categorieUtilisateur, setCategorieUtilisateur] = useState([]);
    const [listTypeOrganisation, setListTypeOrganisation] = useState([]);
    const [errors, setErrors] = useState({
        nom: "",
        prenom: "",
        phone: "",
        email: "",
        mdp: "",
        confirm_mdp: "",
        username: "",
        categorie: "",
        adresse: "",
        code:""
    });

    const loadCategorieUtilisateur = async () => {
        await fetch(`${link}/categorieutilisateur`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then((reponse) => reponse.json()).then(async(data) => {
            if(data.status === "success") {
                setCategorieUtilisateur(data.data);
            }
        }).catch((error) => {
            console.log(error);
        })
    }

    const loadTypeOrganisation = async () => {
        try {
            await fetch(`${link}/typeorganisation`, {
                method: "get",
            }).then((reponse) => reponse.json()).then((data) => {
                console.log(data);
                setListTypeOrganisation(data?.data);
                setLoaderVisible(false);
            }).catch((error) => {
                console.log(error);
                setLoaderVisible(false);
            });
        } catch (error) {
            console.log(error);
            setLoaderVisible(false);

        }
    }
    
    const loadDomaines = async () => {
        setLoaderVisible(true);
        try {
            await fetch(`${link}/get_categorie`, {
                method: "get",
            }).then((reponse) => reponse.json()).then((data) => {
                setDomaineintervention(data?.data);
                setLoaderVisible(false);
            }).catch((error) => {
                console.log(error);
                setLoaderVisible(false);
            });
        } catch (error) {
            console.log(error);
            setLoaderVisible(false);

        }
    }


    const assignerDomaine = async (organisationid) => {
        try {
            setLoaderVisible(true);
            await fetch(`${link}/assignerdomaine`, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({organisationid: organisationid, domaineintervention: configurations.domaines, userid:user?.userid}),
            }).then((reponse) => reponse.json()).then((returneddata) => {
                if(returneddata.success){
                    setLoaderVisible(false);
                    alert(returneddata.message);
                    setErrors({});
                    localStorage.setItem("userinfo",JSON.stringify(returneddata?.data));
                    navigate("/waiting");
                }else{
                    setLoaderVisible(false);
                    setErrors({message:returneddata.message});
                }
            }).catch((error) => {
                console.log(error);

                setLoaderVisible(false);
            });
        } catch (error) {
            console.log(error);
            setLoaderVisible(false);

        }
    }

    const inscrire = async (event) => {
        event.preventDefault();
        setLoaderVisible(true);
        try {
            // verifier que le username n'as pas d'espace et les mdp ont plus de 8 charactere 
            if(user.username.includes(" ")) {
                setErrors({...errors, username: "Le nom d'utilisateur ne peut pas contenir d'espace"});
                return;
            }
            await fetch(`${link}/user`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nom: user.nom,
                    prenom: user.prenom,
                    phone: user.phone,
                    email: user.email,
                    mdp: user.mdp,
                    mdp2: user.confirm_mdp,
                    username: user.username,
                    categorie: user.categorie,
                    adresse: user.adresse,
                }),
            }).then((reponse) => reponse.json()).then(async(data) => {
                
                if(data.status === "success") {
                    navigate("/login");
                }else{
                    setErrors({...errors, message: data.message});
                    if(data.code == 'username_used'){
                        setErrors({...errors, username: "Le nom d'utilisateur est deja utilisé"});
                        setUser({...user, username: ""});
                    }else if(data.code == 'email_used'){
                        setErrors({...errors, email: "L'email est deja utilisé"});
                        setUser({...user, email: ""});
                    }else if(data.code == 'phone_used'){
                        setErrors({...errors, phone: "Le numero de phone est deja utilisé"});
                        setUser({...user, phone: ""});
                    }else if(data.code == 'password_mismatch'){
                        setErrors({...errors, mdp: "Les mots de passe ne correspondent pas", confirm_mdp: "Les mots de passe ne correspondent pas"});
                        setUser({...user, mdp: "", confirm_mdp: ""});
                    }
                }

                setLoaderVisible(false);
                setVisiblemdp(false);
                setVisibleconfirmmdp(false);
                setTimeout(() => {
                    setErrors({});
                }, 8000);
            }).catch((error) => {
                console.log(error);
                setErrors("Une erreur s'est produite");
                setLoaderVisible(false);
                setVisiblemdp(false);
                setVisibleconfirmmdp(false);
                setTimeout(() => {
                    setErrors({});
                }, 8000);
            })
        } catch (error) {
            console.log(error);
        }
    }
    const verifStep1 = async () => {
        const newErrors = {};
        if (!user.nom.trim()) newErrors.nom = "Le nom est requis";
        if (!user.prenom.trim()) newErrors.prenom = "Le prénom est requis";
        if (!user.phone.trim()) newErrors.phone = "Le téléphone est requis";
        if (!user.email.trim()) newErrors.email = "L'email est requis";
        if (!user.username.trim()) newErrors.username = "Le nom d'utilisateur est requis";
        if (!user.categorie.trim()) newErrors.categorie = "La catégorie est requise";
        
        if (user.username.trim() && user.username.includes(" ")) {
            newErrors.username = "Le nom d'utilisateur ne peut pas contenir d'espace";
        }
        console.log(newErrors);
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        setLoaderVisible(true);
        try {
            const response = await fetch(`${link}/user`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nom: user.nom,
                    prenom: user.prenom,
                    phone: user.phone,
                    email: user.email,
                    username: user.username,
                    categorie: user.categorie,
                    adresse: user.adresse,
                }),
            });

            const data = await response.json();
            console.log(data);

            if (data.status === "success") {
                setActivePart(2);
            } else {
                const serverErrors = { message: data.message };

                if (data.code === 'username_used') {
                    serverErrors.username = "Le nom d'utilisateur est déjà utilisé";
                    setUser(prev => ({ ...prev, username: "" }));
                } else if (data.code === 'email_used') {
                    serverErrors.email = "L'email est déjà utilisé";
                    setUser(prev => ({ ...prev, email: "" }));
                } else if (data.code === 'phone_used') {
                    serverErrors.phone = "Le numéro de téléphone est déjà utilisé";
                    setUser(prev => ({ ...prev, phone: "" }));
                }

                setErrors(serverErrors);
            }
        } catch (err) {
            console.error(err);
            setErrors({ global: "Une erreur s'est produite" });
            
            setTimeout(() => {
                setErrors({});
            }, 8000);
        }
        setLoaderVisible(false);
    };
    const verifStep2 = async () => {
        const newErrors = {};
        if(!user.code.trim()) newErrors.code = "Veuillez saisr le code";
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        setLoaderVisible(true);
        try {
            const response = await fetch(`${link}/user/code`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    code: user.code,
                    email: user.email,
                }),
            });

            const data = await response.json();
            console.log(data);

            if (data.status === "success") {
                console.log(data)
                setActivePart(3);
                setUser(prev => ({ ...prev, userid: data.data.userid }));
            } else {
                const serverErrors = { message: data.message };

                if (data.code === 'code_invalid') {
                    serverErrors.code = "Le code est invalide";
                    setUser(prev => ({ ...prev, code: "" }));
                }

                setErrors(serverErrors);
            }
        } catch (err) {
            console.error(err);
            setErrors({ global: "Une erreur s'est produite" });
            
            setTimeout(() => {
                setErrors({});
            }, 8000);
        }
        setLoaderVisible(false);

    }

    const verifStep3 = async () => {
        const newErrors = {};
        if(user.mdp.length < 8) {
            newErrors.mdp = "Le mot de passe doit contenir au moins 8 caractères";
        }
        if(user.confirm_mdp.length < 8) {
            newErrors.confirm_mdp = "Le mot de passe doit contenir au moins 8 caractères";
        }
        if(user.mdp !== user.confirm_mdp) {
            newErrors.mdp = "Les mots de passe ne correspondent pas";
            newErrors.confirm_mdp = "Les mots de passe ne correspondent pas";
        }
        if(Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setErrors({});
        setLoaderVisible(true);
        try {
            const response = await fetch(`${link}/user/mdp`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    mdp: user.mdp,
                    userid: user.userid,
                }),
            });

            const data = await response.json();
            console.log(data);

            if (data.status === "success") {
                console.log(data)

                const user = {...data.data.user, ...data.data.categorieutilisateur, ...data.data.organisation};
                setUser(user);
                setActivePart(4)
                
            } else {
                const serverErrors = { message: data.message };

                if (data.code === 'mdp_invalid') {
                    serverErrors.mdp = "Le mot de passe est invalide";
                    setUser(prev => ({ ...prev, mdp: "" }));
                }

                setErrors(serverErrors);
            }
        } catch (err) {
            console.error(err);
            setErrors({ global: "Une erreur s'est produite" });
            
            setTimeout(() => {
                setErrors({});
            }, 8000);
        }
        setLoaderVisible(false);
    }

    const verifStep4 = async () => {

        if(user.organisation){

            const formData = new FormData();
            const newErrors = {};
            if(!organisme.designation.trim()) newErrors.designation = "Veuillez saisr la designation";
            if(!organisme.sigle.trim()) newErrors.sigle = "Veuillez saisr le sigle";
            if(!organisme.typeorganisationid) newErrors.typeorganisationid = "Veuillez saisr le type d'organisation";
            if(!organisme.pays.trim()) newErrors.pays = "Veuillez saisr le pays";
            if(!organisme.province.trim()) newErrors.province = "Veuillez saisr la province";
            if(!organisme.ville.trim()) newErrors.ville = "Veuillez saisr la ville";
            if(!organisme.adresse.trim()) newErrors.adresse_org = "Veuillez saisr l'adresse";
            if(!organisme.contact.trim()) newErrors.telephone_org = "Veuillez saisr le numero de telephone";
            if(!organisme.email.trim()) newErrors.email_org = "Veuillez saisr l'email";
            if(!organisme.logo) newErrors.logo = "Veuillez fournir le logo";
            if(Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                return;
            }

            formData.append("designation", organisme.designation);
            formData.append("sigle", organisme.sigle);
            formData.append("typeorganisationid", organisme.typeorganisationid);
            formData.append("pays", organisme.pays);
            formData.append("province", organisme.province);
            formData.append("ville", organisme.ville);
            formData.append("adresse_org", organisme.adresse);
            formData.append("telephone_org", organisme.contact);
            formData.append("email_org", organisme.email);
            formData.append("site_web", organisme.site_web);
            formData.append("reseaux_sociaux", organisme.reseaux_sociaux);
            formData.append("logo_url", organisme.logo);
            formData.append("userid", user.userid);

            try {
                setLoaderVisible(true);
                await fetch(`${link}/organisation/add`, {
                    method: "post",
                    body: formData,
                }).then((reponse) => reponse.json()).then((returneddata) => {
                    console.log(returneddata);
                    if(returneddata.success){
                        setLoaderVisible(false);
                        setUser({...user, organisationid: returneddata.data.organisationid});
                        assignerDomaine(returneddata.data.organisationid);
                    }else{
                        setLoaderVisible(false);
                        setErrors({message:returneddata.message});
                    }
                }).catch((error) => {
                    console.log(error);
                    setLoaderVisible(false);
                });
            } catch (error) {
                console.log(error);
                setLoaderVisible(false);

            }
        }else{
            assignerDomaine();
        }
    }

    const handleDomaineClick = (domaine) => {
        if(configurations.domaines.includes(domaine)) {
            setConfigurations(prev => ({ ...prev, domaines: prev.domaines.filter(d => d !== domaine) }));
        }else{
            setConfigurations(prev => ({ ...prev, domaines: [...prev.domaines, domaine] }));
        }
    }

    useEffect(() => {
        loadCategorieUtilisateur();
        loadDomaines();
        loadTypeOrganisation();
    }, []);

    useEffect(() => {
        console.log(user.categorie, categorieUtilisateur.find((cat) => cat.categorieutilisateurid == user.categorie));
    }, [user.categorie])
    return (
        <div class="auth-container">
            <div class="auth-sidebar">
                <div class="logo">
                    <div class="logo-icon">H</div> HAKI System
                </div>
                <h2>Rejoindre HAKI SYSTEM</h2>
                <p>Un compte vous permet de suivre l'evolution des signalements</p>
                <ul>
                    <li>Vous pouvez choisir la categorie d'utilisateur qui vous convient</li>
                    <li>Votre compte sera soumis a une validation</li>
                    <li>Apres validation vous </li>
                </ul>
            </div>
            
                <div className="auth-form" style={{overflowY: "auto", padding: "10px",maxHeight:"100vh"}}>
                    <div  style={{maxWidth: "550px", background: "white", padding: "24px", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-color)", margin:"auto"}}>
                    <h1 style={{textAlign: "center"}}>Créer un compte</h1>
                    <p style={{textAlign: "center", marginTop: "4px", fontSize: "0.9rem", color: "var(--text-muted)"}}>Soumetez vos information pour rejoindre.</p>
                    <br />
                    <div class="stepper-container">
                        <div class="stepper">
                            <div class="stepper-progress" id="progress" style={{width: `${(activePart - 1) * 33}%`}}></div>

                            <div class={`step ${activePart == 1 ? 'active' : activePart > 1 ? 'completed' : ''}`}>
                                <div class="step-number">{activePart > 1 ? '✓' : 1}</div>
                                <div class="step-label">Profil</div>
                            </div>
                            
                            <div class={`step ${activePart == 2 ? 'active' : activePart > 2 ? 'completed' : ''}`}>
                                <div class="step-number">{activePart > 2 ? '✓' : 2}</div>
                                <div class="step-label">Confirmation</div>
                            </div>
                            
                            <div class={`step ${activePart == 3 ? 'active' : activePart > 3 ? 'completed' : ''}`}>
                                <div class="step-number">{activePart > 3 ? '✓' : 3}</div>
                                <div class="step-label">Sécurité</div>
                            </div>

                            <div class={`step ${activePart == 4 ? 'active' : activePart > 4 ? 'completed' : ''}`}>
                                <div class="step-number">{activePart > 4 ? '✓' : 4}</div>
                                <div class="step-label">Configuration</div>
                            </div>
                        </div>
                    </div>
                    {activePart == 1 ? 
                        <>
                        <FormGroup icone={"user"} label={"Catégorie d'utilisateur"} error={errors.categorie}>
                            <Select placeholder={"Catégorie d'utilisateur"} onChange={(value) => setUser({...user, categorie: value})} value={user.categorie} required={true} options={categorieUtilisateur.map((categorie) => {return {value: categorie.categorieutilisateurid, label: categorie.designation}})} />
                        </FormGroup>
                        <div className="form-row">  
                            <FormGroup icone={"user"} label={"Nom"} error={errors.nom}>
                                <Input placeholder={"Nom"} onChange={(value) => setUser({...user, nom: value})} value={user.nom} required={true} type={"text"}/>
                            </FormGroup>
                            <FormGroup icone={"user"} label={"Prenom"} error={errors.prenom}>
                                <Input placeholder={"Prenom"} onChange={(value) => setUser({...user, prenom: value})} value={user.prenom} required={false} type={"text"}/>
                            </FormGroup>
                        </div>
                        <FormGroup icone={"at"} label={"Nom d'utilisateur"} error={errors.username}>
                            <Input placeholder={"Haki_user"} onChange={(value) => setUser({...user, username: value})} value={user.username} required={true} type={"text"}/>
                        </FormGroup>
                        <FormGroup icone={"envelope"} label={"E-mail"} error={errors.email}>
                            <Input placeholder={"E-mail"} onChange={(value) => setUser({...user, email: value})} value={user.email} required={false} type={"text"}/>
                        </FormGroup>
                        <FormGroup icone={"phone"} label={"Téléphone"} error={errors.phone}>
                            <Input placeholder={"Téléphone"} onChange={(value) => setUser({...user, phone: value})} value={user.phone} required={false} type={"text"}/>
                        </FormGroup>
                        {errors.message ? (
                            <Alert icone={"exclamation-triangle"} type={"error"} message={errors.message} />
                        ) : null}

                        <p style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px"}} class="auth-footer">
                            <label class="checkbox-label">
                                <input type="checkbox" required />
                                <span>J'accepte les <a href="/condition" target="_blank">conditions d'utilisation</a> et <a href="/confidentialite" target="_blank">la politique de confidentialité</a>.</span>
                            </label>
                        </p>
                        <Button label={"Suivant"} type={"button"} onClick={verifStep1} variant={"primary"} size="block" loader={loaderVisible} />
                    </>
                    :activePart == 2 ?
                    <>
                        <h3 style={{textAlign: "center", marginTop: "4px", fontSize: "0.9rem"}}>Confirmation de l'adresse mail</h3>
                        <p style={{textAlign: "center", marginTop: "4px", fontSize: "0.9rem", color: "var(--text-muted)"}}>Veuillez saisir le code à 6 chiffres envoyé à <strong>{user.email}</strong>.</p>
                        <FormGroup icone={"envelope"} label={"Code de confirmation"} error={errors.code}>
                            <Input placeholder={"Code de confirmation"} onChange={(value) => setUser({...user, code: value})} value={user.code} required={true} type={"text"}/>
                        </FormGroup>
                        <Button label={"Confirmer"} type={"button"} onClick={verifStep2} variant={"primary"} size="block" loader={loaderVisible} />
                    </>
                    :
                    activePart === 3 ?
                        <>
                            <h4 style={{textAlign: "center", marginTop: "4px", fontSize: "0.9rem"}}>Confirmer votre mot de passe</h4>
                            <p style={{textAlign: "center", marginTop: "4px", fontSize: "0.9rem", color: "var(--text-muted)"}}>Choisissez un mot de passe sécurisé.</p>
                            <div className="form-row"> 
                                <FormGroup icone={"lock"} label={"Mot de passe"} error={errors.mdp}>
                                    <Input placeholder={"Mot de passe"} onChange={(value) => setUser({...user, mdp: value})} value={user.mdp} required={true} type={visiblemdp?"text":"password"} button={visiblemdp?"Masquer":"Afficher"} onClick={() => setVisiblemdp(!visiblemdp)} />
                                </FormGroup>
                                <FormGroup icone={"lock"} label={"Confirmation du mot de passe"} error={errors.confirm_mdp}>
                                    <Input placeholder={"Confirmation du mot de passe"} onChange={(value) => setUser({...user, confirm_mdp: value})} value={user.confirm_mdp} required={true} type={visibleconfirmmdp?"text":"password"} button={visibleconfirmmdp?"Masquer":"Afficher"} onClick={() => setVisibleconfirmmdp(!visibleconfirmmdp)} />
                                </FormGroup>
                            </div>
                            <Button label={"Suivant"} type={"button"} onClick={verifStep3} variant={"primary"} size="block" loader={loaderVisible} />
                        </>
                        :
                        <>
                            <h4 style={{textAlign: "center", marginTop: "4px", fontSize: "0.9rem"}}>Configuration</h4>
                            <h5 style={{textAlign: "center", marginTop: "4px", fontSize: "0.9rem"}}>{user.prenom} {user.nom}, votre compte est presque prêt.</h5>
                            <p style={{textAlign: "center", marginTop: "4px", fontSize: "0.9rem", color: "var(--text-muted)"}}>{user.categorie && categorieUtilisateur.find((categorie) => categorie.categorieutilisateurid == user.categorie).organisation ? "Configurer votre organisation" : "Configurer votre profile"}</p>
                            {user.organisation && 
                                <>
                                    <div className="flex-row">
                                        <FormGroup icone={"building"} label={"Designation"} error={errors.designation} >
                                            <Input placeholder={"Designation"} onChange={(value) => setOrganisme({...organisme, designation: value})} value={organisme.designation} required={true} type={"text"}/>
                                        </FormGroup>
                                        <FormGroup icone={"tag"} label={"Sigle"} error={errors.sigle} >
                                            <Input placeholder={"Sigle"} onChange={(value) => setOrganisme({...organisme, sigle: value})} value={organisme.sigle} required={true} type={"text"}/>
                                        </FormGroup>
                                    </div>
                                    <div className="flex-row">
                                        <FormGroup icone={"building"} label={"Categorie d'organisation"} error={errors.categorie} >
                                            <Select options={listTypeOrganisation.map((item) => {return {label: item.libelle, value: item.typeorganisationid}})} value={organisme.typeorganisationid} onChange={(value) => setOrganisme({...organisme, typeorganisationid: value})} placeholder={"Categorie"} required={true} />
                                        </FormGroup>
                                        <FormGroup icone={"globe"} label={"Pays"} error={errors.pays} >
                                            <Select options={Object.entries(countryList).map(([key, value]) => {return {label: value, value: key}})} value={organisme.pays} onChange={(value) => setOrganisme({...organisme, pays: value})} placeholder={"Pays"} required={true} />
                                        </FormGroup>
                                    </div>
                                    <div className="flex-row">
                                        <FormGroup icone={"phone"} label={"Contact"} error={errors.contact} >
                                            <Input placeholder={"Contact"} onChange={(value) => setOrganisme({...organisme, contact: value})} value={organisme.contact} required={true} type={"tel"} />
                                        </FormGroup>
                                        <FormGroup icone={"envelope"} label={"Adresse email"} error={errors.email} >
                                            <Input placeholder={"Adresse email"} onChange={(value) => setOrganisme({...organisme, email: value})} value={organisme.email} required={true} type={"email"} />
                                        </FormGroup>
                                    </div>
                                    <div className="flex-row">
                                        <FormGroup icone={"map-marker"} label={"Ville"} error={errors.ville} >
                                            <Input placeholder={"Ville"} onChange={(value) => setOrganisme({...organisme, ville: value})} value={organisme.ville} required={true} type={"text"}/>
                                        </FormGroup>
                                        <FormGroup icone={"map-marker-alt"} label={"Province"} error={errors.province} >
                                            <Input placeholder={"Province"} onChange={(value) => setOrganisme({...organisme, province: value})} value={organisme.province} required={true} type={"text"} />
                                        </FormGroup>
                                    </div>
                                    <FormGroup icone={"map-marker"} label={"Adresse"} error={errors.adresse}>
                                        <Input placeholder={"Adresse"} onChange={(value) => setOrganisme({...organisme, adresse: value})} value={organisme.adresse} required={true} type={"text"} />
                                    </FormGroup>
                                    <FormGroup icone={"image"} label={"Logo"} >
                                        <Uploader accept={""} label={"Choisir un logo"} multiple={false} onChange={(e) => setOrganisme({...organisme, logo: e.target.files[0]})} value={organisme.logo} />
                                    </FormGroup>
                                    {organisme.logo && (
                                        <img src={URL.createObjectURL(organisme.logo)} alt="logo" style={{width: "100px", height: "100px", marginTop: "10px"}} />
                                    )}
                                </>
                            }
                            <FormGroup icone={"tasks"} label={"Domaine d'intervention"} >
                                <div className="chip-group">
                                    {domaineintervention.map((domaine) => (
                                        <button type="button" class={`chip ${configurations.domaines?.includes(domaine.categorie_id) ? "active" : ""}`} onClick={() => handleDomaineClick(domaine.categorie_id)}>{configurations.domaines?.includes(domaine.categorie_id) ? <i class="fas fa-check"></i> : <i class="fas fa-plus"></i>}{domaine.designation}</button>
                                    ))}
                                </div>
                            </FormGroup>
                            <Button label={"Terminer"} type={"button"} onClick={verifStep4} variant={"primary"} size="block" loader={loaderVisible} />
                        </>
                    }                
                    <p className="auth-footer" style={{textAlign: "center", marginTop: "24px"}}>Vous avez déjà un compte ? <a href="/">Connectez-vous</a></p>
                    <p className="auth-footer" style={{textAlign: "center", marginTop: "24px"}}>Vous préférez signaler sans compte ? <a href="/signaler">Signaler</a></p>
                </div>
            </div>
        </div>
    );
}