import logo from "../assets/logo.png";
import { useNavigate, useParams } from "react-router-dom";
import { InputForm, MiniLoader, PasswordForm, SelectForm, TextAreaForm } from "../components/MiniComp";
import { useEffect, useState } from "react";

export function ConfirmInvitation () {
    const link = process.env.REACT_APP_LINK;
    const navigate = useNavigate();
    const { code, email } = useParams();
    const [loaderVisible, setLoaderVisible] = useState(false);
    const [visiblemdp, setVisiblemdp] = useState(false);
    const [activePart, setActivePart] = useState(1);
    const [visiblemdp2, setVisiblemdp2] = useState(false);
    const [userRegister, setUserRegister] = useState({
        userid: "",
        mdp:"",
        confirm_mdp:""
    });
    const [error, setError] = useState({
        mdp: "",
        confirm_mdp: ""
    });

    const verifInfosInvitation = async () => {
        await fetch(`${link}/user/code`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                code: code,
                email: email
            })
        }).then((reponse) => reponse.json()).then(async(data) => {
            if(data.status === "success") {
                setUserRegister({...userRegister, userid: data.data.userid});
                setActivePart(2);
            }else{
                setError({...error, message: data.message});
                setTimeout(() => {
                    setError({});
                }, 8000);
            }
        }).catch((error) => {
            console.log(error);
            setError({ message: "Une erreur s'est produite" });
            setTimeout(() => {
                setError({});
            }, 8000);
        })
    }
    const setMdp = async (event) => {
        event.preventDefault();
        setError({});
        if (userRegister.mdp !== userRegister.confirm_mdp) {
            setError({...error, mdp: "Les mots de passe ne correspondent pas", confirm_mdp: "Les mots de passe ne correspondent pas"});
            return;
        }
        if(userRegister.mdp.length < 8) {
            setError({...error, mdp: "Le mot de passe doit contenir au moins 8 caracteres", confirm_mdp: "Le mot de passe doit contenir au moins 8 caracteres"});
            return;
        }
        setLoaderVisible(true);
        try {
            const response = await fetch(`${link}/user/mdp`, {
                method: "PUT",
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

            if (data.success) {
                alert("Compte configuré avec succes");
                console.log(data.data);
                localStorage.setItem("userinfo", JSON.stringify(data.data));
                navigate("/home");
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
        if(code && email){
            verifInfosInvitation();
        }else{
            setError({message:"Code ou email invalide"});
            setTimeout(() => {
                setError({});
                navigate("/login");
            }, 8000);
        }
    }, [code, email]);
    return (
        <div className="container">
            <div className="register-section">
                <div className="login-header">
                    <img src={logo} alt="logo" className="logo" />
                    <h4>HAKI SYSTEM</h4>
                    <p>Activation de votre compte</p>
                </div>
                <div class="stepper-container">
                    <div class="stepper">
                        <div class="stepper-progress" id="progress" style={{width: `${(activePart - 1) * 100}%`}}></div>

                        <div class={`step ${activePart == 1 ? 'active' : activePart > 1 ? 'completed' : ''}`}>
                            <div class="step-number">{activePart > 1 ? '✓' : 1}</div>
                            <div class="step-label">Vérification</div>
                        </div>
                        <div class={`step ${activePart == 2 ? 'active' : activePart > 2 ? 'completed' : ''}`}>
                            <div class="step-number">{activePart > 2 ? '✓' : 2}</div>
                            <div class="step-label">Mot de passe</div>
                        </div>
                    </div>
                </div>
                <form id="userForm" onSubmit={(event) => setMdp(event)}>
                    <div className={`${activePart == 1 ? 'active' : 'hidden'}`}>
                        {/* spinner */}
                        <div align="center"><MiniLoader color="#3F3C8D" size={30} /></div>
                    </div>
                    <div className={`${activePart == 2 ? 'active' : 'hidden'}`}>
                        <div class="modal-form-grid">
                            <PasswordForm value={userRegister.mdp} onchange={(value) => setUserRegister({...userRegister, mdp: value})} placeholder="Minimum 8 caractères" label="Mot de passe" id="mdp" require={true} error={error.mdp} visiblemdp={visiblemdp} setVisiblemdp={setVisiblemdp} icon="lock"/>
                            
                            <PasswordForm value={userRegister.confirm_mdp} onchange={(value) => setUserRegister({...userRegister, confirm_mdp: value})} placeholder="Confirmer le mot de passe" label="Confirmer le mot de passe" id="confirm_mdp" require={true} error={error.confirm_mdp} visiblemdp={visiblemdp2} setVisiblemdp={setVisiblemdp2} icon="lock"/>
                        </div>
                        <div align="center">
                            <button type="submit" class="btn btn-primary"><i class={`fas fa-${loaderVisible ? 'spinner fa-pulse fa-fw loader-text' : 'save'}`}></i> Enregistrer</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}