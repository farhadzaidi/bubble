import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Bubble from "./pages/bubble/Bubble";
import Landing from "./pages/landing/Landing";
import SignIn from "./pages/sign_in/SignIn";
import SignUp from "./pages/sign_up/SignUp";
import PageNotFound from "./pages/page_not_found/PageNotFound";
import ApplicationDown from "./pages/application_unavailable/ApplicationUnavailbale";
import { makeApiCall } from "./utils/api";

function App() {
  const [appReady, setAppReady] = useState(false);

  // Perform health checks on server and ledger
  useEffect(() => {
    (async () => {
      let response = await makeApiCall(false, "GET", "/health");
      const serverReady = response.ok;

      response = await makeApiCall(true, "GET", "/health");
      const ledgerReady = response.ok;

      setAppReady(serverReady && ledgerReady);
    })();
  });


  return !appReady ? <ApplicationDown /> : (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />}></Route>
          <Route path="/chat" element={<Bubble />}></Route>
          <Route path="/sign-in" element={<SignIn />}></Route>
          <Route path="/sign-up" element={<SignUp />}></Route>
          <Route path="*" element={<PageNotFound />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
