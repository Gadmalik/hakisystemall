import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Login } from './layouts/login';
import './style.css';
import './chatbot.css';
import { Home } from './layouts/home';
import { Dashboard } from './layouts/dashboard';
import { Signalement } from './layouts/signalement';
import { SingleSignalement } from './layouts/SingleSignalement';
import { Signaler } from './layouts/signaler';
import { Inscription } from './layouts/inscription';
import { Orienter } from './layouts/orienter';
import { Orientation } from './layouts/orientations';
import { CasOrientes } from './layouts/casorienté';
import { Chatbot } from './layouts/chatbot';
import { CasSuivie } from './layouts/cassuivie';
import { CategorieUtilisateurOrg } from './layouts/categorieutilisateurorg';
import { UtilisateurOrg } from './layouts/utilisateursorg';
import { Rejoindre } from './layouts/rejoindre';
import { LandingPage } from './layouts/waiting';
import { HomeAdmin } from './layouts/HomeAdmin';
import { Organisations } from './layouts/Organisations';
import { SuivieDossier } from './layouts/suivie';
import { Fonctionnalites } from './layouts/fonctionnalites';
import { CategorieUtilisateur } from './layouts/categorieutilisateur';
import { Settings } from './layouts/Settings';
import { AdminDashboard } from './layouts/AdminDashboard';
import { AdminUtilisateurs } from './layouts/AdminUtilisateurs';
import { CategoriesIncident } from './layouts/CategoriesIncident';
import { MailsManager } from './layouts/MailsManager';
import { ConfirmInvitation } from './layouts/confirmInvitation';
// import { Articles } from '../../client/src/layout/Articles';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="signalement" element={<Signalement />} />
          <Route path="signalement/:signalementid" element={<SingleSignalement />} />
          <Route path="signalement/:signalementid/orienter" element={<Orienter />} />
          <Route path="casorientes" element={<CasOrientes />} />
          <Route path="orientation" element={<Orientation />} />
          <Route path="cassuivie" element={<CasSuivie />} />
          <Route path="categorieutilisateurorg" element={<CategorieUtilisateurOrg />} />
          <Route path="utilisateurorg" element={<UtilisateurOrg />} />
          <Route path="parametres" element={<Settings />} />
          {/* <Route path="articles" element={<Articles />} /> */}
        </Route>
        <Route path="/admin" element={<HomeAdmin />} >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="organisations" element={<Organisations />} />
          <Route path="utilisateurs" element={<AdminUtilisateurs />} />
          <Route path="categories-incident" element={<CategoriesIncident />} />
          <Route path="categorieutilisateur" element={<CategorieUtilisateur />} />
          <Route path="fonctionnalites" element={<Fonctionnalites />} />
          <Route path="mails" element={<MailsManager />} />
          <Route path="parametres" element={<Settings />} />
        </Route>
        <Route path="/signaler" element={<Signaler />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/rejoindre" element={<Rejoindre />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/waiting" element={<LandingPage />} />
        <Route path="/suiviedossier" element={<SuivieDossier />} />
        <Route path="/confirm-invitation/:code/:email" element={<ConfirmInvitation />} />
        <Route path="/confirm-invitation" element={<ConfirmInvitation />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;