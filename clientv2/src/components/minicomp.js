import { useEffect } from "react"

export function Input({placeholder, onChange, value, disable, required, type, button, onClick}){
    return <div class={`${button && "password-wrapper"}`}>
        <input type={type} class="form-control" placeholder={placeholder} value={value} onChange={(event) => onChange(event.target.value)} disabled={disable} required={required} />
        {button && <button class="password-toggle" onClick={onClick} type="button">{button}</button>}
    </ div>
}

export function Select({ value, onChange, placeholder, type, label, id, require = true, error, options, icon }) {
    return (
        <select id={id} placeholder={placeholder} value={value} onChange={(event) => onChange(event.target.value)} required={require} className={`form-control`} >
            <option value="">{placeholder}</option>
            {options.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
            ))}
        </select>)
}

export function TextArea({placeholder, onChange, value, disable, required}){
    return <textarea class="form-control" placeholder={placeholder} value={value} onChange={(event) => onChange(event.target.value)} disabled={disable} required={required}></textarea>
}

export function Switch({value=false, onChange, disabled}){
    return <label class="switch">
                <input type="checkbox" checked={value} onChange={() => onChange(!value)} disabled={disabled} />
                <span class="slider round"></span>
            </label>
}

export function CardRadio({title, description, value, onChange, disabled=false, icone}){
    useEffect(() => {
        console.log(value);
    }, [value])
    return(<label class="radio-label">                           
            <input type="radio" name="structure" class="radio-input" checked={value} onChange={(event) => onChange(event)} disabled={disabled} />
            <span class="radio-custom"></span>
            <div class="radio-content">
                <strong>{title}</strong>
                {description && <p style={{fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "4px"}}>{description}</p>}
            </div>
        </label>)
}
export function FormGroup({icone, label, children, error}){
    return(
        <div class="form-group">
            <label><i class={`fas fa-${icone}`} style={{paddingRight: "5px", fontSize: "0.8rem"}}></i> {label}</label>
            {children}
            {error && <p style={{fontSize: "0.75rem", color: "tomato", marginTop: "2px"}}>{error}</p>}
        </div>
    )
}

export function Uploader({label, onChange, value, disable, id, accept, multiple}){
    return <div class="file-upload-zone">
        <label>
            <strong>{label}</strong>
            <p>Photo, audio, vidéo ou PDF</p>
            <input type="file" id={id} onChange={(event) => onChange(event)} disabled={disable} accept={accept} class="hidden" multiple={multiple} />
        </label>
    </div>
}

export function Button({label, onClick, type, size="sm", variant, loader, icone}){
    return <button class={`btn btn-${variant} btn-${size}`} onClick={onClick} disabled={loader} type={type}><i className={`fas fa-${loader ? "spinner fa-spin" : icone ? icone : " hidden"}`} style={{paddingRight: "5px", fontSize: "0.8rem"}} /> {label}</button>
}

export function Logo({size=30}){
    return(<img src={require("./../assets/logo.png")} alt="logo" class="logo" style={{width: `${size}px`, height: "auto"}} />);
}

export function FileCard({titre, taille, onClick, button}){
    return(
        <div class="file-item">
            <div class="file-item-left">
                <div class="file-icon"><i className="fas fa-file" style={{paddingRight: "5px", fontSize: "0.8rem"}} /></div>
                <div>
                    <strong>{titre}</strong><br />
                    <span style={{color: "var(--text-muted)", fontSize: "0.75rem"}}>{taille}</span>
                </div>
            </div>
            {button ? <button class="file-remove" onClick={onClick} type="button">{button}</button> : null}
        </div>
    )
}

export function Badge({label, type, onClick}){
    return <span class={`badge badge-${type}`} onClick={onClick}>{label}</span>
}

export function Alert({message, type, icone}){
    return (
        <div class={`alert alert-${type}`}>
            <i class={`fas fa-${icone}`}></i>
            <div>{message}</div>
        </div>
    )
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

export function MenuItem({icone, title, active, onClick, link}){
    return (<a class={`${active ? "active" : ""}`} onClick={onClick}>
                    <i className={`fas fa-${icone}`}></i>
                    <span>{title}</span>
                </a>)
}

export function ChatSuggestion({icone, title, onClick}){
    return ( <button class="chat-suggestion" onClick={onClick}>
                <i className={`fa-solid fa-${icone}`} />
                <span>{title}</span>
            </button>)
}