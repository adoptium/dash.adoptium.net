import { describe, test, expect } from 'vitest'
import { stringify } from '../utils'

describe('Utils', () => {
  describe('stringify', () => {
    test('Verify if stringify() works well', () => {
      expect(stringify({})).toBe('')

      const obj1 = {
        id: 123456789,
        name: 'mock_name',
        description: 'mock_description'
      }
      expect(stringify(obj1)).toBe('?id=123456789&name=mock_name&description=mock_description')
    })
  })
})
