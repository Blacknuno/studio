
#!/bin/bash
# ProtocolPilot Automated Installer for Ubuntu
# This script automates the deployment of the ProtocolPilot Next.js application.

# --- BEGIN USER CONFIGURATION ---
# IMPORTANT: This script is pre-configured for a specific repository.
# If you need to install a different application, this URL must be changed.

APP_REPO_URL="https://github.com/Blacknuno/studio.git" # <<< Pre-configured Repository URL >>>

# Optional: Define the directory name for the application and where it will be installed.
APP_DIR_NAME="protocolpilot"
INSTALL_PATH="$HOME/$APP_DIR_NAME" # Install in user's home directory by default. If run as root, $HOME is /root.
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
if [ "$APP_REPO_URL" == "https://github.com/YOUR_USERNAME/YOUR_PROTOCOLPILOT_REPO.git" ] || [ -z "$APP_REPO_URL" ]; then
    print_warning "CRITICAL: The APP_REPO_URL in the installation script is still a placeholder or empty."
    print_warning "This script should be pre-configured. If you see this message, the script needs to be updated with the correct repository URL."
    exit 1
fi
if [[ ! "$APP_REPO_URL" =~ ^https://github\.com/.+\.git$ ]]; then
    print_warning "CRITICAL: The APP_REPO_URL ('$APP_REPO_URL') does not look like a valid GitHub HTTPS clone URL."
    print_warning "It should be in the format: https://github.com/username/repository.git"
    print_warning "Please check the APP_REPO_URL variable in the script."
    exit 1
fi
print_success "Script configuration is valid. Using Repository URL: $APP_REPO_URL"


# --- Prerequisites and Setup ---
print_step "Updating system packages..."
sudo apt update
sudo apt upgrade -y
print_success "System packages updated."

print_step "Installing essential dependencies (git, curl, nginx)..."
sudo apt install -y git curl wget unzip nginx
print_success "Essential dependencies installed. Git version: $(git --version)"

# --- Node.js and npm Installation (via nvm) ---
print_step "Installing Node Version Manager (nvm) and Node.js LTS..."
if [ -d "$HOME/.nvm" ]; then
    print_info "NVM already installed. Sourcing NVM..."
else
    print_info "Downloading and installing NVM..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
fi

# Source nvm to make it available in the current script session
export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
    \. "$NVM_DIR/nvm.sh" # Source NVM
    print_success "NVM sourced."
else
    print_warning "NVM script not found at $NVM_DIR/nvm.sh. Node.js/npm installation might fail."
    exit 1
fi
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# Check if Node.js is already installed or install LTS
if command -v node >/dev/null 2>&1 && command -v npm >/dev/null 2>&1; then
    print_info "Node.js ($(node -v)) and npm ($(npm -v)) are already installed and in PATH."
else
    print_info "Installing Node.js LTS via nvm..."
    nvm install --lts
    # nvm use --lts # This is usually done by nvm install automatically for the current session
    nvm alias default 'lts/*' # Set default node version for new shells
    print_success "Node.js LTS ($(node -v)) and npm ($(npm -v)) installed via nvm."
fi
print_info "Using Node version: $(node -v)"
print_info "Using npm version: $(npm -v)"
print_info "npm path: $(which npm)"


# --- PM2 Installation ---
print_step "Installing PM2 process manager globally..."
if command -v pm2 >/dev/null 2>&1; then
    print_info "PM2 is already installed: $(pm2 --version)"
else
    print_info "Attempting to install PM2 globally using sudo and nvm's npm..."
    if [ -f "$NVM_DIR/versions/node/$(nvm current)/bin/npm" ]; then
        sudo "$NVM_DIR/versions/node/$(nvm current)/bin/npm" install pm2 -g
        print_success "PM2 installation command executed."
        if command -v pm2 >/dev/null 2>&1; then
            print_success "PM2 is now installed: $(pm2 --version)"
            print_info "PM2 path: $(which pm2)"
        else
            print_warning "PM2 installation seems to have failed. 'pm2' command not found."
            print_warning "Please check for errors above. You might need to manually install PM2 or adjust your PATH."
            exit 1
        fi
    else
        print_warning "Could not find nvm's npm path. PM2 installation might fail or use system npm."
        sudo npm install pm2 -g # Fallback, might not use nvm's node
        if command -v pm2 >/dev/null 2>&1; then
             print_success "PM2 is now installed (using fallback method): $(pm2 --version)"
        else
            print_warning "PM2 installation failed using fallback. 'pm2' command not found."
            exit 1
        fi
    fi
fi


# --- Clone Application ---
print_step "Cloning ProtocolPilot application from $APP_REPO_URL into $INSTALL_PATH..."
if [ -d "$INSTALL_PATH" ]; then
    print_warning "Directory $INSTALL_PATH already exists. Removing and re-cloning for a fresh install..."
    sudo rm -rf "$INSTALL_PATH"
fi
git clone "$APP_REPO_URL" "$INSTALL_PATH"
cd "$INSTALL_PATH"
print_success "Application cloned to $INSTALL_PATH. Current directory: $(pwd)"
print_info "Files in $INSTALL_PATH:"
ls -la


# --- Install Application Dependencies ---
print_step "Installing application dependencies (npm install)..."
# Ensure npm uses the nvm-installed Node.js (already sourced, but good to be explicit with PATH for this step)
export PATH="$NVM_DIR/versions/node/$(nvm current)/bin:$PATH"
npm install
print_success "Application dependencies installed."


# --- Build Application ---
print_step "Building ProtocolPilot application (npm run build)..."
npm run build
print_success "Application built successfully."


# --- Setup PM2 ---
print_step "Setting up ProtocolPilot with PM2..."
PM2_PATH=$(command -v pm2)
if [ -z "$PM2_PATH" ]; then
    print_warning "PM2 command not found after installation. Cannot proceed with PM2 setup."
    exit 1
fi

print_info "Using PM2 from: $PM2_PATH"

if "$PM2_PATH" list | grep -q "$APP_DIR_NAME"; then
    print_info "Application '$APP_DIR_NAME' is already managed by PM2. Restarting..."
    "$PM2_PATH" restart "$APP_DIR_NAME" --update-env
else
    print_info "Starting application '$APP_DIR_NAME' with PM2..."
    "$PM2_PATH" start npm --name "$APP_DIR_NAME" -- run start
    print_success "Application started with PM2."
fi

print_step "Configuring PM2 to start on system boot..."
CURRENT_USER=$(whoami)
NODE_BIN_PATH="$NVM_DIR/versions/node/$(nvm current)/bin"

PM2_STARTUP_CMD_OUTPUT=$("$PM2_PATH" startup systemd -u "$CURRENT_USER" --hp "$HOME" | grep 'sudo env PATH')

if [ -n "$PM2_STARTUP_CMD_OUTPUT" ]; then
    print_info "Attempting to execute PM2 startup command automatically:"
    echo "$PM2_STARTUP_CMD_OUTPUT"
    PM2_EXEC_CMD=$(echo "$PM2_STARTUP_CMD_OUTPUT" | sed -n 's/.*\(sudo env PATH.*\)/\1/p')
    if [ -n "$PM2_EXEC_CMD" ]; then
        eval "$PM2_EXEC_CMD"
        print_success "PM2 startup command executed."
    else
        print_warning "Could not parse PM2 startup command. You might need to run it manually."
        print_info "Run '$PM2_PATH startup' and follow instructions if the service does not start on boot."
    fi
else
    print_warning "Could not automatically determine PM2 startup command. You may need to run it manually."
    print_info "Run '$PM2_PATH startup' and follow the instructions if the service does not start on boot."
fi
"$PM2_PATH" save
print_success "PM2 startup configuration saved."


# --- Final Instructions ---
print_step "🎉 ProtocolPilot Installation Complete! 🎉"

SERVER_IP=$(hostname -I | awk '{print $1}')
PANEL_PORT=$(grep -oP '"start":\s*"next start(-p\s+\K[0-9]+)?' package.json | grep -oP '[0-9]+$' || echo "3000")

LOGIN_PATH="/paneladmin" 
DEFAULT_USERNAME="admin_please_change" 
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
print_info "To check the status of your application, use: $PM2_PATH list"
print_info "To view logs, use: $PM2_PATH logs $APP_DIR_NAME"
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
    server_name your_domain.com_or_server_ip; 

    location / {
        proxy_pass http://localhost:$PANEL_PORT; 
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
echo "After creating the Nginx config (e.g., /etc/nginx/sites-available/protocolpilot):"
echo "  1. sudo ln -s /etc/nginx/sites-available/protocolpilot /etc/nginx/sites-enabled/"
echo "  2. sudo nginx -t"
echo "  3. sudo systemctl restart nginx"
echo "  4. Consider setting up SSL using Certbot: sudo apt install certbot python3-certbot-nginx && sudo certbot --nginx"
echo ""
print_success "Installation script finished. Enjoy ProtocolPilot!"
exit 0
