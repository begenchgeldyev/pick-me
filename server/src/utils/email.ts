export async function sendVerificationEmail(
  email: string,
  token: string,
  role: string,
): Promise<void> {
  console.log(`\n📧 Verification email to: ${email}`);
  console.log(`   Token: ${token}`);
  console.log(`   Link: http://localhost:3000/api/${role}/auth/verify-email?token=${token}\n`);
}

export async function sendPasswordResetEmail(
  email: string,
  token: string,
  role: string,
): Promise<void> {
  console.log(`\n📧 Password reset email to: ${email}`);
  console.log(`   Token: ${token}`);
  console.log(`   Link: http://localhost:3000/api/${role}/auth/reset-password?token=${token}\n`);
}
