import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import { BrowserRouter } from "react-router-dom"
import { NextUIProvider } from "@nextui-org/react"
import { Provider } from "react-redux"
import { store } from "./stores/store.js"

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <BrowserRouter>
    <NextUIProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </NextUIProvider>
  </BrowserRouter>
  // </React.StrictMode>
)
