require('@babel/register')({
  presets: [
    ['@babel/preset-env'],
    ['@babel/preset-react']
  ],
  plugins: [
    '@babel/plugin-transform-runtime'
  ]
})
require('./dashboard')
