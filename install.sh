#!/bin/bash
# ProtocolPilot Automated Installer for Ubuntu
# This script automates the deployment of the ProtocolPilot Next.js application.

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
if command -v node >/dev/null 2>&1; then
    print_info "Node.js is already installed: $(node -v)"
else
    nvm install --lts
    nvm use --lts
    nvm alias default 'lts/*' # Set default node version for new shells
    print_success "Node.js LTS ($(node -v)) and npm ($(npm -v)) installed."
fi


# --- PM2 Installation ---
print_step "Installing PM2 process manager globally..."
if command -v pm2 >/dev/null 2>&1; then
    print_info "PM2 is already installed."
else
    sudo npm install pm2 -g
    print_success "PM2 installed."
fi

# --- Get Application Details ---
print_step "Gathering Application Details..."
DEFAULT_REPO_URL="https://github.com/YOUR_USERNAME/YOUR_PROTOCOLPILOT_REPO.git" # Placeholder
read -p "Enter the HTTPS URL of your ProtocolPilot GitHub repository (e.g., ${DEFAULT_REPO_URL}): " APP_REPO_URL
APP_REPO_URL=${APP_REPO_URL:-$DEFAULT_REPO_URL} # Use default if empty, though user should provide this

APP_DIR_NAME="protocolpilot"
INSTALL_PATH="$HOME/$APP_DIR_NAME" # Install in user's home directory

if [ "$APP_REPO_URL" == "$DEFAULT_REPO_URL" ]; then
    print_warning "You are using the placeholder repository URL. Please ensure this is correct or the script will fail to clone."
fi


# --- Clone Application ---
print_step "Cloning ProtocolPilot application from $APP_REPO_URL..."
if [ -d "$INSTALL_PATH" ]; then
    print_warning "Directory $INSTALL_PATH already exists. Skipping clone. Attempting to update..."
    cd "$INSTALL_PATH"
    git pull || print_warning "Failed to pull latest changes. Continuing with existing code."
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
    pm2 restart "$APP_DIR_NAME"
else
    # The package.json start script is "next start". By default, Next.js runs on port 3000.
    # The dev script in package.json uses port 9002, but 'npm run start' uses default 3000 unless specified.
    # If you want to run on a specific port for production, change it in package.json's "start" script
    # e.g., "start": "next start -p <YOUR_PORT>"
    pm2 start npm --name "$APP_DIR_NAME" -- run start
    print_success "Application started with PM2."
fi

# Configure PM2 to start on system boot
print_step "Configuring PM2 to start on system boot..."
# This command outputs another command that needs to be run with sudo.
# We can try to automate this, but it's safer to guide the user if it fails.
# The output of `pm2 startup` might vary, so capturing and running it is tricky.
# For now, instruct the user.
sudo env PATH=$PATH:/usr/bin "$NVM_DIR/versions/node/$(nvm current)/bin/pm2" startup systemd -u $(whoami) --hp $HOME
pm2 save
print_success "PM2 startup configured. If prompted, please run the command displayed by PM2 to finalize."


# --- Final Instructions ---
print_step "🎉 ProtocolPilot Installation Complete! 🎉"

SERVER_IP=$(hostname -I | awk '{print $1}')
PANEL_PORT="3000" # Default Next.js port. Change if your 'npm run start' uses a different port.
LOGIN_PATH="/paneladmin" # Default from initialPanelSettings in user-data.ts
DEFAULT_USERNAME="admin_please_change" # Default from initialPanelSettings
DEFAULT_PASSWORD="password"

print_info "Your ProtocolPilot panel should be accessible at:"
echo "   👉 http://$SERVER_IP:$PANEL_PORT"
echo ""
print_info "To access the admin login page, navigate to:"
echo "   🌐 http://$SERVER_IP:$PANEL_PORT$LOGIN_PATH"
echo ""
print_warning "Default Login Credentials:"
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
    server_name your_domain.com; # Replace with your domain or server IP

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
}
EOF
echo ""
echo "After creating the Nginx config:"
echo "  1. sudo ln -s /etc/nginx/sites-available/protocolpilot /etc/nginx/sites-enabled/"
echo "  2. sudo nginx -t"
echo "  3. sudo systemctl restart nginx"
echo "  4. Consider setting up SSL using Certbot: sudo certbot --nginx"
echo ""
print_success "Installation script finished. Enjoy ProtocolPilot!"
exit 0
