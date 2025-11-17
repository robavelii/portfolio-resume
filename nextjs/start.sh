#!/bin/sh

# Initialize database
npx prisma db push

# Start the application
if [ "$NODE_ENV" = "production" ]; then
  node server.js
else
  npm run dev
fi