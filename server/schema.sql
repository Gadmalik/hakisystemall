--
-- PostgreSQL database dump
--

\restrict elAzEzzE8SdlqEGvobg2Uhi61iTj2LhnrU3HE0HXsTQv5hgeQvB1iOw8VER3iZV

-- Dumped from database version 16.13 (Ubuntu 16.13-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.13 (Ubuntu 16.13-0ubuntu0.24.04.1)

-- Started on 2026-10-25 13:07:08 CAT

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

--
-- TOC entry 3613 (class 0 OID 16457)
-- Dependencies: 224
-- Data for Name: article; Type: TABLE DATA; Schema: public; Owner: asuna
--

COPY public.article (articleid, titre, date_create, contenu, piecesjointes, typepiece, userid) FROM stdin;
\.


--
-- TOC entry 3623 (class 0 OID 33719)
-- Dependencies: 234
-- Data for Name: assignercategorieutilisateurorg; Type: TABLE DATA; Schema: public; Owner: asuna
--

COPY public.assignercategorieutilisateurorg (assignercategorieutilisateurorgid, status, date_attribution, created_at, updated_at, organisationid, userid) FROM stdin;
\.


--
-- TOC entry 3626 (class 0 OID 33782)
-- Dependencies: 237
-- Data for Name: assignerdomaine; Type: TABLE DATA; Schema: public; Owner: asuna
--

COPY public.assignerdomaine (assignerdomaineid, organisationid, categorie_id, status, userid) FROM stdin;
82fa9b20-7ad6-4696-9854-fb5adb4ca595	b40add28-e7b8-4604-b3f1-c61c85ab92b3	1	actif	32
0e12c98d-8794-4cd4-aad3-d82705272ce4	b40add28-e7b8-4604-b3f1-c61c85ab92b3	2	actif	32
56486140-0f3f-474a-ad3c-61dbe22ed7cb	cc857743-e91c-49c5-a7b7-4f26f221fa8a	1	actif	34
c611bd77-1b8a-45e6-96a1-774c2cc71646	cc857743-e91c-49c5-a7b7-4f26f221fa8a	2	actif	34
f0a0b5dc-fe7f-4072-a243-2cfc788a48cb	\N	1	actif	38
aea234ef-0d8b-47b7-8e7d-773d025a8282	\N	2	actif	38
\.


--
-- TOC entry 3625 (class 0 OID 33768)
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
39aea7c2-f60d-400e-8be9-694c29681262	11	second	5e03ff65-8869-4012-b460-d77d8dd42c2f	actif
e2d629f8-ea79-4bc3-96d7-604e98725cd8	11	second	e548c882-6750-45f3-ac0a-e578e3c211aa	actif
cc33486d-dcad-4698-8471-31ec7f27c928	11	second	8ada0e43-cb3a-4b7c-8389-dcceb710efe2	actif
39aea7c2-f60d-400e-8be9-694c29681262	12	second	01821144-47c8-4be2-b9da-fce760f0b113	actif
e2d629f8-ea79-4bc3-96d7-604e98725cd8	12	second	9fcb3097-4345-437b-95dc-cf6cac87edf6	actif
39aea7c2-f60d-400e-8be9-694c29681262	13	second	849b4296-83e2-4413-ad97-708474fa5ed3	actif
e2d629f8-ea79-4bc3-96d7-604e98725cd8	13	second	56bc7e68-a866-4130-99a6-a5dbca594643	actif
39aea7c2-f60d-400e-8be9-694c29681262	14	second	ddef3210-92cf-4f70-9a5c-ef7d555e0a33	actif
e2d629f8-ea79-4bc3-96d7-604e98725cd8	14	second	27811189-f025-4112-bfe3-251984e3c1e8	actif
39aea7c2-f60d-400e-8be9-694c29681262	15	second	edc4a9bb-b0d4-4a6d-9741-75bc8dd2ec5b	actif
e2d629f8-ea79-4bc3-96d7-604e98725cd8	15	second	29427cbb-2336-48c7-905e-40dcd0f05509	actif
39aea7c2-f60d-400e-8be9-694c29681262	16	second	2c3d8d4b-4a70-4ab8-94d0-83b4831da82c	actif
e2d629f8-ea79-4bc3-96d7-604e98725cd8	16	second	69fe00af-7947-41fa-ba45-4f9e32d07d1a	actif
39aea7c2-f60d-400e-8be9-694c29681262	17	second	f40475d1-259c-447e-9fdc-f4cfe910220e	actif
8f92487c-d69d-4184-be60-babcc503b3c4	17	second	e776e57a-5d62-4073-8b6d-0082cab93621	actif
5b689762-0e81-4311-91a1-e48389957242	17	second	c558e557-7528-4767-8a81-215574c274ba	actif
e2d629f8-ea79-4bc3-96d7-604e98725cd8	18	second	eaeb3205-3b4c-4aac-b895-aa38a3cdb13d	actif
23b6eafc-485e-42e9-ba0a-5c14ae574a8d	18	second	ead4c4e1-0c25-45e5-811c-0cd045dd08f3	actif
7ae6c6f9-47d6-458f-b12f-ebed551b3416	19	second	dd8e6725-70a2-47fc-8613-8a4b09d0b8f1	actif
d2232797-2997-4fca-9366-9cb664cc613e	19	second	82c132fa-34ae-4580-ae5d-aaf64e31a0eb	actif
b5321be9-02b9-4808-beda-ac90e1dfdb2e	19	second	64539a2e-1629-473c-a2e1-02aed35df303	actif
8f92487c-d69d-4184-be60-babcc503b3c4	19	second	3250493f-4851-4885-aff4-4df5719d04b3	actif
e2d629f8-ea79-4bc3-96d7-604e98725cd8	19	second	c2afe9c1-aef4-4163-9395-100ab285a02c	actif
39aea7c2-f60d-400e-8be9-694c29681262	20	second	daa8050e-ae99-4b91-9dc0-03fd346e63cd	actif
8f92487c-d69d-4184-be60-babcc503b3c4	20	second	3e585439-f803-49a0-b517-f35924b69eca	actif
e2d629f8-ea79-4bc3-96d7-604e98725cd8	20	second	20b11865-35cb-4992-9c7f-055cec82024c	actif
b5321be9-02b9-4808-beda-ac90e1dfdb2e	20	second	99d627fa-bf26-47e9-80c8-ea21475a1701	actif
39aea7c2-f60d-400e-8be9-694c29681262	11	main	0d5adbd7-aa54-4239-9990-1665560b76cd	actif
cc33486d-dcad-4698-8471-31ec7f27c928	11	main	26ddbda3-4198-42db-8e21-6c86f84c2fb1	actif
7ae6c6f9-47d6-458f-b12f-ebed551b3416	11	main	dae16e8a-ebde-49cb-abf3-22bf26e0511c	actif
8f92487c-d69d-4184-be60-babcc503b3c4	11	main	1d279bd6-d8af-467c-b15d-5ce24222fb76	actif
39aea7c2-f60d-400e-8be9-694c29681262	9	main	fee79cdc-235f-4af2-a96a-f593ba346921	inactif
e2d629f8-ea79-4bc3-96d7-604e98725cd8	9	main	5b5ffa28-64d4-4c33-a2fe-2999b95ec4fa	inactif
8f92487c-d69d-4184-be60-babcc503b3c4	9	main	6204bad5-e62b-44c6-bb26-dd300250b86a	inactif
5b689762-0e81-4311-91a1-e48389957242	9	main	453609cb-f396-47f2-8d7a-425dc4cd23aa	inactif
cc33486d-dcad-4698-8471-31ec7f27c928	9	main	6ba994d4-58c7-4e87-aa5e-749e67cc8225	inactif
23b6eafc-485e-42e9-ba0a-5c14ae574a8d	9	main	06d1fd75-991e-4bc6-9c64-d863b87cac5b	inactif
050f7912-a567-4fe4-8bd2-9ad3c20379e3	9	main	2f64e2c9-5563-4f1b-8e39-b3cf58801fc2	inactif
39aea7c2-f60d-400e-8be9-694c29681262	9	main	819a5894-2ffe-4430-968f-27a2980fbf83	inactif
e2d629f8-ea79-4bc3-96d7-604e98725cd8	9	main	15f9c4b9-7d9e-4e29-9101-cd863b4e4b1c	inactif
23b6eafc-485e-42e9-ba0a-5c14ae574a8d	9	main	9361d318-59f0-40da-91e1-8c37b94f8217	inactif
f1b334bb-c9dc-4d3c-8cdd-9d23d0c09dc5	9	main	b2ca68e6-0bb5-4624-8550-19cfcae47f16	inactif
7ae6c6f9-47d6-458f-b12f-ebed551b3416	9	main	bd62766d-6b3d-4c4e-8759-b2aebe719e17	inactif
050f7912-a567-4fe4-8bd2-9ad3c20379e3	9	main	3c6117a0-a68f-4c0d-b351-0608b446a82b	inactif
d2232797-2997-4fca-9366-9cb664cc613e	9	main	ae7b9a56-ed21-488e-bc1f-4c4ccecbca3e	inactif
cc33486d-dcad-4698-8471-31ec7f27c928	9	main	a7b535f8-fb67-4cc9-b4db-8f9bb9038653	inactif
8f92487c-d69d-4184-be60-babcc503b3c4	9	main	ff7fe2ea-365c-4800-87b8-0b88a5a751dd	inactif
b5321be9-02b9-4808-beda-ac90e1dfdb2e	9	main	30e31f0e-b02e-4f1e-96ba-0a170a613008	inactif
39aea7c2-f60d-400e-8be9-694c29681262	9	main	97ffe8dc-8b17-4f3a-a0eb-a8e531862d42	inactif
23b6eafc-485e-42e9-ba0a-5c14ae574a8d	9	main	45a053a6-dc1b-4558-90e8-f70d3b83bcef	inactif
050f7912-a567-4fe4-8bd2-9ad3c20379e3	9	main	3afca8c7-bf9e-4ca1-9d84-2e4f678aff90	inactif
d2232797-2997-4fca-9366-9cb664cc613e	9	main	0fafb0ed-0b03-4ecd-b6a3-786d7e12872f	inactif
cc33486d-dcad-4698-8471-31ec7f27c928	9	main	e49680ce-dda7-4bb4-81e4-c0777f657497	inactif
f1b334bb-c9dc-4d3c-8cdd-9d23d0c09dc5	9	main	f4f1444e-e896-4680-a805-63b356974150	inactif
7ae6c6f9-47d6-458f-b12f-ebed551b3416	9	main	90390425-7d58-40d6-a7bc-33c6703d4e9c	inactif
e2d629f8-ea79-4bc3-96d7-604e98725cd8	9	main	aa0aa969-569c-4685-b529-6fee9f147a7d	inactif
b5321be9-02b9-4808-beda-ac90e1dfdb2e	9	main	ef8b12a3-5e93-4d4c-ac5c-3095c7e82f8d	inactif
39aea7c2-f60d-400e-8be9-694c29681262	9	main	18579b34-c579-4472-bfe7-e314a2ddbc92	inactif
39aea7c2-f60d-400e-8be9-694c29681262	9	main	3d6aa6b0-c502-4526-96c6-9cd9c345cbdf	actif
cc33486d-dcad-4698-8471-31ec7f27c928	9	main	330e2356-f34c-4d1e-bba6-d23f0c787c2d	actif
23b6eafc-485e-42e9-ba0a-5c14ae574a8d	9	main	0f550b7a-e988-4521-8c8b-4bed63872c32	actif
050f7912-a567-4fe4-8bd2-9ad3c20379e3	9	main	bd2ea639-0efd-47b2-9b23-d0ce6d3e2bb3	actif
7ae6c6f9-47d6-458f-b12f-ebed551b3416	9	main	4ac81148-62d6-4b43-ad38-df9222a1d5ce	actif
d2232797-2997-4fca-9366-9cb664cc613e	9	main	b694a326-eb5a-4750-b9d3-b5b55be93bf7	actif
f1b334bb-c9dc-4d3c-8cdd-9d23d0c09dc5	9	main	a80a095d-7e36-43ae-b231-15a6ad0c51be	actif
b5321be9-02b9-4808-beda-ac90e1dfdb2e	9	main	c4e5bec3-7fa6-430d-bd9f-9a337f0dd50b	actif
e2d629f8-ea79-4bc3-96d7-604e98725cd8	9	main	2660ab6d-5966-405f-9dcc-e246a9ee5e12	actif
\.


--
-- TOC entry 3611 (class 0 OID 16440)
-- Dependencies: 222
-- Data for Name: attribuerdossier; Type: TABLE DATA; Schema: public; Owner: asuna
--

COPY public.attribuerdossier (attribuerid, date, status, userid, dossierid, type, commentaire, organisationid) FROM stdin;
23	2026-10-17	en cours	32	25	prise	\N	\N
24	2026-10-19	accepté	33	26	orientation	\N	b40add28-e7b8-4604-b3f1-c61c85ab92b3
25	2026-10-19	en cours	33	26	prise	\N	\N
26	2026-10-23	en cours	34	29	prise	\N	cc857743-e91c-49c5-a7b7-4f26f221fa8a
\.


--
-- TOC entry 3607 (class 0 OID 16415)
-- Dependencies: 218
-- Data for Name: categorie_incident; Type: TABLE DATA; Schema: public; Owner: asuna
--

COPY public.categorie_incident (categorie_id, designation, etat, date, niveau) FROM stdin;
1	Fraude	actif	2026-03-19	faible
2	Corruption	actif	2026-03-19	moyen
\.


--
-- TOC entry 3615 (class 0 OID 33527)
-- Dependencies: 226
-- Data for Name: categorieutilisateur; Type: TABLE DATA; Schema: public; Owner: asuna
--

COPY public.categorieutilisateur (categorieutilisateurid, designation, description, created_at, confirm, organisation, status, isdefault, isadmin) FROM stdin;
8	Professionnel	professionnel	2026-09-17 20:49:32.512798+02	t	f	actif	f	f
7	Utilisateur	utilisateur normal	2026-09-17 20:48:32.165122+02	f	f	actif	t	f
11	Juriste	description du role	2026-10-23 22:08:13.200715+02	t	f	actif	f	f
9	Organisation	organisation	2026-09-17 20:50:23.799112+02	f	t	actif	f	f
10	Administrateur	admin	2026-09-17 20:51:10.752653+02	t	f	actif	f	t
\.


--
-- TOC entry 3622 (class 0 OID 33709)
-- Dependencies: 233
-- Data for Name: categorieutilisateurorg; Type: TABLE DATA; Schema: public; Owner: asuna
--

COPY public.categorieutilisateurorg (categorieutilisateurorgid, libelle, description, created_at, status, organisationid) FROM stdin;
19	Gestionnaire de cas 	Description du role de l'utilisateur	2026-10-17 22:07:49.235938+02	actif	b40add28-e7b8-4604-b3f1-c61c85ab92b3
20	Juriste	ils prend en charge les cas,.....	2026-10-23 21:29:47.229067+02	actif	b40add28-e7b8-4604-b3f1-c61c85ab92b3
\.


--
-- TOC entry 3624 (class 0 OID 33747)
-- Dependencies: 235
-- Data for Name: fonctionnalites; Type: TABLE DATA; Schema: public; Owner: asuna
--

COPY public.fonctionnalites (fonctionnaliteid, designation, description, icone, route, parentid, ordre_affichage, status, created_at, updated_at) FROM stdin;
39aea7c2-f60d-400e-8be9-694c29681262	Dashboard	description	dashboard	/dashboard	\N	0	t	2026-09-17 09:54:23.189805+02	2026-09-17 09:54:23.189805+02
23b6eafc-485e-42e9-ba0a-5c14ae574a8d	Categories d'utilisateurs	categorie utilisateurs organisation	user-tag	/categorieutilisateurorg	\N	0	t	2026-09-17 20:38:24.991807+02	2026-09-17 20:38:24.991807+02
9514a938-9ce1-4717-ba95-a92c94f44abf	Categories d'utilisateurs (main)	categorie utilisateurs 	user-tag	/categorieutilisateur	\N	0	t	2026-09-17 20:38:53.749687+02	2026-09-17 20:38:53.749687+02
8fe38924-e0fc-4032-b341-4d8e6a50b838	Utilisateurs	confirmtions utilisateurs, 	users	/utilisateurs	\N	0	t	2026-09-17 20:39:29.147126+02	2026-09-17 20:39:29.147126+02
050f7912-a567-4fe4-8bd2-9ad3c20379e3	Articles	articles	newspaper	/articles	\N	0	t	2026-09-17 20:40:08.96236+02	2026-09-17 20:40:08.96236+02
cc33486d-dcad-4698-8471-31ec7f27c928	Parametres	parametres	cog	/parametres	\N	0	t	2026-09-17 20:41:07.445655+02	2026-09-17 20:41:07.445655+02
65030167-b59d-4530-975b-d5b8c1428903	Orgaisations	/organisations	institution	/organisations	\N	0	t	2026-09-17 20:36:12.526667+02	2026-09-17 20:36:12.526667+02
7ae6c6f9-47d6-458f-b12f-ebed551b3416	A traité	Gérer les cas que vous avez pris en charge.	clock	/cassuivie	\N	0	t	2026-10-16 11:04:52.598188+02	2026-10-16 11:04:52.598188+02
f1b334bb-c9dc-4d3c-8cdd-9d23d0c09dc5	Mes utilisateurs	utilisateurs d'une organisation	users	/utilisateurorg	\N	0	t	2026-10-16 11:19:42.026645+02	2026-10-16 11:19:42.026645+02
d2232797-2997-4fca-9366-9cb664cc613e	Cas orientés	Gérer les cas que vous avez orienté vers d'autres structures.	share-nodes	/casorientes	\N	0	t	2026-10-16 11:22:15.595968+02	2026-10-16 11:22:15.595968+02
e2d629f8-ea79-4bc3-96d7-604e98725cd8	Signalements	gestion des dossiers	folder-open	/signalement	\N	0	t	2026-09-17 20:33:26.779412+02	2026-09-17 20:33:26.779412+02
8f92487c-d69d-4184-be60-babcc503b3c4	Mes signalements	signalements	inbox	/cassuivie	\N	0	t	2026-09-17 20:34:52.654275+02	2026-09-17 20:34:52.654275+02
5b689762-0e81-4311-91a1-e48389957242	Gestion d'utilisateurs	organisations	user-tie	/utilisateurorg	\N	0	t	2026-09-17 20:37:30.50285+02	2026-09-17 20:37:30.50285+02
b5321be9-02b9-4808-beda-ac90e1dfdb2e	Orientations	Gérer les cas qui vous ont été orientés depuis d'autres structures.	compass	/orientation	\N	0	t	2026-10-16 10:10:11.956736+02	2026-10-16 10:10:11.956736+02
\.


--
-- TOC entry 3609 (class 0 OID 16422)
-- Dependencies: 220
-- Data for Name: incident; Type: TABLE DATA; Schema: public; Owner: asuna
--

COPY public.incident (lieu, id_incident, description, date_incident, status, anonyme, categorieid, typeannexe, date_create, userid, contact, age, genre, code_unique, annexes) FROM stdin;
Beni	25	Par la présente, je souhaite porter à votre attention des faits graves porteurs d'indices sérieux de corruption et de manquement au devoir de probité, constatés au sein de [Nom de l'organisation/institution] en date du [Date de l'événement]. Il m'a été donné d'observer que [Nom ou fonction de la personne visée] a [expliquer les faits de manière purement factuelle : ex. sollicité une contrepartie financière, accordé un avantage indu à un prestataire en dehors des procédures légales, détourné des fonds publics]	2026-10-16	actif	\N	1	\N	2026-10-17	\N	gadmalik423@gmail.com	2	\N	HSY-7N2-MNC	\N
teste	26	test	2026-10-18	actif	\N	2	\N	2026-10-18	\N	gadmalik423@gmail.com	3	N	HSY-UVU-PJS	[{"url": "/uploads/annexes/03e48b9d3ea14a847a48645489c8d517", "path": "uploads/annexes/03e48b9d3ea14a847a48645489c8d517", "size": "0.08 MB", "filename": "6168394.png", "mimetype": "image/png"}, {"url": "/uploads/annexes/2c6bd8662f5d6e0fb94799917af4741b", "path": "uploads/annexes/2c6bd8662f5d6e0fb94799917af4741b", "size": "0.07 MB", "filename": "whitebeard-1920-x-1052-wallpaper-b8dqot6psrcinn70.jpg", "mimetype": "image/jpeg"}]
Beni	27	signalement et tout 	2026-10-19	actif	\N	1	\N	2026-10-19	\N	gadmalik423@gmail.com	4	H	HSY-B8O-LCU	[{"url": "/uploads/annexes/69c9c226973b265e563145c663a970e4", "path": "uploads/annexes/69c9c226973b265e563145c663a970e4", "size": "1.60 MB", "filename": "9700_4_04.jpg", "mimetype": "image/jpeg"}, {"url": "/uploads/annexes/0f2f8ef25d66ae4a52800bda063e4fb7", "path": "uploads/annexes/0f2f8ef25d66ae4a52800bda063e4fb7", "size": "0.54 MB", "filename": "21004063.jpg", "mimetype": "image/jpeg"}]
Beni	28	La détection et la prévention de la fraude au sein de notre plateforme constituent une priorité absolue pour garantir l’intégrité et la fiabilité de chaque signalement. Est considérée comme frauduleuse toute action visant à introduire des données délibérément fausses, à manipuler le système de suivi, ou à émettre des alertes abusives ou calomnieuses dans le but de nuire ou de détourner les ressources de traitement. Grâce à l'intégration d'algorithmes de vérification avancés et à des protocoles de contrôle rigoureux, notre application analyse en continu la cohérence des informations transmises afin d'identifier les comportements suspects. Toute tentative d'utilisation frauduleuse expose son auteur à l’annulation immédiate du traitement de son dossier, à la suspension de son accès aux services, ainsi qu'aux poursuites disciplinaires ou judiciaires prévues par la réglementation en vigueur.	2026-10-23	actif	\N	1	\N	2026-10-23	\N	gadmalik423@gmail.com	3	H	HSY-LLP-V7P	[{"url": "/uploads/annexes/a1a17f772803130b5ee723c26d9985f7", "path": "uploads/annexes/a1a17f772803130b5ee723c26d9985f7", "size": "0.60 MB", "filename": "LETTRE DE MUTATION.pdf", "mimetype": "application/pdf"}]
Goma	29	La détection et la prévention de la fraude au sein de notre plateforme constituent une priorité absolue pour garantir l’intégrité et la fiabilité de chaque signalement. Est considérée comme frauduleuse toute action visant à introduire des données délibérément fausses, à manipuler le système de suivi, ou à émettre des alertes abusives ou calomnieuses dans le but de nuire ou de détourner les ressources de traitement. Grâce à l'intégration d'algorithmes de vérification avancés et à des protocoles de contrôle rigoureux, notre application analyse en continu la cohérence des informations transmises afin d'identifier les comportements suspects. Toute tentative d'utilisation frauduleuse expose son auteur à l’annulation immédiate du traitement de son dossier, à la suspension de son accès aux services, ainsi qu'aux poursuites disciplinaires ou judiciaires prévues par la réglementation en vigueur.	2026-10-23	actif	\N	2	\N	2026-10-23	\N	test@gmail.com	4	N	HSY-IM4-JEW	[{"url": "/uploads/annexes/2b0d45fdc53886d7f5d3844ecb933716", "path": "uploads/annexes/2b0d45fdc53886d7f5d3844ecb933716", "size": "0.07 MB", "filename": "whitebeard-1920-x-1052-wallpaper-b8dqot6psrcinn70.jpg", "mimetype": "image/jpeg"}, {"url": "/uploads/annexes/3b69331a7a04f41b716a88f4122d3d26", "path": "uploads/annexes/3b69331a7a04f41b716a88f4122d3d26", "size": "11.97 MB", "filename": "wp11945054-one-piece-pc-4k-wallpapers.jpg", "mimetype": "image/jpeg"}]
Beni	30	mamam	2026-10-25	actif	\N	2	\N	2026-10-25	\N	gadmalik423@gmail.com	2	N	HSY-MC5-NWU	[{"url": "/uploads/annexes/7acba61a907a70ea061ab76e47b5f987", "path": "uploads/annexes/7acba61a907a70ea061ab76e47b5f987", "size": "0.07 MB", "filename": "WhatsApp Image 2026-10-20 at 17.00.36.jpeg", "mimetype": "image/jpeg"}]
Beni	31	teste	2026-10-25	actif	\N	2	\N	2026-10-25	\N	\N	2	N	HSY-YDA-EV7	[{"url": "/uploads/annexes/8dc109775e2e8edaa16f6483c1963587", "path": "uploads/annexes/8dc109775e2e8edaa16f6483c1963587", "size": "0.07 MB", "filename": "WhatsApp Image 2026-10-20 at 17.00.36.jpeg", "mimetype": "image/jpeg"}]
\.


--
-- TOC entry 3628 (class 0 OID 34085)
-- Dependencies: 239
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: asuna
--

COPY public.notifications (id, userid, organisationid, title, message, url, type, is_read, created_at) FROM stdin;
\.


--
-- TOC entry 3620 (class 0 OID 33665)
-- Dependencies: 231
-- Data for Name: organisation; Type: TABLE DATA; Schema: public; Owner: asuna
--

COPY public.organisation (organisationid, designation, sigle, typeorganisationid, pays, province, ville, adresse_org, phone_org, email_org, site_web, reseaux_sociaux, logo_url, userid, created_at, updated_at, status, config) FROM stdin;
b40add28-e7b8-4604-b3f1-c61c85ab92b3	TAASISI	TS	2	CD	Nord-Kivu	Beni	Q. Tamende, commune Mulekra	\N	lonford.dev@gmail.com	undefined	undefined	/logo/eede591b9fb60da45700b77f2d79afce	32	2026-10-17 21:20:18.340675+02	2026-10-17 21:20:18.340675+02	actif	t
cc857743-e91c-49c5-a7b7-4f26f221fa8a	LONFORD	LFD	1	CD	NORD-KIVU	Goma	Goma	\N	lonfordrdc@gmail.com	undefined	undefined	/logo/be7c2207e9fa8b31a6bc73cc4e8c3c47	34	2026-10-23 21:54:29.018514+02	2026-10-23 21:54:29.018514+02	actif	t
\.


--
-- TOC entry 3617 (class 0 OID 33550)
-- Dependencies: 228
-- Data for Name: push_subscriptions; Type: TABLE DATA; Schema: public; Owner: asuna
--

COPY public.push_subscriptions (id, userid, subscription, created_at) FROM stdin;
361	33	{"keys": {"auth": "Mo9u36iLujG-eh5gyc-sgQ", "p256dh": "BI7HRNyH7m7TBxmyd-1PxjzfaYqMp4mPGGAkKbvxt9hV5ol7eV8W1GfE9wk3iWkIfZUURR8hvzbmFAo85albsYg"}, "endpoint": "https://fcm.googleapis.com/fcm/send/dxUh_OYF31Y:APA91bHzfh_M7XyXJtDg5IFlDisPfHeunFDRlnCl_Z7BPCM6z7r0xt9oRXVvWEJUFU3L0O3tQ156_c1VPF9tCWFchQ2xobY66W0MI_Pi0wl-o-gW5_JNscwuaRbnvi6i4rzb1G_FSjap", "expirationTime": null}	2026-10-17 22:16:19.652424
228	39	{"keys": {"auth": "Jn8Yj4BOTFRm8iGHJvQ65g", "p256dh": "BNoYwQN42-XDbSN-3_jm54-hJrG8m86gnUhQZu5btoD-O1HVFFGnue0clf1Ri6syd0BwarUtfLtA0Slk4P3H23M"}, "endpoint": "https://fcm.googleapis.com/fcm/send/c_W3Un6048c:APA91bEwJALdIIet8DSasQWo2oNarvsbmX8BkIZj2aireU2jnd2cqUdrhQrbc4qdNDRQ1BNooeRSGn6Uk12lVtklf2b9e7V-bYnUbGfimOTsFr5XT-Idt9IhjRMCVqtGHlDViFY3to3B", "expirationTime": null}	2026-09-18 15:01:07.45581
\.


--
-- TOC entry 3619 (class 0 OID 33654)
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
-- TOC entry 3605 (class 0 OID 16406)
-- Dependencies: 216
-- Data for Name: utilisateurs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.utilisateurs (userid, nom, email, phone, mdp, code, type, etat, date_create, username, adresse, prenom, config, categorieutilisateurid) FROM stdin;
32	Gad	gadmalik423@gmail.com	243993886474	$2b$10$sukC6y7uV0CK3ilbm3FSJuGSdcR/XRv65/OMDchn97vJB9Uwoi7mC	\N	main	actif	2026-10-17	gadmalik                                          		Malik	t	9
34	KITSAMA	eliekitsama@gmail.com	243999949700	$2b$10$mEC43gg1OGmu6OIsZolCzeLf/FvKrxH/reGlC2FYSusKAZfUqgMKq	\N	main	actif	2026-10-23	eliekitsama                                       		Elie	t	9
33	KITSAMA	gadmlikidogo@gmail.com	243826711828	$2b$10$LFo0dyYm/VGggg7opL6kKe/.lRyIunew3m0DXuDK.VVE/Jb/yNfFO	\N	second	actif	2026-10-17	elie                                              	Goma	ELIE	t	19
38	Gad	gadmalikidgo@gmail.com	243993886	$2b$10$/l.YVQBsk.//rS0/DO/sDeYo8WhamtenilsO5xuLQlmKEs034xq6.	\N	main	actif	2026-10-25	gmlk                                              		Malik	t	8
39	Gad	gadmalikidogo@gmail.com	243993886470	$2b$10$EqgrkHT0rLtMsaYRa31iYORnVBQUxD7RpNHFrDhp8r2y.QrUzBa2m	\N	second	actif	2026-10-25	gm                                                	Beni	Malik	t	19
\.


--
-- TOC entry 3644 (class 0 OID 0)
-- Dependencies: 223
-- Name: article_articleid_seq; Type: SEQUENCE SET; Schema: public; Owner: asuna
--

SELECT pg_catalog.setval('public.article_articleid_seq', 5, true);


--
-- TOC entry 3645 (class 0 OID 0)
-- Dependencies: 221
-- Name: attribuerdossier_attribuerid_seq; Type: SEQUENCE SET; Schema: public; Owner: asuna
--

SELECT pg_catalog.setval('public.attribuerdossier_attribuerid_seq', 26, true);


--
-- TOC entry 3646 (class 0 OID 0)
-- Dependencies: 225
-- Name: categorieutilisateur_categorieutilisateurid_seq; Type: SEQUENCE SET; Schema: public; Owner: asuna
--

SELECT pg_catalog.setval('public.categorieutilisateur_categorieutilisateurid_seq', 11, true);


--
-- TOC entry 3647 (class 0 OID 0)
-- Dependencies: 232
-- Name: categorieutilisateurorg_categorieutilisateurorgid_seq; Type: SEQUENCE SET; Schema: public; Owner: asuna
--

SELECT pg_catalog.setval('public.categorieutilisateurorg_categorieutilisateurorgid_seq', 20, true);


--
-- TOC entry 3648 (class 0 OID 0)
-- Dependencies: 217
-- Name: cateogie_incident_id_seq; Type: SEQUENCE SET; Schema: public; Owner: asuna
--

SELECT pg_catalog.setval('public.cateogie_incident_id_seq', 2, true);


--
-- TOC entry 3649 (class 0 OID 0)
-- Dependencies: 219
-- Name: incident_id_incident_seq; Type: SEQUENCE SET; Schema: public; Owner: asuna
--

SELECT pg_catalog.setval('public.incident_id_incident_seq', 31, true);


--
-- TOC entry 3650 (class 0 OID 0)
-- Dependencies: 238
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: asuna
--

SELECT pg_catalog.setval('public.notifications_id_seq', 1, false);


--
-- TOC entry 3651 (class 0 OID 0)
-- Dependencies: 227
-- Name: push_subscriptions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: asuna
--

SELECT pg_catalog.setval('public.push_subscriptions_id_seq', 492, true);


--
-- TOC entry 3652 (class 0 OID 0)
-- Dependencies: 229
-- Name: type_organisation_typeorganisationid_seq; Type: SEQUENCE SET; Schema: public; Owner: asuna
--

SELECT pg_catalog.setval('public.type_organisation_typeorganisationid_seq', 6, true);


--
-- TOC entry 3653 (class 0 OID 0)
-- Dependencies: 215
-- Name: utilisateurs_userid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.utilisateurs_userid_seq', 39, true);


-- Completed on 2026-10-25 13:07:08 CAT

--
-- PostgreSQL database dump complete
--

\unrestrict elAzEzzE8SdlqEGvobg2Uhi61iTj2LhnrU3HE0HXsTQv5hgeQvB1iOw8VER3iZV

