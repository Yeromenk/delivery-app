import './NotFound.css';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="not-found">
            <div className="not-found-container">
                <div className="not-found-content">
                    <h1>404</h1>
                    <h2>Page Not Found</h2>
                    <p>The page you are looking for doesn't exist or has been moved.</p>
                    <Link to="/">
                        <button className="not-found-button">
                            Return to Homepage
                        </button>
                    </Link>
                </div>
                <div className="not-found-image">
                    <img src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif" alt="404 animation" />
                </div>
            </div>
        </div>
    );
};

export default NotFound;