--
-- PostgreSQL database dump
--

\restrict 3P8Byf6RUhwpnyLTViaPsci6C1Ab5P6N3hnVTdW5oYQBVqlAZKKe33Elej531hw

-- Dumped from database version 16.13 (Ubuntu 16.13-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.13 (Ubuntu 16.13-0ubuntu0.24.04.1)

-- Started on 2026-09-18 18:09:32 CAT

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
-- TOC entry 3615 (class 0 OID 0)
-- Dependencies: 223
-- Name: article_articleid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: asuna
--

ALTER SEQUENCE public.article_articleid_seq OWNED BY public.article.articleid;


--
-- TOC entry 234 (class 1259 OID 33719)
-- Name: assignercategorieutilisateurorg; Type: TABLE; Schema: public; Owner: asuna
--

CREATE TABLE public.assignercategorieutilisateurorg (
    assignercategorieutilisateurorgid uuid DEFAULT gen_random_uuid() NOT NULL,
    status character varying(50) DEFAULT 'actif'::character varying,
    date_attribution timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    organisationid uuid,
    userid integer
);


ALTER TABLE public.assignercategorieutilisateurorg OWNER TO asuna;

--
-- TOC entry 237 (class 1259 OID 33782)
-- Name: assignerdomaine; Type: TABLE; Schema: public; Owner: asuna
--

CREATE TABLE public.assignerdomaine (
    assignerdomaineid uuid DEFAULT gen_random_uuid() NOT NULL,
    organisationid uuid,
    categorie_id integer NOT NULL,
    status character varying(10) DEFAULT 'actif'::character varying NOT NULL,
    userid integer
);


ALTER TABLE public.assignerdomaine OWNER TO asuna;

--
-- TOC entry 236 (class 1259 OID 33768)
-- Name: assignerfonctionnalites; Type: TABLE; Schema: public; Owner: asuna
--

CREATE TABLE public.assignerfonctionnalites (
    fonctionnaliteid uuid NOT NULL,
    categorieutilisateurid integer NOT NULL,
    compte character varying(10) DEFAULT 'main'::character varying NOT NULL,
    assignerfonctionnalitesid uuid DEFAULT gen_random_uuid() NOT NULL,
    status character varying(10) DEFAULT 'actif'::character varying NOT NULL
);


ALTER TABLE public.assignerfonctionnalites OWNER TO asuna;

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
-- TOC entry 3616 (class 0 OID 0)
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
    confirm boolean DEFAULT true NOT NULL,
    organisation boolean DEFAULT false NOT NULL,
    status character varying(10) DEFAULT 'actif'::character varying NOT NULL
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
-- TOC entry 3617 (class 0 OID 0)
-- Dependencies: 225
-- Name: categorieutilisateur_categorieutilisateurid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: asuna
--

ALTER SEQUENCE public.categorieutilisateur_categorieutilisateurid_seq OWNED BY public.categorieutilisateur.categorieutilisateurid;


--
-- TOC entry 233 (class 1259 OID 33709)
-- Name: categorieutilisateurorg; Type: TABLE; Schema: public; Owner: asuna
--

CREATE TABLE public.categorieutilisateurorg (
    categorieutilisateurorgid integer NOT NULL,
    libelle character varying(100) NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(50) DEFAULT 'actif'::character varying,
    organisationid uuid
);


ALTER TABLE public.categorieutilisateurorg OWNER TO asuna;

--
-- TOC entry 232 (class 1259 OID 33708)
-- Name: categorieutilisateurorg_categorieutilisateurorgid_seq; Type: SEQUENCE; Schema: public; Owner: asuna
--

CREATE SEQUENCE public.categorieutilisateurorg_categorieutilisateurorgid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categorieutilisateurorg_categorieutilisateurorgid_seq OWNER TO asuna;

--
-- TOC entry 3618 (class 0 OID 0)
-- Dependencies: 232
-- Name: categorieutilisateurorg_categorieutilisateurorgid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: asuna
--

ALTER SEQUENCE public.categorieutilisateurorg_categorieutilisateurorgid_seq OWNED BY public.categorieutilisateurorg.categorieutilisateurorgid;


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
-- TOC entry 3619 (class 0 OID 0)
-- Dependencies: 217
-- Name: cateogie_incident_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: asuna
--

ALTER SEQUENCE public.cateogie_incident_id_seq OWNED BY public.categorie_incident.categorie_id;


--
-- TOC entry 235 (class 1259 OID 33747)
-- Name: fonctionnalites; Type: TABLE; Schema: public; Owner: asuna
--

CREATE TABLE public.fonctionnalites (
    fonctionnaliteid uuid DEFAULT gen_random_uuid() NOT NULL,
    designation character varying(150) NOT NULL,
    description text,
    icone character varying(100),
    route character varying(255),
    parentid uuid,
    ordre_affichage integer DEFAULT 0,
    status boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.fonctionnalites OWNER TO asuna;

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
-- TOC entry 3620 (class 0 OID 0)
-- Dependencies: 219
-- Name: incident_id_incident_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: asuna
--

ALTER SEQUENCE public.incident_id_incident_seq OWNED BY public.incident.id_incident;


--
-- TOC entry 231 (class 1259 OID 33665)
-- Name: organisation; Type: TABLE; Schema: public; Owner: asuna
--

CREATE TABLE public.organisation (
    organisationid uuid DEFAULT gen_random_uuid() NOT NULL,
    designation character varying(255) NOT NULL,
    sigle character varying(50),
    typeorganisationid integer NOT NULL,
    pays character varying(100) NOT NULL,
    province character varying(100),
    ville character varying(100) NOT NULL,
    adresse_org text,
    phone_org character varying(50),
    email_org character varying(255) NOT NULL,
    site_web character varying(255),
    reseaux_sociaux text,
    logo_url character varying(500),
    userid integer NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying DEFAULT 'en_attente'::character varying NOT NULL,
    config boolean DEFAULT false NOT NULL
);


ALTER TABLE public.organisation OWNER TO asuna;

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
-- TOC entry 3621 (class 0 OID 0)
-- Dependencies: 227
-- Name: push_subscriptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: asuna
--

ALTER SEQUENCE public.push_subscriptions_id_seq OWNED BY public.push_subscriptions.id;


--
-- TOC entry 230 (class 1259 OID 33654)
-- Name: type_organisation; Type: TABLE; Schema: public; Owner: asuna
--

CREATE TABLE public.type_organisation (
    typeorganisationid integer NOT NULL,
    libelle character varying(100) NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.type_organisation OWNER TO asuna;

--
-- TOC entry 229 (class 1259 OID 33653)
-- Name: type_organisation_typeorganisationid_seq; Type: SEQUENCE; Schema: public; Owner: asuna
--

CREATE SEQUENCE public.type_organisation_typeorganisationid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.type_organisation_typeorganisationid_seq OWNER TO asuna;

--
-- TOC entry 3622 (class 0 OID 0)
-- Dependencies: 229
-- Name: type_organisation_typeorganisationid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: asuna
--

ALTER SEQUENCE public.type_organisation_typeorganisationid_seq OWNED BY public.type_organisation.typeorganisationid;


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
    type character varying(20) DEFAULT 'main'::character varying NOT NULL,
    etat character varying(20),
    date_create date,
    username character(50) NOT NULL,
    adresse text,
    prenom character varying,
    categorieutilisateurid integer,
    config boolean DEFAULT true NOT NULL
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
-- TOC entry 3623 (class 0 OID 0)
-- Dependencies: 215
-- Name: utilisateurs_userid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.utilisateurs_userid_seq OWNED BY public.utilisateurs.userid;


--
-- TOC entry 3362 (class 2604 OID 16460)
-- Name: article articleid; Type: DEFAULT; Schema: public; Owner: asuna
--

ALTER TABLE ONLY public.article ALTER COLUMN articleid SET DEFAULT nextval('public.article_articleid_seq'::regclass);


--
-- TOC entry 3361 (class 2604 OID 16443)
-- Name: attribuerdossier attribuerid; Type: DEFAULT; Schema: public; Owner: asuna
--

ALTER TABLE ONLY public.attribuerdossier ALTER COLUMN attribuerid SET DEFAULT nextval('public.attribuerdossier_attribuerid_seq'::regclass);


--
-- TOC entry 3358 (class 2604 OID 16418)
-- Name: categorie_incident categorie_id; Type: DEFAULT; Schema: public; Owner: asuna
--

ALTER TABLE ONLY public.categorie_incident ALTER COLUMN categorie_id SET DEFAULT nextval('public.cateogie_incident_id_seq'::regclass);


--
-- TOC entry 3363 (class 2604 OID 33530)
-- Name: categorieutilisateur categorieutilisateurid; Type: DEFAULT; Schema: public; Owner: asuna
--

ALTER TABLE ONLY public.categorieutilisateur ALTER COLUMN categorieutilisateurid SET DEFAULT nextval('public.categorieutilisateur_categorieutilisateurid_seq'::regclass);


--
-- TOC entry 3377 (class 2604 OID 33712)
-- Name: categorieutilisateurorg categorieutilisateurorgid; Type: DEFAULT; Schema: public; Owner: asuna
--

ALTER TABLE ONLY public.categorieutilisateurorg ALTER COLUMN categorieutilisateurorgid SET DEFAULT nextval('public.categorieutilisateurorg_categorieutilisateurorgid_seq'::regclass);


--
-- TOC entry 3359 (class 2604 OID 16425)
-- Name: incident id_incident; Type: DEFAULT; Schema: public; Owner: asuna
--

ALTER TABLE ONLY public.incident ALTER COLUMN id_incident SET DEFAULT nextval('public.incident_id_incident_seq'::regclass);


--
-- TOC entry 3368 (class 2604 OID 33553)
-- Name: push_subscriptions id; Type: DEFAULT; Schema: public; Owner: asuna
--

ALTER TABLE ONLY public.push_subscriptions ALTER COLUMN id SET DEFAULT nextval('public.push_subscriptions_id_seq'::regclass);


--
-- TOC entry 3370 (class 2604 OID 33657)
-- Name: type_organisation typeorganisationid; Type: DEFAULT; Schema: public; Owner: asuna
--

ALTER TABLE ONLY public.type_organisation ALTER COLUMN typeorganisationid SET DEFAULT nextval('public.type_organisation_typeorganisationid_seq'::regclass);


--
-- TOC entry 3355 (class 2604 OID 16409)
-- Name: utilisateurs userid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateurs ALTER COLUMN userid SET DEFAULT nextval('public.utilisateurs_userid_seq'::regclass);


--
-- TOC entry 3596 (class 0 OID 16457)
-- Dependencies: 224
-- Data for Name: article; Type: TABLE DATA; Schema: public; Owner: asuna
--

COPY public.article (articleid, titre, date_create, contenu, piecesjointes, typepiece, userid) FROM stdin;
\.


--
-- TOC entry 3606 (class 0 OID 33719)
-- Dependencies: 234
-- Data for Name: assignercategorieutilisateurorg; Type: TABLE DATA; Schema: public; Owner: asuna
--

COPY public.assignercategorieutilisateurorg (assignercategorieutilisateurorgid, status, date_attribution, created_at, updated_at, organisationid, userid) FROM stdin;
\.


--
-- TOC entry 3609 (class 0 OID 33782)
-- Dependencies: 237
-- Data for Name: assignerdomaine; Type: TABLE DATA; Schema: public; Owner: asuna
--

COPY public.assignerdomaine (assignerdomaineid, organisationid, categorie_id, status, userid) FROM stdin;
036eabcd-738b-4d80-8782-d417bd6b2e6c	\N	1	actif	15
d1b54f2e-b965-46fc-9ff9-f37c38e922a0	\N	1	actif	15
66dab510-5c66-4cbc-87fc-65cb1bdcef67	\N	1	actif	15
34f559cc-652d-463f-9f67-c572c1e8d227	\N	2	actif	15
971b601b-75c9-4861-ad45-9dc7aeab3adc	\N	1	actif	15
65c8c77c-7d03-462c-a89f-ce8a7f1c531c	\N	1	actif	15
5f737bd4-9588-4d98-9c32-748299bb2935	\N	1	actif	15
9bcbf654-5dae-4106-b3e7-f35f9b1797b8	\N	2	actif	15
\.


--
-- TOC entry 3608 (class 0 OID 33768)
-- Dependencies: 236
-- Data for Name: assignerfonctionnalites; Type: TABLE DATA; Schema: public; Owner: asuna
--

COPY public.assignerfonctionnalites (fonctionnaliteid, categorieutilisateurid, compte, assignerfonctionnalitesid, status) FROM stdin;
8f92487c-d69d-4184-be60-babcc503b3c4	7	main	35b8c36f-280e-4b45-8cfd-10d36287ab95	actif
050f7912-a567-4fe4-8bd2-9ad3c20379e3	7	main	7112cec0-ccfa-4505-8d91-dfa759468ec0	actif
cc33486d-dcad-4698-8471-31ec7f27c928	7	main	d4d7390f-4a52-43cd-99b1-d555adb53bae	actif
39aea7c2-f60d-400e-8be9-694c29681262	8	main	3c662c84-cef6-444d-b179-c06f0b00fde4	actif
050f7912-a567-4fe4-8bd2-9ad3c20379e3	8	main	5be86ade-8fda-4726-a395-fb89ccc2eda1	actif
cc33486d-dcad-4698-8471-31ec7f27c928	8	main	43fcc03c-636d-45b8-89d3-282ee267c7f5	actif
8f92487c-d69d-4184-be60-babcc503b3c4	8	main	7a340b59-a131-417c-8ad7-65b1aadda396	actif
e2d629f8-ea79-4bc3-96d7-604e98725cd8	8	main	02559836-cae8-47d4-8991-c7cf387ff147	actif
39aea7c2-f60d-400e-8be9-694c29681262	9	main	fee79cdc-235f-4af2-a96a-f593ba346921	actif
e2d629f8-ea79-4bc3-96d7-604e98725cd8	9	main	5b5ffa28-64d4-4c33-a2fe-2999b95ec4fa	actif
8f92487c-d69d-4184-be60-babcc503b3c4	9	main	6204bad5-e62b-44c6-bb26-dd300250b86a	actif
5b689762-0e81-4311-91a1-e48389957242	9	main	453609cb-f396-47f2-8d7a-425dc4cd23aa	actif
cc33486d-dcad-4698-8471-31ec7f27c928	9	main	6ba994d4-58c7-4e87-aa5e-749e67cc8225	actif
23b6eafc-485e-42e9-ba0a-5c14ae574a8d	9	main	06d1fd75-991e-4bc6-9c64-d863b87cac5b	actif
050f7912-a567-4fe4-8bd2-9ad3c20379e3	9	main	2f64e2c9-5563-4f1b-8e39-b3cf58801fc2	actif
39aea7c2-f60d-400e-8be9-694c29681262	10	main	c59db550-4f49-4a47-bcc5-e1f77a93d2ba	actif
8f92487c-d69d-4184-be60-babcc503b3c4	10	main	1656124a-3f64-41f7-a45c-7090f227c437	actif
e2d629f8-ea79-4bc3-96d7-604e98725cd8	10	main	54c402ba-4fe3-4293-be91-cb9562a57080	actif
5b689762-0e81-4311-91a1-e48389957242	10	main	c4ff1901-92e1-4c5c-aa34-e52394034180	actif
65030167-b59d-4530-975b-d5b8c1428903	10	main	027d5c3d-61c6-4a05-aca1-dae9dc77674d	actif
23b6eafc-485e-42e9-ba0a-5c14ae574a8d	10	main	a9b0d409-f923-46c7-9c3c-5438ed9ee82e	actif
8fe38924-e0fc-4032-b341-4d8e6a50b838	10	main	5e823b08-c53c-4e7d-bcf6-8c9424f83463	actif
050f7912-a567-4fe4-8bd2-9ad3c20379e3	10	main	198b1eb0-19c4-48fa-bbc9-825ab1c4625a	actif
9514a938-9ce1-4717-ba95-a92c94f44abf	10	main	b9f2943d-be63-4499-95eb-5626db4d3ba1	actif
cc33486d-dcad-4698-8471-31ec7f27c928	10	main	8478285b-29fb-4813-9ad9-bffcde59b97c	actif
\.


--
-- TOC entry 3594 (class 0 OID 16440)
-- Dependencies: 222
-- Data for Name: attribuerdossier; Type: TABLE DATA; Schema: public; Owner: asuna
--

COPY public.attribuerdossier (attribuerid, date, status, userid, dossierid) FROM stdin;
\.


--
-- TOC entry 3590 (class 0 OID 16415)
-- Dependencies: 218
-- Data for Name: categorie_incident; Type: TABLE DATA; Schema: public; Owner: asuna
--

COPY public.categorie_incident (categorie_id, designation, etat, date, niveau) FROM stdin;
1	Fraude	actif	2026-03-19	faible
2	Corruption	actif	2026-03-19	moyen
\.


--
-- TOC entry 3598 (class 0 OID 33527)
-- Dependencies: 226
-- Data for Name: categorieutilisateur; Type: TABLE DATA; Schema: public; Owner: asuna
--

COPY public.categorieutilisateur (categorieutilisateurid, designation, description, created_at, confirm, organisation, status) FROM stdin;
8	Professionnel	professionnel	2026-09-17 20:49:32.512798+02	t	f	actif
9	Organisation	organisation	2026-09-17 20:50:23.799112+02	t	f	actif
10	Administrateur	admin	2026-09-17 20:51:10.752653+02	t	f	actif
7	Utilisateur	utilisateur normal	2026-09-17 20:48:32.165122+02	f	f	actif
\.


--
-- TOC entry 3605 (class 0 OID 33709)
-- Dependencies: 233
-- Data for Name: categorieutilisateurorg; Type: TABLE DATA; Schema: public; Owner: asuna
--

COPY public.categorieutilisateurorg (categorieutilisateurorgid, libelle, description, created_at, status, organisationid) FROM stdin;
\.


--
-- TOC entry 3607 (class 0 OID 33747)
-- Dependencies: 235
-- Data for Name: fonctionnalites; Type: TABLE DATA; Schema: public; Owner: asuna
--

COPY public.fonctionnalites (fonctionnaliteid, designation, description, icone, route, parentid, ordre_affichage, status, created_at, updated_at) FROM stdin;
39aea7c2-f60d-400e-8be9-694c29681262	Dashboard	description	dashboard	/dashboard	\N	0	t	2026-09-17 09:54:23.189805+02	2026-09-17 09:54:23.189805+02
e2d629f8-ea79-4bc3-96d7-604e98725cd8	Dossiers	gestion des dossiers	folder-open	/dossiers	\N	0	t	2026-09-17 20:33:26.779412+02	2026-09-17 20:33:26.779412+02
8f92487c-d69d-4184-be60-babcc503b3c4	Mes signalements	signalements	exclamation-triangle	/mysignalement	\N	0	t	2026-09-17 20:34:52.654275+02	2026-09-17 20:34:52.654275+02
65030167-b59d-4530-975b-d5b8c1428903	Orgaisations	/organisations	institution	organisations	\N	0	t	2026-09-17 20:36:12.526667+02	2026-09-17 20:36:12.526667+02
5b689762-0e81-4311-91a1-e48389957242	Gestion d'utilisateurs	/organisations	user-tie	/utilisateursorg	\N	0	t	2026-09-17 20:37:30.50285+02	2026-09-17 20:37:30.50285+02
23b6eafc-485e-42e9-ba0a-5c14ae574a8d	Categories d'utilisateurs	categorie utilisateurs organisation	user-tag	/categorieutilisateurorg	\N	0	t	2026-09-17 20:38:24.991807+02	2026-09-17 20:38:24.991807+02
9514a938-9ce1-4717-ba95-a92c94f44abf	Categories d'utilisateurs (main)	categorie utilisateurs 	user-tag	/categorieutilisateur	\N	0	t	2026-09-17 20:38:53.749687+02	2026-09-17 20:38:53.749687+02
8fe38924-e0fc-4032-b341-4d8e6a50b838	Utilisateurs	confirmtions utilisateurs, 	users	/utilisateurs	\N	0	t	2026-09-17 20:39:29.147126+02	2026-09-17 20:39:29.147126+02
050f7912-a567-4fe4-8bd2-9ad3c20379e3	Articles	articles	newspaper	/articles	\N	0	t	2026-09-17 20:40:08.96236+02	2026-09-17 20:40:08.96236+02
cc33486d-dcad-4698-8471-31ec7f27c928	Parametres	parametres	cog	/parametres	\N	0	t	2026-09-17 20:41:07.445655+02	2026-09-17 20:41:07.445655+02
\.


--
-- TOC entry 3592 (class 0 OID 16422)
-- Dependencies: 220
-- Data for Name: incident; Type: TABLE DATA; Schema: public; Owner: asuna
--

COPY public.incident (lieu, id_incident, description, date_incident, status, anonyme, categorieid, annexe, typeannexe, date_create, userid) FROM stdin;
Beni	13	Bebebe	2026-09-18	actif	\N	1	\N	\N	2026-09-18	16
Beni	14	Gedfff	2026-09-18	actif	\N	1	\N	\N	2026-09-18	16
Beni	15	Gedfff	2026-09-18	actif	\N	1	\N	\N	2026-09-18	16
\.


--
-- TOC entry 3603 (class 0 OID 33665)
-- Dependencies: 231
-- Data for Name: organisation; Type: TABLE DATA; Schema: public; Owner: asuna
--

COPY public.organisation (organisationid, designation, sigle, typeorganisationid, pays, province, ville, adresse_org, phone_org, email_org, site_web, reseaux_sociaux, logo_url, userid, created_at, updated_at, status, config) FROM stdin;
\.


--
-- TOC entry 3600 (class 0 OID 33550)
-- Dependencies: 228
-- Data for Name: push_subscriptions; Type: TABLE DATA; Schema: public; Owner: asuna
--

COPY public.push_subscriptions (id, userid, subscription, created_at) FROM stdin;
228	15	{"keys": {"auth": "Jn8Yj4BOTFRm8iGHJvQ65g", "p256dh": "BNoYwQN42-XDbSN-3_jm54-hJrG8m86gnUhQZu5btoD-O1HVFFGnue0clf1Ri6syd0BwarUtfLtA0Slk4P3H23M"}, "endpoint": "https://fcm.googleapis.com/fcm/send/c_W3Un6048c:APA91bEwJALdIIet8DSasQWo2oNarvsbmX8BkIZj2aireU2jnd2cqUdrhQrbc4qdNDRQ1BNooeRSGn6Uk12lVtklf2b9e7V-bYnUbGfimOTsFr5XT-Idt9IhjRMCVqtGHlDViFY3to3B", "expirationTime": null}	2026-09-18 15:01:07.45581
\.


--
-- TOC entry 3602 (class 0 OID 33654)
-- Dependencies: 230
-- Data for Name: type_organisation; Type: TABLE DATA; Schema: public; Owner: asuna
--

COPY public.type_organisation (typeorganisationid, libelle, description, created_at) FROM stdin;
1	Entreprise privée	\N	2026-09-07 19:53:56.934111+02
2	ONG / Association	\N	2026-09-07 19:53:56.934111+02
3	Institution publique	\N	2026-09-07 19:53:56.934111+02
4	Autre	\N	2026-09-07 19:53:56.934111+02
\.


--
-- TOC entry 3588 (class 0 OID 16406)
-- Dependencies: 216
-- Data for Name: utilisateurs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.utilisateurs (userid, nom, email, phone, mdp, code, type, etat, date_create, username, adresse, prenom, categorieutilisateurid, config) FROM stdin;
15	Malik	gadmalik423@gmail.com	0993886474	$2b$10$dEMAbNEc3H1DjRR0mOpYO.1lHJvq1JpB.IeaSwvrEE5sQ0rPqIFKy	\N	main	actif	2026-09-18	gadmalik                                          	C. MULEKERA	Gad	8	t
16	Malik	gadmalikidogo@gmail.com	243826711828	$2b$10$.aa6nDlrO6JtGb8F6mXkm.cDuWSDwDmv7T0YCZe5h3A0NlzfpWNZW	\N	main	actif	2026-09-18	gmalik                                            	423	Gad	7	f
\.


--
-- TOC entry 3624 (class 0 OID 0)
-- Dependencies: 223
-- Name: article_articleid_seq; Type: SEQUENCE SET; Schema: public; Owner: asuna
--

SELECT pg_catalog.setval('public.article_articleid_seq', 5, true);


--
-- TOC entry 3625 (class 0 OID 0)
-- Dependencies: 221
-- Name: attribuerdossier_attribuerid_seq; Type: SEQUENCE SET; Schema: public; Owner: asuna
--

SELECT pg_catalog.setval('public.attribuerdossier_attribuerid_seq', 11, true);


--
-- TOC entry 3626 (class 0 OID 0)
-- Dependencies: 225
-- Name: categorieutilisateur_categorieutilisateurid_seq; Type: SEQUENCE SET; Schema: public; Owner: asuna
--

SELECT pg_catalog.setval('public.categorieutilisateur_categorieutilisateurid_seq', 10, true);


--
-- TOC entry 3627 (class 0 OID 0)
-- Dependencies: 232
-- Name: categorieutilisateurorg_categorieutilisateurorgid_seq; Type: SEQUENCE SET; Schema: public; Owner: asuna
--

SELECT pg_catalog.setval('public.categorieutilisateurorg_categorieutilisateurorgid_seq', 10, true);


--
-- TOC entry 3628 (class 0 OID 0)
-- Dependencies: 217
-- Name: cateogie_incident_id_seq; Type: SEQUENCE SET; Schema: public; Owner: asuna
--

SELECT pg_catalog.setval('public.cateogie_incident_id_seq', 2, true);


--
-- TOC entry 3629 (class 0 OID 0)
-- Dependencies: 219
-- Name: incident_id_incident_seq; Type: SEQUENCE SET; Schema: public; Owner: asuna
--

SELECT pg_catalog.setval('public.incident_id_incident_seq', 15, true);


--
-- TOC entry 3630 (class 0 OID 0)
-- Dependencies: 227
-- Name: push_subscriptions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: asuna
--

SELECT pg_catalog.setval('public.push_subscriptions_id_seq', 241, true);


--
-- TOC entry 3631 (class 0 OID 0)
-- Dependencies: 229
-- Name: type_organisation_typeorganisationid_seq; Type: SEQUENCE SET; Schema: public; Owner: asuna
--

SELECT pg_catalog.setval('public.type_organisation_typeorganisationid_seq', 6, true);


--
-- TOC entry 3632 (class 0 OID 0)
-- Dependencies: 215
-- Name: utilisateurs_userid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.utilisateurs_userid_seq', 16, true);


--
-- TOC entry 3421 (class 2606 OID 33728)
-- Name: assignercategorieutilisateurorg assignercategorieutilisateurorg_pkey; Type: CONSTRAINT; Schema: public; Owner: asuna
--

ALTER TABLE ONLY public.assignercategorieutilisateurorg
    ADD CONSTRAINT assignercategorieutilisateurorg_pkey PRIMARY KEY (assignercategorieutilisateurorgid);


--
-- TOC entry 3428 (class 2606 OID 33787)
-- Name: assignerdomaine assignerdomaine_pkey; Type: CONSTRAINT; Schema: public; Owner: asuna
--

ALTER TABLE ONLY public.assignerdomaine
    ADD CONSTRAINT assignerdomaine_pkey PRIMARY KEY (assignerdomaineid);


--
-- TOC entry 3426 (class 2606 OID 33773)
-- Name: assignerfonctionnalites assignerfonctionnalites_pkey; Type: CONSTRAINT; Schema: public; Owner: asuna
--

ALTER TABLE ONLY public.assignerfonctionnalites
    ADD CONSTRAINT assignerfonctionnalites_pkey PRIMARY KEY (assignerfonctionnalitesid);


--
-- TOC entry 3398 (class 2606 OID 16430)
-- Name: categorie_incident categorie_id_pk; Type: CONSTRAINT; Schema: public; Owner: asuna
--

ALTER TABLE ONLY public.categorie_incident
    ADD CONSTRAINT categorie_id_pk PRIMARY KEY (categorie_id);


--
-- TOC entry 3403 (class 2606 OID 33537)
-- Name: categorieutilisateur categorieutilisateur_designation_key; Type: CONSTRAINT; Schema: public; Owner: asuna
--

ALTER TABLE ONLY public.categorieutilisateur
    ADD CONSTRAINT categorieutilisateur_designation_key UNIQUE (designation);


--
-- TOC entry 3405 (class 2606 OID 33535)
-- Name: categorieutilisateur categorieutilisateur_pkey; Type: CONSTRAINT; Schema: public; Owner: asuna
--

ALTER TABLE ONLY public.categorieutilisateur
    ADD CONSTRAINT categorieutilisateur_pkey PRIMARY KEY (categorieutilisateurid);


--
-- TOC entry 3419 (class 2606 OID 33718)
-- Name: categorieutilisateurorg categorieutilisateurorg_pkey; Type: CONSTRAINT; Schema: public; Owner: asuna
--

ALTER TABLE ONLY public.categorieutilisateurorg
    ADD CONSTRAINT categorieutilisateurorg_pkey PRIMARY KEY (categorieutilisateurorgid);


--
-- TOC entry 3423 (class 2606 OID 33758)
-- Name: fonctionnalites fonctionnalite_pkey; Type: CONSTRAINT; Schema: public; Owner: asuna
--

ALTER TABLE ONLY public.fonctionnalites
    ADD CONSTRAINT fonctionnalite_pkey PRIMARY KEY (fonctionnaliteid);


--
-- TOC entry 3401 (class 2606 OID 16437)
-- Name: incident incident_pk; Type: CONSTRAINT; Schema: public; Owner: asuna
--

ALTER TABLE ONLY public.incident
    ADD CONSTRAINT incident_pk PRIMARY KEY (id_incident);


--
-- TOC entry 3417 (class 2606 OID 33674)
-- Name: organisation organisation_pkey; Type: CONSTRAINT; Schema: public; Owner: asuna
--

ALTER TABLE ONLY public.organisation
    ADD CONSTRAINT organisation_pkey PRIMARY KEY (organisationid);


--
-- TOC entry 3407 (class 2606 OID 33558)
-- Name: push_subscriptions push_subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: asuna
--

ALTER TABLE ONLY public.push_subscriptions
    ADD CONSTRAINT push_subscriptions_pkey PRIMARY KEY (id);


--
-- TOC entry 3409 (class 2606 OID 33560)
-- Name: push_subscriptions push_subscriptions_subscription_key; Type: CONSTRAINT; Schema: public; Owner: asuna
--

ALTER TABLE ONLY public.push_subscriptions
    ADD CONSTRAINT push_subscriptions_subscription_key UNIQUE (subscription);


--
-- TOC entry 3411 (class 2606 OID 33664)
-- Name: type_organisation type_organisation_libelle_key; Type: CONSTRAINT; Schema: public; Owner: asuna
--

ALTER TABLE ONLY public.type_organisation
    ADD CONSTRAINT type_organisation_libelle_key UNIQUE (libelle);


--
-- TOC entry 3413 (class 2606 OID 33662)
-- Name: type_organisation type_organisation_pkey; Type: CONSTRAINT; Schema: public; Owner: asuna
--

ALTER TABLE ONLY public.type_organisation
    ADD CONSTRAINT type_organisation_pkey PRIMARY KEY (typeorganisationid);


--
-- TOC entry 3396 (class 2606 OID 16413)
-- Name: utilisateurs utilisateurs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateurs
    ADD CONSTRAINT utilisateurs_pkey PRIMARY KEY (userid);


--
-- TOC entry 3399 (class 1259 OID 16438)
-- Name: categorie_incident_id_idx; Type: INDEX; Schema: public; Owner: asuna
--

CREATE INDEX categorie_incident_id_idx ON public.categorie_incident USING btree (categorie_id);


--
-- TOC entry 3424 (class 1259 OID 33764)
-- Name: idx_fonctionnalite_parent; Type: INDEX; Schema: public; Owner: asuna
--

CREATE INDEX idx_fonctionnalite_parent ON public.fonctionnalites USING btree (parentid);


--
-- TOC entry 3414 (class 1259 OID 33686)
-- Name: idx_organisation_type_id; Type: INDEX; Schema: public; Owner: asuna
--

CREATE INDEX idx_organisation_type_id ON public.organisation USING btree (typeorganisationid);


--
-- TOC entry 3415 (class 1259 OID 33685)
-- Name: idx_organisation_userid; Type: INDEX; Schema: public; Owner: asuna
--

CREATE INDEX idx_organisation_userid ON public.organisation USING btree (userid);


--
-- TOC entry 3434 (class 2606 OID 16463)
-- Name: article article_utilisateurs_fk; Type: FK CONSTRAINT; Schema: public; Owner: asuna
--

ALTER TABLE ONLY public.article
    ADD CONSTRAINT article_utilisateurs_fk FOREIGN KEY (userid) REFERENCES public.utilisateurs(userid);


--
-- TOC entry 3438 (class 2606 OID 33734)
-- Name: assignercategorieutilisateurorg assignercategorieutilisateurorg_organisation_fk; Type: FK CONSTRAINT; Schema: public; Owner: asuna
--

ALTER TABLE ONLY public.assignercategorieutilisateurorg
    ADD CONSTRAINT assignercategorieutilisateurorg_organisation_fk FOREIGN KEY (organisationid) REFERENCES public.organisation(organisationid);


--
-- TOC entry 3439 (class 2606 OID 33739)
-- Name: assignercategorieutilisateurorg assignercategorieutilisateurorg_utilisateurs_fk; Type: FK CONSTRAINT; Schema: public; Owner: asuna
--

ALTER TABLE ONLY public.assignercategorieutilisateurorg
    ADD CONSTRAINT assignercategorieutilisateurorg_utilisateurs_fk FOREIGN KEY (userid) REFERENCES public.utilisateurs(userid);


--
-- TOC entry 3432 (class 2606 OID 16451)
-- Name: attribuerdossier attribuerdossier_incident_fk; Type: FK CONSTRAINT; Schema: public; Owner: asuna
--

ALTER TABLE ONLY public.attribuerdossier
    ADD CONSTRAINT attribuerdossier_incident_fk FOREIGN KEY (dossierid) REFERENCES public.incident(id_incident);


--
-- TOC entry 3433 (class 2606 OID 16446)
-- Name: attribuerdossier attribuerdossier_utilisateurs_fk; Type: FK CONSTRAINT; Schema: public; Owner: asuna
--

ALTER TABLE ONLY public.attribuerdossier
    ADD CONSTRAINT attribuerdossier_utilisateurs_fk FOREIGN KEY (userid) REFERENCES public.utilisateurs(userid);


--
-- TOC entry 3442 (class 2606 OID 33788)
-- Name: assignerdomaine categori_id; Type: FK CONSTRAINT; Schema: public; Owner: asuna
--

ALTER TABLE ONLY public.assignerdomaine
    ADD CONSTRAINT categori_id FOREIGN KEY (categorie_id) REFERENCES public.categorie_incident(categorie_id);


--
-- TOC entry 3437 (class 2606 OID 33729)
-- Name: categorieutilisateurorg categorieutilisateurorg_organisation_fk; Type: FK CONSTRAINT; Schema: public; Owner: asuna
--

ALTER TABLE ONLY public.categorieutilisateurorg
    ADD CONSTRAINT categorieutilisateurorg_organisation_fk FOREIGN KEY (organisationid) REFERENCES public.organisation(organisationid);


--
-- TOC entry 3440 (class 2606 OID 33759)
-- Name: fonctionnalites fk_fonctionnalite_parent; Type: FK CONSTRAINT; Schema: public; Owner: asuna
--

ALTER TABLE ONLY public.fonctionnalites
    ADD CONSTRAINT fk_fonctionnalite_parent FOREIGN KEY (parentid) REFERENCES public.fonctionnalites(fonctionnaliteid) ON DELETE SET NULL;


--
-- TOC entry 3435 (class 2606 OID 33675)
-- Name: organisation fk_organisation_type; Type: FK CONSTRAINT; Schema: public; Owner: asuna
--

ALTER TABLE ONLY public.organisation
    ADD CONSTRAINT fk_organisation_type FOREIGN KEY (typeorganisationid) REFERENCES public.type_organisation(typeorganisationid) ON DELETE RESTRICT;


--
-- TOC entry 3436 (class 2606 OID 33680)
-- Name: organisation fk_organisation_user; Type: FK CONSTRAINT; Schema: public; Owner: asuna
--

ALTER TABLE ONLY public.organisation
    ADD CONSTRAINT fk_organisation_user FOREIGN KEY (userid) REFERENCES public.utilisateurs(userid) ON DELETE CASCADE;


--
-- TOC entry 3441 (class 2606 OID 33774)
-- Name: assignerfonctionnalites fonctionnalite_assignfonction; Type: FK CONSTRAINT; Schema: public; Owner: asuna
--

ALTER TABLE ONLY public.assignerfonctionnalites
    ADD CONSTRAINT fonctionnalite_assignfonction FOREIGN KEY (fonctionnaliteid) REFERENCES public.fonctionnalites(fonctionnaliteid);


--
-- TOC entry 3430 (class 2606 OID 16431)
-- Name: incident incident_categorie_incident_fk; Type: FK CONSTRAINT; Schema: public; Owner: asuna
--

ALTER TABLE ONLY public.incident
    ADD CONSTRAINT incident_categorie_incident_fk FOREIGN KEY (categorieid) REFERENCES public.categorie_incident(categorie_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3431 (class 2606 OID 33544)
-- Name: incident incident_utilisateurs_fk; Type: FK CONSTRAINT; Schema: public; Owner: asuna
--

ALTER TABLE ONLY public.incident
    ADD CONSTRAINT incident_utilisateurs_fk FOREIGN KEY (userid) REFERENCES public.utilisateurs(userid);


--
-- TOC entry 3443 (class 2606 OID 33793)
-- Name: assignerdomaine orgnisationid; Type: FK CONSTRAINT; Schema: public; Owner: asuna
--

ALTER TABLE ONLY public.assignerdomaine
    ADD CONSTRAINT orgnisationid FOREIGN KEY (organisationid) REFERENCES public.organisation(organisationid);


--
-- TOC entry 3429 (class 2606 OID 33539)
-- Name: utilisateurs utilisateurs_categorieutilisateur_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateurs
    ADD CONSTRAINT utilisateurs_categorieutilisateur_fk FOREIGN KEY (categorieutilisateurid) REFERENCES public.categorieutilisateur(categorieutilisateurid);


-- Completed on 2026-09-18 18:09:33 CAT

--
-- PostgreSQL database dump complete
--

\unrestrict 3P8Byf6RUhwpnyLTViaPsci6C1Ab5P6N3hnVTdW5oYQBVqlAZKKe33Elej531hw

