#!/bin/bash

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   E-Commerce BD - Setup Script${NC}"
echo -e "${GREEN}========================================${NC}\n"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Error: Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 1: Setting up environment variables${NC}"
if [ ! -f .env ]; then
    echo -e "${RED}Error: .env file not found. Please create one from .env.example${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Environment file found${NC}\n"

echo -e "${YELLOW}Step 2: Creating required directories${NC}"
mkdir -p nginx/ssl
echo -e "${GREEN}✓ Directories created${NC}\n"

echo -e "${YELLOW}Step 3: Pulling Docker images${NC}"
docker-compose pull
echo -e "${GREEN}✓ Docker images pulled${NC}\n"

echo -e "${YELLOW}Step 4: Starting Docker containers${NC}"
docker-compose up -d
echo -e "${GREEN}✓ Containers started${NC}\n"

echo -e "${YELLOW}Step 5: Waiting for services to be ready (30 seconds)${NC}"
sleep 30
echo -e "${GREEN}✓ Services should be ready${NC}\n"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   Setup Complete!${NC}"
echo -e "${GREEN}========================================${NC}\n"

echo -e "${YELLOW}Access your services:${NC}"
echo -e "  • WordPress Site: ${GREEN}http://localhost:8080${NC}"
echo -e "  • Direct Access: ${GREEN}http://localhost${NC}"
echo -e "  • phpMyAdmin: ${GREEN}http://localhost:8081${NC}"
echo -e ""
echo -e "${YELLOW}Next Steps:${NC}"
echo -e "  1. Visit http://localhost:8080 to complete WordPress installation"
echo -e "  2. Install WooCommerce plugin from WordPress admin"
echo -e "  3. Configure SSLCommerz payment gateway"
echo -e "  4. Set up mobile OTP authentication"
echo -e ""
echo -e "${YELLOW}Useful Commands:${NC}"
echo -e "  • Stop containers: ${GREEN}docker-compose stop${NC}"
echo -e "  • Start containers: ${GREEN}docker-compose start${NC}"
echo -e "  • View logs: ${GREEN}docker-compose logs -f${NC}"
echo -e "  • Restart: ${GREEN}docker-compose restart${NC}"
echo -e "  • Remove all: ${GREEN}docker-compose down -v${NC}"
echo -e ""
