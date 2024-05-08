import React from "react";
import ReactDOM from "react-dom";
import App from "./App.jsx";
import { Provider } from "react-redux"; 
import "./index.css";
import { PersistGate } from "redux-persist/integration/react";
import { store,persistor } from "./Redux/Store.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
 <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
 </React.StrictMode>
);