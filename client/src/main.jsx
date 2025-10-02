import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {store, persistor } from "./redux/store.js";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import ToastProvider from "./components/Toast.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ToastProvider>
        <App />
      </ToastProvider>
    </PersistGate>
  </Provider>
);

// Expose Redux store for apiService.handleAuthError optional usage
if (typeof window !== 'undefined') {
  window.__REDUX_STORE__ = store;
}