import { randomBytes } from 'crypto';

export default function generateToken(): string {
    return randomBytes(32).toString('hex');
}
