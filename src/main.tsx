import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import { store } from "./state/store/store";
import { BrowserRouter, Route, Routes } from "react-router";
import Results from "./pages/Results";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}/>
          <Route path="/results" element={<Results />} />
        </Routes>            
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
