import pool from "../db.js";

export async function AddSignalement(data){
    try{
        const reponse = await pool.query("INSERT INTO incident(categorieid, lieu, description, date_incident, date_create, userid, status) VALUES($1, $2, $3, $4, $5, $6, $7)", [parseInt(data.type), data.lieu, data.description, data.date, data.date_create, data.userid, "actif"]);
        return {data: reponse.rows[0], status:"success", code:"success"};
    }catch(error){
        console.log(error);
        return {message:"Une erreur s'est produite !", status:"error", code:"", error: error};
    }
}

export async function getIncidentByUser(data){
    try{
        const reponse = await pool.query("SELECT *, att.status as statusinc FROM incident inc JOIN categorie_incident cat ON inc.categorieid = cat.categorie_id LEFT JOIN attribuerdossier att ON inc.id_incident = att.dossierid LEFT JOIN utilisateurs usr ON att.userid=usr.userid WHERE inc.userid=$1", [data.userid]);
        return {data: reponse.rows, status:"success", code:"success"};
    }catch(error){
        console.log(error);
        return {message:"Une erreur s'est produite !", status:"error", code:"", error: error};
    }
}