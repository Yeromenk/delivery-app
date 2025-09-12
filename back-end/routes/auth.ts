import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../database/db';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const OAUTH_GOOGLE_CLIENT_ID = process.env.OAUTH_GOOGLE_CLIENT_ID;
const OAUTH_GOOGLE_CLIENT_SECRET = process.env.OAUTH_GOOGLE_CLIENT_SECRET;
const OAUTH_GOOGLE_REDIRECT = process.env.OAUTH_GOOGLE_REDIRECT || process.env.OAUTH_GOOGLE_CLIENT_REDIRECT || 'http://localhost:5000/api/auth/google/callback';
const OAUTH_GITHUB_CLIENT_ID = process.env.OAUTH_GITHUB_CLIENT_ID;
const OAUTH_GITHUB_CLIENT_SECRET = process.env.OAUTH_GITHUB_CLIENT_SECRET;
const OAUTH_GITHUB_REDIRECT = process.env.OAUTH_GITHUB_REDIRECT || process.env.OAUTH_GITHUB_CLIENT_REDIRECT || 'http://localhost:5000/api/auth/github/callback';
const COOKIE_NAME = process.env.COOKIE_NAME || 'token';
const isProd = process.env.NODE_ENV === 'production';

// Axios instance for external APIs
const externalApiClient = axios.create({
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'ye-pizza-app'
    }
});

// Inline validation helpers (pre-refactor style)
function isValidEmail(email: string) {
    return /[^@\s]+@[^@\s]+\.[^@\s]+/.test(email);
}

function isStrongPassword(pw: string) {
    return pw.length >= 6;
}

function isValidPhone(phone?: string) {
    if (!phone) return false;
    const p = phone.trim();
    const digits = p.replace(/\D/g, '');
    return digits.length >= 7 && /^\+?[\d\s()-]+$/.test(p);
}

function setAuthCookie(res: Response, payload: object) {
    const token = jwt.sign(payload, JWT_SECRET!, { expiresIn: '7d' });
    res.cookie(COOKIE_NAME!, token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: isProd,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/',
    });
}

function sanitizeUser(u: {
    id: number;
    fullName: string;
    email: string;
    phone?: string;
    role: string;
    provider?: string
}) {
    return { id: u.id, fullName: u.fullName, email: u.email, phone: u.phone, role: u.role, provider: u.provider };
}

async function findUserByEmail(email: string) {
    const result = await pool.query('SELECT * FROM "User" WHERE email = $1 LIMIT 1', [email]);
    return result.rows[0];
}

async function findUserByProvider(provider: string, providerId: string) {
    const result = await pool.query('SELECT * FROM "User" WHERE provider = $1 AND "providerId" = $2 LIMIT 1', [provider, providerId]);
    return result.rows[0];
}

// Register
router.post('/register', async (req: Request, res: Response) => {
    try {
        const { fullName, email, password, phone } = req.body as { fullName?: string; email?: string; password?: string; phone?: string };
        const normEmail = (email || '').trim().toLowerCase();

        if (!fullName || fullName.trim().length < 2) {
            return res.status(400).json({ message: 'Invalid full name' });
        }

        if (!isValidEmail(normEmail)) {
            return res.status(400).json({ message: 'Invalid email' });
        }

        if (!isStrongPassword(password || '')) {
            return res.status(400).json({ message: 'Password must be at least 6 chars' });
        }

        if (!isValidPhone(phone)) {
            return res.status(400).json({ message: 'Invalid phone number' });
        }

        const existing = await findUserByEmail(normEmail);

        if (existing) {
            return res.status(409).json({ message: 'Email already in use' });
        }

        const hash = await bcrypt.hash(password!, 10);
        const result = await pool.query(
            'INSERT INTO "User" ("fullName", email, password, phone) VALUES ($1, $2, $3, $4) RETURNING *',
            [fullName.trim(), normEmail, hash, (phone || '').trim()]
        );
        const user = result.rows[0];

        setAuthCookie(res, { id: user.id, email: user.email, role: user.role });
        res.status(200).json({ user: sanitizeUser(user) });
    } catch (e) {
        console.error('Register error', e);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body as { email?: string; password?: string };
        const normEmail = (email || '').trim().toLowerCase();
        if (!isValidEmail(normEmail)) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const user = await findUserByEmail(normEmail);
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const ok = await bcrypt.compare(password || '', user.password);
        if (!ok) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        setAuthCookie(res, { id: user.id, email: user.email, role: user.role });
        res.status(200).json({ user: sanitizeUser(user) });
    } catch (e) {
        console.error('Login error', e);
        res.status(500).json({ message: 'Server error' });
    }
});

