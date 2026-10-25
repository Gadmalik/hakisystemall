export function ConfirmMail(noms, code) {
    return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code de confirmation - HAKI SYSTEM</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f5f8;
            margin: 0;
            padding: 20px;
            color: #333333;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
        }
        .header {
            background-color: #3F3C8D;
            color: #ffffff;
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 26px;
            font-weight: 700;
            letter-spacing: 1px;
        }
        .header p {
            margin: 8px 0 0 0;
            font-size: 13px;
            opacity: 0.9;
        }
        .content {
            padding: 35px 30px;
            text-align: center;
        }
        .greeting {
            font-size: 18px;
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 15px;
        }
        .description {
            font-size: 15px;
            line-height: 1.6;
            color: #555555;
            margin-bottom: 30px;
            text-align: left;
        }
        .code-container {
            background-color: #f0f0f8;
            border: 2px dashed #3F3C8D;
            border-radius: 10px;
            padding: 20px;
            margin: 25px 0;
            display: inline-block;
            width: 80%;
        }
        .code-label {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: #3F3C8D;
            font-weight: 600;
            margin-bottom: 8px;
        }
        .code {
            font-size: 36px;
            font-weight: 800;
            letter-spacing: 8px;
            color: #3F3C8D;
            font-family: 'Courier New', Courier, monospace;
        }
        .expiry-notice {
            font-size: 13px;
            color: #e74c3c;
            margin-top: 15px;
            font-weight: 500;
        }
        .badges {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eeeeee;
            text-align: center;
        }
        .badge {
            display: inline-block;
            background-color: #f8f9fa;
            border: 1px solid #e2e8f0;
            border-radius: 20px;
            padding: 6px 14px;
            font-size: 12px;
            color: #3F3C8D;
            font-weight: 600;
            margin: 0 4px;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 20px 30px;
            text-align: center;
            font-size: 12px;
            color: #888888;
            border-top: 1px solid #eeeeee;
        }
        .footer p {
            margin: 5px 0;
            line-height: 1.5;
        }
        .security-note {
            font-size: 12px;
            color: #7f8c8d;
            margin-top: 20px;
            font-style: italic;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <h1>HAKI SYSTEM</h1>
            <p>Plateforme sécurisée de signalement et d'accompagnement juridique</p>
        </div>

        <!-- Content -->
        <div class="content">
            <div class="greeting">Bonjour ${noms},</div>
            <div class="description">
                Vous recevez ce message dans le cadre d'une activation de compte ou d'une
                réinitialisation de mot de passe sur la plateforme <strong>HAKI SYSTEM</strong>.
            </div>

            <!-- Code Box -->
            <div class="code-container">
                <div class="code-label">Votre code de vérification</div>
                <div class="code">${code}</div>
            </div>

            <div class="expiry-notice">
                Ce code est valide pendant 10 minutes.
            </div>

            <div class="security-note">
                Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet e-mail en toute sécurité. Votre anonymat et vos données restent protégés.
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p><strong>HAKI SYSTEM</strong> — Protéger vos droits en toute sécurité.</p>
            <p>Ceci est un message automatique, veuillez ne pas y répondre directement.</p>
            <p>&copy; 2026 HAKI SYSTEM. Tous droits réservés.</p>
        </div>
    </div>
</body>
</html>`;
}

export function ConfirmOrgMail(noms, email, code, nomOrganisation) {
    const url = process.env.CLIENT_URL_URL;
    const confirmationLink = `${url}/confirm-invitation/${encodeURIComponent(code)}/${encodeURIComponent(email)}`;

    return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invitation à rejoindre HAKI SYSTEM</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f5f8;
            margin: 0;
            padding: 20px;
            color: #333333;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
        }
        .header {
            background-color: #3F3C8D;
            color: #ffffff;
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 26px;
            font-weight: 700;
            letter-spacing: 1px;
        }
        .header p {
            margin: 8px 0 0 0;
            font-size: 13px;
            opacity: 0.9;
        }
        .content {
            padding: 35px 30px;
            text-align: center;
        }
        .greeting {
            font-size: 18px;
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 15px;
        }
        .description {
            font-size: 15px;
            line-height: 1.6;
            color: #555555;
            margin-bottom: 30px;
            text-align: left;
        }
        .btn-container {
            margin: 30px 0;
        }
        .btn-confirm {
            background-color: #3F3C8D;
            color: #ffffff !important;
            padding: 14px 28px;
            font-size: 16px;
            font-weight: 700;
            text-decoration: none;
            border-radius: 8px;
            display: inline-block;
            box-shadow: 0 4px 10px rgba(63, 60, 141, 0.3);
            transition: background-color 0.3s ease;
        }
        .link-fallback {
            font-size: 12px;
            color: #7f8c8d;
            margin-top: 20px;
            word-break: break-all;
            text-align: left;
            background-color: #f8f9fa;
            padding: 12px;
            border-radius: 6px;
        }
        .security-note {
            font-size: 12px;
            color: #7f8c8d;
            margin-top: 25px;
            font-style: italic;
            text-align: left;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 20px 30px;
            text-align: center;
            font-size: 12px;
            color: #888888;
            border-top: 1px solid #eeeeee;
        }
        .footer p {
            margin: 5px 0;
            line-height: 1.5;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <h1>HAKI SYSTEM</h1>
            <p>Plateforme sécurisée de signalement et d'accompagnement juridique</p>
        </div>

        <!-- Content -->
        <div class="content">
            <div class="greeting">Bonjour ${noms},</div>
            <div class="description">
                L'organisation <strong>${nomOrganisation}</strong> vous a ajouté(e) en tant que membre sur la plateforme <strong>HAKI SYSTEM</strong>.
                <br><br>
                Pour finaliser votre inscription et configurer votre compte sous-utilisateur, veuillez cliquer sur le bouton ci-dessous :
            </div>

            <!-- Action Button -->
            <div class="btn-container">
                <a href="${confirmationLink}" class="btn-confirm" target="_blank">Rejoindre l'organisation</a>
            </div>

            <!-- Alternative Link -->
            <div class="link-fallback">
                Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :<br>
                <a href="${confirmationLink}" style="color: #3F3C8D;">${confirmationLink}</a>
            </div>

            <div class="security-note">
                Si vous ne faites pas partie de l'organisation <strong>${nomOrganisation}</strong> ou si vous pensez qu'il s'agit d'une erreur, vous pouvez ignorer cet e-mail.
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p><strong>HAKI SYSTEM</strong> — Protéger vos droits en toute sécurité.</p>
            <p>Ceci est un message automatique, veuillez ne pas y répondre directement.</p>
            <p>&copy; 2026 HAKI SYSTEM. Tous droits réservés.</p>
        </div>
    </div>
</body>
</html>`;
}

