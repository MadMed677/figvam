import {ThemeService} from './theme.service';

describe('ThemeService', () => {
    test('should return "light" theme when called "getTheme" method', () => {
        const themeService = new ThemeService();

        expect(themeService.getTheme()).toBeTruthy();
    });

    test('should return "light" theme when called "getLightTheme" method', () => {
        const themeService = new ThemeService();

        expect(themeService.getLightTheme()).toBeTruthy();
    });

    test('should return "dark" theme when called "getDarkTheme" method', () => {
        const themeService = new ThemeService();

        expect(themeService.getDarkTheme()).toBeTruthy();
    });
});
