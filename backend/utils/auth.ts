import * as bcrypt from "bcrypt";

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

// Generate a strong password: 12 chars, mix of upper/lower/digits/specials
export function generateStrongPassword(length = 12): string {
  const lowers = "abcdefghijkmnopqrstuvwxyz";
  const uppers = "ABCDEFGHJKMNPQRSTUVWXYZ";
  const digits = "23456789";
  const specials = "!@#$%^&*()-_=+[]{};:,.?";
  const all = lowers + uppers + digits + specials;

  function pick(set: string) {
    return set[Math.floor(Math.random() * set.length)];
  }

  const required = [pick(lowers), pick(uppers), pick(digits), pick(specials)];
  const remainingLength = Math.max(length - required.length, 0);
  const rest = Array.from({ length: remainingLength }, () => pick(all));
  const combined = [...required, ...rest];

  // Fisher-Yates shuffle
  for (let i = combined.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [combined[i], combined[j]] = [combined[j], combined[i]];
  }
  return combined.join("");
}
