/**
 * rollup plugin
 * @author yutent<yutent.io@gmail.com>
 * @date 2020/08/11 15:46:57
 */

export default function esm() {
  return {
    name: 'esm',
    generateBundle(info, chunk) {
      var item
      for (let k in chunk) {
        item = chunk[k]
        break
      }
      item.code += 'export default _Anot\n'
    }
  }
}
