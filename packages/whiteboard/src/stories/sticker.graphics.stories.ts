import {Story, Meta} from '@storybook/html';
import {action} from '@storybook/addon-actions';
import {StickerGraphics, IStickerGraphicsProps} from '../graphics';
import {PixiContainer} from './pixi_container.builder';
import {ThemeService} from '../services';

const themeService = new ThemeService();

export default {
    title: 'Canvas/StickerGraphics',
    argTypes: {
        mode: {
            control: {
                type: 'select',
            },
            options: ['normal', 'selected'],
        },
        text: {
            control: 'text',
        },
        theme: {
            control: {
                type: 'inline-radio',
            },
            options: {
                light: themeService.getLightTheme(),
                dark: themeService.getDarkTheme(),
            },
        },
    },
} as Meta;

const graphics = new StickerGraphics(1);
const contextBuilder = PixiContainer.getBuilder()
    .withTheme(themeService)
    .withContainer(window.innerWidth, window.innerHeight)
    .withElement(graphics);

graphics.visual.on('pointerdown', action('pointerdown'));

const context = contextBuilder.build();

const Template: Story<IStickerGraphicsProps> = args => {
    contextBuilder.update(args);

    return context;
};

export const Primary = Template.bind({});
Primary.args = {
    mode: 'normal',
    position: {
        x: 200,
        y: 200,
    },
    size: {
        width: 200,
        height: 200,
    },
    text: 'Sticker',
    theme: themeService.getLightTheme(),
};
