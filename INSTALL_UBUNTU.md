
# ProtocolPilot: Ubuntu Server Installation Guide

This guide provides basic steps to deploy the ProtocolPilot Next.js application on an Ubuntu server.

## Prerequisites

1.  **Ubuntu Server**: A clean installation of Ubuntu (LTS version recommended, e.g., 20.04, 22.04).
2.  **SSH Access**: You should have SSH access to the server with a user that has `sudo` privileges.
3.  **Domain Name (Optional but Recommended)**: If you plan to use a domain name and SSL, have it ready and pointing to your server's IP address.
4.  **Git**: To clone the repository.

## Step 1: Update System and Install Essentials

Connect to your server via SSH and update the package lists:

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y curl wget git unzip nginx # Nginx is optional but recommended for reverse proxy
```

## Step 2: Install Node.js and npm

ProtocolPilot is a Next.js application and requires Node.js. We recommend using Node Version Manager (nvm) to install and manage Node.js versions.

1.  **Install nvm**:
    ```bash
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    ```
    After installation, you might need to close and reopen your terminal or run:
    ```bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
    source ~/.bashrc 
    ```
    Verify nvm installation:
    ```bash
    nvm --version
    ```

2.  **Install Node.js (LTS version)**:
    ```bash
    nvm install --lts
    nvm use --lts
    ```
    Verify Node.js and npm installation:
    ```bash
    node -v
    npm -v
    ```

## Step 3: Clone the Application from GitHub

Navigate to the directory where you want to install the application (e.g., `/var/www/` or your user's home directory).

```bash
# Example: cd /var/www
# Replace <your-github-repo-url> with the actual URL of your ProtocolPilot repository
git clone <your-github-repo-url> protocolpilot
cd protocolpilot
```

## Step 4: Install Application Dependencies

Inside the `protocolpilot` directory:

```bash
npm install
```
(If you prefer yarn: `yarn install`)

## Step 5: Configure Environment Variables (If Any)

If your application requires environment variables (e.g., for API keys, database connections - though this prototype uses mock data), create a `.env.local` file in the root of the `protocolpilot` directory:

```bash
cp .env .env.local # If you have a template .env file
nano .env.local
```
Add your variables in the format `VARIABLE_NAME=value`.

## Step 6: Build the Application

Build the Next.js application for production:

```bash
npm run build
```

## Step 7: Run the Application with a Process Manager (PM2)

PM2 is a production process manager for Node.js applications that will keep your app alive and manage logs.

1.  **Install PM2 globally**:
    ```bash
    sudo npm install pm2 -g
    ```

2.  **Start the application with PM2**:
    The default port for Next.js is 3000. The panel itself might be configured to be accessed via a different port (e.g., 2053 as per `initialPanelSettings.loginPort` in `user-data.ts`).
    If Next.js is configured to run on a specific port (e.g., 9002 as per `package.json` dev script), you'd use that. The `npm run start` script for Next.js will typically use port 3000 unless overridden.

    ```bash
    pm2 start npm --name "protocolpilot" -- run start 
    ```
    If your `npm run start` script in `package.json` specifies a port (e.g., `next start -p <PORT>`), PM2 will use that. Otherwise, Next.js defaults to port 3000.

3.  **Ensure PM2 starts on system boot**:
    ```bash
    pm2 startup systemd
    # Follow the instructions output by the command (it usually asks you to run another command with sudo)
    pm2 save
    ```

4.  **Check application status**:
    ```bash
    pm2 list
    pm2 logs protocolpilot
    ```

## Step 8: Configure Reverse Proxy (Nginx - Optional but Recommended)

Using a reverse proxy like Nginx allows you to serve your application on standard ports (80/443), handle SSL termination, and manage multiple sites.

1.  **Create an Nginx server block configuration file**:
    ```bash
    sudo nano /etc/nginx/sites-available/protocolpilot
    ```

2.  **Paste the following configuration (adjust as needed)**:
    Replace `your_domain.com` with your actual domain and ensure `proxy_pass` points to the port your Next.js app is running on (e.g., 3000 or the port specified in `npm run start`).

    ```nginx
    server {
        listen 80;
        listen [::]:80;

        server_name your_domain.com www.your_domain.com; # Replace with your domain

        location / {
            proxy_pass http://localhost:3000; # Or your app's actual port
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```

3.  **Enable the site and test Nginx configuration**:
    ```bash
    sudo ln -s /etc/nginx/sites-available/protocolpilot /etc/nginx/sites-enabled/
    sudo nginx -t
    ```

4.  **Restart Nginx**:
    If the test is successful:
    ```bash
    sudo systemctl restart nginx
    ```

5.  **Configure SSL with Certbot (Let's Encrypt)**:
    If you have a domain, you can easily set up free SSL.
    ```bash
    sudo apt install certbot python3-certbot-nginx -y
    sudo certbot --nginx -d your_domain.com -d www.your_domain.com # Follow prompts
    ```
    Certbot will automatically update your Nginx configuration for SSL.

## Step 9: Access Your Panel

You should now be able to access your ProtocolPilot panel.

*   **If using Nginx with a domain**: `http://your_domain.com` or `https://your_domain.com`
*   **If accessing directly by IP and port**: `http://<YOUR_SERVER_IP>:<APP_PORT>` (e.g., `http://<YOUR_SERVER_IP>:3000`)

Then, navigate to the login path, which is configured in `src/app/users/user-data.ts` (`initialPanelSettings.loginPath`, default `/paneladmin`). So the full login URL might be something like:
`http://<YOUR_SERVER_IP>:<APP_PORT_IF_NO_NGINX_OR_NGINX_PORT_IF_REVERSE_PROXY_SETUP>/paneladmin`

**Initial Login Details (as per current prototype settings):**
*   **Default Username**: `admin_please_change`
*   **Default Password**: `password`
*   **Panel Login Address Format**: `http://<YOUR_SERVER_IP>:${initialPanelSettings.loginPort}${initialPanelSettings.loginPath}` (The port here is the one configured in the panel settings, which might be different from the Next.js app's running port. Nginx would typically map port 80/443 to the app's actual running port, and the panel settings port would be for internal reference or specific direct access if allowed).

**Important:** Remember to change the default username and password immediately after your first login via the "Panel Settings" page for security.

## Troubleshooting

*   **Firewall**: Ensure your server's firewall (e.g., `ufw`) allows traffic on the necessary ports (80, 443 if using Nginx; or your app's direct port like 3000).
    ```bash
    sudo ufw allow 'Nginx Full' # If using Nginx
    sudo ufw allow <YOUR_APP_PORT>/tcp # e.g., sudo ufw allow 3000/tcp
    sudo ufw enable
    sudo ufw status
    ```
*   **Logs**: Check PM2 logs (`pm2 logs protocolpilot`) and Nginx logs (`/var/log/nginx/error.log`, `/var/log/nginx/access.log`) for any errors.

This guide provides a starting point. Depending on your specific server setup and security requirements, further configurations might be necessary.
