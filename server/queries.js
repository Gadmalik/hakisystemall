import pool from "./db.js";

export async function suivreDossier({dossierid, userid}){
    const date = new Date();
    try{
        const reponse = await pool.query("INSERT INTO attribuerdossier(userid, date, dossierid, status) VALUES ($1,$2,$3,$4)", [userid, date, dossierid, "en cours"]);
        return {status:"success", code:"success", data: reponse.rows[0]};
    }catch(error){
        console.log(error);
        return {status: "error", code:"error", error:error}
    }
    
}

export async function getDossier({userid}){
    try{
        if(userid){
            const datas = await pool.query("SELECT *, ad.status AS statusinc, catinc.designation AS categorie FROM incident inc JOIN categorie_incident catinc ON inc.categorieid=catinc.categorie_id JOIN attribuerdossier ad ON inc.id_incident=ad.dossierid WHERE ad.userid=$1 AND (ad.status != 'libre' OR ad.status != 'abandonner')", [userid]);
            return {_inc:"success", code:"success", data: datas.rows};
        }else{
            const datas = await pool.query("SELECT *, ad.status AS statusinc, catinc.designation AS categorie FROM incident inc JOIN categorie_incident catinc ON inc.categorieid=catinc.categorie_id LEFT JOIN attribuerdossier ad ON inc.id_incident=ad.dossierid WHERE ad.attribuerid IS NULL OR ad.status='libre' OR ad.status='abandonner'");
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

