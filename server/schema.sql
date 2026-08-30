--
-- PostgreSQL database dump
--

\restrict oRPGhqN488PAtd0JhXeFeQdNw2MINl71CxjsqTBEKdmoLVKXO2b4JVMkhyHYP7z

-- Dumped from database version 16.13 (Ubuntu 16.13-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.13 (Ubuntu 16.13-0ubuntu0.24.04.1)

-- Started on 2026-08-30 19:53:02 CAT

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 224 (class 1259 OID 16457)
-- Name: article; Type: TABLE; Schema: public; Owner: asuna
--

CREATE TABLE public.article (
    articleid integer NOT NULL,
    titre character varying NOT NULL,
    date_create date NOT NULL,
    contenu text,
    piecesjointes text,
    typepiece character varying,
    userid integer
);


ALTER TABLE public.article OWNER TO asuna;

--
-- TOC entry 223 (class 1259 OID 16456)
-- Name: article_articleid_seq; Type: SEQUENCE; Schema: public; Owner: asuna
--

CREATE SEQUENCE public.article_articleid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.article_articleid_seq OWNER TO asuna;

--
-- TOC entry 3519 (class 0 OID 0)
-- Dependencies: 223
-- Name: article_articleid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: asuna
--

ALTER SEQUENCE public.article_articleid_seq OWNED BY public.article.articleid;


--
-- TOC entry 222 (class 1259 OID 16440)
-- Name: attribuerdossier; Type: TABLE; Schema: public; Owner: asuna
--

CREATE TABLE public.attribuerdossier (
    attribuerid integer NOT NULL,
    date date NOT NULL,
    status character varying,
    userid integer,
    dossierid integer
);


ALTER TABLE public.attribuerdossier OWNER TO asuna;

--
-- TOC entry 221 (class 1259 OID 16439)
-- Name: attribuerdossier_attribuerid_seq; Type: SEQUENCE; Schema: public; Owner: asuna
--

CREATE SEQUENCE public.attribuerdossier_attribuerid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.attribuerdossier_attribuerid_seq OWNER TO asuna;

--
-- TOC entry 3520 (class 0 OID 0)
-- Dependencies: 221
-- Name: attribuerdossier_attribuerid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: asuna
--

ALTER SEQUENCE public.attribuerdossier_attribuerid_seq OWNED BY public.attribuerdossier.attribuerid;


--
-- TOC entry 218 (class 1259 OID 16415)
-- Name: categorie_incident; Type: TABLE; Schema: public; Owner: asuna
--

CREATE TABLE public.categorie_incident (
    categorie_id integer NOT NULL,
    designation character varying,
    etat character varying,
    date date,
    niveau character varying(50)
);


ALTER TABLE public.categorie_incident OWNER TO asuna;

--
-- TOC entry 226 (class 1259 OID 33527)
-- Name: categorieutilisateur; Type: TABLE; Schema: public; Owner: asuna
--

CREATE TABLE public.categorieutilisateur (
    categorieutilisateurid integer NOT NULL,
    designation character varying(50) NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    confirm boolean DEFAULT true NOT NULL
);


ALTER TABLE public.categorieutilisateur OWNER TO asuna;

--
-- TOC entry 225 (class 1259 OID 33526)
-- Name: categorieutilisateur_categorieutilisateurid_seq; Type: SEQUENCE; Schema: public; Owner: asuna
--

CREATE SEQUENCE public.categorieutilisateur_categorieutilisateurid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categorieutilisateur_categorieutilisateurid_seq OWNER TO asuna;

--
-- TOC entry 3521 (class 0 OID 0)
-- Dependencies: 225
-- Name: categorieutilisateur_categorieutilisateurid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: asuna
--

ALTER SEQUENCE public.categorieutilisateur_categorieutilisateurid_seq OWNED BY public.categorieutilisateur.categorieutilisateurid;


--
-- TOC entry 217 (class 1259 OID 16414)
-- Name: cateogie_incident_id_seq; Type: SEQUENCE; Schema: public; Owner: asuna
--

CREATE SEQUENCE public.cateogie_incident_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cateogie_incident_id_seq OWNER TO asuna;

--
-- TOC entry 3522 (class 0 OID 0)
-- Dependencies: 217
-- Name: cateogie_incident_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: asuna
--

ALTER SEQUENCE public.cateogie_incident_id_seq OWNED BY public.categorie_incident.categorie_id;


--
-- TOC entry 220 (class 1259 OID 16422)
-- Name: incident; Type: TABLE; Schema: public; Owner: asuna
--

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


ALTER TABLE public.incident OWNER TO asuna;

--
-- TOC entry 219 (class 1259 OID 16421)
-- Name: incident_id_incident_seq; Type: SEQUENCE; Schema: public; Owner: asuna
--

CREATE SEQUENCE public.incident_id_incident_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.incident_id_incident_seq OWNER TO asuna;

--
-- TOC entry 3523 (class 0 OID 0)
-- Dependencies: 219
-- Name: incident_id_incident_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: asuna
--

ALTER SEQUENCE public.incident_id_incident_seq OWNED BY public.incident.id_incident;


--
-- TOC entry 228 (class 1259 OID 33550)
-- Name: push_subscriptions; Type: TABLE; Schema: public; Owner: asuna
--

CREATE TABLE public.push_subscriptions (
    id integer NOT NULL,
    userid integer NOT NULL,
    subscription jsonb NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.push_subscriptions OWNER TO asuna;

--
-- TOC entry 227 (class 1259 OID 33549)
-- Name: push_subscriptions_id_seq; Type: SEQUENCE; Schema: public; Owner: asuna
--

CREATE SEQUENCE public.push_subscriptions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.push_subscriptions_id_seq OWNER TO asuna;

--
-- TOC entry 3524 (class 0 OID 0)
-- Dependencies: 227
-- Name: push_subscriptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: asuna
--

ALTER SEQUENCE public.push_subscriptions_id_seq OWNED BY public.push_subscriptions.id;


--
-- TOC entry 216 (class 1259 OID 16406)
-- Name: utilisateurs; Type: TABLE; Schema: public; Owner: postgres
--

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


ALTER TABLE public.utilisateurs OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 16405)
-- Name: utilisateurs_userid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.utilisateurs_userid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.utilisateurs_userid_seq OWNER TO postgres;

--
-- TOC entry 3525 (class 0 OID 0)
-- Dependencies: 215
-- Name: utilisateurs_userid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.utilisateurs_userid_seq OWNED BY public.utilisateurs.userid;


--
-- TOC entry 3330 (class 2604 OID 16460)
-- Name: article articleid; Type: DEFAULT; Schema: public; Owner: asuna
--

ALTER TABLE ONLY public.article ALTER COLUMN articleid SET DEFAULT nextval('public.article_articleid_seq'::regclass);


--
-- TOC entry 3329 (class 2604 OID 16443)
-- Name: attribuerdossier attribuerid; Type: DEFAULT; Schema: public; Owner: asuna
--

ALTER TABLE ONLY public.attribuerdossier ALTER COLUMN attribuerid SET DEFAULT nextval('public.attribuerdossier_attribuerid_seq'::regclass);


--
-- TOC entry 3326 (class 2604 OID 16418)
-- Name: categorie_incident categorie_id; Type: DEFAULT; Schema: public; Owner: asuna
--

ALTER TABLE ONLY public.categorie_incident ALTER COLUMN categorie_id SET DEFAULT nextval('public.cateogie_incident_id_seq'::regclass);


--
-- TOC entry 3331 (class 2604 OID 33530)
-- Name: categorieutilisateur categorieutilisateurid; Type: DEFAULT; Schema: public; Owner: asuna
--

ALTER TABLE ONLY public.categorieutilisateur ALTER COLUMN categorieutilisateurid SET DEFAULT nextval('public.categorieutilisateur_categorieutilisateurid_seq'::regclass);


--
-- TOC entry 3327 (class 2604 OID 16425)
-- Name: incident id_incident; Type: DEFAULT; Schema: public; Owner: asuna
--

ALTER TABLE ONLY public.incident ALTER COLUMN id_incident SET DEFAULT nextval('public.incident_id_incident_seq'::regclass);


--
-- TOC entry 3334 (class 2604 OID 33553)
-- Name: push_subscriptions id; Type: DEFAULT; Schema: public; Owner: asuna
--

ALTER TABLE ONLY public.push_subscriptions ALTER COLUMN id SET DEFAULT nextval('public.push_subscriptions_id_seq'::regclass);


--
-- TOC entry 3325 (class 2604 OID 16409)
-- Name: utilisateurs userid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateurs ALTER COLUMN userid SET DEFAULT nextval('public.utilisateurs_userid_seq'::regclass);


--
-- TOC entry 3509 (class 0 OID 16457)
-- Dependencies: 224
-- Data for Name: article; Type: TABLE DATA; Schema: public; Owner: asuna
--

COPY public.article (articleid, titre, date_create, contenu, piecesjointes, typepiece, userid) FROM stdin;
1	Test article 	2026-04-13	<p><strong>Goma, RDC</strong> – Dans une ère de surveillance accrue, la dénonciation anonyme devient le seul rempart pour les populations vulnérables contre l'impunité.</p><h2>Le cryptage de bout en bout</h2><p>Toutes les informations transmises via notre plateforme sont chiffrées. Même l'équipe de <strong>Lonford Devs</strong> ne peut accéder au contenu sans votre clé privée.</p><blockquote><p>"La justice commence par le droit de parler sans crainte." - Équipe TAASISI</p></blockquote><ul><li><p>Anonymat garanti par IP Masking.</p></li><li><p>Preuves stockées sur Blockchain légère.</p></li><li><p>Signalement possible sans internet (Mode Offline).</p></li></ul><p></p>	9965a158fa7ec9e6f46124884e719be6	image/jpeg	1
3	fast	2026-04-13		ec5c0fe866649aa43fc99c8d543a608f	image/jpeg	1
2	Autre article	2026-04-13	<p><strong>Goma, RDC</strong> – Dans une ère de surveillance accrue, la dénonciation anonyme devient le seul rempart pour les populations vulnérables contre l'impunité.</p><h2>Le cryptage de bout en bout</h2><p>Toutes les informations transmises via notre plateforme sont chiffrées. Même l'équipe de <strong>Lonford Devs</strong> ne peut accéder au contenu sans votre clé privée.</p><blockquote><p>"La justice commence par le droit de parler sans crainte." - Équipe TAASISI</p></blockquote><ul><li><p>Anonymat garanti par IP Masking.</p></li><li><p>Preuves stockées sur Blockchain légère.</p></li><li><p>Signalement possible sans internet (Mode Offline).</p></li></ul><p></p>	6cfbefab27d9d2f78011335f895fdfa8	image/png	2
4	Application de gestion de plainte	2026-04-14	<p>À l’ère du numérique, les organisations – qu’elles soient publiques ou privées – doivent répondre de manière rapide, transparente et efficace aux préoccupations de leurs usagers. Dans ce contexte, les applications de gestion de plainte s’imposent comme des outils indispensables pour structurer, suivre et résoudre les réclamations de manière professionnelle.</p><h4>Qu’est-ce qu’une application de gestion de plainte ?</h4><p>Une application de gestion de plainte est une plateforme numérique conçue pour centraliser les réclamations des clients, citoyens ou usagers. Elle permet de soumettre une plainte, de la suivre en temps réel, et d’assurer son traitement jusqu’à sa résolution. Ces applications peuvent être accessibles via mobile, web ou intégrées aux systèmes internes d’une organisation.</p><h4>Fonctionnalités principales</h4><p>Une bonne application de gestion de plainte offre généralement les fonctionnalités suivantes :</p><ul><li><p><strong>Soumission simplifiée des plaintes</strong> : formulaires intuitifs permettant de décrire le problème, joindre des documents ou des images.</p></li><li><p><strong>Suivi en temps réel</strong> : l’utilisateur peut consulter l’état d’avancement de sa plainte.</p></li><li><p><strong>Attribution automatique</strong> : les plaintes sont dirigées vers les services compétents.</p></li><li><p><strong>Historique et traçabilité</strong> : toutes les interactions sont enregistrées pour garantir la transparence.</p></li><li><p><strong>Notifications</strong> : alertes envoyées aux utilisateurs et aux gestionnaires pour les tenir informés.</p></li><li><p><strong>Tableaux de bord analytiques</strong> : outils de reporting pour identifier les tendances et améliorer les services.</p></li></ul><h4>Avantages pour les organisations</h4><p>L’adoption d’une telle application présente de nombreux bénéfices :</p><ul><li><p><strong>Amélioration de la satisfaction des usagers</strong> grâce à des réponses rapides et structurées.</p></li><li><p><strong>Gain de temps et d’efficacité</strong> dans le traitement des plaintes.</p></li><li><p><strong>Réduction des erreurs humaines</strong> grâce à l’automatisation.</p></li><li><p><strong>Meilleure prise de décision</strong> grâce aux données collectées et analysées.</p></li><li><p><strong>Renforcement de la transparence et de la confiance</strong> entre l’organisation et ses usagers.</p></li></ul><h4>Cas d’utilisation</h4><p>Les applications de gestion de plainte sont utilisées dans divers secteurs :</p><ul><li><p><strong>Services publics</strong> : gestion des plaintes des citoyens (routes, électricité, eau, etc.).</p></li><li><p><strong>Entreprises privées</strong> : service client et support technique.</p></li><li><p><strong>Institutions financières</strong> : traitement des litiges clients.</p></li><li><p><strong>Établissements de santé</strong> : retour des patients sur les services reçus.</p></li></ul><h4>Enjeux et défis</h4><p>Malgré leurs avantages, ces applications doivent relever certains défis :</p><ul><li><p><strong>Accessibilité numérique</strong> : garantir que tous les usagers puissent utiliser l’application.</p></li><li><p><strong>Protection des données</strong> : sécuriser les informations sensibles.</p></li><li><p><strong>Adoption par les utilisateurs</strong> : encourager les citoyens ou clients à utiliser la plateforme.</p></li><li><p><strong>Formation du personnel</strong> : assurer une bonne prise en main de l’outil par les équipes.</p></li></ul><h4>Conclusion</h4><p>Les applications de gestion de plainte représentent un progrès majeur dans la gestion de la relation usager. En facilitant la communication, en améliorant la réactivité et en apportant une meilleure visibilité sur les problèmes rencontrés, elles contribuent à une gouvernance plus efficace et à une meilleure qualité de service. Dans un monde où la satisfaction des utilisateurs est devenue essentielle, investir dans ce type de solution n’est plus une option, mais une nécessité.</p>	1776179584523.jpg	image/jpeg	1
5	gad	2026-04-18	<h1><strong>egtt</strong></h1><p><s>cvdvrvr</s></p>	7619984930653994577c6934e152a995	image/jpeg	1
\.


--
-- TOC entry 3507 (class 0 OID 16440)
-- Dependencies: 222
-- Data for Name: attribuerdossier; Type: TABLE DATA; Schema: public; Owner: asuna
--

COPY public.attribuerdossier (attribuerid, date, status, userid, dossierid) FROM stdin;
9	2026-08-27	en cours	6	10
10	2026-08-30	cloturer	6	9
\.


--
-- TOC entry 3503 (class 0 OID 16415)
-- Dependencies: 218
-- Data for Name: categorie_incident; Type: TABLE DATA; Schema: public; Owner: asuna
--

COPY public.categorie_incident (categorie_id, designation, etat, date, niveau) FROM stdin;
1	Fraude	actif	2026-03-19	faible
2	Corruption	actif	2026-03-19	moyen
\.


--
-- TOC entry 3511 (class 0 OID 33527)
-- Dependencies: 226
-- Data for Name: categorieutilisateur; Type: TABLE DATA; Schema: public; Owner: asuna
--

COPY public.categorieutilisateur (categorieutilisateurid, designation, description, created_at, confirm) FROM stdin;
1	Admin	Accès complet à la plateforme et à la gestion des utilisateurs	2026-08-25 10:35:26.960024+02	t
3	professionnel	Utilisateur professionel avec accès aux services avancé	2026-08-25 10:35:26.960024+02	t
2	utilisateur	Utilisateur standard avec accès aux services de base	2026-08-25 10:35:26.960024+02	f
\.


--
-- TOC entry 3505 (class 0 OID 16422)
-- Dependencies: 220
-- Data for Name: incident; Type: TABLE DATA; Schema: public; Owner: asuna
--

COPY public.incident (lieu, id_incident, description, date_incident, status, anonyme, categorieid, annexe, typeannexe, date_create, userid) FROM stdin;
Beni	9	Description 	2026-08-26	actif	\N	1	\N	\N	2026-08-26	\N
Beni, Kanzuli	10	Beni,f rrkmv rvrvkvtjv tnvtvnjvdc 	2026-08-25	actif	\N	2	\N	\N	2026-08-26	6
Beni	11	description	2026-08-29	actif	\N	2	\N	\N	2026-08-30	6
\.


--
-- TOC entry 3513 (class 0 OID 33550)
-- Dependencies: 228
-- Data for Name: push_subscriptions; Type: TABLE DATA; Schema: public; Owner: asuna
--

COPY public.push_subscriptions (id, userid, subscription, created_at) FROM stdin;
2	6	{"keys": {"auth": "Jn8Yj4BOTFRm8iGHJvQ65g", "p256dh": "BNoYwQN42-XDbSN-3_jm54-hJrG8m86gnUhQZu5btoD-O1HVFFGnue0clf1Ri6syd0BwarUtfLtA0Slk4P3H23M"}, "endpoint": "https://fcm.googleapis.com/fcm/send/c_W3Un6048c:APA91bEwJALdIIet8DSasQWo2oNarvsbmX8BkIZj2aireU2jnd2cqUdrhQrbc4qdNDRQ1BNooeRSGn6Uk12lVtklf2b9e7V-bYnUbGfimOTsFr5XT-Idt9IhjRMCVqtGHlDViFY3to3B", "expirationTime": null}	2026-08-27 14:44:16.707429
35	6	{"keys": {"auth": "wxbYgQmmzS6E-uBAqPqnrQ", "p256dh": "BB0p08utwNQfbZuzx1f95tHVReuyxUpGczaArNNsi-tq0nN_LoPb5mWyAifz4CUlbZjkNudYg_ClIQMWP4oE1ws"}, "endpoint": "https://fcm.googleapis.com/fcm/send/eGeSotQoimw:APA91bGVATPjbnWkftwEb6tr_OlW60o5ofxp9GhNjrHzbgDSv3gDXze97zGEuZXNeYPqxj9PXSv66WGdDMoPdZFGGj1PGJWB3PThvLGU8djLkLp9_xt5F9C6v5_JZt2qzivAbeW1CntJ", "expirationTime": null}	2026-08-30 17:46:35.537188
36	6	{"keys": {"auth": "Mo9u36iLujG-eh5gyc-sgQ", "p256dh": "BI7HRNyH7m7TBxmyd-1PxjzfaYqMp4mPGGAkKbvxt9hV5ol7eV8W1GfE9wk3iWkIfZUURR8hvzbmFAo85albsYg"}, "endpoint": "https://fcm.googleapis.com/fcm/send/dxUh_OYF31Y:APA91bHzfh_M7XyXJtDg5IFlDisPfHeunFDRlnCl_Z7BPCM6z7r0xt9oRXVvWEJUFU3L0O3tQ156_c1VPF9tCWFchQ2xobY66W0MI_Pi0wl-o-gW5_JNscwuaRbnvi6i4rzb1G_FSjap", "expirationTime": null}	2026-08-30 17:46:35.567131
\.


--
-- TOC entry 3501 (class 0 OID 16406)
-- Dependencies: 216
-- Data for Name: utilisateurs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.utilisateurs (userid, nom, email, phone, mdp, code, type, etat, date_create, username, adresse, prenom, categorieutilisateurid) FROM stdin;
2	Malik Will	gad@gmail.com	243826711828	423#malik	\N	juriste	actif	2026-04-13	will                                              	Beni	\N	\N
1	Gad Malik	gadmalik42@gmail.com	243993886474	423#malik	\N	juriste	actif	2026-03-12	gadmalik                                          	Beni, tamende	\N	\N
6	Malik	gadmalik423@gmail.com	243896711828	$2b$10$TxUHrGAyzZ/pmHD1I4.wouAljiqwC/f0vUjBwPmttFSYTjlBWZpAa	\N	\N	actif	2026-08-25	gadmalik423                                       	Beni	Gad	2
7	Malik	gadmalikidogo@gmail.com	243993886475	\N	663136	\N	en attente	2026-08-30	gmalike                                           	Beni	Gad	1
\.


--
-- TOC entry 3526 (class 0 OID 0)
-- Dependencies: 223
-- Name: article_articleid_seq; Type: SEQUENCE SET; Schema: public; Owner: asuna
--

SELECT pg_catalog.setval('public.article_articleid_seq', 5, true);


--
-- TOC entry 3527 (class 0 OID 0)
-- Dependencies: 221
-- Name: attribuerdossier_attribuerid_seq; Type: SEQUENCE SET; Schema: public; Owner: asuna
--

SELECT pg_catalog.setval('public.attribuerdossier_attribuerid_seq', 10, true);


--
-- TOC entry 3528 (class 0 OID 0)
-- Dependencies: 225
-- Name: categorieutilisateur_categorieutilisateurid_seq; Type: SEQUENCE SET; Schema: public; Owner: asuna
--

SELECT pg_catalog.setval('public.categorieutilisateur_categorieutilisateurid_seq', 3, true);


--
-- TOC entry 3529 (class 0 OID 0)
-- Dependencies: 217
-- Name: cateogie_incident_id_seq; Type: SEQUENCE SET; Schema: public; Owner: asuna
--

SELECT pg_catalog.setval('public.cateogie_incident_id_seq', 2, true);


--
-- TOC entry 3530 (class 0 OID 0)
-- Dependencies: 219
-- Name: incident_id_incident_seq; Type: SEQUENCE SET; Schema: public; Owner: asuna
--

SELECT pg_catalog.setval('public.incident_id_incident_seq', 11, true);


--
-- TOC entry 3531 (class 0 OID 0)
-- Dependencies: 227
-- Name: push_subscriptions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: asuna
--

SELECT pg_catalog.setval('public.push_subscriptions_id_seq', 37, true);


--
-- TOC entry 3532 (class 0 OID 0)
-- Dependencies: 215
-- Name: utilisateurs_userid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.utilisateurs_userid_seq', 7, true);


--
-- TOC entry 3339 (class 2606 OID 16430)
-- Name: categorie_incident categorie_id_pk; Type: CONSTRAINT; Schema: public; Owner: asuna
--

ALTER TABLE ONLY public.categorie_incident
    ADD CONSTRAINT categorie_id_pk PRIMARY KEY (categorie_id);


--
-- TOC entry 3344 (class 2606 OID 33537)
-- Name: categorieutilisateur categorieutilisateur_designation_key; Type: CONSTRAINT; Schema: public; Owner: asuna
--

ALTER TABLE ONLY public.categorieutilisateur
    ADD CONSTRAINT categorieutilisateur_designation_key UNIQUE (designation);


--
-- TOC entry 3346 (class 2606 OID 33535)
-- Name: categorieutilisateur categorieutilisateur_pkey; Type: CONSTRAINT; Schema: public; Owner: asuna
--

ALTER TABLE ONLY public.categorieutilisateur
    ADD CONSTRAINT categorieutilisateur_pkey PRIMARY KEY (categorieutilisateurid);


--
-- TOC entry 3342 (class 2606 OID 16437)
-- Name: incident incident_pk; Type: CONSTRAINT; Schema: public; Owner: asuna
--

ALTER TABLE ONLY public.incident
    ADD CONSTRAINT incident_pk PRIMARY KEY (id_incident);


--
-- TOC entry 3348 (class 2606 OID 33558)
-- Name: push_subscriptions push_subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: asuna
--

ALTER TABLE ONLY public.push_subscriptions
    ADD CONSTRAINT push_subscriptions_pkey PRIMARY KEY (id);


--
-- TOC entry 3350 (class 2606 OID 33560)
-- Name: push_subscriptions push_subscriptions_subscription_key; Type: CONSTRAINT; Schema: public; Owner: asuna
--

ALTER TABLE ONLY public.push_subscriptions
    ADD CONSTRAINT push_subscriptions_subscription_key UNIQUE (subscription);


--
-- TOC entry 3337 (class 2606 OID 16413)
-- Name: utilisateurs utilisateurs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateurs
    ADD CONSTRAINT utilisateurs_pkey PRIMARY KEY (userid);


--
-- TOC entry 3340 (class 1259 OID 16438)
-- Name: categorie_incident_id_idx; Type: INDEX; Schema: public; Owner: asuna
--

CREATE INDEX categorie_incident_id_idx ON public.categorie_incident USING btree (categorie_id);


--
-- TOC entry 3356 (class 2606 OID 16463)
-- Name: article article_utilisateurs_fk; Type: FK CONSTRAINT; Schema: public; Owner: asuna
--

ALTER TABLE ONLY public.article
    ADD CONSTRAINT article_utilisateurs_fk FOREIGN KEY (userid) REFERENCES public.utilisateurs(userid);


--
-- TOC entry 3354 (class 2606 OID 16451)
-- Name: attribuerdossier attribuerdossier_incident_fk; Type: FK CONSTRAINT; Schema: public; Owner: asuna
--

ALTER TABLE ONLY public.attribuerdossier
    ADD CONSTRAINT attribuerdossier_incident_fk FOREIGN KEY (dossierid) REFERENCES public.incident(id_incident);


--
-- TOC entry 3355 (class 2606 OID 16446)
-- Name: attribuerdossier attribuerdossier_utilisateurs_fk; Type: FK CONSTRAINT; Schema: public; Owner: asuna
--

ALTER TABLE ONLY public.attribuerdossier
    ADD CONSTRAINT attribuerdossier_utilisateurs_fk FOREIGN KEY (userid) REFERENCES public.utilisateurs(userid);


--
-- TOC entry 3352 (class 2606 OID 16431)
-- Name: incident incident_categorie_incident_fk; Type: FK CONSTRAINT; Schema: public; Owner: asuna
--

ALTER TABLE ONLY public.incident
    ADD CONSTRAINT incident_categorie_incident_fk FOREIGN KEY (categorieid) REFERENCES public.categorie_incident(categorie_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3353 (class 2606 OID 33544)
-- Name: incident incident_utilisateurs_fk; Type: FK CONSTRAINT; Schema: public; Owner: asuna
--

ALTER TABLE ONLY public.incident
    ADD CONSTRAINT incident_utilisateurs_fk FOREIGN KEY (userid) REFERENCES public.utilisateurs(userid);


--
-- TOC entry 3351 (class 2606 OID 33539)
-- Name: utilisateurs utilisateurs_categorieutilisateur_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateurs
    ADD CONSTRAINT utilisateurs_categorieutilisateur_fk FOREIGN KEY (categorieutilisateurid) REFERENCES public.categorieutilisateur(categorieutilisateurid);


-- Completed on 2026-08-30 19:53:02 CAT

--
-- PostgreSQL database dump complete
--

\unrestrict oRPGhqN488PAtd0JhXeFeQdNw2MINl71CxjsqTBEKdmoLVKXO2b4JVMkhyHYP7z

