import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'nprogress/nprogress.css'
import App from './App.tsx'
import ErrorBoundary from './components/error-boundary/ErrorBoundary.tsx'
import { Toaster } from "react-hot-toast";
import NProgress from 'nprogress'
import { initAxiosProgress } from './lib/axios-progress.ts'

NProgress.configure({ showSpinner: false, trickleSpeed: 100 });
initAxiosProgress();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ErrorBoundary>
            <App />
            <Toaster />
        </ErrorBoundary>
    </StrictMode>,
)