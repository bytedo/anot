import { Anot, window, document, root, inBrowser } from '../../seed/core'

var readyList = []

export function fireReady(fn) {
  Anot.isReady = true
  while ((fn = readyList.shift())) {
    fn(Anot)
  }
}

Anot.ready = function(fn) {
  readyList.push(fn)
  if (Anot.isReady) {
    fireReady()
  }
}

Anot.ready(function() {
  Anot.scan && Anot.scan(document.body)
})

/* istanbul ignore next */
function bootstrap() {
  if (document.readyState === 'complete') {
    setTimeout(fireReady) //如果在domReady之外加载
  } else {
    //必须传入三个参数，否则在firefox4-26中报错
    //caught exception: [Exception... "Not enough arguments"  nsresult: "0x80570001 (NS_ERROR_XPC_NOT_ENOUGH_ARGS)"
    document.addEventListener('DOMContentLoaded', fireReady, false)
  }

  Anot.bind(window, 'load', fireReady)
}

if (inBrowser) {
  bootstrap()
}
