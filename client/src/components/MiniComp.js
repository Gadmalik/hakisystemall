import { useEffect, useState } from "react";

export function MiniLoader() {
    return <i className="fas fa-spinner fa-pulse fa-fw"></i>
}

export function Loader(){
    return (
        <div className="loader">
            <div className="loader-content">
                <i className="fas fa-spinner fa-pulse fa-fw loader-text"></i>
                <div className="loader-text">Chargement...</div>
            </div>
        </div>
    )
}

export function HeaderButton({onclick}){
    return <div align="right" className="m-10">
        <button className="btn btn-primary" onClick={onclick}><i className="fas fa-plus"></i> Ajouter</button>
    </div>;
}

export function Button({onclick, icon, category, text}){
    return <button className={`btn btn-${category}`} onClick={onclick}><i className={`fas fa-${icon}`}></i>{text}</button>
}

export function InputForm({value, onchange, placeholder, type, label, id, require=true, error, icon}){
    return <div class={`modal-form-group ${require ? 'required' : ''}`}>
        <div className="flex items-center">
            {icon && <i className={`fas fa-${icon}`}></i>}
            <label htmlFor={id}>{label}</label>
        </div>
        <input type={type} id={id} placeholder={placeholder} value={value} onChange={(event) => onchange(event.target.value)} required={require} className={`${error ? 'error' : ''}`} />
        {error && <div class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            <span> {error}</span>
        </div>}
    </div>
}

export function SelectForm({value, onchange, placeholder, type, label, id, require=true, error, options, icon}){
    return <div class={`modal-form-group ${require ? 'required' : ''}`}>
        <div className="flex items-center">
            {icon && <i className={`fas fa-${icon}`}></i>}
            <label htmlFor={id}>{label}</label>
        </div>
        <select id={id} placeholder={placeholder} value={value} onChange={(event) => onchange(event.target.value)} required={require} className={`${error ? 'error' : ''}`} >
            <option value="">Sélectionner...</option>
            {options.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
            ))}
        </select>
        {error && <div class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            <span> {error}</span>
        </div>}
    </div>
}

export function TextAreaForm({value, onchange, placeholder, label, id, require=true, error, rows=3, icon}){
    return <div class={`modal-form-group ${require ? 'required' : ''}`}>
        <div className="flex items-center">
            {icon && <i className={`fas fa-${icon}`}></i>}
            <label htmlFor={id}>{label}</label>
        </div>
        <textarea id={id} placeholder={placeholder} value={value} onChange={(event) => onchange(event.target.value)} required={require} rows={rows} className={`${error ? 'error' : ''}`}  />
        {error && <div class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            <span> {error}</span>
        </div>}
    </div>
}

export function PasswordForm({value, onchange, placeholder, label, id, require=true, error, visiblemdp, setVisiblemdp, icon}){
    return <div class={`modal-form-group ${require ? 'required' : ''}`}>
        <div className="flex items-center">
            {icon && <i className={`fas fa-${icon}`}></i>}
            <label htmlFor={id}>{label}</label>
        </div>
            <div class="password-input">
            <input type={visiblemdp ? "text" : "password"} placeholder={placeholder} required value={value} onChange={(e) => onchange(e.target.value)}  className={`${error ? 'error' : ''}`} />
            <button type="button" class="password-toggle" onClick={() => setVisiblemdp(!visiblemdp)}>
                <i className={visiblemdp ? "fas fa-eye" : "fas fa-eye-slash"}></i>
            </button>
        </div>
        {error && <div class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            <span> {error}</span>
        </div>}
    </div>
}

export function MenuItem ({activeMenu, setActiveMenu, navigate, icon, label, page}){
    return <li class="menu-item">
            <a className={activeMenu === page ? "active" : ""} data-page={page} onClick={() => {setActiveMenu(page); navigate(`/home/${page}`) }}>
                <i class={`fa-solid fa-${icon}`}></i>
                <span>{label}</span>
            </a>
        </li>
}

export function FAB({open, setOpen, options, onClickMain}){
    return (
    <div class={`fab-container ${open ? "active" : ""}`}>
        <div class="fab-options" id="fabOptions">
            {options.map((option) => (
                <button class="fab-item fab-item-help" title={option.title} onClick={option.onClick}>
                    <span class="fab-label">{option.label}</span>
                    <i class={`fas fa-${option.icon}`}></i>
                </button>
            ))}
        </div>
        <button class="fab-main" id="fabMain" aria-label="Menu d'action" onClick={onClickMain}>
            <i class="fas fa-plus fab-icon"></i>
        </button>
    </div>
    )
}

export function CardIncident({incident}){
    const [status, setStatus] = useState("");
    useEffect(() =>{
        if(incident.statusinc === "en attente"){
            setStatus("En attente");
        }else if(incident.statusinc === "en cours"){
            setStatus(`Pris en charge par : ${incident.nom} ${incident.prenom}`);
        }else if(incident.statusinc === "traiter"){
            setStatus("Traité");
        }
    },[incident])
    return (
        <div class="signalement-card">
            <div class="sig-header">
                <strong>#DOS-{new Date(incident.date_create).getFullYear()}-{incident.id_incident}</strong>
                <span class={`badge bg-${incident.niveau == "critique" || incident.niveau =="eleve" ? "danger" : "warning"}`}>Inquiétude : {incident.niveau}</span>
            </div>
            <div class="sig-body">
                <h4 class="sig-title">{incident.categorie}</h4>
                <div class="sig-info"><i class="fa-solid fa-location-dot"></i> {incident.lieu}</div>
                <div class="sig-info"><i class="fa-regular fa-calendar"></i> {(incident.date_incident)}</div>
                <p class="sig-desc">{incident.description}</p>
            </div>
            <div class="sig-footer">
                <small>Status: <span class="text-warning">{status}</span></small>
            </div>
        </div>
    )
}