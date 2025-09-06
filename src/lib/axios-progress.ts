import axios from 'axios';
import NProgress from 'nprogress';

let activeRequests = 0;
let initialized = false;

export function initAxiosProgress() {
    if (initialized) return;
    initialized = true;

    axios.interceptors.request.use(
        (config) => {
            if (activeRequests === 0) NProgress.start();
            activeRequests += 1;
            return config;
        },
        (error) => {
            return Promise.reject(error);
        },
    );

    const finalize = () => {
        activeRequests = Math.max(0, activeRequests - 1);
        if (activeRequests === 0) NProgress.done();
    };

    axios.interceptors.response.use(
        (response) => {
            finalize();
            return response;
        },
        (error) => {
            finalize();
            return Promise.reject(error);
        },
    );
}
