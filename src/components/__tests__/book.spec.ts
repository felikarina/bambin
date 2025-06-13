import { formattedDate } from '../../utils/formattedDate'
import { describe, it, expect } from 'vitest'

describe('formattedDate', () => {
  it('retourne la date au format YYYY-MM-DD', () => {
    expect(formattedDate('2025-05-15T22:00:00.000Z')).toBe('2025-05-15')
  })
  it('retourne une chaîne vide si la date est undefined', () => {
    expect(formattedDate(undefined)).toBe('')
  })
})
