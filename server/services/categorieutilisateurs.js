import pool from "../db.js";

export async function addCategorieUtilisateurOrg(data){
    try {
        const query = "INSERT INTO categorieutilisateurorg (libelle, description, organisationid, status) VALUES ($1, $2, $3, $4)";
        const result = await pool.query(query, [data.libelle, data.description, data.organisationid, 'actif']);
        return {status: "success", success: true, message: "Categorie utilisateur ajoutée avec succès !"};
    } catch (error) {
        console.log(error);
        return {status: "error", success: false, message: error.message};
    }
}

export async function getcategorieutilisateurOrg(data){
    try {
        const query = "SELECT * FROM categorieutilisateurorg WHERE organisationid = $1 AND status = 'actif'";
        const result = await pool.query(query, [data.organisationid]);
        return {status: "success", success: true, data: result.rows};
    } catch (error) {
        console.log(error);
        return {status: "error", success: false, message: error.message};
    }
}

export async function addAssignerCategorieUtilisateur(data){
    try {
        const verif = await pool.query("SELECT * FROM assignercategorieutilisateurorg WHERE userid = $1 AND categorieutilisateurorgid = $2 AND status = 'actif'", [data.userid, data.categorieutilisateurorgid]);
        if(verif.rowCount > 0){
            return {status: "error", success: false, message: "Cette categorie utilisateur est déjà assignée à cet utilisateur !"};
        }
        const query = "INSERT INTO assignercategorieutilisateurorg (assignercategorieutilisateurorgid, userid, categorieutilisateurorgid, status) VALUES ($1, $2, $3, $4)";
        const result = await pool.query(query, [data.assignercategorieutilisateurorgid, data.userid, data.categorieutilisateurorgid, 'actif']);
        return {status: "success", success: true, message: "Categorie utilisateur assignée avec succès !"};
    } catch (error) {
        console.log(error);
        return {status: "error", success: false, message: error.message};
    }
}

export async function getUtilisateursByOrganisationId(data){
    try {
        const query = "SELECT * FROM utilisateurs ut JOIN assignercategorieutilisateurorg acuo ON ut.userid = acuo.userid JOIN categorieutilisateurorg cuo ON acuo.categorieutilisateurorgid = cuo.categorieutilisateurorgid WHERE cuo.organisationid = $1 AND ut.status = 'actif' AND acuo.status = 'actif'";
        const result = await pool.query(query, [data.organisationid]);
        return {status: "success", success: true, data: result.rows};
    } catch (error) {
        console.log(error);
        return {status: "error", success: false, message: error.message};
    }
}