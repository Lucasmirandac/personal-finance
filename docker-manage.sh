#!/bin/bash

# Personal Finance API - Docker Management Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker Desktop."
        exit 1
    fi
}

# Function to start production environment
start_production() {
    print_status "Starting production environment..."
    check_docker
    docker compose up --build -d
    print_success "Production environment started!"
    print_status "Application: http://localhost:3000"
    print_status "MySQL: localhost:3306"
    print_status "Use 'docker compose logs app' to see application logs"
}

# Function to start development environment
start_development() {
    print_status "Starting development environment..."
    check_docker
    docker compose -f docker-compose.dev.yml up --build -d
    print_success "Development environment started!"
    print_status "Application: http://localhost:3000 (with hot reload)"
    print_status "MySQL: localhost:3306"
    print_status "Use 'docker compose -f docker-compose.dev.yml logs app' to see application logs"
}

# Function to stop all services
stop_services() {
    print_status "Stopping all services..."
    docker compose down
    docker compose -f docker-compose.dev.yml down
    print_success "All services stopped!"
}

# Function to show logs
show_logs() {
    local service=${1:-app}
    print_status "Showing logs for service: $service"
    docker compose logs -f $service
}

# Function to show development logs
show_dev_logs() {
    local service=${1:-app}
    print_status "Showing development logs for service: $service"
    docker compose -f docker-compose.dev.yml logs -f $service
}

# Function to clean up
cleanup() {
    print_warning "This will remove all containers, volumes, and images. Are you sure? (y/N)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        print_status "Cleaning up..."
        docker compose down -v --rmi all
        docker compose -f docker-compose.dev.yml down -v --rmi all
        docker system prune -f
        print_success "Cleanup completed!"
    else
        print_status "Cleanup cancelled."
    fi
}

# Function to show status
show_status() {
    print_status "Docker Compose Services Status:"
    docker compose ps
    echo ""
    print_status "Development Services Status:"
    docker compose -f docker-compose.dev.yml ps
}

# Function to show help
show_help() {
    echo "Personal Finance API - Docker Management Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start-prod     Start production environment"
    echo "  start-dev      Start development environment"
    echo "  stop           Stop all services"
    echo "  logs [service] Show logs for service (default: app)"
    echo "  logs-dev [service] Show development logs for service (default: app)"
    echo "  status         Show status of all services"
    echo "  cleanup        Remove all containers, volumes, and images"
    echo "  help           Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start-prod"
    echo "  $0 logs mysql"
    echo "  $0 cleanup"
}

# Main script logic
case "${1:-help}" in
    start-prod)
        start_production
        ;;
    start-dev)
        start_development
        ;;
    stop)
        stop_services
        ;;
    logs)
        show_logs $2
        ;;
    logs-dev)
        show_dev_logs $2
        ;;
    status)
        show_status
        ;;
    cleanup)
        cleanup
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        show_help
        exit 1
        ;;
esac
