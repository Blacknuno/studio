
## Install ProtocolPilot

```
bash <(curl -Ls https://raw.githubusercontent.com/Blacknuno/studio/refs/heads/1.0.0/install.sh)
```



# ProtocolPilot: Automated Ubuntu Server Installation Guide

This guide provides steps to deploy the ProtocolPilot Next.js application on an Ubuntu server using an automated installation script. The script is now pre-configured to use a specific application repository: `https://github.com/Blacknuno/studio.git`.

## Prerequisites

1.  **Ubuntu Server**: A clean installation of Ubuntu (LTS version recommended, e.g., 20.04, 22.04).
2.  **SSH Access**: You should have SSH access to the server, ideally as the `root` user or a user with full `sudo` privileges.
3.  **`install.sh` Script**: You need the `install.sh` script provided with ProtocolPilot, which is now pre-configured for your GitHub repository.

## Step 1: Host Your Pre-configured `install.sh` Script (Recommended for `curl` method)

Even though the application repository URL is pre-configured in the `install.sh` script, you still need to host this script at a publicly accessible raw URL for the `curl` installation method.

Common options:
    *   **GitHub Gist**: Create a new public Gist ([https://gist.github.com/](https://gist.github.com/)), paste the pre-configured `install.sh` script content, give it a filename (e.g., `install.sh`), and click "Create public gist". Then, click the "Raw" button on the Gist page and copy the URL from your browser's address bar. This is `YOUR_PRECONFIGURED_RAW_INSTALL_SH_URL`.
    *   **Public GitHub Repository**: Commit the pre-configured `install.sh` to a public repository (it could even be your `Blacknuno/studio` repository if you wish, or a dedicated one) and use the raw file URL (e.g., `https://raw.githubusercontent.com/your-username/your-repo/main/install.sh`).

    Let's assume your pre-configured script is now hosted at: `YOUR_PRECONFIGURED_RAW_INSTALL_SH_URL`

## Step 2: Run the Automated Installer

Connect to your Ubuntu server via SSH (as `root` or a user with `sudo` privileges).

**Option A: Using `curl` (if you hosted the pre-configured script and have a raw URL):**
This is the recommended method. This command downloads your pre-configured `install.sh` script and executes it using `sudo bash`.

```bash
sudo bash -c "$(curl -Ls YOUR_PRECONFIGURED_RAW_INSTALL_SH_URL)"
```
**Replace `YOUR_PRECONFIGURED_RAW_INSTALL_SH_URL` with the actual raw URL of your pre-configured `install.sh` script.**

**Option B: If you manually uploaded/pasted the pre-configured script to the server (e.g., as `~/install.sh`):**
1.  Make the script executable: `chmod +x ~/install.sh`
2.  Run it with `sudo`: `sudo ~/install.sh`

## Step 3: Monitor Installation

The installation script will now run automatically. It will:
*   Update system packages.
*   Install Node.js (via NVM), npm, PM2, and other dependencies like Nginx.
*   Clone your application from `https://github.com/Blacknuno/studio.git`.
*   Install application dependencies.
*   Build the application.
*   Set up PM2 to run your application and configure it to start on boot.
*   Output the access URL, default username, and default password.

**Watch the script output carefully for any error messages.**

## Step 4: Post-Installation

Once the script finishes successfully, it will display:
*   The URL to access your ProtocolPilot panel (usually `http://<YOUR_SERVER_IP>:<PORT>`, where port is often 3000 or as defined in your `package.json` start script).
*   The login path (e.g., `/paneladmin`).
*   The **default username** (`admin_please_change`) and **default password** (`password`) for initial login.

**Crucial First Step:**
Log in to your panel immediately using the provided details and navigate to **Panel Settings** to **change the default username and password** for security.

## Step 5: Configure Reverse Proxy (Nginx - Recommended)

The script installs Nginx and provides an example Nginx server block configuration in its output. For production use, it's highly recommended to set up Nginx as a reverse proxy. This allows you to:
*   Serve your application on standard ports (80 for HTTP, 443 for HTTPS).
*   Easily set up SSL/TLS for a secure HTTPS connection (e.g., using Certbot with Let's Encrypt).
*   Improve performance and add a layer of security.

Follow the Nginx configuration example provided by the script.

## Troubleshooting

*   **Script Errors**: If the script fails, review the output carefully for specific error messages.
    *   **"pm2: command not found" or "node: command not found"**: This usually indicates an issue with NVM installation or PATH configuration. The script attempts to handle this, but ensure your base Ubuntu system is standard.
    *   **"cannot access '/root/protocolpilot': No such file or directory" (or similar for your user's home)**: This means the `git clone` step likely failed.
        *   Verify your server has internet access to GitHub.
        *   Ensure `git` was installed correctly (the script does this).
*   **Check Script Logs**: The output on your terminal during installation is the primary log.
*   **Firewall**: Ensure your server's firewall (e.g., `ufw`) allows traffic on the necessary ports (e.g., the port your Next.js app runs on, typically 3000, or 80/443 if using Nginx).
    *   `sudo ufw allow <your_app_port>/tcp` (e.g., `sudo ufw allow 3000/tcp`)
    *   `sudo ufw allow 'Nginx Full'` (if Nginx is configured)
    *   `sudo ufw enable`
*   **PM2 Logs**: If the app starts but has issues: `pm2 logs protocolpilot` (or your `APP_DIR_NAME`).
*   **Nginx Logs**: If using Nginx, check logs in `/var/log/nginx/error.log` and `/var/log/nginx/access.log`.

If you continue to face issues, please provide the **full output of the installation script** so the problem can be diagnosed.
