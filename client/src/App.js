import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Login } from './layout/Login';
import { Home } from './layout/Home';
import { Dashboard } from './layout/Dashboard';
import { Utilisateurs } from './layout/Utilisateurs';
import './styles/tableau.css';
import './styles/home.css';
import './styles/profile.css';
import './styles/welcome.css';
import './styles/organisation.css';
// editor 
import '@mantine/core/styles.css';
import '@mantine/tiptap/styles.css';
import { Welcome } from './layout/Welcome';
import { Register } from './layout/Register';
import TypeIncident from './layout/TypeIncident';
import { Dossier } from './layout/Dossier';
import { Articles } from './layout/Articles';
import { SingleArticl } from './layout/SingleArticl';
import { Profile } from './layout/Profile';
import { ListArticles } from './layout/ListArticles';
import { Signalement } from './layout/Mysignalement';
import { WaitingOrgPage, WaitingPage } from './layout/waitingPage';
import { OrganisationsList } from './layout/organisation';
import { CategorieUtilisateursOrg } from './layout/Categorieutilisateurorg';
import { UtilisateursOrg } from './layout/Utilisateursorg';
import { ConfirmInvitation } from './layout/confirmInvitation';
function App() {
  // routes 
  return (
    <Router>
      <Routes>
        <Route path="*" element={<Welcome />} />
        <Route path="/inscription" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/welcome" element={<WaitingPage />} />
        <Route path="/organisation" element={<WaitingOrgPage />} />
        <Route path="/home" element={<Home />} >
          <Route path="/home" element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="dossiers" element={<Dossier />} />
          <Route path="utilisateurs" element={<Utilisateurs />} />
          <Route path="articles" element={<Articles />} />
          <Route path="parametres" element={<Home />} />
          <Route path="categorieincident" element={<TypeIncident />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:username" element={<Profile />} />
          <Route path="article/:id" element={<SingleArticl />} />
          <Route path="mysignalement" element={<Signalement />} />
          <Route path="organisations" element={<OrganisationsList />} />
          <Route path="categorieutilisateurorg" element={<CategorieUtilisateursOrg />} />
          <Route path="utilisateursorg" element={<UtilisateursOrg />} />
        </Route>
        <Route path="/confirm-invitation/:code/:email" element={<ConfirmInvitation />} />
        <Route path="/articles/:id" element={<SingleArticl />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/articles" element={<ListArticles />} />

      </Routes>
    </Router>
  );
}

export default App;
