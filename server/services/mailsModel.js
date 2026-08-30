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