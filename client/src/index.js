import ReactDOM from "react-dom/client";
import { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { App } from "./app";
import { Provider } from "react-redux";
import Store from "./redux/store";
import { SocketProvider } from "./utils/SocketContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <HelmetProvider>
    <SocketProvider>

    <BrowserRouter>
      <Suspense>
        <Provider store={Store}>
          <App />
        </Provider>
      </Suspense>
    </BrowserRouter>
    </SocketProvider>
  </HelmetProvider>
);
