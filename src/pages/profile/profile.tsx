import { useEffect, useState } from 'react';
import axios from 'axios';
import { ProfileForm } from '../../components/profile-form/profile-form';
import { InfoBlock as NotAuth } from '../../components/not-auth/not-auth';

const ProfilePage = () => {
    const [ready, setReady] = useState(false);
    const [denied, setDenied] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                await axios.get('http://localhost:5000/api/auth/me', { withCredentials: true });
                setDenied(false);
            } catch {
                setDenied(true);
            } finally {
                setReady(true);
            }
        })();
    }, []);

    if (!ready) return null;
    if (denied) return (
        <div className="container">
            <NotAuth />
        </div>
    );


    return (
        <div className="container" >
            <ProfileForm />
        </div>
    );
};

export default ProfilePage;
