import pool from "./db.js";

export async function suivreDossier({dossierid, userid, commentaire, type, status, organisationid, orientationid}){
    const date = new Date();
    try{
        const verif = await verifStatus(dossierid, type || "prise")
        console.log(verif);
        if(verif.status === "error"){
            return verif;
        }
        if(orientationid){
            const updateOrientation = await pool.query("UPDATE attribuerdossier SET status='accepté', date=$1 WHERE attribuerid=$2", [date, orientationid])
        }
        const reponse = await pool.query("INSERT INTO attribuerdossier(userid, date, dossierid, commentaire, type, organisationid, status) VALUES ($1, $2, $3, $4, $5, $6, $7)", [userid, date, dossierid, commentaire || null, type || "prise", organisationid || null, status || "en cours"]);
        return {status:"success", code:"success", data: reponse.rows[0]};
    }catch(error){
        console.log(error);
        return {status: "error", code:"error", error:error}
    }
    
}

export async function verifStatus(dossierid, type){
    try{
        const datas = await pool.query("SELECT * FROM attribuerdossier WHERE dossierid=$1 AND status != 'refusé' AND status != 'abandonné' AND type=$2", [dossierid, type]);
        if(datas.rowCount === 0){
            return {status: "success", code:"success", data: datas.rows[0]};
        }else{
            return {status: "error", code:"error", message:`Dossier déjà ${datas.rows[0]?.type == "prise" ? "attribué" : "orienté"}`};
        }
    }catch(error){
        console.log(error);
        return {status: "error", code:"error", error:error}
    }
}

export async function getDossier({userid, limit}){
    try{
        if(userid){
            const datas = await pool.query("SELECT *, ad.status AS statusinc, catinc.designation AS categorie FROM incident inc JOIN categorie_incident catinc ON inc.categorieid=catinc.categorie_id JOIN attribuerdossier ad ON inc.id_incident=ad.dossierid WHERE ad.userid=$1 AND (ad.status != 'refusé' OR ad.status != 'abandonné')", [userid]);
            return {_inc:"success", code:"success", data: datas.rows};
        }else{
            let  additionnal = "";
            if(limit){
                additionnal = `limit ${limit}`;
            }
            const datas = await pool.query("SELECT *, ad.status AS statusinc, catinc.designation AS categorie FROM incident inc JOIN categorie_incident catinc ON inc.categorieid=catinc.categorie_id LEFT JOIN attribuerdossier ad ON (inc.id_incident=ad.dossierid AND (ad.status='en cours' OR ad.status= 'en attente' OR ad.status='résolu')) WHERE ad.status IS NULL "+additionnal);
            return {_inc:"success", code:"success", data: datas.rows};
        }
    }catch(error){
        console.log(error);
        return {status: "error", code:"error", error:error}
    }
}

export async function setEtatAttribut({attribuerid, status}){
    try{
        const reponse = await pool.query("UPDATE attribuerdossier SET status=$1 WHERE attribuerid=$2", [status, attribuerid]);
        return {status:"success", code:"success", data: reponse.rows[0]};
    }catch(error){
        console.log(error);
        return {status: "error", code:"error", error:error}
    }
}
export async function addArticle({titre, contenu, piecesJointe, typepiece, userid}){
    try{
        const date_create = new Date().toISOString().split('T')[0];
        const reponse = await pool.query("INSERT INTO article(titre, contenu, piecesjointes, typepiece, date_create,userid) VALUES($1, $2, $3, $4, $5, $6)", [titre, contenu, piecesJointe, typepiece, date_create, userid]);
        return {status:"success", code:"success", data: reponse.rows[0]};
    }catch(error){
        console.log(error);
        return {status: "error", code:"error", error:error}
    }
}

export async function getArticle({articleid, filter}){
    try{
        if(articleid){
            if(filter == "user"){
                const datas = await pool.query("SELECT * FROM article JOIN utilisateurs ON article.userid=utilisateurs.userid WHERE utilisateurs.userid=$1", [articleid]);
                return {status:"success", code:"success", data: datas.rows};
            }else{
                const datas = await pool.query("SELECT * FROM article JOIN utilisateurs ON article.userid=utilisateurs.userid WHERE articleid=$1", [articleid]);
                return {status:"success", code:"success", data: datas.rows[0]};
            }
        }else{
            const datas = await pool.query("SELECT * FROM article JOIN utilisateurs ON article.userid=utilisateurs.userid");
            return {status:"success", code:"success", data: datas.rows};
        }
    }catch(error){
        console.log(error);
        return {status: "error", code:"error", error:error}
    }
}

export async function getUser({username}){
    try{
        const datas = await pool.query("SELECT * FROM utilisateurs WHERE username=$1", [username]);
        return {status:"success", code:"success", data: datas.rows[0]};
    }catch(error){
        console.log(error);
        return {status: "error", code:"error", error:error}
    }
}

export async function updateProfile({username, noms, adresse, phone, email, password, oldPassword}){
    try{
        const datas = await pool.query("SELECT * FROM utilisateurs WHERE username=$1", [username]);
        if(datas.rowCount === 0){
            return {status: "error", code:"error", message:"Utilisateur non trouvé !"};
        }
        if(datas.rows[0].mdp !== oldPassword){
            return {status: "error", code:"error", message:"Ancien mot de passe incorrecte !"};
        }

        const reponse = await pool.query("UPDATE utilisateurs SET noms=$1, adresse=$2, phone=$3, email=$4, mdp=$5 WHERE userid=$6", [noms, adresse, phone, email, password, datas.rows[0].userid]);
        return {status:"success", code:"success", data: reponse.rows[0]};
    }catch(error){
        console.log(error);
        return {status: "error", code:"error", error:error}
    }
}


