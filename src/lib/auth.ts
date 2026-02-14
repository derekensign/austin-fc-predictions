// Validate admin password (simple comparison)
export async function validateAdminPassword(password: string): Promise<boolean> {
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedPassword) {
    console.error('ADMIN_PASSWORD environment variable is not set');
    return false;
  }

  return password === expectedPassword;
}

// Generate a simple admin token (base64 encoded timestamp + secret)
export function generateAdminToken(): string {
  const timestamp = Date.now();
  const secret = process.env.ADMIN_PASSWORD || 'default';
  const payload = `admin:${timestamp}:${secret}`;
  return Buffer.from(payload).toString('base64');
}

// Validate admin token (basic validation - expires after 24 hours)
export function validateAdminToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [prefix, timestampStr, secret] = decoded.split(':');

    if (prefix !== 'admin') return false;

    const timestamp = parseInt(timestampStr, 10);
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;

    // Check if token is less than 24 hours old
    if (now - timestamp > twentyFourHours) return false;

    // Verify secret matches
    const expectedSecret = process.env.ADMIN_PASSWORD || 'default';
    return secret === expectedSecret;
  } catch (error) {
    return false;
  }
}

// Extract and validate token from Authorization header
export function extractAndValidateToken(authHeader: string | null): boolean {
  if (!authHeader) return false;

  const token = authHeader.replace('Bearer ', '');
  return validateAdminToken(token);
}
