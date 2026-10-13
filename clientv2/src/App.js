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
        </Route>
        <Route path="/signaler" element={<Signaler />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/chatbot" element={<Chatbot />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;