// Logout
router.post('/logout', (req: Request, res: Response) => {
    res.clearCookie(COOKIE_NAME!, { path: '/' });
    res.status(200).json({ ok: true });
});

// Me
router.get('/me', async (req: Request, res: Response) => {
    try {
        const token = req.cookies?.[COOKIE_NAME!];

        if (!token) {
            return res.status(401).json({ user: null });
        }

        const payload = jwt.verify(token, JWT_SECRET!) as { id: number };
        const result = await pool.query('SELECT * FROM "User" WHERE id = $1 LIMIT 1', [payload.id]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ user: null });
        }
        res.json({ user: sanitizeUser(user) });
    } catch {
        return res.status(401).json({ user: null });
    }
});

// Update profile 
router.put('/me', async (req: Request, res: Response) => {
    try {
        const token = req.cookies?.[COOKIE_NAME!];

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const payload = jwt.verify(token, JWT_SECRET!) as { id: number };

        const { fullName, email, password, confirmPassword, phone } = req.body as {
            fullName?: string;
            email?: string;
            password?: string;
            confirmPassword?: string;
            phone?: string;
        };

        const updates: string[] = [];
        const values: (string | number)[] = [];

        // Validate and queue updates
        if (typeof fullName === 'string') {
            const nameTrim = fullName.trim();

            if (nameTrim.length < 2) {
                return res.status(400).json({ message: 'Full name must be at least 2 characters' });
            }

            updates.push('"fullName" = $' + (values.length + 1));
            values.push(nameTrim);
        }

        if (typeof email === 'string') {
            const emailNorm = email.trim().toLowerCase();
            if (!isValidEmail(emailNorm)) {
                return res.status(400).json({ message: 'Invalid email' });
            }

            const existing = await pool.query('SELECT id FROM "User" WHERE email=$1 AND id<>$2 LIMIT 1', [emailNorm, payload.id]);

            if (existing.rows[0]) {
                return res.status(409).json({ message: 'Email already in use' });
            }

            updates.push('email = $' + (values.length + 1));
            values.push(emailNorm);
        }

        if (typeof phone === 'string') {
            const phoneTrim = phone.trim();

            if (!isValidPhone(phoneTrim)) {
                return res.status(400).json({ message: 'Invalid phone number' });
            }

            updates.push('phone = $' + (values.length + 1));
            values.push(phoneTrim);
        }

        if (typeof password === 'string' && password.length) {
            if (!isStrongPassword(password)) {
                return res.status(400).json({ message: 'Password must be at least 6 chars' });
            }

            if (password !== confirmPassword) {
                return res.status(400).json({ message: 'Passwords must match' });
            }

            const hash = await bcrypt.hash(password, 10);
            updates.push('password = $' + (values.length + 1));
            values.push(hash);
        }

        if (!updates.length) {
            return res.status(400).json({ message: 'No valid changes provided' });
        }

        updates.push('"updatedAt" = NOW()');
        const sql = `UPDATE "User" SET ${updates.join(', ')} WHERE id = $${values.length + 1} RETURNING *`;
        values.push(payload.id);
        const result = await pool.query(sql, values);
        const user = result.rows[0];
        res.json({ user: sanitizeUser(user) });
    } catch (e) {
        console.error('Update profile error', e);
        res.status(500).json({ message: 'Server error' });
    }
});

// OAuth: Google
router.get('/google', (req: Request, res: Response) => {
    const state = encodeURIComponent(req.query.redirect as string || '/');
    const params = new URLSearchParams({
        client_id: OAUTH_GOOGLE_CLIENT_ID!,
        redirect_uri: OAUTH_GOOGLE_REDIRECT!,
        response_type: 'code',
        scope: 'openid email profile',
        state,
        access_type: 'offline',
        prompt: 'consent',
    });
    res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
});

