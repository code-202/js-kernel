import { test, expect, afterAll, beforeAll } from '@jest/globals'
import { Environment } from '../src'

type KEYS = 'ENDPOINT' | 'API_KEY' | 'DEBUG' | 'VERBOSITY'

const env = {
    'ENDPOINT': 'https://the-endpoint',
    'DEBUG': 'false',
}

let environment: Environment<KEYS>

beforeAll(() => {
    environment = new Environment<KEYS>({
        'DEBUG': 'false',
        'VERBOSITY': 'true',
    }, env)
})

test('normal', () => {
    expect.assertions(3);

    expect(environment.get('ENDPOINT')).toBe('https://the-endpoint')
    expect(environment.get('DEBUG')).toBe('false')
    expect(environment.get('VERBOSITY')).toBe('true')
})

test('undefined', () => {
    expect.assertions(1);

    expect(environment.get('API_KEY')).toBeUndefined()
})
