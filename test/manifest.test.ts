import { test, expect, afterAll, beforeAll } from '@jest/globals'
import { Manifest } from '../src'

let manifest: Manifest
beforeAll(() => {
    manifest = new Manifest({
        'app.css': '/dist/css/app.348b54047dc4eeef2a98.css',
        'app.js': '/dist/js/app.348b54047dc4eeef2a98.js',
    }, 'https://the-endpoint')
})

test('normal', () => {
    expect.assertions(2);

    expect(manifest.get('app.css')).toBe('https://the-endpoint/dist/css/app.348b54047dc4eeef2a98.css')
    expect(manifest.get('app.js', false)).toBe('/dist/js/app.348b54047dc4eeef2a98.js')
})

test('undefined', () => {
    expect.assertions(1);

    expect(manifest.get('unknown')).toBeUndefined()
})
