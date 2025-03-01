# NGINX Configuration for DegenDuel

This document explains how to set up NGINX as a reverse proxy for the DegenDuel application.

## Prerequisites

1. A server with NGINX installed
2. Domain name pointed to your server (game.degenduel.me)
3. SSL certificate (we'll use Let's Encrypt)

## Steps to Configure NGINX

### 1. Install Let's Encrypt Certbot

```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx
```

### 2. Obtain SSL Certificate

```bash
sudo certbot --nginx -d game.degenduel.me -d www.game.degenduel.me
```

Follow the prompts to complete the certificate generation.

### 3. Copy NGINX Configuration

Copy the provided configuration file to the NGINX sites-available directory:

```bash
sudo cp /home/websites/degenduel-swarm/nginx/game.degenduel.me /etc/nginx/sites-available/
```

### 4. Create Symbolic Link to Enable the Site

```bash
sudo ln -s /etc/nginx/sites-available/game.degenduel.me /etc/nginx/sites-enabled/
```

### 5. Test NGINX Configuration

```bash
sudo nginx -t
```

If the test is successful, you should see:
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### 6. Restart NGINX

```bash
sudo systemctl restart nginx
```

## Configuration Details

The NGINX configuration includes:

1. **HTTP to HTTPS Redirect**: All HTTP traffic (port 80) is redirected to HTTPS (port 443)
2. **WWW to Non-WWW Redirect**: Requests to www.game.degenduel.me are redirected to game.degenduel.me
3. **Reverse Proxy**: All requests are forwarded to the Next.js application running on port 3010
4. **WebSocket Support**: Required for real-time features
5. **Caching Rules**: Optimized for static assets
6. **Security Headers**: Including HSTS, XSS protection, etc.

## Maintenance

### SSL Certificate Renewal

Certbot automatically adds a cron job to renew certificates before they expire. You can test the renewal process with:

```bash
sudo certbot renew --dry-run
```

### Updating Configuration

If you need to update your NGINX configuration:

1. Edit the file in sites-available:
   ```bash
   sudo nano /etc/nginx/sites-available/game.degenduel.me
   ```

2. Test the configuration:
   ```bash
   sudo nginx -t
   ```

3. Reload NGINX:
   ```bash
   sudo systemctl reload nginx
   ```

## Monitoring

Check NGINX logs for any issues:

- Access logs: `/var/log/nginx/game.degenduel.me.access.log`
- Error logs: `/var/log/nginx/game.degenduel.me.error.log`

## Troubleshooting

### 502 Bad Gateway

If you get a 502 Bad Gateway error, check:
- Is the Next.js server running on port 3010?
- Check with: `npm run status`
- If not running, start it with: `npm run deploy-bg`

### SSL Certificate Issues

If you have SSL certificate issues:
- Verify the certificate paths in the configuration file
- Ensure Let's Encrypt renewal is working properly
- Check certbot logs: `/var/log/letsencrypt/letsencrypt.log`