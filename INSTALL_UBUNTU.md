
# ProtocolPilot: Automated Ubuntu Server Installation Guide

This guide provides steps to deploy the ProtocolPilot Next.js application on an Ubuntu server using an automated installation script.

## Prerequisites

1.  **Ubuntu Server**: A clean installation of Ubuntu (LTS version recommended, e.g., 20.04, 22.04).
2.  **SSH Access**: You should have SSH access to the server with a user that has `sudo` privileges.
3.  **GitHub Repository**: Your ProtocolPilot application code must be available in a GitHub repository. You will need the HTTPS URL of this repository.

## Step 1: Prepare the Installation Command

You will run a command that downloads and executes the installation script directly from its source.

1.  **Get the Installer Script URL**:
    The official installer script for ProtocolPilot should be hosted on GitHub or another publicly accessible raw file hosting service.
    Let's assume the script is hosted at:
    `https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_PROTOCOLPILOT_INSTALLER_REPO/main/install.sh`

    **Note**: Replace the URL above with the actual raw URL of the `install.sh` script you created for your project. If you place the `install.sh` file (generated in the previous step by the AI) in the root of your main ProtocolPilot application repository, the URL might look like:
    `https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_PROTOCOLPILOT_REPO/main/install.sh`

## Step 2: Run the Automated Installer

Connect to your Ubuntu server via SSH. Then, run the following command. This command downloads the `install.sh` script and executes it using `bash`. You need `sudo` because the script will install packages and configure services.

```bash
sudo bash -c "$(curl -Ls YOUR_RAW_INSTALL_SH_URL)"
```

**Replace `YOUR_RAW_INSTALL_SH_URL` with the actual raw URL of your `install.sh` script.**

For example, if your script is at `https://raw.githubusercontent.com/myuser/myprotocolpilot/main/install.sh`, the command would be:

```bash
sudo bash -c "$(curl -Ls https://raw.githubusercontent.com/myuser/myprotocolpilot/main/install.sh)"
```

## Step 3: Follow On-Screen Prompts

The installation script will guide you through the process. It will:
*   Update system packages.
*   Install Node.js, npm, PM2, and other dependencies like Nginx.
*   **Prompt you to enter the HTTPS URL of your ProtocolPilot application's GitHub repository.** This is where your actual panel code resides.
*   Clone your application.
*   Install application dependencies.
*   Build the application.
*   Set up PM2 to run your application and start on boot.
*   Provide you with the access URL, default username, and default password.

**Example Interaction during the script:**
```
Enter the HTTPS URL of your ProtocolPilot GitHub repository (e.g., https://github.com/YOUR_USERNAME/YOUR_PROTOCOLPILOT_REPO.git):
```
You will need to paste your repository's HTTPS clone URL here and press Enter.

## Step 4: Post-Installation

Once the script finishes, it will display:
*   The URL to access your ProtocolPilot panel (usually `http://<YOUR_SERVER_IP>:3000`).
*   The login path (e.g., `/paneladmin`).
*   The **default username** (`admin_please_change`) and **default password** (`password`).

**Crucial First Step:**
Log in to your panel immediately using the provided details and navigate to **Panel Settings** to **change the default username and password** for security.

## Step 5: Configure Reverse Proxy (Nginx - Recommended)

The script installs Nginx but does not fully configure it. For production use, it's highly recommended to set up Nginx as a reverse proxy. This allows you to:
*   Serve your application on standard ports (80 for HTTP, 443 for HTTPS).
*   Easily set up SSL/TLS for a secure HTTPS connection (e.g., using Certbot with Let's Encrypt).
*   Improve performance and add a layer of security.

The installation script will output an example Nginx server block configuration. You should:
1.  Create a configuration file (e.g., `/etc/nginx/sites-available/protocolpilot`).
2.  Paste and customize the example Nginx configuration (replace `your_domain.com` with your actual domain or server IP).
3.  Enable the site: `sudo ln -s /etc/nginx/sites-available/protocolpilot /etc/nginx/sites-enabled/`
4.  Test Nginx configuration: `sudo nginx -t`
5.  Restart Nginx: `sudo systemctl restart nginx`
6.  (Optional but Recommended) Set up SSL using Certbot: `sudo apt install certbot python3-certbot-nginx` and then `sudo certbot --nginx`.

## Troubleshooting

*   **Script Errors**: If the script fails, check the output for error messages. Ensure your server has internet access and that the GitHub repository URL is correct and accessible.
*   **Firewall**: Ensure your server's firewall (e.g., `ufw`) allows traffic on the necessary ports (e.g., 3000 for direct access, or 80/443 if using Nginx).
    *   `sudo ufw allow 3000/tcp` (or your app's port)
    *   `sudo ufw allow 'Nginx Full'` (if Nginx is configured)
    *   `sudo ufw enable`
*   **PM2 Logs**: Check application logs using `pm2 logs protocolpilot`.
*   **Nginx Logs**: Check Nginx logs in `/var/log/nginx/error.log` and `/var/log/nginx/access.log`.

This automated installer should significantly simplify the deployment process. Remember to replace placeholder URLs with your actual script and repository URLs.
