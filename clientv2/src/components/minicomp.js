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

export function StatCard({ label, value, sub, icone, color = "primary", onClick }) {
    return (
        <div className={`kpi-card ${onClick ? "clickable" : ""}`} onClick={onClick} style={{ cursor: onClick ? "pointer" : "default" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                    <div className="label">{label}</div>
                    <div className="value">{value}</div>
                    {sub && <div className="sub">{sub}</div>}
                </div>
                {icone && (
                    <div style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "12px",
                        background: color === "danger" ? "#fee2e2" : color === "warning" ? "#fef3c7" : color === "success" ? "#dcfce7" : "#e0e7ff",
                        color: color === "danger" ? "#dc2626" : color === "warning" ? "#d97706" : color === "success" ? "#16a34a" : "var(--primary)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.2rem"
                    }}>
                        <i className={`fa-solid fa-${icone}`}></i>
                    </div>
                )}
            </div>
        </div>
    );
}

export function Modal({ isOpen, onClose, title, children, maxWidth = "550px" }) {
    if (!isOpen) return null;
    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px"
        }} onClick={onClose}>
            <div style={{
                background: "white",
                borderRadius: "var(--radius-lg)",
                width: "100%",
                maxWidth: maxWidth,
                maxHeight: "90vh",
                overflowY: "auto",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                border: "1px solid var(--border-color)",
                padding: "24px"
            }} onClick={(e) => e.stopPropagation()}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid var(--border-color)", paddingBottom: "12px" }}>
                    <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700, color: "var(--text-main)" }}>{title}</h3>
                    <button type="button" onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem", color: "var(--text-muted)", padding: "4px" }}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}

export function EmptyState({ icone = "inbox", title, message, actionLabel, onAction }) {
    return (
        <div style={{ padding: "40px 20px", textAlign: "center", background: "white", borderRadius: "var(--radius-md)", border: "1px dashed var(--border-color)", margin: "15px 0" }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#f1f5f9", color: "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", fontSize: "1.5rem" }}>
                <i className={`fa-solid fa-${icone}`}></i>
            </div>
            <h4 style={{ margin: "0 0 6px 0", color: "var(--text-main)" }}>{title}</h4>
            <p style={{ margin: "0 auto 16px", color: "var(--text-muted)", fontSize: "0.88rem", maxWidth: "400px" }}>{message}</p>
            {actionLabel && onAction && (
                <button type="button" className="btn btn-primary btn-sm" onClick={onAction}>
                    {actionLabel}
                </button>
            )}
        </div>
    );
}