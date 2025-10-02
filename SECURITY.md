# Security Policy

## Supported Versions

We release patches for security vulnerabilities for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of Basha Lagbe seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### Please do NOT:

- Open a public GitHub issue
- Disclose the vulnerability publicly before it has been addressed

### Please DO:

1. **Email us directly** at: security@bashalagbe.com (or your email)
2. **Provide detailed information** including:
   - Type of vulnerability
   - Full paths of source file(s) related to the vulnerability
   - Location of the affected source code (tag/branch/commit)
   - Step-by-step instructions to reproduce the issue
   - Proof-of-concept or exploit code (if possible)
   - Impact of the vulnerability

### What to expect:

- **Acknowledgment**: We'll acknowledge receipt of your vulnerability report within 48 hours
- **Investigation**: We'll investigate and validate the vulnerability
- **Updates**: We'll keep you informed about our progress
- **Resolution**: We'll work on a fix and release it as soon as possible
- **Credit**: We'll credit you for the discovery (unless you prefer to remain anonymous)

## Security Best Practices

### For Users

1. **Keep dependencies updated**
   ```bash
   npm audit
   npm audit fix
   ```

2. **Use strong passwords**
   - Minimum 8 characters
   - Mix of uppercase, lowercase, numbers, and symbols

3. **Enable 2FA** when available

4. **Don't share credentials**

5. **Keep your .env files secure**
   - Never commit them to version control
   - Use strong, unique secrets
   - Rotate secrets regularly

### For Developers

1. **Environment Variables**
   - Never hardcode secrets
   - Use `.env` files (excluded from git)
   - Use strong JWT secrets (min 32 characters)

2. **Input Validation**
   - Always validate user input
   - Sanitize data before database operations
   - Use parameterized queries

3. **Authentication**
   - Use bcrypt for password hashing
   - Implement rate limiting
   - Use secure cookie settings

4. **Dependencies**
   - Regularly update dependencies
   - Review package updates before installing
   - Use `npm audit` to check for vulnerabilities

5. **File Uploads**
   - Validate file types
   - Limit file sizes
   - Scan uploaded files
   - Store files securely

6. **API Security**
   - Use HTTPS in production
   - Implement CORS properly
   - Rate limit API endpoints
   - Validate JWT tokens

## Known Security Considerations

### File Uploads
- Maximum file size: 5MB
- Allowed types: images only (JPG, PNG, WEBP)
- Files are stored in `/uploads` directory

### Authentication
- JWT tokens expire after 24 hours
- Passwords are hashed using bcrypt
- Email verification required for new accounts

### Rate Limiting
- 100 requests per 15 minutes per IP
- Prevents brute force attacks

## Disclosure Policy

- Security vulnerabilities will be disclosed publicly only after a fix is available
- We aim to fix critical vulnerabilities within 7 days
- We'll publish security advisories for all patched vulnerabilities

## Security Updates

Subscribe to security updates:
- Watch this repository on GitHub
- Follow our security advisories
- Check our releases page regularly

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [React Security Best Practices](https://snyk.io/blog/10-react-security-best-practices/)

---

Thank you for helping keep Basha Lagbe and our users safe! 🔒
