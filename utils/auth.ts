import * as bcrypt from 'bcrypt'

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10
  const hashedPassword = await bcrypt.hash(password, saltRounds)
  console.log('Hashed Password:', hashedPassword)
  return hashedPassword
}
hashPassword('test')
