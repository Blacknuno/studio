
# ProtocolPilot: Automated Ubuntu Server Installation Guide

This guide provides steps to deploy the ProtocolPilot Next.js application on an Ubuntu server using an automated installation script.

## Prerequisites

1.  **Ubuntu Server**: A clean installation of Ubuntu (LTS version recommended, e.g., 20.04, 22.04).
2.  **SSH Access**: You should have SSH access to the server, ideally as the `root` user or a user with full `sudo` privileges.
3.  **GitHub Repository**: Your ProtocolPilot application code must be available in a **public** GitHub repository. You will need the HTTPS URL of this repository. If it's private, the script will fail to clone.
4.  **`install.sh` Script**: You need the `install.sh` script provided with ProtocolPilot.

## Step 1: Prepare the `install.sh` Script

1.  **Get the `install.sh` script**:
    *   Copy the content of the `install.sh` script provided by the AI or from your project files.
    *   Save it locally on your computer (e.g., as `my_protocolpilot_install.sh`).

2.  **Edit `APP_REPO_URL` in your local `install.sh` script**:
    Open your local copy of the `install.sh` script in a text editor. Near the top of the script, you will find a line:
    ```sh
    APP_REPO_URL="https://github.com/YOUR_USERNAME/YOUR_PROTOCOLPILOT_REPO.git" # <<<!!! EDIT THIS LINE !!!>>>
    ```
    **You MUST change this placeholder URL** to the actual HTTPS URL of your ProtocolPilot application's GitHub repository. For example:
    ```sh
    APP_REPO_URL="https://github.com/your-actual-username/your-protocolpilot-app.git"
    ```
    Save the changes to your local `install.sh` script. **Ensure this URL is correct and the repository is public or accessible without authentication by the script.**

## Step 2: Host Your Edited `install.sh` Script (Recommended for `curl` method)

For the easiest installation using a single `curl` command, you should host your **edited** `install.sh` script at a publicly accessible raw URL.
Common options:
    *   **GitHub Gist**: Create a new public Gist ([https://gist.github.com/](https://gist.github.com/)), paste your edited script content, give it a filename (e.g., `install.sh`), and click "Create public gist". Then, click the "Raw" button on the Gist page and copy the URL from your browser's address bar. This is `YOUR_RAW_EDITED_INSTALL_SH_URL`.
    *   **Public GitHub Repository**: Commit the edited `install.sh` to a public repository and use the raw file URL (e.g., `https://raw.githubusercontent.com/your-username/your-repo/main/install.sh`).

    Let's assume your edited script is now hosted at: `YOUR_RAW_EDITED_INSTALL_SH_URL`

## Step 3: Run the Automated Installer

Connect to your Ubuntu server via SSH (as `root` or a user with `sudo` privileges).

**Option A: Using `curl` (if you hosted the script and have a raw URL):**
This is the recommended method. This command downloads your edited `install.sh` script and executes it using `sudo bash`.

```bash
sudo bash -c "$(curl -Ls YOUR_RAW_EDITED_INSTALL_SH_URL)"
```
**Replace `YOUR_RAW_EDITED_INSTALL_SH_URL` with the actual raw URL of your edited `install.sh` script.**

**Option B: If you manually uploaded/pasted the script to the server (e.g., as `~/install.sh`):**
1.  Make sure you've edited the `APP_REPO_URL` inside this script on the server.
2.  Make the script executable: `chmod +x ~/install.sh`
3.  Run it with `sudo`: `sudo ~/install.sh`

## Step 4: Monitor Installation and Follow Prompts (If Any)

The installation script is designed to be largely automated after you've correctly set the `APP_REPO_URL` in it. It will:
*   Update system packages.
*   Install Node.js (via NVM), npm, PM2, and other dependencies like Nginx.
*   Clone your application using the `APP_REPO_URL` you configured.
*   Install application dependencies.
*   Build the application.
*   Set up PM2 to run your application and configure it to start on boot.
*   Output the access URL, default username, and default password.

**Watch the script output carefully for any error messages.**

## Step 5: Post-Installation

Once the script finishes successfully, it will display:
*   The URL to access your ProtocolPilot panel (usually `http://<YOUR_SERVER_IP>:<PORT>`, where port is often 3000 or as defined in your `package.json` start script).
*   The login path (e.g., `/paneladmin`).
*   The **default username** (`admin_please_change`) and **default password** (`password`) for initial login.

**Crucial First Step:**
Log in to your panel immediately using the provided details and navigate to **Panel Settings** to **change the default username and password** for security.

## Step 6: Configure Reverse Proxy (Nginx - Recommended)

The script installs Nginx and provides an example Nginx server block configuration in its output. For production use, it's highly recommended to set up Nginx as a reverse proxy. This allows you to:
*   Serve your application on standard ports (80 for HTTP, 443 for HTTPS).
*   Easily set up SSL/TLS for a secure HTTPS connection (e.g., using Certbot with Let's Encrypt).
*   Improve performance and add a layer of security.

Follow the Nginx configuration example provided by the script.

## Troubleshooting

*   **Script Errors**: If the script fails, review the output carefully for specific error messages.
    *   **"pm2: command not found" or "node: command not found"**: This usually indicates an issue with NVM installation or PATH configuration. The improved script attempts to handle this better. Ensure your base Ubuntu system is standard.
    *   **"cannot access '/root/protocolpilot': No such file or directory" (or similar for your user's home)**: This means the `git clone` step likely failed.
        *   Double-check the `APP_REPO_URL` in your `install.sh` script. Is it correct? Is the repository public?
        *   Check for network connectivity issues on your server.
        *   Ensure `git` was installed correctly (the script does this).
*   **Check Script Logs**: If you run the script and it fails, the output on your terminal is the primary log.
*   **Firewall**: Ensure your server's firewall (e.g., `ufw`) allows traffic on the necessary ports (e.g., the port your Next.js app runs on, typically 3000, or 80/443 if using Nginx).
    *   `sudo ufw allow <your_app_port>/tcp` (e.g., `sudo ufw allow 3000/tcp`)
    *   `sudo ufw allow 'Nginx Full'` (if Nginx is configured)
    *   `sudo ufw enable`
*   **PM2 Logs**: If the app starts but has issues: `pm2 logs protocolpilot` (or your `APP_DIR_NAME`).
*   **Nginx Logs**: If using Nginx, check logs in `/var/log/nginx/error.log` and `/var/log/nginx/access.log`.

If you continue to face issues, please provide the **full output of the installation script** so the problem can be diagnosed.

    