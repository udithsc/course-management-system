#!/bin/sh

echo "Generating Prisma client..."
npx prisma generate

echo "Pushing DB schema..."
npx prisma db push --accept-data-loss

echo "Starting the server..."
npm start