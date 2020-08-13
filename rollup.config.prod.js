/**
 * 生产版配置
 * @author yutent<yutent.io@gmail.com>
 * @date 2020/08/13 15:28:39
 */

import uglify from '@bytedo/rollup-plugin-uglify'
import esm from './lib/plugin.esm'
import copyright from './copyright'

export default [
  {
    input: 'src/anot.js',
    output: {
      file: 'dist/anot.js',
      format: 'iife',
      banner: copyright,
      name: '_Anot'
    },
    plugins: [esm(), uglify()]
  },
  {
    input: 'src/anot.touch.js',
    output: {
      file: 'dist/anot.touch.js',
      format: 'iife',
      banner: copyright,
      name: '_Anot'
    },
    plugins: [esm(), uglify()]
  }
]
