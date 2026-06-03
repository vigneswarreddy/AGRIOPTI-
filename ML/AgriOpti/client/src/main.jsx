import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { StateContextProvider } from './Context/index.jsx'
import { registerSW } from 'virtual:pwa-register'
import './i18n';

registerSW({ immediate: true })

ReactDOM.createRoot(document.getElementById('root')).render(

    <StateContextProvider>
        <App />
    </StateContextProvider>

)
