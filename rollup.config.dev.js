// const uglify = require('@bytedo/rollup-plugin-uglify')

module.exports = [
  {
    input: 'src/anot.js',
    output: {
      file: 'dist/anot.js',
      format: 'es',
      sourcemap: false
    },
    plugins: []
  },
  {
    input: 'src/anot.touch.js',
    output: {
      file: 'dist/anot.touch.js',
      format: 'es',
      sourcemap: false
    },
    plugins: []
  }
]
