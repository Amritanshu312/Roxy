/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

// index.js


import handleCorsRequest from './cors.js';
import proxy from './proxy.js';

// Define the list of allowed websites
const ALLOWED_WEBSITES = [
    'http://localhost:3000/', // Replace with your allowed domains
    'https://movie-verse-sage.vercel.app/',
];

function isAllowedOrigin(origin) {
    if (!origin) return false; // If no origin is provided, deny by default

    try {
        const { hostname } = new URL(origin);
        return ALLOWED_WEBSITES.includes(hostname);
    } catch (error) {
        return false; // Deny requests with invalid origins
    }
}

export default {
    async fetch(request) {
        const url = new URL(request.url);
        const origin = request.headers.get('Origin');

        if (!isAllowedOrigin(origin)) {
            return new Response('Origin not allowed', { status: 403 });
        }

        if (url.pathname === '/proxy') {
            return proxy(request);
        } else if (url.pathname === '/cors') {
            return handleCorsRequest(request);
        } else if (url.pathname === '/image') {
            return handleCorsRequest(request);
        } else if (url.pathname === '/') {
            return new Response(
                JSON.stringify({
                    message: 'Welcome to Roxy',
                    Endpoints: ['/proxy', '/cors'],
                    params: '?url=<Base64-encoded-m3u8-url>&headers=<Base64-encoded-headers>',
                }),
                {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
        }

        return new Response('Not Found', { status: 404 });
    },
};
