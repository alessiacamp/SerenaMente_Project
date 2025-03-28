import "./App.css";
import Login from "./components/LoginScreen/Login";
import RegistratiUtente from "./components/RegistratiUtente/RegistratiUtente";
import RegistratiVolontario from "./components/RegistratiVolontario/RegistratiVolontario";
import Dashboard from "./components/Dashboard/Dashboard";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ModificaProfilo from "./components/ModificaProfilo/ModificaProfilo";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registrati-utente" element={<RegistratiUtente />} />
        <Route path="/registrati-volontario" element={<RegistratiVolontario />} />
        <Route path="/home" element={<Dashboard />} />
        <Route path="/modifica-profilo" element={<ModificaProfilo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
