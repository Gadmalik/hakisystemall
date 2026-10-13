import { Alert, Button, FormGroup, Input } from "../components/minicomp";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function Inscription() {
    const [user, setUser] = useState({
        nom: "",
        prenom: "",
        username: "",
        mdp: "",
        email: "",
        phone: "",
        confirmmdp: "",
        categorieutilisateurid: ""
    });
    const [visiblemdp, setVisiblemdp] = useState(false);
    const [errors, setErrors] = useState({
        nom: "",
        username: "",
        mdp: "",
        email: "",
        confirmmdp: ""
    });
    const [visibleconfirmmdp, setVisibleconfirmmdp] = useState(false);
    const [loaderVisible, setLoaderVisible] = useState(false);
    const navigate = useNavigate();
    const link = process.env.REACT_APP_LINK;

    const getDefaultCategorieUtilisateur = async () => {
        const response = await fetch(`${link}/getdefaultcategorieutilisateur`);
        const data = await response.json();
        console.log(data, "");
        if(data.success){
            setUser({...user, categorieutilisateurid: data.data.categorieutilisateurid});
        }
    }

    const inscrire = async (event) => {
        event.preventDefault();

        setErrors({
            nom: "",
            username: "",
            mdp: "",
            confirmmdp: ""
        });
        if (!user.nom || !user.username || !user.mdp || !user.confirmmdp) {
            setErrors({
                nom: !user.nom ? "Le nom est requis" : "",
                username: !user.username ? "Le nom d'utilisateur est requis" : "",
                mdp: !user.mdp ? "Le mot de passe est requis" : "",
                confirmmdp: !user.confirmmdp ? "La confirmation du mot de passe est requise" : ""
            });
            return;
        }
        if(user.username.includes(" ")){
            setErrors({...errors, username: "Le nom d'utilisateur ne doit pas contenir d'espace"});
            return;
        }
        if(user.mdp.length < 6){
            setErrors({...errors, mdp: "Le mot de passe doit contenir au moins 6 caracteres"});
            return;
        }
        if(user.mdp !== user.confirmmdp){
            setErrors({...errors, mdp: "Les mots de passe ne correspondent pas", confirmmdp: "Les mots de passe ne correspondent pas"});
            return;
        }
        try {
            const response = await fetch(`${link}/user`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });

            const data = await response.json();

            if (data.status === "success") {
                if(data.data){
                    const resp_user = await fetch(`${link}/user/${data.data.userid}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
                    const data_user = await resp_user.json();
                    if(data_user.status === "success"){
                        console.log(data_user.data);
                        localStorage.setItem("user", JSON.stringify(data_user.data));
                        navigate("/home");
                    }
                }
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

                setErrors({...errors, ...serverErrors});
            }
        } catch (err) {
            console.error(err);
            setErrors({...errors, message: "Une erreur s'est produite" });
        }
        setLoaderVisible(false);
    }

    useEffect(() => {
        getDefaultCategorieUtilisateur();
    }, []);
    return (
        
        <div class="auth-container">
            <div class="auth-sidebar">
                <div class="logo">
                    <div class="logo-icon">H</div> HAKI System
                </div>
                <h2>Créez votre compte, à votre rythme.</h2>
                <p>Un compte vous permet de suivre vos signalements et d'en faire d'autres. Vous pouvez utiliser un pseudo.</p>
                <ul>
                    <li>Pas besoin de donner votre vrai nom</li>
                    <li>Vous pouvez supprimer votre compte à tout moment</li>
                    <li>Le mode anonyme reste disponible</li>
                </ul>
            </div>
            <div className="auth-form" style={{overflowY: "auto", padding: "10px"}}>
                <form style={{maxWidth: "550px", background: "white", padding: "24px", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-color)", margin:"auto"}} onSubmit={inscrire}>
                    <h1 style={{textAlign: "center"}}>Créer un compte</h1>
                    <p style={{textAlign: "center", marginTop: "4px", fontSize: "0.9rem", color: "var(--text-muted)"}}>Quelques informations suffisent.</p>
                    <br />
                    <div className="form-row">  
                        <FormGroup icone={"user"} label={"Nom ou pseudo"} error={errors.nom}>
                            <Input placeholder={"Nom ou pseudo"} onChange={(value) => setUser({...user, nom: value})} value={user.nom} required={true} type={"text"}/>
                        </FormGroup>
                        <FormGroup icone={"user"} label={"Prenom (optionnel)"} error={errors.prenom}>
                            <Input placeholder={"Prenom"} onChange={(value) => setUser({...user, prenom: value})} value={user.prenom} required={false} type={"text"}/>
                        </FormGroup>
                    </div>
                    <FormGroup icone={"at"} label={"Nom d'utilisateur"} error={errors.username}>
                        <Input placeholder={"Haki_user"} onChange={(value) => setUser({...user, username: value})} value={user.username} required={true} type={"text"}/>
                    </FormGroup>
                    <FormGroup icone={"envelope"} label={"E-mail (optionnel)"} error={errors.email}>
                        <Input placeholder={"E-mail"} onChange={(value) => setUser({...user, email: value})} value={user.email} required={false} type={"text"}/>
                    </FormGroup>
                    <FormGroup icone={"phone"} label={"Téléphone (optionnel)"} error={errors.phone}>
                        <Input placeholder={"Téléphone"} onChange={(value) => setUser({...user, phone: value})} value={user.phone} required={false} type={"text"}/>
                    </FormGroup>
                    <div className="form-row"> 
                        <FormGroup icone={"lock"} label={"Mot de passe"} error={errors.mdp}>
                            <Input placeholder={"Mot de passe"} onChange={(value) => setUser({...user, mdp: value})} value={user.mdp} required={true} type={visiblemdp?"text":"password"} button={visiblemdp?"Masquer":"Afficher"} onClick={() => setVisiblemdp(!visiblemdp)} />
                        </FormGroup>
                        <FormGroup icone={"lock"} label={"Confirmation du mot de passe"} error={errors.mdp}>
                            <Input placeholder={"Confirmation du mot de passe"} onChange={(value) => setUser({...user, confirmmdp: value})} value={user.confirmmdp} required={true} type={visibleconfirmmdp?"text":"password"} button={visibleconfirmmdp?"Masquer":"Afficher"} onClick={() => setVisibleconfirmmdp(!visibleconfirmmdp)} />
                        </FormGroup>
                    </div>

                    {errors.message ? (
                        <Alert icone={"exclamation-triangle"} type={"error"} message={errors.message} />
                    ) : null}

                    <p style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px"}} class="auth-footer">
                        <label class="checkbox-label">
                            <input type="checkbox" required />
                            <span>J'accepte les <a href="/condition" target="_blank">conditions d'utilisation</a> et <a href="/confidentialite" target="_blank">la politique de confidentialité</a>.</span>
                        </label>
                    </p>
                    <Button label={"Créer mon compte"} type={"submit"} variant={"primary"} size="block" loader={loaderVisible} />
                    <p className="auth-footer" style={{textAlign: "center", marginTop: "24px"}}>Vous avez déjà un compte ? <a href="/">Connectez-vous</a></p>
                    <p className="auth-footer" style={{textAlign: "center", marginTop: "24px"}}>Vous préférez signaler sans compte ? <a href="/signaler">Signaler</a></p>
                </form>
            </div>
        </div>
    );
}