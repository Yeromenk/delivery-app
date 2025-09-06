import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import './not-auth.css';

export const InfoBlock = () => {
    return (
        <div className="not-auth">
            <div className="not-auth__content">
                <div className="not-auth__text">
                    <h1>You are not authorized</h1>
                    <p>Please sign in to access this page.</p>
                </div>

                <div className="not-auth__actions">
                    <Link to="/" className="not-auth__btn not-auth__btn--secondary">
                        <ArrowLeft size={18} />
                        <span>Home</span>
                    </Link>
                    <button
                        className="not-auth__btn not-auth__btn--primary"
                        onClick={() => window.dispatchEvent(new Event('auth:open'))}
                        type="button"
                    >
                        Sign in
                    </button>
                </div>
            </div>

            <div className="not-auth__image">
                <img src="/images/lock.png" alt="Lock" />
            </div>
        </div>
    );
};