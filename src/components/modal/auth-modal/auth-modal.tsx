import React, { useEffect, useState } from 'react';
import './auth-modal.css';
import { X } from 'lucide-react';
import { Login } from './login/login';
import { Register } from './register/register';

export type AuthMode = 'login' | 'register';

interface Props {
    open: boolean;
    initialMode?: AuthMode;
    onClose: () => void;
}

const AuthModal: React.FC<Props> = ({ open, initialMode = 'login', onClose }) => {
    const [mode, setMode] = useState<AuthMode>(initialMode);

    useEffect(() => {
        setMode(initialMode);
    }, [initialMode, open]);

    if (!open) return null;

    return (
        <div className="auth-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div
                className="auth-modal-content"
                role="dialog"
                aria-modal="true"
                aria-label={mode === 'login' ? 'Sign in' : 'Create account'}
            >
                <div className="auth-card">
                    <button className="auth-close" onClick={onClose} aria-label="Close">
                        <X size={18} />
                    </button>
                    {mode === 'login' ? (
                        <Login />
                    ) : (
                        <Register />
                    )}

                    <div className="auth-divider"><span>or</span></div>

                    <div className="auth-social">
                        <button
                            type="button"
                            className="oauth-btn github"
                            aria-label="Continue with GitHub"
                            onClick={() => window.location.href = `http://localhost:5000/api/auth/github?redirect=${encodeURIComponent(window.location.pathname)}`}
                        >
                            <img className='oauth-icon' src='https://github.githubassets.com/favicons/favicon.svg' alt='' />
                            <span>{mode === 'login' ? 'Sign in with GitHub' : 'Sign up with GitHub'}</span>
                        </button>

                        <button
                            type="button"
                            className="oauth-btn google"
                            aria-label="Continue with Google"
                            onClick={() => window.location.href = `http://localhost:5000/api/auth/google?redirect=${encodeURIComponent(window.location.pathname)}`}
                        >
                            <img className='oauth-icon' src='https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg' alt='' />
                            <span>{mode === 'login' ? 'Sign in with Google' : 'Sign up with Google'}</span>
                        </button>
                    </div>
                    <div className="auth-toggle">
                        {mode === 'login' ? (
                            <>
                                <span>Don’t have an account?</span>
                                <button type="button" className="auth-link" onClick={() => setMode('register')}>
                                    Create one
                                </button>
                            </>
                        ) : (
                            <>
                                <span>Already have an account?</span>
                                <button type="button" className="auth-link" onClick={() => setMode('login')}>
                                    Sign in
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