export function NewIncidentAlertMail({ nomOrganisation, codeUnique, categorie, lieu, dateIncident, clientUrl, id }) {
    const link = `${clientUrl || 'http://localhost:3000'}/home/signalement/${encodeURIComponent(id)}/code`;
    return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Nouveau Signalement - HAKI SYSTEM</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
        <div style="background: linear-gradient(135deg, #4338ca 0%, #312e81 100%); color: white; padding: 28px 24px; text-align: center;">
            <h1 style="margin: 0; font-size: 1.5rem;">HAKI SYSTEM</h1>
            <p style="margin: 6px 0 0; opacity: 0.9; font-size: 0.92rem;">Alerte nouveau dossier dans votre domaine</p>
        </div>
        <div style="padding: 28px 24px; color: #1e293b; line-height: 1.6;">
            <p>Bonjour à l'équipe de <strong>${nomOrganisation}</strong>,</p>
            <p>Un citoyen vient de soumettre un signalement correspondant à votre domaine d'intervention : <strong style="color: #4338ca;">${categorie}</strong>.</p>
            <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; margin: 20px 0;">
                <p style="margin: 4px 0;"><strong>Code unique :</strong> <code style="color: #4338ca; font-weight: 700;">${codeUnique}</code></p>
                <p style="margin: 4px 0;"><strong>Catégorie :</strong> ${categorie}</p>
                <p style="margin: 4px 0;"><strong>Lieu :</strong> ${lieu || 'Non précisé'}</p>
                <p style="margin: 4px 0;"><strong>Date :</strong> ${dateIncident || 'Aujourd\'hui'}</p>
            </div>
            <p style="text-align: center; margin: 24px 0;">
                <a href="${link}" style="display: inline-block; background: #4338ca; color: #ffffff !important; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600;">Consulter le dossier</a>
            </p>
            <p style="font-size: 0.82rem; color: #64748b;">Lien direct : <a href="${link}">${link}</a></p>
        </div>
        <div style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 18px 24px; text-align: center; font-size: 0.78rem; color: #64748b;">
            <p>&copy; 2026 HAKI SYSTEM. Plateforme citoyenne et professionnelle de défense des droits.</p>
        </div>
    </div>
</body>
</html>`;
}

export function OrganisationStatusMail({ nomOrganisation, status, messageExplication }) {
    const isActif = status === 'actif';
    return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Statut Organisation - HAKI SYSTEM</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
        <div style="background: ${isActif ? '#059669' : '#dc2626'}; color: white; padding: 28px 24px; text-align: center;">
            <h1 style="margin: 0; font-size: 1.5rem;">HAKI SYSTEM</h1>
            <p style="margin: 6px 0 0; opacity: 0.9;">Mise à jour de votre compte organisation</p>
        </div>
        <div style="padding: 28px 24px; color: #1e293b; line-height: 1.6;">
            <p>Bonjour <strong>${nomOrganisation}</strong>,</p>
            <p>L'administration de HAKI SYSTEM vous informe que votre statut est désormais : <strong style="color: ${isActif ? '#059669' : '#dc2626'}; text-transform: uppercase;">${status}</strong>.</p>
            ${messageExplication ? `<p><em>${messageExplication}</em></p>` : ''}
            ${isActif ? '<p>Vous pouvez maintenant accéder à votre espace de travail et commencer à traiter les dossiers citoyens.</p>' : '<p>Pour toute question ou demande de recours, contactez le support administrateur.</p>'}
        </div>
        <div style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 18px 24px; text-align: center; font-size: 0.78rem; color: #64748b;">
            <p>&copy; 2026 HAKI SYSTEM. Tous droits réservés.</p>
        </div>
    </div>
</body>
</html>`;
}

