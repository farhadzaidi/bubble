import { BrowserRouter, Routes, Route } from "react-router-dom";

import Bubble from "./bubble/Bubble";
import SignIn from "./sign_in/SignIn";
import SignUp from "./sign_up/SignUp";
import PageNotFound from "./page_not_found/PageNotFound";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Bubble />}></Route>
          <Route path="/sign-in" element={<SignIn />}></Route>
          <Route path="/sign-up" element={<SignUp />}></Route>
          <Route path="*" element={<PageNotFound />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
