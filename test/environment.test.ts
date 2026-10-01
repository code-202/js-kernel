import { test, expect, afterAll, beforeAll, jest } from '@jest/globals'
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

test('context', () => {
    environment = new Environment<KEYS>({
        'DEBUG': 'false',
        'VERBOSITY': 'true',
    }, {
        'ENDPOINT': 'https://the-endpoint',
        'ENDPOINT.node': 'https://the-endpoint-for-node',
        'DEBUG.browser': 'true',
    })

    const mock = jest.spyOn(environment, 'context', 'get')
    mock.mockReturnValue('node')

    expect(environment.get('ENDPOINT')).toBe('https://the-endpoint-for-node')
    expect(environment.get('DEBUG')).toBe('false')
    expect(mock).toHaveBeenCalledTimes(2)


    mock.mockReturnValue('browser')

    expect(environment.get('ENDPOINT')).toBe('https://the-endpoint')
    expect(environment.get('DEBUG')).toBe('true')
    expect(mock).toHaveBeenCalledTimes(4)
})
