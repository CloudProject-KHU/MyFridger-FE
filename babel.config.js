module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'expo-router/babel',
      [
        'module-resolver',
        {
          extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
          alias: {
            '@': './',
            '@features': './src/features',
            '@settings': './src/features/settings',
            '@shared': './shared',
          },
        },
      ],
    ],
  };
};
