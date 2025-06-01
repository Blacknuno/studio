
# ProtocolPilot: Automated Ubuntu Server Installation Guide

This guide provides steps to deploy the ProtocolPilot Next.js application on an Ubuntu server using an automated installation script.

## Prerequisites

1.  **Ubuntu Server**: A clean installation of Ubuntu (LTS version recommended, e.g., 20.04, 22.04).
2.  **SSH Access**: You should have SSH access to the server with a user that has `sudo` privileges.
3.  **GitHub Repository**: Your ProtocolPilot application code must be available in a GitHub repository. You will need the HTTPS URL of this repository.
4.  **`install.sh` Script**: You need the `install.sh` script provided with ProtocolPilot.

## Step 1: Prepare the `install.sh` Script

1.  **Get the `install.sh` script**:
    *   If you have it locally, you can upload it to your server (e.g., using `scp`).
    *   Alternatively, if the `install.sh` script itself is hosted on GitHub (e.g., in your ProtocolPilot application repository or a separate repository), you can download it directly.

2.  **Edit `APP_REPO_URL` in `install.sh`**:
    Open the `install.sh` script in a text editor. Near the top of the script, you will find a line:
    ```sh
    APP_REPO_URL="https://github.com/YOUR_USERNAME/YOUR_PROTOCOLPILOT_REPO.git" # <<<!!! EDIT THIS LINE !!!>>>
    ```
    **You MUST change this placeholder URL** to the actual HTTPS URL of your ProtocolPilot application's GitHub repository. For example:
    ```sh
    APP_REPO_URL="https://github.com/your-actual-username/your-protocolpilot-app.git"
    ```
    Save the changes to the `install.sh` script.

## Step 2: Host the (Edited) `install.sh` Script (Optional but Recommended)

For the easiest installation using a single `curl` command, you should host your **edited** `install.sh` script at a publicly accessible raw URL.
Common options:
    *   **GitHub Gist**: Create a new public Gist, paste your edited script content, and use the "Raw" button URL.
    *   **Public GitHub Repository**: Commit the edited `install.sh` to a public repository and use the raw file URL (e.g., `https://raw.githubusercontent.com/your-username/your-repo/main/install.sh`).

    Let's assume your edited script is now hosted at: `YOUR_RAW_EDITED_INSTALL_SH_URL`

## Step 3: Run the Automated Installer

Connect to your Ubuntu server via SSH.

**Option A: If you hosted the script and have a raw URL:**
Run the following command. This command downloads your edited `install.sh` script and executes it using `bash`. You need `sudo` because the script will install packages and configure services.

```bash
sudo bash -c "$(curl -Ls YOUR_RAW_EDITED_INSTALL_SH_URL)"
```
**Replace `YOUR_RAW_EDITED_INSTALL_SH_URL` with the actual raw URL of your edited `install.sh` script.**

**Option B: If you uploaded/downloaded the script directly to the server (e.g., as `~/install.sh`):**
Make the script executable and run it:
```bash
chmod +x ~/install.sh
sudo ~/install.sh
```

## Step 4: Follow On-Screen Prompts (If Any)

The installation script is designed to be largely automated after you've set the `APP_REPO_URL`. It will:
*   Update system packages.
*   Install Node.js, npm, PM2, and other dependencies like Nginx.
*   Clone your application using the `APP_REPO_URL` you configured in the script.
*   Install application dependencies.
*   Build the application.
*   Set up PM2 to run your application and start on boot.
*   Provide you with the access URL, default username, and default password.

## Step 5: Post-Installation

Once the script finishes, it will display:
*   The URL to access your ProtocolPilot panel (usually `http://<YOUR_SERVER_IP>:3000`, but the port might vary if your `package.json` start script specifies a different one).
*   The login path (e.g., `/paneladmin`).
*   The **default username** (`admin_please_change`) and **default password** (`password`) for initial login.

**Crucial First Step:**
Log in to your panel immediately using the provided details and navigate to **Panel Settings** to **change the default username and password** for security.

## Step 6: Configure Reverse Proxy (Nginx - Recommended)

The script installs Nginx but does not fully configure it with your domain. For production use, it's highly recommended to set up Nginx as a reverse proxy. This allows you to:
*   Serve your application on standard ports (80 for HTTP, 443 for HTTPS).
*   Easily set up SSL/TLS for a secure HTTPS connection (e.g., using Certbot with Let's Encrypt).
*   Improve performance and add a layer of security.

The installation script will output an example Nginx server block configuration. You should:
1.  Create a configuration file (e.g., `/etc/nginx/sites-available/protocolpilot`).
2.  Paste and customize the example Nginx configuration (replace `your_domain.com_or_server_ip` with your actual domain or server IP, and ensure the `proxy_pass` port matches your application's running port, likely 3000).
3.  Enable the site: `sudo ln -s /etc/nginx/sites-available/protocolpilot /etc/nginx/sites-enabled/`
4.  Test Nginx configuration: `sudo nginx -t`
5.  Restart Nginx: `sudo systemctl restart nginx`
6.  (Optional but Recommended) Set up SSL using Certbot: `sudo apt install certbot python3-certbot-nginx` and then `sudo certbot --nginx`.

## Troubleshooting

*   **Script Errors**: If the script fails, check the output for error messages. Ensure your server has internet access and that the `APP_REPO_URL` in your `install.sh` is correct and publicly accessible.
*   **Firewall**: Ensure your server's firewall (e.g., `ufw`) allows traffic on the necessary ports (e.g., 3000 for direct access, or 80/443 if using Nginx).
    *   `sudo ufw allow <your_app_port>/tcp` (e.g., `sudo ufw allow 3000/tcp`)
    *   `sudo ufw allow 'Nginx Full'` (if Nginx is configured)
    *   `sudo ufw enable`
*   **PM2 Logs**: Check application logs using `pm2 logs protocolpilot`.
*   **Nginx Logs**: Check Nginx logs in `/var/log/nginx/error.log` and `/var/log/nginx/access.log`.

This automated installer should significantly simplify the deployment process. Remember to edit the `install.sh` with your repository URL first.
