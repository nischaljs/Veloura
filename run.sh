#!/bin/bash

# Function to check if node_modules exist and install dependencies
install_dependencies() {
    echo "Checking and installing dependencies..."
    if [ ! -d "client/node_modules" ]; then
        echo "Installing client dependencies..."
        (cd client && pnpm install)
    fi
    if [ ! -d "server/node_modules" ]; then
        echo "Installing server dependencies..."
        (cd server && pnpm install)
    fi
    echo "Dependencies check complete."
}

# Function to run database migrations and seeding
run_db_ops() {
    echo "Running database migrations..."
    (cd server && pnpm run prisma:migrate)
    echo "Running database seeding..."
    (cd server && pnpm run prisma:seed)
    echo "Database operations complete."
}

# Main script logic
install_dependencies

# Check for a flag to run database operations
if [[ "$1" == "--db" ]]; then
    run_db_ops
fi

echo "Starting backend server (server/pnpm dev)..."
(cd server && pnpm dev) &
SERVER_PID=$!

echo "Starting frontend server (client/pnpm dev)..."
(cd client && pnpm dev) &
CLIENT_PID=$!

echo "Both servers are running. Press Ctrl+C to stop them."

# Wait for both processes to finish (or for Ctrl+C)
wait $SERVER_PID
wait $CLIENT_PID

echo "Servers stopped."
