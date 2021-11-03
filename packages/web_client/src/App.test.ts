describe('Useless test', () => {
    test('should be changed for real when interface will be created', () => {
        expect(true).toBe(true);
    });
});

/**
 * Useless code. We have to create it because otherwise we will get an error:
 *
 * TS1208: 'App.test.ts' cannot be compiled under '--isolatedModules'
 *  because it is considered a global script file.
 * Add an import, export, or an empty 'export {}' statement
 *  to make it a module.
 */
export {};
