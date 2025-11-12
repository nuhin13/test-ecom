const fs = require('fs');
const path = require('path');

// Files to fix
const files = [
  'src/controllers/admin.controller.ts',
  'src/controllers/cart.controller.ts',
  'src/controllers/order.controller.ts',
  'src/controllers/product.controller.ts',
  'src/controllers/review.controller.ts',
  'src/controllers/user.controller.ts',
  'src/middleware/admin.middleware.ts',
  'src/middleware/auth.middleware.ts',
  'src/middleware/validator.middleware.ts',
];

console.log('Fixing TypeScript issues...\n');

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${file} - not found`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // Add Promise<void> return type to async functions without it
  content = content.replace(
    /export const (\w+) = async \(req: Request, res: Response\) =>/g,
    'export const $1 = async (req: Request, res: Response): Promise<void> =>'
  );

  content = content.replace(
    /export const (\w+) = async \(req: Request, res: Response, next: NextFunction\) =>/g,
    'export const $1 = async (req: Request, res: Response, next: NextFunction): Promise<void> =>'
  );

  // Fix return statements before res.json/status
  content = content.replace(/(\s+)return res\.(status|json)/g, '$1res.$2');

  // Add explicit return; after res.json/status calls that end a block
  content = content.replace(/(res\.status\(\d+\)\.json\([^)]+\));(\s+)(\/\/[^\n]*)?\n(\s+)}/g, '$1;$2$3\n$4return;\n$4}');

  // Fix unused variables by prefixing with underscore
  content = content.replace(/\(req: Request, res: Response/g, '(_req: Request, res: Response');
  content = content.replace(/\(req: Request, res: Response, next/g, '(_req: Request, res: Response, next');

  // Restore if req is actually used
  if (content.includes('req.body') || content.includes('req.params') || content.includes('req.query') || content.includes('req.user')) {
    content = content.replace(/_req: Request/g, 'req: Request');
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✓ Fixed ${file}`);
});

console.log('\nTypeScript fixes applied!');
console.log('Run "npm run build" to verify.');
