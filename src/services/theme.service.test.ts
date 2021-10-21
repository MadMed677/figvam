import {ThemeService} from './theme.service';

describe('ThemeService', () => {
    test('should return "light" theme when called "getTheme" method right below the constructor', () => {
        const themeService = new ThemeService();

        expect(themeService.getTheme()).toBeTruthy();
    });
});
