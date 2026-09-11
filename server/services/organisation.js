import pool from "../db.js"

export async function addOrganisation(data){
    const verifDesignation = await verifOrganisationByDesignation(data);
    const verifEmail = await verifOrganisationByEmail(data);
    const verifPhone = await verifOrganisationByPhone(data);
    if(verifDesignation.data.length > 0){
        return {status: "failed", success: false, message: "Une organisation existe déjà avec cette designation !"};
    }
    if(verifEmail.data.length > 0){
        return {status: "failed", success: false, message: "Une organisation existe déjà avec cette adresse email !"};
    }
    if(verifPhone.data.length > 0){
        return {status: "failed", success: false, message: "Une organisation existe déjà avec ce numéro de téléphone !"};
    }
    try{
        console.log(data)
        const add = await pool.query("INSERT INTO organisation (designation, sigle, typeorganisationid, pays, province, ville, adresse_org, phone_org, email_org, site_web, reseaux_sociaux, logo_url, userid) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)", [data.designation, data.sigle, data.typeorganisationid, data.pays, data.province, data.ville, data.adresse_org, data.phone_org, data.email_org, data.site_web, data.reseaux_sociaux, data.logo_url, data.userid]);
        return {status: "success", success: true, message: "Organisation ajoutée avec succès !"};
    }catch(error){
        console.error(error);
        return {status: "error", success: false, message: error.message};
    }   
}

export async function getOrganisations(){
    try{
        const organisations = await pool.query("SELECT *, og.status AS status FROM organisation og JOIN utilisateurs ut ON og.userid = ut.userid LEFT JOIN type_organisation ty ON og.typeorganisationid = ty.typeorganisationid");
        return {status: "success", success: true, data: organisations.rows };
    }catch(error){
        console.error(error);
        return {status: "error", success: false, message: error.message};
    }
}

export async function getOrganisation(data){
    try{
        const org = await pool.query("SELECT * FROM organisation WHERE organisationid=$1", [data.organisationid]);
        return {status:"success", success: true, data: org.rows[0] };
    }catch(error){
        console.error(error);
        return {status: "error", success: false, message: error.message};
    }
}


export async function verifOrganisationByDesignation(data){
    const org = await pool.query("SELECT * FROM organisation WHERE designation=$1", [data.designation]);
    return {status:"success", success: true, data: org.rows };
}

export async function verifOrganisationByEmail(data){
    const org = await pool.query("SELECT * FROM organisation WHERE email_org=$1", [data.email_org]);
    return {status:"success", success: true, data: org.rows };
}

export async function verifOrganisationByPhone(data){
    const org = await pool.query("SELECT * FROM organisation WHERE phone_org=$1", [data.phone_org]);
    return {status:"success", success: true, data: org.rows };
}

export async function getTypeOrganisation(){
    const type = await pool.query("SELECT * FROM type_organisation");
    return {status:"success", success: true, data: type.rows };
}

export async function UpdateOrganisation(data){
    const verifDesignation = await verifOrganisationByDesignation(data);
    const verifEmail = await verifOrganisationByEmail(data);
    const verifPhone = await verifOrganisationByPhone(data);
    if(verifDesignation.data.length > 0 && data.id != verifDesignation.data[0].id){
        return {status: "failed", success: false, message: "Une organisation existe déjà avec cette designation !"};
    }
    if(verifEmail.data.length > 0 && data.id != verifEmail.data[0].id){
        return {status: "failed", success: false, message: "Une organisation existe déjà avec cette adresse email !"};
    }
    if(verifPhone.data.length > 0 && data.id != verifPhone.data[0].id){
        return {status: "failed", success: false, message: "Une organisation existe déjà avec ce numéro de téléphone !"};
    }
    try{
        const update = await pool.query("UPDATE organisation SET nom_officiel = $1, sigle = $2, type_organisation_id = $3, pays = $4, province = $5, ville = $6, adresse_org = $7, phone_org = $8, email_org = $9, site_web = $10, reseaux_sociaux = $11, logo_url = $12, userid = $13 WHERE id = $14", [data.nom_officiel, data.sigle, data.type_organisation_id, data.pays, data.province, data.ville, data.adresse_org, data.phone_org, data.email_org, data.site_web, data.reseaux_sociaux, data.logo_url, data.user_id, data.id]);
        return {status: "success", success: true, message: "Organisation mise à jour avec succès !"};
    }catch(error){
        return {status: "error", success: false, message: error.message};
    }
}

export async function actionOrganisations(data){
    try{
        const update = await pool.query("UPDATE organisation SET status = $1 WHERE organisationid IN ($2)", [data.action, data.organisations.join(",")]);
        return {status: "success", success: true, message: "Organisation mise à jour avec succès !"};
    }catch(error){
        return {status: "error", success: false, message: error.message};
    }
}
