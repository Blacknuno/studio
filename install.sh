#!/bin/bash
# ProtocolPilot Automated Installer for Ubuntu
# This script automates the deployment of the ProtocolPilot Next.js application.

# --- BEGIN USER CONFIGURATION ---
# IMPORTANT: Before using this script, replace the placeholder URL below
# with the ACTUAL HTTPS URL of YOUR ProtocolPilot application's GitHub repository.
# For example: APP_REPO_URL="https://github.com/your-username/your-protocolpilot-repo.git"

APP_REPO_URL="https://github.com/YOUR_USERNAME/YOUR_PROTOCOLPILOT_REPO.git" # <<<!!! EDIT THIS LINE before hosting this script !!!>>>

# Optional: Define the directory name for the application and where it will be installed.
APP_DIR_NAME="protocolpilot"
INSTALL_PATH="$HOME/$APP_DIR_NAME" # Install in user's home directory by default
# --- END USER CONFIGURATION ---


# Exit immediately if a command exits with a non-zero status.
set -e

echo "🚀 Starting ProtocolPilot Automated Installation..."

# --- Helper Functions ---
print_step() {
    echo ""
    echo "------------------------------------"
    echo "➡️  $1"
    echo "------------------------------------"
}

print_success() {
    echo "✅ $1"
}

print_warning() {
    echo "⚠️  $1"
}

print_info() {
    echo "ℹ️ $1"
}

# --- Validate Configuration ---
print_step "Validating script configuration..."
if [ "$APP_REPO_URL" == "https://github.com/YOUR_USERNAME/YOUR_PROTOCOLPILOT_REPO.git" ]; then
    print_warning "CRITICAL: The APP_REPO_URL in the installation script is still the placeholder."
    print_warning "Please download this script, edit the APP_REPO_URL variable at the top to point to"
    print_warning "your ProtocolPilot application's GitHub repository URL, host the edited script,"
    print_warning "and then run it using the new raw URL."
    print_warning "Installation cannot proceed with the placeholder URL."
    exit 1
