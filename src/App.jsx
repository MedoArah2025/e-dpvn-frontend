import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess, setUser } from "./store/authSlice"; // adapte le chemin si besoin

import "./css/style.css";
import "./charts/ChartjsConfig";

// Pages & layouts
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import Layout from "./partials/Layout";
import AccueilVitrine from "./pages/AccueilVitrine";

// Groupes de pages
import * as Administratif from "./pages/administratif";
import * as Circulation from "./pages/circulation";
import * as CirculationConstat from "./pages/constat";
import * as Dispositions from "./pages/dispositions";
import * as Judiciaire from "./pages/judiciaire";
import * as Operations from "./pages/operation";
import * as RH from "./pages/rh";
import StatsUnit from "./pages/stats/StatsUnit";
import StatsGlobales from "./pages/stats/StatsGlobales";
import QuartiersCarte from "./pages/geodata/QuartiersCarte";
import InfractionsMap from "./pages/judiciaire/InfractionsMap";
import InfractionsMapPro from "./pages/judiciaire/InfractionsMapPro";
import * as Spja from "./pages/spja";

function App() {
  const location = useLocation();
  const dispatch = useDispatch();

  // 1. Restaure token/user Redux au démarrage pour éviter la déconnexion sur refresh
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token) {
      dispatch(loginSuccess({ token }));
    }
    if (user) {
      dispatch(setUser(JSON.parse(user)));
    }
  }, [dispatch]);

  // 2. Ton useEffect pour le scroll
  useEffect(() => {
    document.querySelector("html").style.scrollBehavior = "auto";
    window.scroll({ top: 0 });
    document.querySelector("html").style.scrollBehavior = "";
  }, [location.pathname]);

  return (
    <Routes>
      {/* Page d'accueil vitrine */}
      <Route path="/" element={<AccueilVitrine />} />

      {/* Login */}
      <Route path="/login" element={<Login />} />

      {/* Routes protégées */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        {/* Dashboard par défaut */}
        <Route path="dashboard" element={<Dashboard />} />

        {/* ADMINISTRATIF */}
        <Route path="administratif/amende-forfaitaire" element={<Administratif.AmendeForfaitaireList />} />
        <Route path="administratif/amende-forfaitaire/add" element={<Administratif.AmendeForfaitaireForm />} />
        <Route path="administratif/amende-forfaitaire/:id/edit" element={<Administratif.AmendeForfaitaireForm />} />

        <Route path="administratif/autres-declarations" element={<Administratif.AutresDeclarationsList />} />
        <Route path="administratif/autres-declarations/add" element={<Administratif.AutresDeclarationsForm />} />
        <Route path="administratif/autres-declarations/:id/edit" element={<Administratif.AutresDeclarationsForm />} />

        <Route path="administratif/cin" element={<Administratif.CinList />} />
        <Route path="administratif/cin/add" element={<Administratif.CinForm />} />
        <Route path="administratif/cin/:id/edit" element={<Administratif.CinForm />} />

        <Route path="administratif/declaration-perte" element={<Administratif.DeclarationPerteList />} />
        <Route path="administratif/declaration-perte/add" element={<Administratif.DeclarationPerteForm />} />
        <Route path="administratif/declaration-perte/:id/edit" element={<Administratif.DeclarationPerteForm />} />

        <Route path="administratif/procuration" element={<Administratif.ProcurationList />} />
        <Route path="administratif/procuration/add" element={<Administratif.ProcurationForm />} />
        <Route path="administratif/procuration/:id/edit" element={<Administratif.ProcurationForm />} />

        <Route path="administratif/residence" element={<Administratif.ResidenceList />} />
        <Route path="administratif/residence/add" element={<Administratif.ResidenceForm />} />
        <Route path="administratif/residence/:id/edit" element={<Administratif.ResidenceForm />} />

        {/* CIRCULATION */}
        <Route path="circulation/engin-immobilise" element={<Circulation.EnginImmobiliseList />} />
        <Route path="circulation/engin-immobilise/add" element={<Circulation.EnginImmobiliseForm />} />
        <Route path="circulation/engin-immobilise/:id/edit" element={<Circulation.EnginImmobiliseForm />} />

        <Route path="circulation/piece-retire" element={<Circulation.PieceRetireList />} />
        <Route path="circulation/piece-retire/add" element={<Circulation.PieceRetireForm />} />
        <Route path="circulation/piece-retire/:id/edit" element={<Circulation.PieceRetireForm />} />

        <Route path="circulation/vitre-teintee" element={<Circulation.VitreTeinteeList />} />
        <Route path="circulation/vitre-teintee/add" element={<Circulation.VitreTeinteeForm />} />
        <Route path="circulation/vitre-teintee/:id/edit" element={<Circulation.VitreTeinteeForm />} />

        <Route path="circulation/constat/accident-circulation" element={<CirculationConstat.AccidentCirculationList />} />
        <Route path="circulation/constat/accident-circulation/add" element={<CirculationConstat.AccidentCirculationForm />} />
        <Route path="circulation/constat/accident-circulation/:id/edit" element={<CirculationConstat.AccidentCirculationForm />} />

        <Route path="circulation/controle-routier" element={<Circulation.ControleRoutierList />} />
        <Route path="circulation/controle-routier/add" element={<Circulation.ControleRoutierForm />} />
        <Route path="circulation/controle-routier/:id/edit" element={<Circulation.ControleRoutierForm editMode />} />

        {/* DISPOSITIONS */}
        <Route path="dispositions/douane" element={<Dispositions.MiseDispositionDouaneList />} />
        <Route path="dispositions/douane/add" element={<Dispositions.MiseDispositionDouaneForm />} />
        <Route path="dispositions/douane/:id/edit" element={<Dispositions.MiseDispositionDouaneForm />} />

        <Route path="dispositions/ocrit-im" element={<Dispositions.MiseDispositionOcritList />} />
        <Route path="dispositions/ocrit-im/add" element={<Dispositions.MiseDispositionOcritForm />} />
        <Route path="dispositions/ocrit-im/:id/edit" element={<Dispositions.MiseDispositionOcritForm />} />

        <Route path="dispositions/dpj" element={<Dispositions.MiseDPJList />} />
        <Route path="dispositions/dpj/add" element={<Dispositions.MiseDPJForm />} />
        <Route path="dispositions/dpj/:id/edit" element={<Dispositions.MiseDPJForm />} />

        <Route path="dispositions/dpmf" element={<Dispositions.MiseDPMFList />} />
        <Route path="dispositions/dpmf/add" element={<Dispositions.MiseDPMFForm />} />
        <Route path="dispositions/dpmf/:id/edit" element={<Dispositions.MiseDPMFForm />} />

        <Route path="dispositions/dst" element={<Dispositions.MiseDSTList />} />
        <Route path="dispositions/dst/add" element={<Dispositions.MiseDSTForm />} />
        <Route path="dispositions/dst/:id/edit" element={<Dispositions.MiseDSTForm />} />

        <Route path="dispositions/pavillon-e" element={<Dispositions.MisePavillonEList />} />
        <Route path="dispositions/pavillon-e/add" element={<Dispositions.MisePavillonEForm />} />
        <Route path="dispositions/pavillon-e/:id/edit" element={<Dispositions.MisePavillonEForm />} />

        <Route path="dispositions/slct-cto" element={<Dispositions.MiseslctCtoList />} />
        <Route path="dispositions/slct-cto/add" element={<Dispositions.MiseslctCtoForm />} />
        <Route path="dispositions/slct-cto/:id/edit" element={<Dispositions.MiseslctCtoForm />} />

        <Route path="dispositions/soniloga" element={<Dispositions.MiseSonilogaList />} />
        <Route path="dispositions/soniloga/add" element={<Dispositions.MiseSonilogaForm />} />
        <Route path="dispositions/soniloga/:id/edit" element={<Dispositions.MiseSonilogaForm />} />

        {/* JUDICIAIRE */}
        <Route path="judiciaire/autre-saisie" element={<Judiciaire.AutreSaisieList />} />
        <Route path="judiciaire/autre-saisie/add" element={<Judiciaire.AutreSaisieForm />} />
        <Route path="judiciaire/autre-saisie/:id/edit" element={<Judiciaire.AutreSaisieForm />} />

        <Route path="judiciaire/declaration-vol" element={<Judiciaire.DeclarationVolList />} />
        <Route path="judiciaire/declaration-vol/add" element={<Judiciaire.DeclarationVolForm />} />
        <Route path="judiciaire/declaration-vol/:id/edit" element={<Judiciaire.DeclarationVolForm />} />

        <Route path="judiciaire/decouverte-cadavre" element={<Judiciaire.DecouverteCadavreList />} />
        <Route path="judiciaire/decouverte-cadavre/add" element={<Judiciaire.DecouverteCadavreForm />} />
        <Route path="judiciaire/decouverte-cadavre/:id/edit" element={<Judiciaire.DecouverteCadavreForm />} />

        <Route path="judiciaire/deferement" element={<Judiciaire.DeferementList />} />
        <Route path="judiciaire/deferement/add" element={<Judiciaire.DeferementForm />} />
        <Route path="judiciaire/deferement/:id/edit" element={<Judiciaire.DeferementForm />} />

        <Route path="judiciaire/gav" element={<Judiciaire.GavList />} />
        <Route path="judiciaire/gav/add" element={<Judiciaire.GavForm />} />
        <Route path="judiciaire/gav/:id/edit" element={<Judiciaire.GavForm />} />

        <Route path="judiciaire/incendie" element={<Judiciaire.IncendieList />} />
        <Route path="judiciaire/incendie/add" element={<Judiciaire.IncendieForm />} />
        <Route path="judiciaire/incendie/:id/edit" element={<Judiciaire.IncendieForm />} />

        <Route path="judiciaire/infraction" element={<Judiciaire.InfractionList />} />
        <Route path="judiciaire/infraction/add" element={<Judiciaire.InfractionForm />} />
        <Route path="judiciaire/infraction/:id/edit" element={<Judiciaire.InfractionForm />} />

        <Route path="judiciaire/noyade" element={<Judiciaire.NoyadeList />} />
        <Route path="judiciaire/noyade/add" element={<Judiciaire.NoyadeForm />} />
        <Route path="judiciaire/noyade/:id/edit" element={<Judiciaire.NoyadeForm />} />

        <Route path="judiciaire/personnes-enleve" element={<Judiciaire.PersonnesEnleveList />} />
        <Route path="judiciaire/personnes-enleve/add" element={<Judiciaire.PersonnesEnleveForm />} />
        <Route path="judiciaire/personnes-enleve/:id/edit" element={<Judiciaire.PersonnesEnleveForm />} />

        <Route path="judiciaire/personnes-interpelle" element={<Judiciaire.PersonnesInterpelleList />} />
        <Route path="judiciaire/personnes-interpelle/add" element={<Judiciaire.PersonnesInterpelleForm />} />
        <Route path="judiciaire/personnes-interpelle/:id/edit" element={<Judiciaire.PersonnesInterpelleForm />} />

        <Route path="judiciaire/plainte" element={<Judiciaire.PlainteList />} />
        <Route path="judiciaire/plainte/add" element={<Judiciaire.PlainteForm />} />
        <Route path="judiciaire/plainte/:id/edit" element={<Judiciaire.PlainteForm />} />

        <Route path="judiciaire/requisition" element={<Judiciaire.RequisitionList />} />
        <Route path="judiciaire/requisition/add" element={<Judiciaire.RequisitionForm />} />
        <Route path="judiciaire/requisition/:id/edit" element={<Judiciaire.RequisitionForm />} />

        <Route path="judiciaire/saisie-drogue" element={<Judiciaire.SaisieDrogueList />} />
        <Route path="judiciaire/saisie-drogue/add" element={<Judiciaire.SaisieDrogueForm />} />
        <Route path="judiciaire/saisie-drogue/:id/edit" element={<Judiciaire.SaisieDrogueForm />} />

        <Route path="judiciaire/vehicule-enleve" element={<Judiciaire.VehiculeEnleveList />} />
        <Route path="judiciaire/vehicule-enleve/add" element={<Judiciaire.VehiculeEnleveForm />} />
        <Route path="judiciaire/vehicule-enleve/:id/edit" element={<Judiciaire.VehiculeEnleveForm />} />

        {/* OPERATIONS */}
        <Route path="operation/coup-poing" element={<Operations.CoupPoingList />} />
        <Route path="operation/coup-poing/add" element={<Operations.CoupPoingForm />} />
        <Route path="operation/coup-poing/:id/edit" element={<Operations.CoupPoingForm />} />

        <Route path="operation/descente" element={<Operations.DescenteList />} />
        <Route path="operation/descente/add" element={<Operations.DescenteForm />} />
        <Route path="operation/descente/:id/edit" element={<Operations.DescenteForm />} />

        <Route path="operation/patrouille" element={<Operations.PatrouilleList />} />
        <Route path="operation/patrouille/add" element={<Operations.PatrouilleForm />} />
        <Route path="operation/patrouille/:id/edit" element={<Operations.PatrouilleForm />} />

        <Route path="operation/positionnement" element={<Operations.PositionnementList />} />
        <Route path="operation/positionnement/add" element={<Operations.PositionnementForm />} />
        <Route path="operation/positionnement/:id/edit" element={<Operations.PositionnementForm />} />

        <Route path="operation/raffle" element={<Operations.RaffleList />} />
        <Route path="operation/raffle/add" element={<Operations.RaffleForm />} />
        <Route path="operation/raffle/:id/edit" element={<Operations.RaffleForm />} />

        <Route path="operation/service-ordre" element={<Operations.ServiceOrdreList />} />
        <Route path="operation/service-ordre/add" element={<Operations.ServiceOrdreForm />} />
        <Route path="operation/service-ordre/:id/edit" element={<Operations.ServiceOrdreForm />} />

        {/* RH */}
        <Route path="rh/effectifs" element={<RH.EffectifRHList />} />
        <Route path="rh/effectifs/add" element={<RH.EffectifRHForm />} />
        <Route path="rh/effectifs/:id/edit" element={<RH.EffectifRHForm />} />

        {/* SPJA */}
        <Route path="spja/mises-a-disposition" element={<Spja.MiseADispositionSpjaList />} />
        <Route path="spja/mises-a-disposition/add" element={<Spja.MiseADispositionSpjaForm />} />
        <Route path="spja/mises-a-disposition/:id/edit" element={<Spja.MiseADispositionSpjaForm />} />

        {/* AUTRES */}
        <Route path="judiciaire/infractions/carte-pro" element={<InfractionsMapPro />} />
        <Route path="judiciaire/infractions/carte" element={<InfractionsMap />} />
        <Route path="stats/globales" element={<StatsGlobales />} />
        <Route path="stats/unite" element={<StatsUnit />} />
        <Route path="geodata/carte" element={<QuartiersCarte />} />

        {/* 404 */}
        <Route path="*" element={<div className="p-8 text-2xl">404 Not Found</div>} />
      </Route>
    </Routes>
  );
}

export default App;
