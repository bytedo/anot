/**
 * 开发版配置
 * @author yutent<yutent.io@gmail.com>
 * @date 2020/08/13 15:28:39
 */

import esm from './lib/plugin.esm'

export default [
  {
    input: 'src/anot.js',
    output: {
      file: 'dist/anot.js',
      format: 'iife',
      sourcemap: true,
      name: '_Anot'
    },
    plugins: [esm()]
  }
  // {
  //   input: 'src/anot.touch.js',
  //   output: {
  //     file: 'dist/anot.touch.js',
  //     format: 'iife',
  //     sourcemap: true,
  //     name: '_Anot'
  //   },
  //   plugins: [esm()]
  // }
]
