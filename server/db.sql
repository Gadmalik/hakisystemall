-- ==========================================
-- 1. CREATION DES TABLES
-- ==========================================

CREATE TABLE public.utilisateurs (
    userid integer NOT NULL,
    nom character varying(150) NOT NULL,
    email character varying(150),
    phone character varying(150),
    mdp text,
    code integer,
    type character varying(20),
    etat character varying(20),
    date_create date,
    username character(50) NOT NULL,
    adresse text,
    prenom character varying,
    categorieutilisateurid integer
);

CREATE TABLE public.categorie_incident (
    categorie_id integer NOT NULL,
    designation character varying,
    etat character varying,
    date date,
    niveau character varying(50)
);

CREATE TABLE public.incident (
    lieu character varying,
    id_incident integer NOT NULL,
    description text,
    date_incident date DEFAULT CURRENT_TIMESTAMP,
    status character varying,
    anonyme boolean,
    categorieid integer,
    annexe character varying,
    typeannexe character varying,
    date_create date,
    userid integer
);

CREATE TABLE public.attribuerdossier (
    attribuerid integer NOT NULL,
    date date NOT NULL,
    status character varying,
    userid integer,
    dossierid integer
);

CREATE TABLE public.article (
    articleid integer NOT NULL,
    titre character varying NOT NULL,
    date_create date NOT NULL,
    contenu text,
    piecesjointes text,
    typepiece character varying,
    userid integer
);

CREATE TABLE public.categorieutilisateur (
    categorieutilisateurid integer NOT NULL,
    designation character varying(50) NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    confirm boolean DEFAULT true NOT NULL
);