router.get('/google/callback', async (req: Request, res: Response) => {
    try {
        const code = req.query.code as string;
        const redirect = (req.query.state as string) ? decodeURIComponent(req.query.state as string) : '/';
        if (!code) {
            return res.redirect(`${FRONTEND_URL}/?error=oauth_no_code`);
        }

        // Exchange code for tokens using axios
        const tokenResponse = await externalApiClient.post('https://oauth2.googleapis.com/token',
            new URLSearchParams({
                code,
                client_id: OAUTH_GOOGLE_CLIENT_ID!,
                client_secret: OAUTH_GOOGLE_CLIENT_SECRET!,
                redirect_uri: OAUTH_GOOGLE_REDIRECT!,
                grant_type: 'authorization_code',
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        const tokenData = tokenResponse.data as { id_token?: string };
        const idToken = tokenData.id_token as string | undefined;

        if (!idToken) {
            return res.redirect(`${FRONTEND_URL}/?error=oauth_no_token`);
        }

        // Decode id_token (JWT) to get basic profile
        const payload = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString()) as { email?: string; name?: string; given_name?: string; sub: string };
        const email = String(payload.email || '').toLowerCase();
        const name = payload.name || payload.given_name || 'User';
        const sub = String(payload.sub);

        let user = await findUserByProvider('google', sub);
        if (!user) {
            const existingEmailUser = await findUserByEmail(email);
            if (existingEmailUser) {
                user = existingEmailUser;
                await pool.query('UPDATE "User" SET provider=$1, "providerId"=$2 WHERE id=$3', ['google', sub, user.id]);
            } else {
                const randomHash = await bcrypt.hash(`oauth_${sub}_${Date.now()}`, 10);
                const result = await pool.query(
                    'INSERT INTO "User" ("fullName", email, password, provider, "providerId", verified) VALUES ($1,$2,$3,$4,$5, NOW()) RETURNING *',
                    [name, email, randomHash, 'google', sub]
                );
                user = result.rows[0];
            }
        }

        setAuthCookie(res, { id: user.id, email: user.email, role: user.role });
        res.redirect(`${FRONTEND_URL}${redirect}`);
    } catch (e) {
        console.error('Google OAuth error', e);
        res.redirect(`${FRONTEND_URL}/?error=oauth_failed`);
    }
});

// OAuth: GitHub
router.get('/github', (req: Request, res: Response) => {
    const state = encodeURIComponent(req.query.redirect as string || '/');
    const params = new URLSearchParams({
        client_id: OAUTH_GITHUB_CLIENT_ID!,
        redirect_uri: OAUTH_GITHUB_REDIRECT!,
        scope: 'read:user user:email',
        state,
    });
    res.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
});

router.get('/github/callback', async (req: Request, res: Response) => {
    try {
        const code = req.query.code as string;
        const redirect = (req.query.state as string) ? decodeURIComponent(req.query.state as string) : '/';
        if (!code) {
            return res.redirect(`${FRONTEND_URL}/?error=oauth_no_code`);
        }

        // Exchange code for access token using axios
        const tokenResponse = await externalApiClient.post('https://github.com/login/oauth/access_token', {
            client_id: OAUTH_GITHUB_CLIENT_ID!,
            client_secret: OAUTH_GITHUB_CLIENT_SECRET!,
            code,
            redirect_uri: OAUTH_GITHUB_REDIRECT!,
        }, {
            headers: {
                'Accept': 'application/json'
            }
        });

        const tokenData = tokenResponse.data as { access_token?: string };
        const accessToken = tokenData.access_token as string | undefined;
        if (!accessToken) return res.redirect(`${FRONTEND_URL}/?error=oauth_no_token`);

        // Get user data using axios
        const userResponse = await externalApiClient.get('https://api.github.com/user', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        const ghUser = userResponse.data as { id: number; login?: string; name?: string };

        const emailsResponse = await externalApiClient.get('https://api.github.com/user/emails', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        const emails = emailsResponse.data as Array<{ email: string; primary?: boolean }>;

        const primaryEmail = (emails?.find((e) => e.primary)?.email || emails?.[0]?.email || '').toLowerCase();

        const loginName = ghUser.name || ghUser.login || 'GitHub User';
        const providerId = String(ghUser.id);

        let user = await findUserByProvider('github', providerId);
        if (!user) {
            const existingEmailUser = primaryEmail ? await findUserByEmail(primaryEmail) : null;
            if (existingEmailUser) {
                user = existingEmailUser;
                await pool.query('UPDATE "User" SET provider=$1, "providerId"=$2 WHERE id=$3', ['github', providerId, user.id]);
            } else {
                const randomHash = await bcrypt.hash(`oauth_${providerId}_${Date.now()}`, 10);
                const result = await pool.query(
                    'INSERT INTO "User" ("fullName", email, password, provider, "providerId", verified) VALUES ($1,$2,$3,$4,$5, NOW()) RETURNING *',
                    [loginName, primaryEmail || `${providerId}@users.noreply.github.com`, randomHash, 'github', providerId]
                );
                user = result.rows[0];
            }
        }

        setAuthCookie(res, { id: user.id, email: user.email, role: user.role });
        res.redirect(`${FRONTEND_URL}${redirect}`);
    } catch (e) {
        console.error('GitHub OAuth error', e);
        res.redirect(`${FRONTEND_URL}/?error=oauth_failed`);
    }
});

export default router;