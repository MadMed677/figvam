module.exports = {
    core: {
        builder: 'webpack5',
    },
    features: {
        storyStoreV7: true,
    },
    stories: [
        '../src/**/*.stories.mdx',
        '../src/**/*.stories.@(js|jsx|ts|tsx)',
    ],
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        'storybook-dark-mode',
    ],
};
