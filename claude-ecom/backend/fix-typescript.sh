#!/bin/bash

# Fix all TypeScript issues in controllers and middleware

cd /Users/nuhin13/Documents/claude-ecom/backend

# Add Promise<void> return type to all async controller functions
find src/controllers -name "*.ts" -exec sed -i '' 's/export const \([a-zA-Z]*\) = async (req: Request, res: Response)/export const \1 = async (req: Request, res: Response): Promise<void>/g' {} \;
find src/middleware -name "*.ts" -exec sed -i '' 's/export const \([a-zA-Z]*\) = async (req: Request, res: Response, next: NextFunction)/export const \1 = async (req: Request, res: Response, next: NextFunction): Promise<void>/g' {} \;

# Replace return res. with res. followed by return;
find src -name "*.ts" -exec sed -i '' 's/return res\./res./g' {} \;

echo "TypeScript fixes applied!"
