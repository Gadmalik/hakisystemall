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

export async function getDossier({userid, limit, status, categorieid, niveau, search, all, libre}){
    try{
        if(userid && all !== "true" && all !== true){
            const datas = await pool.query(
                `SELECT inc.*, catinc.designation AS categorie, catinc.niveau, ad.status AS statusatt, ad.type AS type_attribut, ad.attribuerid, org.designation AS organisation_nom 
                 FROM incident inc 
                 JOIN categorie_incident catinc ON inc.categorieid=catinc.categorie_id 
                 JOIN attribuerdossier ad ON inc.id_incident=ad.dossierid 
                 LEFT JOIN organisation org ON ad.organisationid=org.organisationid
                 WHERE ad.userid=$1 AND (ad.status != 'refusé' AND ad.status != 'abandonné')
                 ORDER BY inc.id_incident DESC`,
                [userid]
            );
            const rows = datas.rows.map(r => {
                if(r.annexes && typeof r.annexes === 'string'){
                    try { r.annexes = JSON.parse(r.annexes); } catch(e){}
                }
                return r;
            });
            return {status:"success", success: true, code:"success", data: rows};
        } else if (libre === "true" || libre === true) {
            // Signalements libres : sans prise en charge active
            let whereClauses = ["NOT EXISTS (SELECT 1 FROM attribuerdossier ad2 WHERE ad2.dossierid = inc.id_incident AND ad2.status NOT IN ('abandonné','refusé'))"];
            let params = [];

            if (categorieid) {
                params.push(parseInt(categorieid, 10));
                whereClauses.push(`inc.categorieid = $${params.length}`);
            }
            if (niveau) {
                params.push(niveau.toLowerCase());
                whereClauses.push(`LOWER(catinc.niveau) = $${params.length}`);
            }
            if (search && search.trim() !== "") {
                params.push(`%${search.trim().toLowerCase()}%`);
                whereClauses.push(`(LOWER(inc.code_unique) LIKE $${params.length} OR LOWER(inc.description) LIKE $${params.length} OR LOWER(inc.lieu) LIKE $${params.length} OR LOWER(catinc.designation) LIKE $${params.length})`);
            }

            const whereStr = " WHERE " + whereClauses.join(" AND ");
            let limitStr = "";
            if (limit && parseInt(limit, 10) > 0) {
                params.push(parseInt(limit, 10));
                limitStr = ` LIMIT $${params.length}`;
            }

            const queryStr = `
                SELECT inc.*, catinc.designation AS categorie, catinc.niveau,
                    NULL AS statusatt, NULL AS type_attribut, NULL AS attribuerid, NULL AS organisation_nom,
                    NULL AS nom_gestionnaire, NULL AS prenom_gestionnaire
                FROM incident inc
                JOIN categorie_incident catinc ON inc.categorieid = catinc.categorie_id
                ${whereStr}
                ORDER BY inc.id_incident DESC
                ${limitStr}
            `;

            const datas = await pool.query(queryStr, params);
            const rows = datas.rows.map(r => {
                if(r.annexes && typeof r.annexes === 'string'){
                    try { r.annexes = JSON.parse(r.annexes); } catch(e){}
                }
                return r;
            });
            return {status:"success", success: true, code:"success", data: rows};
        } else {
            let whereClauses = [];
            let params = [];

            if (status) {
                const s = status.toLowerCase();
                if (s === 'nouveau' || s === 'nouveaux' || s === 'unassigned' || s === 'libre' || s === 'libres') {
                    whereClauses.push("NOT EXISTS (SELECT 1 FROM attribuerdossier ad2 WHERE ad2.dossierid = inc.id_incident AND ad2.status NOT IN ('refusé', 'abandonné'))");
                } else if (s === 'en cours' || s === 'encours' || s === 'analyse') {
                    whereClauses.push("(ad.status = 'en cours' OR ad.status = 'en attente' OR ad.status = 'accepté')");
                } else if (s === 'résolu' || s === 'resolu' || s === 'cloturé' || s === 'cloture') {
                    whereClauses.push("(ad.status = 'résolu' OR ad.status = 'cloturé')");
                } else if (s === 'orienté' || s === 'oriente' || s === 'orientés') {
                    whereClauses.push("ad.type = 'orientation'");
                } else if (s !== 'tous' && s !== 'all') {
                    params.push(status);
                    whereClauses.push(`ad.status = $${params.length}`);
                }
            }

            if (categorieid) {
                params.push(parseInt(categorieid, 10));
                whereClauses.push(`inc.categorieid = $${params.length}`);
            }

            if (niveau) {
                params.push(niveau.toLowerCase());
                whereClauses.push(`LOWER(catinc.niveau) = $${params.length}`);
            }

            if (search && search.trim() !== "") {
                params.push(`%${search.trim().toLowerCase()}%`);
                whereClauses.push(`(LOWER(inc.code_unique) LIKE $${params.length} OR LOWER(inc.description) LIKE $${params.length} OR LOWER(inc.lieu) LIKE $${params.length} OR LOWER(catinc.designation) LIKE $${params.length})`);
            }

            const whereStr = whereClauses.length > 0 ? " WHERE " + whereClauses.join(" AND ") : "";

            let limitStr = "";
            if (limit && parseInt(limit, 10) > 0) {
                params.push(parseInt(limit, 10));
                limitStr = ` LIMIT $${params.length}`;
            }

            const queryStr = `
                SELECT 
                    inc.*, 
                    catinc.designation AS categorie, 
                    catinc.niveau, 
                    ad.status AS statusatt, 
                    ad.type AS type_attribut, 
                    ad.attribuerid, 
                    org.designation AS organisation_nom,
                    usr.nom AS nom_gestionnaire,
                    usr.prenom AS prenom_gestionnaire
                FROM incident inc 
                JOIN categorie_incident catinc ON inc.categorieid = catinc.categorie_id 
                LEFT JOIN attribuerdossier ad ON (
                    inc.id_incident = ad.dossierid 
                    AND ad.attribuerid = (SELECT attribuerid FROM attribuerdossier WHERE dossierid=inc.id_incident ORDER BY attribuerid DESC LIMIT 1)
                ) 
                LEFT JOIN organisation org ON ad.organisationid = org.organisationid
                LEFT JOIN utilisateurs usr ON ad.userid = usr.userid
                ${whereStr}
                ORDER BY inc.id_incident DESC
                ${limitStr}
            `;

            const datas = await pool.query(queryStr, params);
            const rows = datas.rows.map(r => {
                if(r.annexes && typeof r.annexes === 'string'){
                    try { r.annexes = JSON.parse(r.annexes); } catch(e){}
                }
                return r;
            });
            return {status:"success", success: true, code:"success", data: rows};
        }
    }catch(error){
        console.log("Error getDossier:", error);
        return {status: "error", success: false, code:"error", error: error};
    }
}

export async function setEtatAttribut({attribuerid, status}){
    try{
        if (status === 'abandonné' || status === 'abandonne' || status === 'abandon') {
            return {
                status: "error", 
                code: "cannot_abandon", 
                message: "Un signalement pris en charge / suivi ne peut pas être abandonné. Vous devez le classer comme résolu ou l'orienter vers une structure compétente."
            };
        }
        const reponse = await pool.query("UPDATE attribuerdossier SET status=$1 WHERE attribuerid=$2 RETURNING *", [status, attribuerid]);
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

export async function updateUtilisateur({userid, nom, prenom, phone, adresse}){
    try{
        const reponse = await pool.query(
            "UPDATE utilisateurs SET nom=$1, prenom=$2, phone=$3, adresse=$4 WHERE userid=$5 RETURNING *",
            [nom, prenom, phone, adresse, userid]
        );
        if(reponse.rowCount === 0){
            return {status: "error", code:"not_found", message:"Utilisateur non trouvé"};
        }
        return {status:"success", code:"success", data: reponse.rows[0]};
    }catch(error){
        console.log(error);
        return {status: "error", code:"error", error:error};
    }
}

