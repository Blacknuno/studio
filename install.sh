#!/bin/bash
# ProtocolPilot Installation Script with Interactive Menu

# Configuration
APP_REPO_URL="https://github.com/Blacknuno/studio.git"
APP_DIR_NAME="protocolpilot"
INSTALL_PATH="$HOME/$APP_DIR_NAME"
DEFAULT_PORT=3000
DEFAULT_USER="admin"
TEMP_PASS=$(openssl rand -base64 12) # Temporary random password

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# --- Helper Functions ---
show_menu() {
    clear
    echo -e "${GREEN}=== ProtocolPilot Management ===${NC}"
    echo "1) Install Panel"
    echo "2) Update Panel"
    echo "3) Uninstall Panel"
    echo "4) Change Settings"
    echo "5) Exit"
    echo -e "${YELLOW}===============================${NC}"
}

show_step() {
    echo ""
    echo -e "${GREEN}➡️  $1${NC}"
    echo "------------------------------------"
}

show_error() {
    echo -e "${RED}❌ Error: $1${NC}"
}

show_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

show_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

check_requirements() {
    if ! command -v git &> /dev/null; then
        sudo apt update && sudo apt install -y git
    fi
    
    if ! command -v node &> /dev/null || ! node -v | grep -q "v18\|v20\|v22"; then
        curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
        sudo apt-get install -y nodejs
    fi
    
    if ! command -v pm2 &> /dev/null; then
        sudo npm install -g pm2
    fi
}

create_env_file() {
    SERVER_IP=$(hostname -I | awk '{print $1}')
    PANEL_PORT=${1:-$DEFAULT_PORT}
    ADMIN_USER=${2:-$DEFAULT_USER}
    ADMIN_PASS=${3:-$TEMP_PASS}

    cat > "$INSTALL_PATH/.env" <<EOL
# ProtocolPilot Configuration
REAL_IP=$SERVER_IP
PORT=$PANEL_PORT
ADMIN_USER=$ADMIN_USER
ADMIN_PASS=$ADMIN_PASS
NODE_ENV=production
EOL
}

install_panel() {
    show_step "Starting Panel Installation"
    
    # Get user inputs
    read -p "Enter panel port [$DEFAULT_PORT]: " port_input
    read -p "Enter admin username [$DEFAULT_USER]: " user_input
    read -p "Enter admin password [random]: " pass_input
    
    # Set defaults if empty
    port_input=${port_input:-$DEFAULT_PORT}
    user_input=${user_input:-$DEFAULT_USER}
    pass_input=${pass_input:-$(openssl rand -base64 12)}
    
    # Check requirements
    check_requirements
    
    # Clone repository
    if [ -d "$INSTALL_PATH" ]; then
        show_warning "Removing existing installation..."
        rm -rf "$INSTALL_PATH"
    fi
    
    git clone "$APP_REPO_URL" "$INSTALL_PATH" || {
        show_error "Failed to clone repository"
        exit 1
    }
    
    cd "$INSTALL_PATH" || exit
    
    # Create environment file
    create_env_file "$port_input" "$user_input" "$pass_input"
    
    # Install dependencies
    npm install || {
        show_error "Failed to install dependencies"
        exit 1
    }
    
    # Build application
    npm run build || {
        show_error "Failed to build application"
        exit 1
    }
    
    # Start with PM2
    pm2 start npm --name "$APP_DIR_NAME" -- run start || {
        show_error "Failed to start application"
        exit 1
    }
    
    pm2 save
    pm2 startup | grep "sudo env" | bash
    
    show_success "Installation completed successfully!"
    show_credentials
}

update_panel() {
    show_step "Updating Panel"
    
    if [ ! -d "$INSTALL_PATH" ]; then
        show_error "Panel not found at $INSTALL_PATH"
        exit 1
    fi
    
    cd "$INSTALL_PATH" || exit
    
    # Backup existing .env
    cp .env .env.bak
    
    git pull origin main || {
        show_error "Failed to update repository"
        exit 1
    }
    
    # Restore .env
    mv .env.bak .env
    
    npm install
    npm run build
    
    pm2 restart "$APP_DIR_NAME"
    
    show_success "Panel updated successfully!"
}

uninstall_panel() {
    show_step "Uninstalling Panel"
    
    read -p "Are you sure you want to completely uninstall? [y/N]: " confirm
    if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
        show_warning "Uninstallation cancelled"
        return
    fi
    
    pm2 delete "$APP_DIR_NAME"
    pm2 save
    
    if [ -d "$INSTALL_PATH" ]; then
        rm -rf "$INSTALL_PATH"
        show_success "Panel files removed successfully"
    else
        show_warning "Panel directory not found"
    fi
    
    show_success "Panel completely uninstalled"
}

change_settings() {
    show_step "Changing Settings"
    
    if [ ! -f "$INSTALL_PATH/.env" ]; then
        show_error "No panel installation found"
        exit 1
    fi
    
    current_port=$(grep "PORT=" "$INSTALL_PATH/.env" | cut -d= -f2)
    current_user=$(grep "ADMIN_USER=" "$INSTALL_PATH/.env" | cut -d= -f2)
    
    read -p "Enter new port [$current_port]: " new_port
    read -p "Enter new admin username [$current_user]: " new_user
    read -p "Enter new admin password [keep current]: " new_pass
    
    new_port=${new_port:-$current_port}
    new_user=${new_user:-$current_user}
    
    # Update .env file
    if [ -n "$new_pass" ]; then
        sed -i "s/ADMIN_PASS=.*/ADMIN_PASS=$new_pass/" "$INSTALL_PATH/.env"
    fi
    
    sed -i "s/PORT=.*/PORT=$new_port/" "$INSTALL_PATH/.env"
    sed -i "s/ADMIN_USER=.*/ADMIN_USER=$new_user/" "$INSTALL_PATH/.env"
    
    pm2 restart "$APP_DIR_NAME"
    
    show_success "Settings updated successfully!"
    show_credentials
}

show_credentials() {
    if [ ! -f "$INSTALL_PATH/.env" ]; then
        show_error "No panel installation found"
        return
    fi
    
    SERVER_IP=$(grep "REAL_IP=" "$INSTALL_PATH/.env" | cut -d= -f2)
    PANEL_PORT=$(grep "PORT=" "$INSTALL_PATH/.env" | cut -d= -f2)
    ADMIN_USER=$(grep "ADMIN_USER=" "$INSTALL_PATH/.env" | cut -d= -f2)
    ADMIN_PASS=$(grep "ADMIN_PASS=" "$INSTALL_PATH/.env" | cut -d= -f2)
    
    echo ""
    echo -e "${GREEN}=== Panel Access Information ===${NC}"
    echo -e "URL: ${YELLOW}http://$SERVER_IP:$PANEL_PORT/paneladmin${NC}"
    echo -e "Username: ${YELLOW}$ADMIN_USER${NC}"
    echo -e "Password: ${YELLOW}$ADMIN_PASS${NC}"
    echo -e "${GREEN}=================================${NC}"
    echo ""
}

# --- Main Execution ---
if [[ "$1" == "vpn" ]]; then
    # Show menu if script is called with "vpn" argument
    while true; do
        show_menu
        read -p "Select option [1-5]: " choice
        
        case $choice in
            1) install_panel ;;
            2) update_panel ;;
            3) uninstall_panel ;;
            4) change_settings ;;
            5) exit 0 ;;
            *) show_error "Invalid option" ;;
        esac
        
        read -p "Press Enter to continue..."
    done
else
    # Run installation directly if no argument
    install_panel
fi