export function UserValidationMail({ nom, prenom, email, clientUrl, etat = "actif" }) {
    const isActif = etat === "actif";
    const loginLink = `${clientUrl || "http://localhost:3000"}/`;
    return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Validation de votre compte - HAKI SYSTEM</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.06);">
        <div style="background: ${isActif ? 'linear-gradient(135deg, #059669 0%, #047857 100%)' : 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)'}; color: white; padding: 28px 24px; text-align: center;">
            <h1 style="margin: 0; font-size: 1.5rem; letter-spacing: 1px;">HAKI SYSTEM</h1>
            <p style="margin: 6px 0 0; opacity: 0.9; font-size: 0.92rem;">Plateforme de Signalement & Accompagnement Juridique</p>
        </div>
        <div style="padding: 30px 24px; color: #1e293b; line-height: 1.6;">
            <p style="font-size: 1.1rem; font-weight: 600; margin-top: 0;">Bonjour ${prenom ? `${prenom} ` : ''}${nom || 'Utilisateur'},</p>
            ${isActif ? `
            <p>Nous avons le plaisir de vous informer que votre compte sur la plateforme <strong>HAKI SYSTEM</strong> a été validé et activé par l'administrateur.</p>
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 20px 0; color: #166534;">
                <p style="margin: 0; font-weight: 600;">✓ Votre compte est désormais actif et opérationnel.</p>
                <p style="margin: 6px 0 0 0; font-size: 0.88rem;">Vous pouvez dès maintenant vous connecter pour accéder à vos dossiers, recevoir les alertes de signalements et collaborer sur la plateforme.</p>
            </div>
            <p style="text-align: center; margin: 28px 0;">
                <a href="${loginLink}" style="display: inline-block; background: #059669; color: #ffffff !important; text-decoration: none; padding: 13px 28px; border-radius: 8px; font-weight: 700; font-size: 0.95rem; box-shadow: 0 4px 10px rgba(5,150,105,0.3);">Accéder à mon espace</a>
            </p>
            ` : `
            <p>L'administration de HAKI SYSTEM vous informe que le statut de votre compte a été modifié à : <strong style="color: #dc2626; text-transform: uppercase;">${etat}</strong>.</p>
            <p>Si vous pensez qu'il s'agit d'une erreur ou souhaitez demander un réexamen, veuillez contacter le support administratif.</p>
            `}
            <p style="font-size: 0.85rem; color: #64748b; margin-top: 24px;">Identifiant associé : <strong>${email}</strong></p>
        </div>
        <div style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 18px 24px; text-align: center; font-size: 0.78rem; color: #64748b;">
            <p style="margin: 0;">&copy; 2026 HAKI SYSTEM. Protéger vos droits en toute sécurité.</p>
        </div>
    </div>
</body>
</html>`;
}