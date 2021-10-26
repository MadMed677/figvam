/**
 * Mocking `window.matchMedia` by default.
 *
 * But if you need to rewrite it you may do
 *  that in your test manually
 */
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,

        /** @deprecated */
        addListener: jest.fn(),

        /** @deprecated */
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});
