import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import ErrorBoundary from './components/error-boundary/ErrorBoundary.tsx'
import {Toaster} from "react-hot-toast";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ErrorBoundary>
            <App />
            <Toaster />
        </ErrorBoundary>
    </StrictMode>,
)