// eslint-disable-next-line no-undef
module.exports = env => {
    const env_name = env.dev ? 'dev' : 'prod';

    // eslint-disable-next-line no-undef
    console.log(
        `🛠️  running ${env_name} Mode using ./webpack/webpack.${env_name}.js 🛠️`,
    );
    // eslint-disable-next-line no-undef
    return require(`./webpack/webpack.${env_name}.js`);
};