fi
if [[ ! "$APP_REPO_URL" =~ ^https://github\.com/.+\.git$ ]]; then
    print_warning "CRITICAL: The APP_REPO_URL ('$APP_REPO_URL') does not look like a valid GitHub HTTPS clone URL."
    print_warning "It should be in the format: https://github.com/username/repository.git"
    print_warning "Please edit the APP_REPO_URL variable in the script and try again."
    exit 1
fi
print_success "Script configuration seems valid. Repository URL: $APP_REPO_URL"


# --- Prerequisites and Setup ---
print_step "Updating system packages..."
sudo apt update
sudo apt upgrade -y
print_success "System packages updated."

print_step "Installing essential dependencies (git, curl, nginx)..."
sudo apt install -y git curl wget unzip nginx
print_success "Essential dependencies installed."

# --- Node.js and npm Installation (via nvm) ---
print_step "Installing Node Version Manager (nvm) and Node.js LTS..."
if [ -d "$HOME/.nvm" ]; then
    print_info "NVM already installed. Skipping NVM installation."
else
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
fi

# Source nvm to make it available in the current script session
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# Check if Node.js is already installed or install LTS
if command -v node >/dev/null 2>&1 && command -v npm >/dev/null 2>&1; then
    print_info "Node.js ($(node -v)) and npm ($(npm -v)) are already installed."
else
    print_info "Installing Node.js LTS via nvm..."
    nvm install --lts
    nvm use --lts # Ensures the LTS version is used for the current session
    nvm alias default 'lts/*' # Set default node version for new shells
    print_success "Node.js LTS ($(node -v)) and npm ($(npm -v)) installed via nvm."
fi


# --- PM2 Installation ---
print_step "Installing PM2 process manager globally..."
if command -v pm2 >/dev/null 2>&1; then
    print_info "PM2 is already installed: $(pm2 --version)"
else
    sudo npm install pm2 -g
    print_success "PM2 installed."
fi


# --- Clone Application ---
print_step "Cloning ProtocolPilot application from $APP_REPO_URL..."
if [ -d "$INSTALL_PATH" ]; then
    print_warning "Directory $INSTALL_PATH already exists. Attempting to remove and re-clone..."
    sudo rm -rf "$INSTALL_PATH" # Remove existing directory to ensure fresh clone
    git clone "$APP_REPO_URL" "$INSTALL_PATH"
    cd "$INSTALL_PATH"
    print_success "Application re-cloned to $INSTALL_PATH."
else
    git clone "$APP_REPO_URL" "$INSTALL_PATH"
    cd "$INSTALL_PATH"
    print_success "Application cloned to $INSTALL_PATH."
fi


# --- Install Application Dependencies ---
print_step "Installing application dependencies (npm install)..."
# Ensure npm uses the nvm-installed Node.js
export PATH="$NVM_DIR/versions/node/$(nvm current)/bin:$PATH"
npm install
print_success "Application dependencies installed."


# --- Build Application ---
print_step "Building ProtocolPilot application (npm run build)..."
npm run build
print_success "Application built successfully."


# --- Setup PM2 ---
print_step "Setting up ProtocolPilot with PM2..."
# Check if the app is already managed by PM2
if pm2 list | grep -q "$APP_DIR_NAME"; then
    print_info "Application '$APP_DIR_NAME' is already managed by PM2. Attempting to restart..."
    pm2 restart "$APP_DIR_NAME" --update-env # Update environment variables if any changed
else
    # The package.json start script is "next start". By default, Next.js runs on port 3000.
    # If your package.json's "start" script uses a different port, ensure it's correct.
    # Example: "start": "next start -p <YOUR_PORT>"
    # We use `npm run start` which will respect the port in package.json's start script.
    # Default is port 3000 for `next start`. User can change this in their project's package.json.
    # The login page script uses port 9002 for dev, start script uses default 3000
    pm2 start npm --name "$APP_DIR_NAME" -- run start
    print_success "Application started with PM2."
fi

# Configure PM2 to start on system boot
print_step "Configuring PM2 to start on system boot..."
# The command `pm2 startup` generates a command that needs to be run with sudo.
# We capture and execute it.
PM2_STARTUP_CMD=$(sudo env PATH=$PATH:/usr/bin "$NVM_DIR/versions/node/$(nvm current)/bin/pm2" startup systemd -u $(whoami) --hp $HOME | grep 'sudo env')
if [ -n "$PM2_STARTUP_CMD" ]; then
    print_info "Executing PM2 startup command: $PM2_STARTUP_CMD"
    eval "$PM2_STARTUP_CMD" # Execute the captured command
else
    print_warning "Could not automatically determine PM2 startup command. You may need to run it manually."
    print_info "Run 'pm2 startup' and follow the instructions if the service does not start on boot."
fi
pm2 save
print_success "PM2 startup configured."


# --- Final Instructions ---
print_step "🎉 ProtocolPilot Installation Complete! 🎉"

SERVER_IP=$(hostname -I | awk '{print $1}')
# The login port and path are defined in src/app/users/user-data.ts
# This script cannot read them directly. We assume defaults or user knows from panel settings.
# We can hardcode the typical defaults here for the message.
PANEL_PORT="3000" # This is the default Next.js start port if not overridden in package.json's "start" script.
LOGIN_PATH="/paneladmin" # Default from initialPanelSettings
DEFAULT_USERNAME="admin_please_change" # Default from initialPanelSettings
DEFAULT_PASSWORD="password"

print_info "Your ProtocolPilot panel should be accessible at:"
echo "   👉 http://$SERVER_IP:$PANEL_PORT"
echo ""
print_info "To access the admin login page, navigate to:"
echo "   🌐 http://$SERVER_IP:$PANEL_PORT$LOGIN_PATH"
echo ""
print_warning "Default Login Credentials (from initial setup):"
echo "   👤 Username: $DEFAULT_USERNAME"
echo "   🔑 Password: $DEFAULT_PASSWORD"
echo ""
print_warning "SECURITY WARNING: Please change the default username and password immediately after your first login via the 'Panel Settings' page!"
echo ""
print_info "To check the status of your application, use: pm2 list"
print_info "To view logs, use: pm2 logs $APP_DIR_NAME"
echo ""
print_step "Next Steps (Recommended): Configure Nginx Reverse Proxy"
echo "For production, it's highly recommended to set up Nginx as a reverse proxy to:"
echo "  - Serve your application on standard ports (80/443)."
echo "  - Enable SSL/TLS for HTTPS."
echo "  - Improve performance and security."
echo ""
echo "Example Nginx server block (save to /etc/nginx/sites-available/protocolpilot and then enable):"
cat << EOF
server {
    listen 80;
    # For IPv6, add: listen [::]:80;
    server_name your_domain.com_or_server_ip; # Replace with your domain or server IP

    location / {
        proxy_pass http://localhost:$PANEL_PORT; # Points to your Next.js app
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Optional: Add error pages, access logs, etc.
    # access_log /var/log/nginx/protocolpilot.access.log;
    # error_log /var/log/nginx/protocolpilot.error.log;
}
EOF
echo ""
echo "After creating the Nginx config (e.g., /etc/nginx/sites-available/protocolpilot):"
echo "  1. sudo ln -s /etc/nginx/sites-available/protocolpilot /etc/nginx/sites-enabled/"
echo "  2. sudo nginx -t                            (Test configuration)"
echo "  3. sudo systemctl restart nginx             (Restart Nginx)"
echo "  4. Consider setting up SSL using Certbot: sudo apt install certbot python3-certbot-nginx && sudo certbot --nginx"
echo ""
print_success "Installation script finished. Enjoy ProtocolPilot!"
exit 0
