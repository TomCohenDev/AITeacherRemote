# Server Timeout Configuration Guide

## Problem

Annotation requests are failing after exactly **60 seconds** with a "Network Error" (CORS error), even though:

- The frontend has a **5-minute timeout** configured
- The backend is still processing the request
- The annotation completes successfully on the server

## Root Cause

Your **reverse proxy/gateway** (nginx, Apache, Cloudflare, etc.) has a **60-second timeout** that's killing long-running requests before they complete.

## Evidence

From browser console:

```
❌ Annotation error after 60.2s
Error code: ERR_NETWORK
Error message: Network Error
Response status: undefined
```

The "Network Error" appears as a CORS error because when the proxy times out, it returns an error response **without CORS headers**, making the browser think it's a CORS policy violation.

## Solution

You need to configure your reverse proxy to allow **longer timeouts** for annotation requests.

### For nginx

Edit your nginx config (usually `/etc/nginx/sites-available/your-site`):

```nginx
location /webhook-test/ita/api {
    proxy_pass http://your-n8n-backend;

    # Increase timeouts to 5 minutes (300 seconds)
    proxy_connect_timeout 300s;
    proxy_send_timeout 300s;
    proxy_read_timeout 300s;

    # Keep the connection alive
    proxy_buffering off;

    # CORS headers
    add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Allow-Methods "GET, POST, OPTIONS";
    add_header Access-Control-Allow-Headers "Content-Type";
}
```

Then restart nginx:

```bash
sudo nginx -t  # Test configuration
sudo systemctl restart nginx
```

### For Apache

Edit your Apache config or `.htaccess`:

```apache
<Location /webhook-test/ita/api>
    ProxyPass http://your-n8n-backend
    ProxyPassReverse http://your-n8n-backend

    # Increase timeout to 5 minutes (300 seconds)
    ProxyTimeout 300

    # CORS headers
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Methods "GET, POST, OPTIONS"
    Header set Access-Control-Allow-Headers "Content-Type"
</Location>
```

### For Cloudflare

If using Cloudflare, note that:

- **Free plan**: 100-second timeout limit (cannot be changed)
- **Pro plan**: 100-second timeout limit
- **Business plan**: Can increase to 600 seconds
- **Enterprise plan**: Can increase to 6000 seconds

If you're on a free/pro plan and need longer timeouts, consider:

1. Use Cloudflare for page delivery only, not API endpoints
2. Create a direct subdomain (e.g., `api-direct.yourdomain.com`) that bypasses Cloudflare
3. Upgrade to Business/Enterprise plan

### For n8n Webhook Settings

If using n8n's built-in webhook:

1. Go to n8n settings → Executions
2. Set "Timeout" to 300 seconds or higher
3. Enable "Wait for completion" in webhook settings

## Frontend Improvements (Already Implemented)

The frontend now:

- ✅ Uses a custom axios instance with 5-minute timeout
- ✅ Detects the 60-second proxy timeout pattern
- ✅ Shows user-friendly message explaining the situation
- ✅ Indicates that processing may still continue on the server

## Testing

After configuring your server, test with:

1. Send an annotation request
2. Watch browser console logs
3. You should see either:
   - ✅ `Annotation request completed in X.Xs` (success)
   - ❌ Error after 60s → Server still needs configuration
   - ⏳ Timeout after 300s → Request genuinely took too long

## Current Behavior

Until the server is configured, users will see:

> ⏳ Annotation sent! Server is processing (may take up to 5 minutes). ⚠️ Your server proxy has a 60s timeout - please configure it to allow longer requests.

This is **not an error** - it's informing users that:

1. The request was successfully sent
2. The backend is still processing
3. The server configuration needs updating for better UX

## Questions?

Check your server logs to see if the annotation completed successfully despite the frontend timeout.

