import pool from "../db.js";
import bcrypt from "bcrypt";

export async function AddUtilisateur(data){
    if(!data.nom || !data.prenom || !data.phone || !data.email || !data.username || !data.categorie){
        return {message:"informations de connexion insuffisant !"};
    }
    const verif_user = await VerifUsername(data);
    if(!verif_user.success){
        return verif_user;
    }
    const verif_email = await VerifEmail(data);
    if(!verif_email.success){
        return verif_email;
    }
    const verif_phone = await VerifPhone(data);
    if(!verif_phone.success){
        return verif_phone;
    }
    const verif_categorie = await getCategorieUtilisateurById(data.categorie);
    console.log(verif_categorie);
    if(!verif_categorie.success){
        return verif_categorie;
    }
    let etat = "actif";
    if(verif_categorie.data.confirm){
        etat = "en attente";
    }
    const result = await pool.query("INSERT INTO utilisateurs (nom, prenom, phone, email, username, code, etat, categorieutilisateurid, adresse,date_create) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)", [data.nom, data.prenom, data.phone, data.email, data.username, data.code, etat, data.categorie, data.adresse, data.date_create]);
    return {message:"Utilisateur ajouté avec succès !", status:"success", code:"success", success:true};
}

export async function VerifUsername(data){
    const verif_user = await pool.query("SELECT * FROM utilisateurs WHERE username = $1", [data.username]);
    if(verif_user.rows.length > 0){
        return {message:"Utilisateur deja existant !", status:"error", code:"username_used", success:false};
    }
    return {message:"Utilisateur disponible !", status:"success", code:"success", success:true};
}

export async function UpdateCodeUtilisateur(data){
    const setCode = await pool.query("UPDATE utilisateurs SET code = $1 WHERE email = $2", [data.code, data.email]);
    if(setCode.rows.length > 0){
        return {message:"Code mis à jour avec succès !", status:"success", code:"success", success:true};
    }
    return {message:"Une erreur s'est produite !", status:"error", code:"code_invalid", error: setCode, success:false};
}

export async function getUserByCode(data){
    if(!data.code || !data.email){
        return {message:"Code ou email incorrect !", status:"error", code:"code_invalid", success:false};
    }
    try{
        const result = await pool.query("SELECT * FROM utilisateurs WHERE code = $1 AND email = $2", [data.code, data.email]);
        if(result.rows.length === 0){
            return {message:"Code incorrect !", status:"error", code:"code_invalid", success:false};
        }
        return {data: result.rows[0], status:"success", code:"success", success:true};
    }catch(error){
        console.log(error);
        return {message:"Une erreur s'est produite !", status:"error", code:"code_invalid", error: error, success:false};
    }
}

export async function SetMdpUtilisateur(data){
    try{
        const hashmdp = await bcrypt.hash(data.mdp, 10);
        const verif_user = await pool.query("SELECT * FROM utilisateurs WHERE userid = $1", [data.userid]);
        if(verif_user.rows.length === 0){
            return {message:"Utilisateur introuvable !", status:"error", code:"user_not_found", success:false};
        }
        const setMdp = await pool.query("UPDATE utilisateurs SET mdp = $1, code = $2 WHERE userid=$3", [hashmdp, null, data.userid]);
        if(setMdp.rowCount > 0){
            return {message:"Mot de passe mis à jour avec succès !", status:"success", code:"success", success:true};
        }
        return {message:"Une erreur s'est produite !", status:"error", code:"code_invalid", error: setMdp, success:false};
    }catch(error){
        console.log(error);
        return {message:"Une erreur s'est produite !", status:"error", code:"code_invalid", error: error, success:false};
    }
}

export async function VerifEmail(data){
    const verif_email = await pool.query("SELECT * FROM utilisateurs WHERE email = $1", [data.email]);
    if(verif_email.rows.length > 0){
        return {message:"Email deja existant !", status:"error", code:"email_used", success:false};
    }
    return {message:"Email disponible !", status:"success", code:"success", success:true};
}

export async function VerifPhone(data){
    const verif_phone = await pool.query("SELECT * FROM utilisateurs WHERE phone = $1", [data.phone]);
    if(verif_phone.rows.length > 0){
        return {message:"Telephone deja existant !", status:"error", code:"phone_used", success:false};
    }
    return {message:"Telephone disponible !", status:"success", code:"success", success:true};
}

export function GetUtilisateur(data){
    
}

export function UpdateUtilisateur(data){
    
}

export function DeleteUtilisateur(data){
    
}

export async function addCategorieUtilisateur(data){
    try{
        const verif = await pool.query("SELECT * FROM categorie_utilisateur WHERE designation = $1", [data.designation]);
        if(verif.rows.length > 0){
            return {message:"Categorie deja existante !", status:"error", code:"categorie_used", success:false};
        }
        const result = await pool.query("INSERT INTO categorieutilisateur (designation, description, date_create) VALUES ($1, $2, $3)", [data.designation, data.description, data.date_create]);
        return {message:"Categorie ajoutée avec succès !", status:"success", code:"success", success:true};
    }catch(error){
        console.log(error);
        return {message:"Une erreur s'est produite !", status:"error", code:"", error: error, success:false};
    }
}

export async function getCategorieUtilisateur(){
    try{
        const result = await pool.query("SELECT * FROM categorieutilisateur");
        return {data: result.rows, status:"success", code:"success", success:true};
    }catch(error){
        console.log(error);
        return {message:"Une erreur s'est produite !", status:"error", code:"", error: error, success:false};
    }
}

export async function getCategorieUtilisateurById(categorieutilisateurid){
    try{
        const result = await pool.query("SELECT * FROM categorieutilisateur WHERE categorieutilisateurid = $1", [categorieutilisateurid]);
        return {data: result.rows[0], status:"success", code:"success", success:true};
    }catch(error){
        console.log(error);
        return {message:"Une erreur s'est produite !", status:"error", code:"", error: error, success:false};
    }
}

export async function login(data){
    try{
        const user = await pool.query("SELECT * FROM utilisateurs WHERE (phone = $1 OR email = $1 OR username = $1)", [data.identifiant]);
        if(user.rows.length === 0){
            return {message:"Utilisateur introuvable !", status:"error", code:"user_not_found", success:false};
        }
        const verifMdp = await bcrypt.compare(data.mdp, user.rows[0].mdp);
        if(!verifMdp){
            return {message:"Mot de passe incorrect !", status:"error", code:"mdp_invalid", success:false};
        }
        if(user.rows[0].etat === "inactif"){
            return {message:"Votre compte est inactif !", status:"error", code:"inactif", success:false};
        }else if(user.rows[0].etat === "en attente"){
            return {message:"Votre compte est en attente de validation !", status:"error", code:"en_attente", success:false};
        }
        return {data: user.rows[0], status:"success", code:"success", success:true};
    }catch(error){
        console.log(error);
        return {message:"Une erreur s'est produite !", status:"error", code:"", error: error, success:false};
    }
}