CREATE TABLE public.push_subscriptions (
    id integer NOT NULL,
    userid integer NOT NULL,
    subscription jsonb NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


-- ==========================================
-- 2. INSERTION DES DONNEES
-- ==========================================

COPY public.utilisateurs (userid, nom, email, phone, mdp, code, type, etat, date_create, username, adresse, prenom, categorieutilisateurid) FROM stdin;
2	Malik Will	gad@gmail.com	243826711828	423#malik	\N	juriste	actif	2026-04-13	will                                              	Beni	\N	\N
1	Gad Malik	gadmalik42@gmail.com	243993886474	423#malik	\N	juriste	actif	2026-03-12	gadmalik                                          	Beni, tamende	\N	\N
6	Malik	gadmalik423@gmail.com	243896711828	$2b$10$TxUHrGAyzZ/pmHD1I4.wouAljiqwC/f0vUjBwPmttFSYTjlBWZpAa	\N	\N	actif	2026-08-25	gadmalik423                                       	Beni	Gad	2
7	Malik	gadmalikidogo@gmail.com	243993886475	\N	663136	\N	en attente	2026-08-30	gmalike                                           	Beni	Gad	1
\.

COPY public.categorie_incident (categorie_id, designation, etat, date, niveau) FROM stdin;
1	Fraude	actif	2026-03-19	faible
2	Corruption	actif	2026-03-19	moyen
\.

COPY public.incident (lieu, id_incident, description, date_incident, status, anonyme, categorieid, annexe, typeannexe, date_create, userid) FROM stdin;
Beni	9	Description 	2026-08-26	actif	\N	1	\N	\N	2026-08-26	\N
Beni, Kanzuli	10	Beni,f rrkmv rvrvkvtjv tnvtvnjvdc 	2026-08-25	actif	\N	2	\N	\N	2026-08-26	6
Beni	11	description	2026-08-29	actif	\N	2	\N	\N	2026-08-30	6
\.

COPY public.attribuerdossier (attribuerid, date, status, userid, dossierid) FROM stdin;
9	2026-08-27	en cours	6	10
10	2026-08-30	cloturer	6	9
\.

COPY public.article (articleid, titre, date_create, contenu, piecesjointes, typepiece, userid) FROM stdin;
1	Test article 	2026-04-13	<p><strong>Goma, RDC</strong> – Dans une ère de surveillance accrue, la dénonciation anonyme devient le seul rempart pour les populations vulnérables contre l'impunité.</p><h2>Le cryptage de bout en bout</h2><p>Toutes les informations transmises via notre plateforme sont chiffrées. Même l'équipe de <strong>Lonford Devs</strong> ne peut accéder au contenu sans votre clé privée.</p><blockquote><p>"La justice commence par le droit de parler sans crainte." - Équipe TAASISI</p></blockquote><ul><li><p>Anonymat garanti par IP Masking.</p></li><li><p>Preuves stockées sur Blockchain légère.</p></li><li><p>Signalement possible sans internet (Mode Offline).</p></li></ul><p></p>	9965a158fa7ec9e6f46124884e719be6	image/jpeg	1
3	fast	2026-04-13		ec5c0fe866649aa43fc99c8d543a608f	image/jpeg	1
2	Autre article	2026-04-13	<p><strong>Goma, RDC</strong> – Dans une ère de surveillance accrue, la dénonciation anonyme devient le seul rempart pour les populations vulnérables contre l'impunité.</p><h2>Le cryptage de bout en bout</h2><p>Toutes les informations transmises via notre plateforme sont chiffrées. Même l'équipe de <strong>Lonford Devs</strong> ne peut accéder au contenu sans votre clé privée.</p><blockquote><p>"La justice commence par le droit de parler sans crainte." - Équipe TAASISI</p></blockquote><ul><li><p>Anonymat garanti par IP Masking.</p></li><li><p>Preuves stockées sur Blockchain légère.</p></li><li><p>Signalement possible sans internet (Mode Offline).</p></li></ul><p></p>	6cfbefab27d9d2f78011335f895fdfa8	image/png	2
4	Application de gestion de plainte	2026-04-14	<p>À l’ère du numérique, les organisations – qu’elles soient publiques ou privées – doivent répondre de manière rapide, transparente et efficace aux préoccupations de leurs usagers. Dans ce contexte, les applications de gestion de plainte s’imposent comme des outils indispensables pour structurer, suivre et résoudre les réclamations de manière professionnelle.</p><h4>Qu’est-ce qu’une application de gestion de plainte ?</h4><p>Une application de gestion de plainte est une plateforme numérique conçue pour centraliser les réclamations des clients, citoyens ou usagers. Elle permet de soumettre une plainte, de la suivre en temps réel, et d’assurer son traitement jusqu’à sa résolution. Ces applications peuvent être accessibles via mobile, web ou intégrées aux systèmes internes d’une organisation.</p><h4>Fonctionnalités principales</h4><p>Une bonne application de gestion de plainte offre généralement les fonctionnalités suivantes :</p><ul><li><p><strong>Soumission simplifiée des plaintes</strong> : formulaires intuitifs permettant de décrire le problème, joindre des documents ou des images.</p></li><li><p><strong>Suivi en temps réel</strong> : l’utilisateur peut consulter l’état d’avancement de sa plainte.</p></li><li><p><strong>Attribution automatique</strong> : les plaintes sont dirigées vers les services compétents.</p></li><li><p><strong>Historique et traçabilité</strong> : toutes les interactions sont enregistrées pour garantir la transparence.</p></li><li><p><strong>Notifications</strong> : alertes envoyées aux utilisateurs et aux gestionnaires pour les tenir informés.</p></li><li><p><strong>Tableaux de bord analytiques</strong> : outils de reporting pour identifier les tendances et améliorer les services.</p></li></ul><h4>Avantages pour les organisations</h4><p>L’adoption d’une telle application présente de nombreux bénéfices :</p><ul><li><p><strong>Amélioration de la satisfaction des usagers</strong> grâce à des réponses rapides et structurées.</p></li><li><p><strong>Gain de temps et d’efficacité</strong> dans le traitement des plaintes.</p></li><li><p><strong>Réduction des erreurs humaines</strong> grâce à l’automatisation.</p></li><li><p><strong>Meilleure prise de décision</strong> grâce aux données collectées et analysées.</p></li><li><p><strong>Renforcement de la transparence et de la confiance</strong> entre l’organisation et ses usagers.</p></li></ul><h4>Cas d’utilisation</h4><p>Les applications de gestion de plainte sont utilisées dans divers secteurs :</p><ul><li><p><strong>Services publics</strong> : gestion des plaintes des citoyens (routes, électricité, eau, etc.).</p></li><li><p><strong>Entreprises privées</strong> : service client et support technique.</p></li><li><p><strong>Institutions financières</strong> : traitement des litiges clients.</p></li><li><p><strong>Établissements de santé</strong> : retour des patients sur les services reçus.</p></li></ul><h4>Enjeux et défis</h4><p>Malgré leurs avantages, ces applications doivent relever certains défis :</p><ul><li><p><strong>Accessibilité numérique</strong> : garantir que tous les usagers puissent utiliser l’application.</p></li><li><p><strong>Protection des données</strong> : sécuriser les informations sensibles.</p></li><li><p><strong>Adoption par les utilisateurs</strong> : encourager les citoyens ou clients à utiliser la plateforme.</p></li><li><p><strong>Formation du personnel</strong> : assurer une bonne prise en main de l’outil par les équipes.</p></li></ul><h4>Conclusion</h4><p>Les applications de gestion de plainte représentent un progrès majeur dans la gestion de la relation usager. En facilitant la communication, en améliorant la réactivité et en apportant une meilleure visibilité sur les problèmes rencontrés, elles contribuent à une gouvernance plus efficace et à une meilleure qualité de service. Dans un monde où la satisfaction des utilisateurs est devenue essentielle, investir dans ce type de solution n’est plus une option, mais une nécessité.</p>	1776179584523.jpg	image/jpeg	1
5	gad	2026-04-18	<h1><strong>egtt</strong></h1><p><s>cvdvrvr</s></p>	7619984930653994577c6934e152a995	image/jpeg	1
\.

COPY public.categorieutilisateur (categorieutilisateurid, designation, description, created_at, confirm) FROM stdin;
1	Admin	Accès complet à la plateforme et à la gestion des utilisateurs	2026-08-25 10:35:26.960024+02	t
3	professionnel	Utilisateur professionel avec accès aux services avancé	2026-08-25 10:35:26.960024+02	t
2	utilisateur	Utilisateur standard avec accès aux services de base	2026-08-25 10:35:26.960024+02	f
\.

COPY public.push_subscriptions (id, userid, subscription, created_at) FROM stdin;
2	6	{"keys": {"auth": "Jn8Yj4BOTFRm8iGHJvQ65g", "p256dh": "BNoYwQN42-XDbSN-3_jm54-hJrG8m86gnUhQZu5btoD-O1HVFFGnue0clf1Ri6syd0BwarUtfLtA0Slk4P3H23M"}, "endpoint": "https://fcm.googleapis.com/fcm/send/c_W3Un6048c:APA91bEwJALdIIet8DSasQWo2oNarvsbmX8BkIZj2aireU2jnd2cqUdrhQrbc4qdNDRQ1BNooeRSGn6Uk12lVtklf2b9e7V-bYnUbGfimOTsFr5XT-Idt9IhjRMCVqtGHlDViFY3to3B", "expirationTime": null}	2026-08-27 14:44:16.707429
35	6	{"keys": {"auth": "wxbYgQmmzS6E-uBAqPqnrQ", "p256dh": "BB0p08utwNQfbZuzx1f95tHVReuyxUpGczaArNNsi-tq0nN_LoPb5mWyAifz4CUlbZjkNudYg_ClIQMWP4oE1ws"}, "endpoint": "https://fcm.googleapis.com/fcm/send/eGeSotQoimw:APA91bGVATPjbnWkftwEb6tr_OlW60o5ofxp9GhNjrHzbgDSv3gDXze97zGEuZXNeYPqxj9PXSv66WGdDMoPdZFGGj1PGJWB3PThvLGU8djLkLp9_xt5F9C6v5_JZt2qzivAbeW1CntJ", "expirationTime": null}	2026-08-30 17:46:35.537188
36	6	{"keys": {"auth": "Mo9u36iLujG-eh5gyc-sgQ", "p256dh": "BI7HRNyH7m7TBxmyd-1PxjzfaYqMp4mPGGAkKbvxt9hV5ol7eV8W1GfE9wk3iWkIfZUURR8hvzbmFAo85albsYg"}, "endpoint": "https://fcm.googleapis.com/fcm/send/dxUh_OYF31Y:APA91bHzfh_M7XyXJtDg5IFlDisPfHeunFDRlnCl_Z7BPCM6z7r0xt9oRXVvWEJUFU3L0O3tQ156_c1VPF9tCWFchQ2xobY66W0MI_Pi0wl-o-gW5_JNscwuaRbnvi6i4rzb1G_FSjap", "expirationTime": null}	2026-08-30 17:46:35.567131
\.
