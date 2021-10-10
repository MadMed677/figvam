module.exports = env => {
	const env_name = env.dev ? 'dev' : 'prod';

	console.log(`🛠️  running ${env_name} Mode using ./webpack/webpack.${env_name}.js 🛠️`);
	return require(`./webpack/webpack.${env_name}.js`);
};
