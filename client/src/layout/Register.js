import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { InputForm, MiniLoader, PasswordForm, SelectForm, TextAreaForm } from "../components/MiniComp";
import { useEffect, useState } from "react";

export function Register () {
    const link = process.env.REACT_APP_LINK;
    const navigate = useNavigate();
    const [loaderVisible, setLoaderVisible] = useState(false);
    const [visiblemdp, setVisiblemdp] = useState(false);
    const [activePart, setActivePart] = useState(1);
    const [visiblemdp2, setVisiblemdp2] = useState(false);
    const [userRegister, setUserRegister] = useState({
        nom: "",
        prenom: "",
        telephone: "",
        email: "",
        mdp: "",
        confirm_mdp: "",
        nom_utilisateur: "",
        categorie: "",
        adresse: "",
        code:""
    });
    const [categorieUtilisateur, setCategorieUtilisateur] = useState([]);
    const [error, setError] = useState({
        nom: "",
        prenom: "",
        telephone: "",
        email: "",
        mdp: "",
        confirm_mdp: "",
        nom_utilisateur: "",
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
    const inscrire = async (event) => {
        event.preventDefault();
        setLoaderVisible(true);
        try {
            // verifier que le username n'as pas d'espace et les mdp ont plus de 8 charactere 
            if(userRegister.nom_utilisateur.includes(" ")) {
                setError({...error, nom_utilisateur: "Le nom d'utilisateur ne peut pas contenir d'espace"});
                return;
            }
            await fetch(`${link}/user`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nom: userRegister.nom,
                    prenom: userRegister.prenom,
                    phone: userRegister.telephone,
                    email: userRegister.email,
                    mdp: userRegister.mdp,
                    mdp2: userRegister.confirm_mdp,
                    username: userRegister.nom_utilisateur,
                    categorie: userRegister.categorie,
                    adresse: userRegister.adresse,
                }),
            }).then((reponse) => reponse.json()).then(async(data) => {
                
                if(data.status === "success") {
                    navigate("/login");
                }else{
                    setError({...error, message: data.message});
                    if(data.code == 'username_used'){
                        setError({...error, nom_utilisateur: "Le nom d'utilisateur est deja utilisé"});
                        setUserRegister({...userRegister, nom_utilisateur: ""});
                    }else if(data.code == 'email_used'){
                        setError({...error, email: "L'email est deja utilisé"});
                        setUserRegister({...userRegister, email: ""});
                    }else if(data.code == 'phone_used'){
                        setError({...error, telephone: "Le numero de telephone est deja utilisé"});
                        setUserRegister({...userRegister, telephone: ""});
                    }else if(data.code == 'password_mismatch'){
                        setError({...error, mdp: "Les mots de passe ne correspondent pas", confirm_mdp: "Les mots de passe ne correspondent pas"});
                        setUserRegister({...userRegister, mdp: "", confirm_mdp: ""});
                    }
                }

                setLoaderVisible(false);
                setVisiblemdp(false);
                setVisiblemdp2(false);
                setTimeout(() => {
                    setError({});
                }, 8000);
            }).catch((error) => {
                console.log(error);
                setError("Une erreur s'est produite");
                setLoaderVisible(false);
                setVisiblemdp(false);
                setVisiblemdp2(false);
                setTimeout(() => {
                    setError("");
                }, 8000);
            })
        } catch (error) {
            console.log(error);
        }
    }
    const verifStep1 = async () => {
        const newErrors = {};
        if (!userRegister.nom.trim()) newErrors.nom = "Le nom est requis";
        if (!userRegister.prenom.trim()) newErrors.prenom = "Le prénom est requis";
        if (!userRegister.telephone.trim()) newErrors.telephone = "Le téléphone est requis";
        if (!userRegister.email.trim()) newErrors.email = "L'email est requis";
        if (!userRegister.nom_utilisateur.trim()) newErrors.nom_utilisateur = "Le nom d'utilisateur est requis";
        if (!userRegister.categorie.trim()) newErrors.categorie = "La catégorie est requise";
        if (!userRegister.adresse.trim()) newErrors.adresse = "L'adresse est requise";

        if (userRegister.nom_utilisateur.trim() && userRegister.nom_utilisateur.includes(" ")) {
            newErrors.nom_utilisateur = "Le nom d'utilisateur ne peut pas contenir d'espace";
        }
        if (Object.keys(newErrors).length > 0) {
            setError(newErrors);
            return;
        }

        setError({});
        setLoaderVisible(true);
        try {
            const response = await fetch(`${link}/user`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nom: userRegister.nom,
                    prenom: userRegister.prenom,
                    phone: userRegister.telephone,
                    email: userRegister.email,
                    username: userRegister.nom_utilisateur,
                    categorie: userRegister.categorie,
                    adresse: userRegister.adresse,
                }),
            });

            const data = await response.json();
            console.log(data);

            if (data.status === "success") {
                setActivePart(2);
            } else {
                const serverErrors = { message: data.message };

                if (data.code === 'username_used') {
                    serverErrors.nom_utilisateur = "Le nom d'utilisateur est déjà utilisé";
                    setUserRegister(prev => ({ ...prev, nom_utilisateur: "" }));
                } else if (data.code === 'email_used') {
                    serverErrors.email = "L'email est déjà utilisé";
                    setUserRegister(prev => ({ ...prev, email: "" }));
                } else if (data.code === 'phone_used') {
                    serverErrors.telephone = "Le numéro de téléphone est déjà utilisé";
                    setUserRegister(prev => ({ ...prev, telephone: "" }));
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
    };
    const verifStep2 = async () => {
        const newErrors = {};
        if(!userRegister.code.trim()) newErrors.code = "Veuillez saisr le code";
        if (Object.keys(newErrors).length > 0) {
            setError(newErrors);
            return;
        }

        setError({});
        setLoaderVisible(true);
        try {
            const response = await fetch(`${link}/user/code`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    code: userRegister.code,
                    email: userRegister.email,
                }),
            });

            const data = await response.json();
            console.log(data);

            if (data.status === "success") {
                console.log(data)
                setActivePart(3);
                setUserRegister(prev => ({ ...prev, userid: data.data.userid }));
            } else {
                const serverErrors = { message: data.message };

                if (data.code === 'code_invalid') {
                    serverErrors.code = "Le code est invalide";
                    setUserRegister(prev => ({ ...prev, code: "" }));
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

    const verifStep3 = async () => {
        const newErrors = {};
        if(userRegister.mdp.length < 8) {
            newErrors.mdp = "Le mot de passe doit contenir au moins 8 caractères";
        }
        if(userRegister.confirm_mdp.length < 8) {
            newErrors.confirm_mdp = "Le mot de passe doit contenir au moins 8 caractères";
        }
        if(userRegister.mdp !== userRegister.confirm_mdp) {
            newErrors.mdp = "Les mots de passe ne correspondent pas";
            newErrors.confirm_mdp = "Les mots de passe ne correspondent pas";
        }
        if(Object.keys(newErrors).length > 0) {
            setError(newErrors);
            return;
        }
        setError({});
        setLoaderVisible(true);
        try {
            const response = await fetch(`${link}/user/mdp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    mdp: userRegister.mdp,
                    userid: userRegister.userid,
                }),
            });

            const data = await response.json();
            console.log(data);

            if (data.status === "success") {
                console.log(data)
                alert("Inscription reussie")
                navigate("/login");
            } else {
                const serverErrors = { message: data.message };

                if (data.code === 'mdp_invalid') {
                    serverErrors.mdp = "Le mot de passe est invalide";
                    setUserRegister(prev => ({ ...prev, mdp: "" }));
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
        loadCategorieUtilisateur();
    }, []);
    return (
        <div className="container">
            <div className="register-section">
                <div className="login-header">
                    <img src={logo} alt="logo" className="logo" />
                    <h4>HAKI SYSTEM</h4>
                    <p>S'inscrire</p>
                </div>
                <div class="stepper-container">
                    <div class="stepper">
                        <div class="stepper-progress" id="progress" style={{width: `${(activePart - 1) * 50}%`}}></div>

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
                    </div>
                </div>
                <form id="userForm" onSubmit={(event) => inscrire(event)}>
                    <div className={`${activePart == 1 ? 'active' : 'hidden'}`}>
                        <div class="modal-form-grid">
                            <InputForm value={userRegister.nom} onchange={(value) => setUserRegister({...userRegister, nom: value})} placeholder="Ex: Curie" type="text" label="Nom" id="nom" require={true} error={error.nom} icon="user"/>
                            
                            <InputForm value={userRegister.prenom} onchange={(value) => setUserRegister({...userRegister, prenom: value})} placeholder="Ex: Marie" type="text" label="Prenom" id="prenom" require={true} error={error.prenom} icon="user"/>
                            
                            <InputForm value={userRegister.telephone} onchange={(value) => setUserRegister({...userRegister, telephone: value})} placeholder="Ex: 243 812 345 678" type="tel" label="Téléphone" id="telephone" require={true} error={error.telephone} icon="phone"/>
                            
                            <InputForm value={userRegister.email} onchange={(value) => setUserRegister({...userRegister, email: value})} placeholder="Ex: marie.curie@example.com" type="email" label="Email" id="email" require={true} error={error.email} icon="envelope"/>
                            
                            <InputForm value={userRegister.nom_utilisateur} onchange={(value) => setUserRegister({...userRegister, nom_utilisateur: value})} placeholder="Ex: mariecurie" type="text" label="Nom d'utilisateur" id="nom_utilisateur" require={true} error={error.nom_utilisateur} icon="user"/>
                            
                            <SelectForm value={userRegister.categorie} onchange={(value) => setUserRegister({...userRegister, categorie: value})} placeholder="Ex: Juriste" type="text" label="Catégorie" id="categorie" require={true} error={error.categorie} options={categorieUtilisateur.map((cu) => ({value:cu.categorieutilisateurid, label:cu.designation}))} icon="user-tag"/>
                            
                            <TextAreaForm value={userRegister.adresse} onchange={(value) => setUserRegister({...userRegister, adresse: value})} placeholder="Ex: 123 Rue de la Paix" label="Adresse" id="adresse" require={true} error={error.adresse} rows={3} icon="map-marker"/>
                        </div>
                        <div align="right">
                            <button type="button" class="btn btn-primary" onClick={() => verifStep1()}>Suivant <i class="fas fa-arrow-right"></i></button>
                        </div>
                    </div>
                    <div className={`${activePart == 2 ? 'active' : 'hidden'}`}>
                        <p className="text-details">Un code de confirmation a été envoyé à votre adresse email ({userRegister.email}). Veuillez entrer le code pour continuer.</p>
                        <div class="modal-form-grid">
                            <InputForm value={userRegister.code} onchange={(value) => setUserRegister({...userRegister, code: value})} placeholder="Code de confirmation" type="text" label="Code de confirmation" id="code" require={true} error={error.code} icon="key"/>
                        </div>
                        <div align="right">
                            <button type="button" class="btn btn-primary" onClick={() => verifStep2()}>Suivant <i class="fas fa-arrow-right"></i></button>
                        </div>
                    </div>
                    <div className={`${activePart == 3 ? 'active' : 'hidden'}`}>
                        <div class="modal-form-grid">
                            <PasswordForm value={userRegister.mdp} onchange={(value) => setUserRegister({...userRegister, mdp: value})} placeholder="Minimum 8 caractères" label="Mot de passe" id="mdp" require={true} error={error.mdp} visiblemdp={visiblemdp} setVisiblemdp={setVisiblemdp} icon="lock"/>
                            
                            <PasswordForm value={userRegister.confirm_mdp} onchange={(value) => setUserRegister({...userRegister, confirm_mdp: value})} placeholder="Confirmer le mot de passe" label="Confirmer le mot de passe" id="confirm_mdp" require={true} error={error.confirm_mdp} visiblemdp={visiblemdp2} setVisiblemdp={setVisiblemdp2} icon="lock"/>
                        </div>
                        <div align="center">
                            <button type="button" class="btn btn-primary" onClick={() => verifStep3()}><i class="fas fa-save"></i> Enregistrer</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}