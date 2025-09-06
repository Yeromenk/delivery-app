import { CircleUser } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import axios from 'axios';
import AuthModal from "../modal/auth-modal/auth-modal";
import type { AuthMode } from "../modal/auth-modal/auth-modal";

export const Profile = () => {
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
    const [authOpen, setAuthOpen] = useState(false);
    const [initialMode, setInitialMode] = useState<AuthMode>('login');

    const openAuth = (mode: AuthMode) => {
        setInitialMode(mode);
        setAuthOpen(true);
    };

    useEffect(() => {
        (async () => {
            try {
                await axios.get('http://localhost:5000/api/auth/me', { withCredentials: true });
                setIsAuthorized(true);
            } catch {
                setIsAuthorized(false);
            }
        })();

        const onAuthSuccess = () => {
            setAuthOpen(false);
            setIsAuthorized(true);
        };
        const onAuthLogout = () => {
            setIsAuthorized(false);
        };
        const onAuthOpen = () => openAuth('login');

        window.addEventListener('auth:success', onAuthSuccess as EventListener);
        window.addEventListener('auth:logout', onAuthLogout as EventListener);
        window.addEventListener('auth:open', onAuthOpen as EventListener);
        return () => {
            window.removeEventListener('auth:success', onAuthSuccess as EventListener);
            window.removeEventListener('auth:logout', onAuthLogout as EventListener);
            window.removeEventListener('auth:open', onAuthOpen as EventListener);
        };
    }, []);

    return (
        <>
            {isAuthorized ? (
                <Link to="/profile">
                    <button className="btn-sign-in">
                        <CircleUser size={18} /> Profile
                    </button>
                </Link>
            ) : (
                <button  
                className="btn-sign-in"
                onClick={() => openAuth('login')}>
                    <CircleUser size={16} />
                    Sign in
                </button>
            )}

            <AuthModal
                open={authOpen}
                initialMode={initialMode}
                onClose={() => setAuthOpen(false)}
            />
        </>
    );
};