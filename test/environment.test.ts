import { test, expect, afterAll, beforeAll } from '@jest/globals'
import { Environment } from '../src'

type KEYS = 'ENDPOINT' | 'API_KEY' | 'DEBUG' | 'VERBOSITY'

const env = {
    'ENDPOINT': 'https://the-endpoint',
    'DEBUG': 'false',
}

let environment: Environment.Environment<KEYS>

beforeAll(() => {
    environment = new Environment.Environment<KEYS>({
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

test('normalize', () => {
    expect.assertions(1)

    expect(environment.normalize()).toStrictEqual({
        'ENDPOINT': 'https://the-endpoint',
        'DEBUG': 'false',
        'VERBOSITY': 'true',
    })
})

test('denormalize', () => {
    expect.assertions(4)

    environment.denormalize({
        'ENDPOINT': 'https://the-endpoint-modified',
        'DEBUG': 'true',
        'API_KEY': '1234567890',
    })

    expect(environment.get('ENDPOINT')).toBe('https://the-endpoint-modified')
    expect(environment.get('DEBUG')).toBe('true')
    expect(environment.get('VERBOSITY')).toBe('true')
    expect(environment.get('API_KEY')).toBe('1234567890')
})
