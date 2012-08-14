/**
 * @preserve SeaJS - A Module Loader for the Web
 * v1.2.0 | seajs.org | MIT Licensed
 */


/**
 * Base namespace for the framework.
 * seajs 为seajs 全局的命名空间 
 */

 // 主要有两个作用
 // 作用一：避免多次加载seajs而引起冲突
 // 作用二：在异步加载seajs的时候，通过预先在页面端定义了seajs 和 config ， use ，define 并对执行参数进行缓存来确保seajs可用性，避免报错。
this.seajs = { _seajs: this.seajs }
//页面端异步加载seajs代码如下：
/*
;(function(m, o, d, u, l, a, r) {
  if(m[d]) return;
  function f(n, t) { return function() { r.push(n, arguments); return t } }
  m[d] = a = { args: (r = []), config: f(0, a), use: f(1, a) };
  m.define = f(2);
  u = o.createElement('script');
  u.id = d + 'node';
  u.src = '../../dist/sea.js';
  l = o.getElementsByTagName('head')[0];
  a = o.getElementsByTagName('base')[0];
  a ? l.insertBefore(u, a) : l.appendChild(u);
})(window, document, 'seajs');
*/

/**
 * The version of the framework. It will be replaced with "major.minor.patch"
 * when building.
 * seajs 版本号
 */
seajs.version = '1.2.0'


/**
 * The private utilities. Internal use only.
 * 私有工具集 ，仅供内部调用使用。
 */
seajs._util = {}


/**
 * The private configuration data. Internal use only.
 * 私有配置数据，仅供内部调用使用。
 */
seajs._config = {

  /**
   * Debug mode. It will be turned off automatically when compressing.
   * debug模式 。 在seajs被压缩后它会自动关闭debug模式。
   */
  debug: '%DEBUG%',

  /**
   * Modules that are needed to load before all other modules.
   * 需要预先被加载的模块
   */
  preload: []
}

/**
 * The minimal language enhancement
 * JavaScript 语言增强 
 */
;(function(util) {

  var toString = Object.prototype.toString
  var AP = Array.prototype

  //判断是否是个字符串
  util.isString = function(val) {
    return toString.call(val) === '[object String]'
  }

  //判断是否是函数
  util.isFunction = function(val) {
    return toString.call(val) === '[object Function]'
  }

  //判断是否是个正则
  util.isRegExp = function(val) {
    return toString.call(val) === '[object RegExp]'
  }

  //判断是否是个对象
  util.isObject = function(val) {
    return val === Object(val)
  }

  //判断是否是个数组
  util.isArray = Array.isArray || function(val) {
    return toString.call(val) === '[object Array]'
  }

  //三元表达式为做兼容处理
  //返回指定字符串在某个数组成员匹配中首次全文匹配的索引，如果没有匹配则返回 -1
  util.indexOf = AP.indexOf ?
      function(arr, item) {
        return arr.indexOf(item)
      } :
      function(arr, item) {
        for (var i = 0; i < arr.length; i++) {
          if (arr[i] === item) {
            return i
          }
        }
        return -1
      }

  //三元表达式为做兼容处理
  //让数组成员全部执行一次一个指定的函数 , 对数组不做任何修改
  var forEach = util.forEach = AP.forEach ?
      function(arr, fn) {
        arr.forEach(fn)
      } :
      function(arr, fn) {
        for (var i = 0; i < arr.length; i++) {
          fn(arr[i], i, arr)
        }
      }

  //三元表达式为做兼容处理
  //让数据成员全部执行一次一个指定的函数，并返回一个新的数组，该数组为原数组成员执行回调后的结果
  util.map = AP.map ?
      function(arr, fn) {
        return arr.map(fn)
      } :
      function(arr, fn) {
        var ret = []
        forEach(arr, function(item, i, arr) {
          ret.push(fn(item, i, arr))
        })
        return ret
      }

  //三元表达式为做兼容处理
  //让数据成员全部执行一次一个指定的函数，并返回一个新的数组，该数组为原数组成员执行回调后返回为true的成员
  util.filter = AP.filter ?
      function(arr, fn) {
        return arr.filter(fn)
      } :
      function(arr, fn) {
        var ret = []
        forEach(arr, function(item, i, arr) {
          if (fn(item, i, arr)) {
            ret.push(item)
          }
        })
        return ret
      }

  //数组去重
  util.unique = function(arr) {
    //声明空数组ret，空对象o
    var ret = []
    var o = {}

    //将数组对象执行forEach方法，得到去重后的对象o ， 巧妙 XD
    forEach(arr, function(item) {
      o[item] = 1
    })

    //对象以键值数组化
    if (Object.keys) {
      ret = Object.keys(o)
    }
    else {
      for (var p in o) {
        if (o.hasOwnProperty(p)) {
          ret.push(p)
        }
      }
    }

    //返回数组
    return ret
  }


  //以对象键值数组化
  util.keys = Object.keys

  if (!util.keys) {
    util.keys = function(o) {
      var ret = []

      for (var p in o) {
        if (o.hasOwnProperty(p)) {
          ret.push(p)
        }
      }

      return ret
    }
  }

  //当前时刻
  util.now = Date.now || function() {
    return new Date().getTime()
  }

})(seajs._util)

/**
 * The tiny console support
 * 提供 tiny console
 */
;(function(util, config) {

  var AP = Array.prototype


  /**
   * The safe wrapper of console.log/error/...
   */
  util.log = function() {
    if (typeof console !== 'undefined') {

      //借助Array原生方法把arguments转换为JS数组
      var args = AP.slice.call(arguments)

      var type = 'log'
      var last = args[args.length - 1]
      // pop方法为删除数组最后一个元素并返回删除内容
      console[last] && (type = args.pop())

      // Only show log info in debug mode
      // 只在debug模式下出现log信息
      if (type === 'log' && !config.debug) return

      var out = type === 'dir' ? args[0] : AP.join.call(args, ' ')
      console[type](out)
    }
  }

})(seajs._util, seajs._config)

/**
 * Path utilities for the framework
 * 框架路径工具集
 */
;(function(util, config, global) {

  var DIRNAME_RE = /.*(?=\/.*$)/
  //↑用于提取文件路径的目录部分
  var MULTIPLE_SLASH_RE = /([^:\/])\/\/+/g
  //↑用于削减多个‘/’情况
  var FILE_EXT_RE = /\.(?:css|js)$/
  //↑用于判断是否以 .css 或者 .js 结尾
  var ROOT_RE = /^(.*?\w)(?:\/|$)/
  //↑这个用于提取路径的目录部分


  /**
   * Extracts the directory portion of a path.
   * dirname('a/b/c.js') ==> 'a/b/'
   * dirname('d.js') ==> './'
   * @see http://jsperf.com/regex-vs-split/2
   * 用于提取文件路径的目录部分
   */
  function dirname(path) {
    var s = path.match(DIRNAME_RE)
    return (s ? s[0] : '.') + '/'
  }


  /**
   * Canonicalizes a path.
   * realpath('./a//b/../c') ==> 'a/c'
   * 规范化路径
   */
  function realpath(path) {
    MULTIPLE_SLASH_RE.lastIndex = 0

    // 'file:///a//b/c' ==> 'file:///a/b/c'
    // 'http://a//b/c' ==> 'http://a/b/c'
    if (MULTIPLE_SLASH_RE.test(path)) {
      path = path.replace(MULTIPLE_SLASH_RE, '$1\/')
      //匹配到多个/情况后用一个/予以替换
    }

    // 'a/b/c', just return. 
    //如果路径中没有出现 '.' 则返回路径
    if (path.indexOf('.') === -1) {
      return path
    }

    var original = path.split('/')
    var ret = [], part

    //用于处理路径中存在a/b/../c 的形式，该形式下将会直接被替换成为 a/c
    for (var i = 0; i < original.length; i++) {
      part = original[i]

      if (part === '..') {
        if (ret.length === 0) {
          throw new Error('The path is invalid: ' + path)
        }
        ret.pop()
      }
      else if (part !== '.') {
        ret.push(part)
      }
    }

    return ret.join('/')
  }


  /**
   * Normalizes an uri.
   * 正常化uri 原因在于在seajs内部require模块时候对于后缀名都是缺省的，正常化的功能就在于此
   */
  function normalize(uri) {

    // 规范化路径，调用realpath方法
    uri = realpath(uri)
    // 获取路径倒数第一个字符
    var lastChar = uri.charAt(uri.length - 1)
    // 如果是‘/’则返回uri
    if (lastChar === '/') {
      return uri
    }

    // Adds the default '.js' extension except that the uri ends with #.
    // ref: http://jsperf.com/get-the-last-character
    // 如果最后一个字符是‘#’ , 去‘#’
    if (lastChar === '#') {
      uri = uri.slice(0, -1)
    }
    // 如果uri中同时不存在‘?’和 路径中不以.css和.js结尾的，统一给路径加上.js
    else if (uri.indexOf('?') === -1 && !FILE_EXT_RE.test(uri)) {
      uri += '.js'
    }

    // Remove ':80/' for bug in IE
    // IE bug  :80/ -> /
    if (uri.indexOf(':80/') > 0) {
      uri = uri.replace(':80/', '/')
    }
    //返回正常化路径
    return uri
  }


  /**
   * Parses alias in the module id. Only parse the first part.
   * 解析模块id中的别名。
   */
  function parseAlias(id) {
    // #xxx means xxx is already alias-parsed.
    // #xxx 意味着 xxx 别名已经解析完毕。

    //判断首个字符串字符是否为# 如果含#，则舍去# 并返回字符串
    if (id.charAt(0) === '#') {
      return id.substring(1)
    }

    // 获取用户配置的别名配置信息
    var alias = config.alias

    // Only top-level id needs to parse alias.
    // 顶级标识不以点（.）或斜线（/）或含有(://)， 会相对模块系统的基础路径（即 SeaJS 的 base 路径）来解析
    if (alias && isTopLevel(id)) {

      //把id用(/)进行分割
      var parts = id.split('/')
      // 把首个数组的值做为关键字
      var first = parts[0]
      //如果alilas内含有first的属性
      if (alias.hasOwnProperty(first)) {
        //则把alias内first的属性值给parts[0],实则替换路径，替换成顶级标识
        parts[0] = alias[first]
        //重新拼接字符串
        id = parts.join('/')
      }
    }
    //返回 id
    return id
  }

  // 新建mapCache对象
  var mapCache = {}

  /**
   * Converts the uri according to the map rules.
   * 根据map中的规则转换uri 
   * 可以参考 https://github.com/seajs/seajs/issues/270 非常详细！
   */
  function parseMap(uri) {
    // map: [[match, replace], ...]
    // map来自于用户的自定义配置项seajs.config
    var map = config.map || []
    // 如果map为空 则直接返回 uri
    if (!map.length) return uri

    //不为空的情况下，原始uri将赋值给 ret
    var ret = uri

    // Apply all matched rules in sequence.
    // 匹配序列中所有的规则
    for (var i = 0; i < map.length; i++) {
      var rule = map[i]

      if (util.isArray(rule) && rule.length === 2) {
        var m = rule[0]

        if (util.isString(m) && ret.indexOf(m) > -1 ||
            util.isRegExp(m) && m.test(ret)) {
          //对匹配到的地方予以替换
          ret = ret.replace(m, rule[1])
        }
      }
      else if (util.isFunction(rule)) {
        ret = rule(ret)
      }
    }

    if (ret !== uri) {
      //缓存原有uri
      mapCache[ret] = uri
    }
    //返回经过匹配的新的uri 
    return ret
  }


  /**
   * Gets the original uri.
   * 获取原始uri
   */
  function unParseMap(uri) {
    return mapCache[uri] || uri
  }


  /**
   * Converts id to uri.
   * 把 id 转化为 uri
   */
  function id2Uri(id, refUri) {

    //id不存在则返回空
    if (!id) return ''

    //解析别名
    id = parseAlias(id)

    //如果refUri没有传入的时候 refUri采用pageUri
    refUri || (refUri = pageUri)

    var ret
    // 如果 传入的 id 本身就是一个绝对地址
    // absolute id
    if (isAbsolute(id)) {
      ret = id
    }
    // relative id
    else if (isRelative(id)) {
      // Converts './a' to 'a', to avoid unnecessary loop in realpath.
      if (id.indexOf('./') === 0) {
        id = id.substring(2)
      }
      ret = dirname(refUri) + id
    }
    // root id
    else if (isRoot(id)) {
      ret = refUri.match(ROOT_RE)[1] + id
    }
    // top-level id
    // 顶级标识 附加 base ，base为seajs路径
    else {
      ret = config.base + '/' + id
    }
    // 返回正常化的uri 
    return normalize(ret)
  }


  //是否为绝对路径
  function isAbsolute(id) {
    return id.indexOf('://') > 0 || id.indexOf('//') === 0
  }

  //是否为相对路径
  function isRelative(id) {
    return id.indexOf('./') === 0 || id.indexOf('../') === 0
  }

  //是否为根路径
  function isRoot(id) {
    return id.charAt(0) === '/' && id.charAt(1) !== '/'
  }


  //判断id 是否为顶级标识  关于标识具体可以查看 https://github.com/seajs/seajs/issues/258
  //顶级标识不以点（.）或斜线（/）或含有(://)， 会相对模块系统的基础路径（即 SeaJS 的 base 路径）来解析
  function isTopLevel(id) {
    var c = id.charAt(0)
    return id.indexOf('://') === -1 && c !== '.' && c !== '/'
  }


  /**
   * Normalizes pathname to start with '/'
   * Ref: https://groups.google.com/forum/#!topic/seajs/9R29Inqk1UU
   * 所有路径（除了根路径）前添加 ‘/’
   */
  function normalizePathname(pathname) {
    if (pathname.charAt(0) !== '/') {
      pathname = '/' + pathname
    }
    return pathname
  }


  var loc = global['location']


  // 举例 ： 
  // uri : http://www.google.com/pigcan/sohandsome.html
  // loc.protocol -> http:
  // loc.host -> www.google.com
  // normalizePathname(loc.pathname) -> /pigcan/sohandsome.html

  var pageUri = loc.protocol + '//' + loc.host +
      normalizePathname(loc.pathname)

  // local file in IE: C:\path\to\xx.js
  if (pageUri.indexOf('\\') > 0) {
    pageUri = pageUri.replace(/\\/g, '/')
  }


  util.dirname = dirname
  // 该方法用以提取路径的目录部分
  //dirname('a/b/c.js') ==> 'a/b/'  dirname('d.js') ==> './'

  util.realpath = realpath
  // 该方法将规范化路径，从而获得真实路径 
  //realpath('./a//b/../c') ==> 'a/c' 'file:///a//b/c' ==> 'file:///a/b/c' 'http://a//b/c' ==> 'http://a/b/c'

  util.normalize = normalize
  // 该方法会加上缺省的后缀名 .js

  util.parseAlias = parseAlias
  //解析别名

  util.parseMap = parseMap
  //根据map中的规则转换uri

  util.unParseMap = unParseMap
  //替换转换后的uri为原始uri

  util.id2Uri = id2Uri
  //把id转换为uri

  util.isAbsolute = isAbsolute
  //是否为绝对路径

  util.isTopLevel = isTopLevel
  //是否是顶级标识

  util.pageUri = pageUri
  //当前页uri

})(seajs._util, seajs._config, this)



/**
 * Utilities for fetching js and css files.
 * 获取js和css文件的工具集
 */
;(function(util, config) {

  var doc = document
  var head = doc.head ||
      doc.getElementsByTagName('head')[0] ||
      doc.documentElement

  var baseElement = head.getElementsByTagName('base')[0]

  var IS_CSS_RE = /\.css(?:\?|$)/i
  var READY_STATE_RE = /loaded|complete|undefined/

  var currentlyAddingScript
  var interactiveScript


  //加载资源文件文件

  util.fetch = function(url, callback, charset) {

    //获取的文件是不是css
    var isCSS = IS_CSS_RE.test(url)

    //如果是css创建节点 link  否则 则创建script节点
    var node = document.createElement(isCSS ? 'link' : 'script')

    //如果存在charset 如果charset不是function类型，那就直接对节点设置charset ，如果是function如下例：
    /*
    seajs.config({
      charset: function(url) {
      // xxx 目录下的文件用 gbk 编码加载
        if (url.indexOf('http://example.com/js/xxx') === 0) {
          return 'gbk';
        }
      // 其他文件用 utf-8 编码
        return 'utf-8';
      }

    });
    */
    if (charset) {
      var cs = util.isFunction(charset) ? charset(url) : charset
      cs && (node.charset = cs)
    }

    //assets执行完毕后执行callback ，如果自定义callback为空，则赋予noop 为空函数
    assetOnload(node, callback || noop)

    //如果是样式 ……  如果是 脚本 …… async 详见：https://github.com/seajs/seajs/issues/287
    if (isCSS) {
      node.rel = 'stylesheet'
      node.href = url
    }
    else {
      node.async = 'async'
      node.src = url
    }

    // For some cache cases in IE 6-9, the script executes IMMEDIATELY after
    // the end of the insertBefore execution, so use `currentlyAddingScript`
    // to hold current node, for deriving url in `define`.
    // 之下这些代码都是为了兼容ie 
    // 假如A页面在含有base标签，此时A页面有个按钮具有请求B页面的功能，并且请求过来的内容将插入到A页面的某个div中
    // B页面有一些div，并且包含一个可执行的script
    // 其他浏览器都会在异步请求完毕插入页面后执行该script 但是 ie 不行，必须要插入到base标签前。
    currentlyAddingScript = node

    // ref: #185 & http://dev.jquery.com/ticket/2709 
    // 关于base 标签 http://www.w3schools.com/tags/tag_base.asp

    baseElement ?
        head.insertBefore(node, baseElement) :
        head.appendChild(node)

    currentlyAddingScript = null
  }

  //资源文件加载完毕后执行回调callback
  function assetOnload(node, callback) {
    if (node.nodeName === 'SCRIPT') {
      scriptOnload(node, callback)
    } else {
      styleOnload(node, callback)
    }
  }

  //资源文件加载完执行回调不是所有浏览器都支持一种形式，存在兼容性问题
  //http://www.fantxi.com/blog/archives/load-css-js-callback/ 这篇文章非常不错

  //加载脚本完毕后执行回调
  function scriptOnload(node, callback) {

    // onload为IE6-9/OP下创建CSS的时候，或IE9/OP/FF/Webkit下创建JS的时候  
    // onreadystatechange为IE6-9/OP下创建CSS或JS的时候

    node.onload = node.onerror = node.onreadystatechange = function() {

      //正则匹配node的状态
      //readyState == "loaded" 为IE/OP下创建JS的时候
      //readyState == "complete" 为IE下创建CSS的时候 -》在js中做这个正则判断略显多余
      //readyState == "undefined" 为除此之外浏览器
      if (READY_STATE_RE.test(node.readyState)) {

        // Ensure only run once and handle memory leak in IE
        // 配合 node = undefined 使用 主要用来确保其只被执行一次 并 处理了IE 可能会导致的内存泄露
        node.onload = node.onerror = node.onreadystatechange = null

        // Remove the script to reduce memory leak
        // 在存在父节点并出于非debug模式下移除node节点
        if (node.parentNode && !config.debug) {
          head.removeChild(node)
        }

        // Dereference the node
        // 废弃节点，这个做法其实有点巧妙，对于某些浏览器可能同时支持onload或者onreadystatechange的情况，只要支持其中一种并执行完一次之后，把node释放，巧妙实现了可能会触发多次回调的情况
        node = undefined

        //执行回调
        callback()
      }
    }

  }

  //加载样式完毕后执行回调
  function styleOnload(node, callback) {

    // for Old WebKit and Old Firefox
    // iOS 5.1.1 还属于old --！ 但是 iOS6中 536.13
    // 这里用户采用了代理可能会造成一点的勿扰，可能代理中他是一个oldwebkit浏览器 但是实质却不是
    if (isOldWebKit || isOldFirefox) {
      util.log('Start poll to fetch css')

      setTimeout(function() {
        poll(node, callback)
      }, 1) // Begin after node insertion 
      // 延迟执行 poll 方法，确保node节点已被插入
    }
    else {
      node.onload = node.onerror = function() {
        node.onload = node.onerror = null
        node = undefined
        callback()
      }
    }

  }

  function poll(node, callback) {
    var isLoaded

    // for WebKit < 536
    // 如果webkit内核版本低于536则通过判断node节点时候含属性sheet
    if (isOldWebKit) {
      if (node['sheet']) {
        isLoaded = true
      }
    }
    // for Firefox < 9.0
    else if (node['sheet']) {
      try {
        //如果存在cssRules属性
        if (node['sheet'].cssRules) {
          isLoaded = true
        }
      } catch (ex) {
        // The value of `ex.name` is changed from
        // 'NS_ERROR_DOM_SECURITY_ERR' to 'SecurityError' since Firefox 13.0
        // But Firefox is less than 9.0 in here, So it is ok to just rely on
        // 'NS_ERROR_DOM_SECURITY_ERR'

        // 在Firefox13.0开始把'NS_ERROR_DOM_SECURITY_ERR'改成了'SecurityError'
        // 但是这边处理是小于等于firefox9.0的所以在异常处理上还是依赖与'NS_ERROR_DOM_SECURITY_ERR'
        if (ex.name === 'NS_ERROR_DOM_SECURITY_ERR') {
          isLoaded = true
        }
      }
    }

    setTimeout(function() {
      if (isLoaded) {
        // Place callback in here due to giving time for style rendering.
        callback()
      } else {
        poll(node, callback)
      }
    }, 1)
  }

  function noop() {
  }


  //用来获取当前插入script
  util.getCurrentScript = function() {
    // 如果已经获取到当前插入的script节点，则直接返回
    if (currentlyAddingScript) {
      return currentlyAddingScript
    }

    // For IE6-9 browsers, the script onload event may not fire right
    // after the the script is evaluated. Kris Zyp found that it
    // could query the script nodes and the one that is in "interactive"
    // mode indicates the current script.
    // Ref: http://goo.gl/JHfFW
    // 在IE6-9浏览器中，script的onload事件有时候并不能在script加载后触发
    // 需要遍历script的节点才能知道，当前脚本状态为 'interactive'
    if (interactiveScript &&
        interactiveScript.readyState === 'interactive') {
      return interactiveScript
    }

    var scripts = head.getElementsByTagName('script')

    for (var i = 0; i < scripts.length; i++) {
      var script = scripts[i]
      if (script.readyState === 'interactive') {
        interactiveScript = script
        return script
      }
    }
  }

  //获取script的绝对路径
  util.getScriptAbsoluteSrc = function(node) {
    return node.hasAttribute ? // non-IE6/7
        node.src :
        // see http://msdn.microsoft.com/en-us/library/ms536429(VS.85).aspx
        node.getAttribute('src', 4)
  }


  // 创建样式节点
  util.importStyle = function(cssText, id) {
    // Don't add multi times 
    //一个id不要添加多次 如果页面中已经存在该id则直接返回
    if (id && doc.getElementById(id)) return

    //创建style标签，并指定标签id，并插入head，ie和其他标准浏览器插入css样式存在兼容性问题，具体如下：
    var element = doc.createElement('style')
    id && (element.id = id)

    // Adds to DOM first to avoid the css hack invalid
    head.appendChild(element)

    // IE
    if (element.styleSheet) {
      element.styleSheet.cssText = cssText
    }
    // W3C
    else {
      element.appendChild(doc.createTextNode(cssText))
    }
  }

  //获取 UA 信息
  var UA = navigator.userAgent

  // `onload` event is supported in WebKit since 535.23
  // Ref:
  //  - https://bugs.webkit.org/show_activity.cgi?id=38995
  // css onload 事件的支持 从webkit 内核版本 535.23 开始
  var isOldWebKit = Number(UA.replace(/.*AppleWebKit\/(\d+)\..*/, '$1')) < 536

  // `onload/onerror` event is supported since Firefox 9.0
  // onload/onerror 这个事件是从firefox9.0开始支持的，在判断中首先判断UA是否是Firefox 并且 在存在onload
  // Ref:
  //  - https://bugzilla.mozilla.org/show_bug.cgi?id=185236
  //  - https://developer.mozilla.org/en/HTML/Element/link#Stylesheet_load_events
  var isOldFirefox = UA.indexOf('Firefox') > 0 &&
      !('onload' in document.createElement('link'))


  /**
   * References:
   *  - http://unixpapa.com/js/dyna.html
   *  - ../test/research/load-js-css/test.html
   *  - ../test/issues/load-css/test.html
   *  - http://www.blaze.io/technical/ies-premature-execution-problem/
   */

})(seajs._util, seajs._config, this)

/**
 * The parser for dependencies
 * 解析模块依赖
 */
;(function(util) {

  var REQUIRE_RE = /(?:^|[^.$])\brequire\s*\(\s*(["'])([^"'\s\)]+)\1\s*\)/g


  util.parseDependencies = function(code) {
    // Parse these `requires`:
    //   var a = require('a');
    //   someMethod(require('b'));
    //   require('c');
    //   ...
    // Doesn't parse:
    //   someInstance.require(...);
    // 解析含有require字段的依赖 ， 但是不解析实例化之后的实例的依赖
    var ret = [], match

    code = removeComments(code)
    //从头开始匹配 lastIndex的值会随着匹配过程的进行而修改
    REQUIRE_RE.lastIndex = 0

    // var asd = require('a'); 经过正则匹配后结果为 ["require('asd')","'" ,"asd"]
    while ((match = REQUIRE_RE.exec(code))) {
      if (match[2]) {
        ret.push(match[2])
      }
    }

    //返回数组去重值
    return util.unique(ret)
  }

  //删除注释 , 其实就是避免在正则匹配的时候，注释内还含有require信息，导致加载不必要的模块
  // See: research/remove-comments-safely
  function removeComments(code) {
    return code
        .replace(/^\s*\/\*[\s\S]*?\*\/\s*$/mg, '') // block comments
        .replace(/^\s*\/\/.*$/mg, '') // line comments
  }

})(seajs._util)

/**
 * The Module constructor and its methods
 */
;(function(seajs, util, config) {

  //详细解释具体查看 https://github.com/seajs/seajs/issues/303
  //不过接下来也会大概举例出来。
  //假设模块a.js并且其依赖于模块b.js 在页面中使用seajs.use('./a')
  //调用use方法后，seajs会在浏览器端创建<script src='a.js'></script> 随后通过一系列的方法得到a.js的绝对路径，并开始下载a.js
  //此时模块的状态为FETCHING
  //当a.js的onload时间触发时，文件已经下载到浏览器端，此时模块状态为FETCHED
  //在onload事件触发前，a.js中的define代码已经执行，但是由于是匿名模块，该模块的uri信息需要得到onload事件触发后才能拿到 
  //获取到后，会将模块 a 的信息存储到内部变量 cachedModules 里，此时模块状态变成 STATUS.SAVED
  //存储模块的信息包括：
  //1.factory - 就是 define 接收的函数 function(require, exports) { ... }
  //2.uri - 在 onload 触发后，通过 url 拿到
  //3.dependencies - 通过 factory.toString 方法拿到源码，然后正则匹配 require 拿到
  //4.status - 就是这里讨论的模块状态
  //可见当模块状态处于 SAVED 时，模块的依赖信息已经获取到。
  //拿到 dependencies，接下来就很自然了：开始下载这些依赖模块，重复上面的步骤，直到所有依赖模块的状态都变成 SAVED。
  //当依赖的所有模块都保存完毕时，模块 a 的状态就变成了 STATUS.READY

  var cachedModules = {}
  var cachedModifiers = {}
  var compileStack = []

  var STATUS = {
    'FETCHING': 1,  // The module file is fetching now. 模块正在获取中
    'FETCHED': 2,   // The module file has been fetched. 模块获取完毕
    'SAVED': 3,     // The module info has been saved. 模块信息已被存储
    'READY': 4,     // All dependencies and self are ready to compile. 所有依赖以及自身等待编译
    'COMPILING': 5, // The module is in compiling now. 模块编译中
    'COMPILED': 6   // The module is compiled and module.exports is available. 模块编译完毕，module.exports可用
  }


  //另外 源码中大量采用了 a && b && c && d  或者  a || b || c || d
  // &&中返回的是第一个返回为false的值   而 || 返回的则是第一个返回true的值

  function Module(uri, status) {

    this.uri = uri
    //如果status缺省，则赋值为0
    this.status = status || 0

    // this.id is set when saving
    // this.dependencies is set when saving
    // this.factory is set when saving
    // this.exports is set when compiling
    // this.parent is set when compiling
    // this.require is set when compiling
  }


  Module.prototype._use = function(ids, callback) {

    //查看传入的ids为字符串还是数组
    //如果传入的ids为字符串 例：ids =  './a' -> ids =['./a']
    //如果传入的ids为数组 例： ids = ['./a','./b'] -> ids = ['./a','./b'] (原样不变)
    util.isString(ids) && (ids = [ids])

    //得到uri 或者 uri数组

    var uris = resolve(ids, this.uri)


    this._load(uris, function() {
      //util.map : 让数据成员全部执行一次一个指定的函数，并返回一个新的数组，该数组为原数组成员执行回调后的结果
      var args = util.map(uris, function(uri) {

        return uri ? cachedModules[uri]._compile() : null

      })

      if (callback) {
        callback.apply(null, args)
      }
    })
  }


  // _load()方法主要会先判断那些资源文件还没有ready，如果全部资源文件都处于ready状态就执行callback()
  // 在这其中还会做循环依赖的判断，以及对没有加载的js执行加载

  Module.prototype._load = function(uris, callback) {

    //util.filter : 让数据成员全部执行一次一个指定的函数，并返回一个新的数组，该数组为原数组成员执行回调后返回为true的成员
    //unLoadedUris是那些没有被编译的模块uri数组
    var unLoadedUris = util.filter(uris, function(uri) {

      //返回执行函数后布尔值为true的成员，在uri存在并且在内部变量cacheModules中不存在或者或者它在存储信息中status的值小于STATUS.READY时返回true
      // STATUS.READY值为4，小于四则可能的情况是获取中，下载中或者还有依赖模块未模块信息saved
      return uri && (!cachedModules[uri] ||
          cachedModules[uri].status < STATUS.READY)

    })

    //如果模块所依赖的模块全部被加载执行了，执行回调并退出函数体
    var length = unLoadedUris.length
    if (length === 0) {
      callback()
      return
    }
    //还未加载的模块个数
    var remain = length
    //创建闭包，尝试去加载那些没有加载的模块
    for (var i = 0; i < length; i++) {
      (function(uri) {
        //判断如果在内部变量cachedModules里面并不存在该uri的存储信息则实例化一个Module对象
        var module = cachedModules[uri] ||
            (cachedModules[uri] = new Module(uri, STATUS.FETCHING))

        //如果模块的状态值大于等于2，也就意味着模块已经被下载好并已经存在于本地了
        //这个时候执行onFetched()
        //否则则调用fetch(uri, onFetched) ，尝试下载资源文件，onload后执行回调onFetched方法

        module.status >= STATUS.FETCHED ? onFetched() : fetch(uri, onFetched)

        function onFetched() {
          // cachedModules[uri] is changed in un-correspondence case

          module = cachedModules[uri]

          //但模块的状态值为大于等于STATUS.SAVED的时候，也就意味着该模块所有的依赖信息已经被拿到
          if (module.status >= STATUS.SAVED) {

            //getPureDependencies：得到不存在循环依赖的依赖数组
            var deps = getPureDependencies(module)

            //如果依赖数组不为空
            if (deps.length) {
              //再次执行_load()方法，直到全部依赖加载完成后执行回调
              Module.prototype._load(deps, function() {
                cb(module)
              })
            }
            //如果依赖数组为空的情况下，直接执行cb(module)
            else {
              cb(module)             
            }
          }
          // Maybe failed to fetch successfully, such as 404 or non-module.
          // In these cases, module.status stay at FETCHING or FETCHED.
          // 如果获取失败后，比如404或者不符合模块化规范
          //在这种情形下，module.status会维持在 FETCHING 或者 FETCHED
          else {
            cb()
          }
        }

      })(unLoadedUris[i])
    }

    // cb 方法 - 加载完所有模块执行回调
    function cb(module) {

      // 如果module的存储信息存在，那么修改它的module存储信息中的status的值，修改为 STATUS.READY
      module && (module.status = STATUS.READY)
      // 只有当所有模块加载完毕后执行回调。
      --remain === 0 && callback()
    }
  }

  // 执行factory 返回module.exports , 如果该module还对其余module存在依赖也会让其执行返回exports
  Module.prototype._compile = function() {

    var module = this
    // 如果执行编译时module.staus 显示为 已经编译好了
    // 则直接返回该module.exports
    if (module.status === STATUS.COMPILED) {
      return module.exports
    }

    // Just return null when:
    //  1. the module file is 404.
    //  2. the module file is not written with valid module format.
    //  3. other error cases.
    // 如果到编译了，module的状态还未ready则返回null
    // 一般这种情形是module不存在或者module不符合相关规范或者其他一些错误 - 严重超时
    if (module.status < STATUS.READY) {
      return null
    }

    // 设置module的状态值为 STATUS.COMPILING
    // 假设现有模块a其status的值为READY，其的含义是 ready to compile。此时模块 a 的 factory 函数还没有执行。
    // 当需要执行时，才会执行。模块 a 的 factory 函数正在执行时，模块 a 的状态为 COMPILING。

    module.status = STATUS.COMPILING

    //
    function require(id) {

      // resolve函数主要用于把ids -》 uris
      var uri = resolve(id, module.uri)
      // cachedModules为存储模块信息的内部变量，这里将其赋值给child
      var child = cachedModules[uri]

      // Just return null when uri is invalid.
      // 如果不存在该模块存储信息，则返回null
      if (!child) {
        return null
      }

      // Avoids circular calls.
      // 如果child的状态值为STATUS.COMPILING ,为了避免回调中的循环依赖则直接返回child.exports
      if (child.status === STATUS.COMPILING) {
        return child.exports
      }

      // 指向初始化时调用当前模块的模块。根据该属性，可以得到模块初始化时的 Call Stack.
      child.parent = module

      //返回 child的module.exports
      return child._compile()
    }

    // async 方法可用来异步加载模块，并在加载完成后执行指定回调。
    require.async = function(ids, callback) {

      module._use(ids, callback)

    }

    // 使用模块系统内部的路径解析机制来解析并返回模块路径。该函数不会加载模块，只返回解析后的绝对路径。
    require.resolve = function(id) {
      return resolve(id, module.uri)
    }

    // 通过该属性，可以查看到模块系统加载过的所有模块。
    // 在某些情况下，如果需要重新加载某个模块，可以得到该模块的 uri, 然后通过 delete require.cache[uri] 来将其信息删除掉。这样下次使用时，就会重新获取。
    require.cache = cachedModules

    // require 是一个方法，用来获取其他模块提供的接口。
    module.require = require

    // exports 是一个对象，用来向外提供模块接口。
    module.exports = {}

    // 指向 define(factory) 中 factory 参数。
    var factory = module.factory

    // 判断factory是否为函数
    if (util.isFunction(factory)) {

      // 假设模块 a 的 factory 执行时，假设a内部含有b的依赖，因此也会触发模块 b 的执行，模块 b 有可能还有依赖模块，比如 c，这时会继续触发模块 c 的执行，这就形成一个 stack：
      // 这个信息，就存储在内部变量 compileStack 里。
      /*
        模块 a 开始执行
          模块 b 开始执行
            模块 c 开始执行
            模块 c 执行完毕
          模块 b 执行完毕
        模块 a 执行完毕
      */
      compileStack.push(module)

      // 得到module.exports
      runInModuleContext(factory, module)

      compileStack.pop()
    }
    // factory不是函数但是它又存在的 这个时候module.exports直接赋值factory
    // 换言之 factory 为对象、字符串等非函数类型时，表示模块的接口就是该对象、字符串等值。
    // define({ "foo": "bar" }); 或者 define('I am a template. My name is {{name}}.');
    else if (factory !== undefined) {
      module.exports = factory
    }

    //把module.status的状态值设置为 STATUS.COMPILED , 意义为编译完毕
    module.status = STATUS.COMPILED

    // 执行modify 功能 ，如果程序中有设置modify的相关内容则取代原有的module.exports
    execModifiers(module)

    //最终返回module.exports 当前模块对外提供的
    return module.exports
  }


  //define 定义 ,id : 模块id , deps : 模块依赖 , factory

  Module._define = function(id, deps, factory) {
    var argsLength = arguments.length

    // define(factory)
    // 如果参数只有一位，那默认为factory，其余配对信息将由打包工具完成，需要走注意的一点是factory不可缺省！
    if (argsLength === 1) {
      factory = id
      id = undefined
    }
    // define(id || deps, factory)
    // 如果参数有两位
    else if (argsLength === 2) {
      //赋值factory为deps -》 因为参数缺省导致这么书写
      factory = deps
      // deps 为 undefined
      deps = undefined

      //判断id时候为一个数组，
      // define(deps, factory)
      if (util.isArray(id)) {
        deps = id
        id = undefined
      }
    }

    // Parses dependencies.
    //解析依赖关系
    // 如果deps不是数组类型，同时factory是函数
    if (!util.isArray(deps) && util.isFunction(factory)) {
      // 函数体内正则匹配require字符串，并形成数组返回赋值给deps
      deps = util.parseDependencies(factory.toString())
    }

    //设置元信息
    var meta = { id: id, dependencies: deps, factory: factory }
    var derivedUri

    // Try to derive uri in IE6-9 for anonymous modules.
    if (document.attachEvent) {
      // Try to get the current script.
      // 得到当前script的节点
      var script = util.getCurrentScript()
      // 如果script节点存在 
      if (script) {
        // 得到原始uri地址
        derivedUri = util.unParseMap(util.getScriptAbsoluteSrc(script))
      }

      if (!derivedUri) {
        util.log('Failed to derive URI from interactive script for:',
            factory.toString(), 'warn')

        // NOTE: If the id-deriving methods above is failed, then falls back
        // to use onload event to get the uri.
      }
    }

    // Gets uri directly for specific module.
    var resolvedUri = id ? resolve(id) : derivedUri

    if (resolvedUri) {
      // If the first module in a package is not the cachedModules[derivedUri]
      // self, it should assign it to the correct module when found.
      if (resolvedUri === derivedUri) {
        var refModule = cachedModules[derivedUri]
        if (refModule && refModule.packageUri &&
            refModule.status === STATUS.SAVED) {
          cachedModules[derivedUri] = null
        }
      }

      var module = save(resolvedUri, meta)

      // Handles un-correspondence case:
      if (derivedUri) {
        // cachedModules[derivedUri] may be undefined in combo case.
        if ((cachedModules[derivedUri] || {}).status === STATUS.FETCHING) {
          cachedModules[derivedUri] = module
          module.packageUri = derivedUri
        }
      }
      else {
        firstModuleInPackage || (firstModuleInPackage = module)
      }
    }
    else {
      // Saves information for "memoizing" work in the onload event.
      anonymousModuleMeta = meta
    }

  }

  // 逐次获取编译后module的module.exportsse
  Module._getCompilingModule = function() {
    return compileStack[compileStack.length - 1]
  }

  // 通过 seajs.find，可以快速查到到 seajs.cache 中的特定模块。
  // selector 支持字符串 和 正则表达式
  // 最终把模块的exports暴露给外界
  Module._find = function(selector) {
    var matches = []

    util.forEach(util.keys(cachedModules), function(uri) {
      if (util.isString(selector) && uri.indexOf(selector) > -1 ||
          util.isRegExp(selector) && selector.test(uri)) {
        var module = cachedModules[uri]
        module.exports && matches.push(module.exports)
      }
    })

    var length = matches.length

    if (length === 1) {
      matches = matches[0]
    }
    else if (length === 0) {
      matches = null
    }

    return matches
  }

  //在拿到 module.exports 对象、正式返回给模块系统前，我们可以做点手脚：对 module.exports 进行加工，这就是 seajs.modify 功能。

  // 关于modify相关内容具体可以查看：
  // https://github.com/seajs/seajs/issues/274

  Module._modify = function(id, modifier) {
    //通过id获取绝对路径
    var uri = resolve(id)
    //在cachedModules中寻找所需要的uri所对应的存储信息，该信息包含1.factory2.uri3.dependencies4.status
    var module = cachedModules[uri]
    // 如果module存储信息存在（代表已经被saved）并且module的状态为已经编译完毕
    if (module && module.status === STATUS.COMPILED) {
      //执行factory 返回module.exports
      runInModuleContext(modifier, module)
    }
    else {
      // cachedModifiers[uri] 查看是否存在，如果不存在赋值新数组，并添加数组成员
      cachedModifiers[uri] || (cachedModifiers[uri] = [])
      cachedModifiers[uri].push(modifier)
    }
    //返回seajs
    return seajs
  }


  // For plugin developers
  // 用于插件开发

  // Module.STATUS 为模块的状态值
  Module.STATUS = STATUS
  // Module._resolve id -> uri
  Module._resolve = util.id2Uri
  // Module._fetch  资源文件加载
  Module._fetch = util.fetch
  // Module.cache 模块系统加载过的所有模块
  Module.cache = cachedModules


  // Helpers
  // -------

  var fetchingList = {}
  var fetchedList = {}
  var callbackList = {}
  var anonymousModuleMeta = null
  var firstModuleInPackage = null
  var circularCheckStack = []

  //firstModuleInPackage 这个，和 un-correspondence 的情况，可以看 test/issues/un-correspondence
  //有两个作用：
  //1. 一是当 id 解析路径与真实路径不匹配时，让这两个路径都指向同一个模块。
  //2. 二是当一个文件里，有多个模块时，使得访问路径指向文件里的第一个模块。

  //resolve函数主要用于把ids -》 uris

  function resolve(ids, refUri) {
    if (util.isString(ids)) {
      // 是字符串的话执行Module._resolve -> util.id2Uri 
      // 在id2Uri这个函数中主要是把id转换为Uri（此uri被normalize过）
      return Module._resolve(ids, refUri)
    }
    // util.map 让数据成员全部执行一次一个指定的函数，并返回一个新的数组，该数组为原数组成员执行回调后的结果
    // 如果ids为数组 ，数组内成员执行resolve函数，并返回执行结果的新数组
    return util.map(ids, function(id) {
      return resolve(id, refUri)
    })
  }

  function fetch(uri, callback) {
    // 根据map中的规则替换uri为新的请求地址
    var requestUri = util.parseMap(uri)

    // 首先在已获取列表中查找是否含有requestUri记录
    if (fetchedList[requestUri]) {
      // See test/issues/debug-using-map
      // 这个时候将原始uri的module存储信息 刷新到 通过map重定义的requestUri上
      cachedModules[uri] = cachedModules[requestUri]
      // 执行callback 并返回
      callback()
      return
    }

    //在获取列表中查询 requestUri 的存储信息
    if (fetchingList[requestUri]) {
      //在callbacklist中加入该uri对应下的callback 并返回
      callbackList[requestUri].push(callback)
      return
    }
    // 如果尝试获取的模块都未出现在fetchedList和fetchingList中，则分别在请求列表和回调列表中添加其信息
    fetchingList[requestUri] = true
    callbackList[requestUri] = [callback]

    // Fetches it
    Module._fetch(
        requestUri,

        function() {
          fetchedList[requestUri] = true

          // Updates module status
          // 如果 module.status 等于 STATUS.FECTCHING ,则修改module状态为FETCHED
          var module = cachedModules[uri]
          if (module.status === STATUS.FETCHING) {
            module.status = STATUS.FETCHED
          }

          // Saves anonymous module meta data
          // 如果存在匿名模块元信息
          if (anonymousModuleMeta) {

            save(uri, anonymousModuleMeta)
            anonymousModuleMeta = null
          }

          // Assigns the first module in package to cachedModules[uri]
          // See: test/issues/un-correspondence
          if (firstModuleInPackage && module.status === STATUS.FETCHED) {
            cachedModules[uri] = firstModuleInPackage
            firstModuleInPackage.packageUri = uri
          }
          firstModuleInPackage = null

          // Clears 清除获取信息
          if (fetchingList[requestUri]) {
            delete fetchingList[requestUri]
          }

          // Calls callbackList 统一执行回调
          if (callbackList[requestUri]) {
            util.forEach(callbackList[requestUri], function(fn) {
              fn()
            })
            delete callbackList[requestUri]
          }

        },

        config.charset
    )
  }

  //
  function save(uri, meta) {
    //尝试获取uri的存储信息，如果存在则直接从内部变量cachedModules中获取，否则新建一个Module对象
    var module = cachedModules[uri] || (cachedModules[uri] = new Module(uri))

    // Don't override already saved module
    // 
    if (module.status < STATUS.SAVED) {
      // Lets anonymous module id equal to its uri
      // 让那些匿名模块的id 等于 meta.id 如果meta.id不存在 则为 uri
      module.id = meta.id || uri

      module.dependencies = resolve(
          // 返回那些存在依赖关系的module的dependencies的绝对地址
          util.filter(meta.dependencies || [], function(dep) {
            return !!dep
          }), uri)


      module.factory = meta.factory

      // Updates module status 
      // 更新模块状态 为saved
      // 假设存在模块a ，在 onload 事件触发前，a.js 中的 define 代码已执行。
      // 但由于是匿名模块，该模块的 uri 信息，需要等到 onload 触发后才能获取到。
      // 获取到后，会将模块 a 的信息存储到内部变量 cachedModules 里，此时模块状态变成 STATUS.SAVED
      module.status = STATUS.SAVED
    }
    // 返回module
    return module
  }

  // 运行 fn -> factory , 得到module.exports

  function runInModuleContext(fn, module) {
    var ret = fn(module.require, module.exports, module)

    // 在ret不为undefined情况下 ，赋值该module的exports值为fn的执行结果
    if (ret !== undefined) {
      module.exports = ret
    }
  }

  // 在拿到 module.exports 对象、正式返回给模块系统前，我们可以做点手脚：对 module.exports 进行加工，这就是 seajs.modify 功能。

  function execModifiers(module) {
    // 得到模块uri
    var uri = module.uri
    // 内部变量 cachedModifiers 就是用来存储用户通过 seajs.modify 方法定义的修改点
    // 查看该uri是否又被modify更改过
    var modifiers = cachedModifiers[uri]
    // 如果存在修改点
    if (modifiers) {

      // 对修改点统一执行factory，返回修改后的module.exports

      util.forEach(modifiers, function(modifier) {
        runInModuleContext(modifier, module)
      })
      // 删除 modify 方法定义的修改点 ，避免再次执行时再次执行
      delete cachedModifiers[uri]
    }
  }

  //获取纯粹的依赖关系 ， 得到不存在循环依赖关系的依赖数组

  function getPureDependencies(module) {

    var uri = module.uri

    return util.filter(module.dependencies, function(dep) {

      //是先推入被检查模块的uri到循环依赖检查栈中

      circularCheckStack = [uri]

      //接下来检查模块uri是否和其依赖的模块存在循环依赖
      //传入的两个值分别为cachedModules[dep]：依赖模块的存储信息 ， 当前被检查的模块的uri
      //ps:cachedModules[dep] 这个内部变量的存在时，代表其模块状态已经为saved

      var isCircular = isCircularWaiting(cachedModules[dep], uri)

      //如果存在循环依赖则在检查栈中推入uri ， 并打印循环依赖信息
      if (isCircular) {
        circularCheckStack.push(uri)
        printCircularLog(circularCheckStack)
      }
      // 如果存在循环依赖返回false，如果不存在则返回true
      return !isCircular
    })
  }

  //检查模块间是否存在循环等待，返回布尔值

  function isCircularWaiting(module, uri) {

    // 如果主模块所依赖模块存储信息不存在 或者 模块的状态值等于saved ，那么他就不属于循环等待的情况
    // 因为模块状态为saved的时候代表该模块的信息已经被存储到了内部变量cacheModules内
    if (!module || module.status !== STATUS.SAVED) {
      return false
    }

    //反之，将该依赖模块的uri信息将被推入到循环检查栈

    circularCheckStack.push(module.uri)

    //获取依赖模块的依赖
    var deps = module.dependencies

    //如果依赖模块没有对别的模块产生依赖，则直接返回 false
    if (deps.length) {
      // 如果依赖模块存在对别的模块有依赖 
      // 那么接下去将会在依赖关系中查找是否存在依赖uri的情形，存在返回true
      //util.indexOf：返回指定字符串在某个数组成员匹配中首次全文匹配的索引，如果没有匹配则返回 -1
      if (util.indexOf(deps, uri) > -1) {
        return true
      }

      //如果不存在上述情形，那么进一步查看，依赖模块的依赖模块，查看他们是否存在对当前模块存在依赖，如果存在返回true
      //逐层检查
      for (var i = 0; i < deps.length; i++) {
        if (isCircularWaiting(cachedModules[deps[i]], uri)) {
          return true
        }
      }

      //如果经过这两步的判断还是没有发现依赖，那就只能返回false了，认为没有循环依赖

      return false
    }

    return false
  }

  //打印存在循环依赖
  function printCircularLog(stack, type) {
    util.log('Found circular dependencies:', stack.join(' --> '), type)
  }


  // Public API
  // ----------

  //创建一个全局模型对象
  var globalModule = new Module(util.pageUri, STATUS.COMPILED)

  // 从配置文件读取是否有需要提前加载的模块
  // 如果有预先加载模块，事先设置预加载模块为空，并加载预加载模块并执行回调，如果没有则顺序执行
  seajs.use = function(ids, callback) {
    var preloadMods = config.preload

    if (preloadMods.length) {
      // Loads preload modules before all other modules.
      globalModule._use(preloadMods, function() {
        config.preload = []
        globalModule._use(ids, callback)
      })
    }
    else {
      globalModule._use(ids, callback)
    }

    return seajs
  }


  // For normal users
  // 针对于普通开发者

  // define 是全局函数，用来定义模块。在开发时，define 仅接收一个 factory 参数。factory 可以是一个函数，也可以是对象、字符串等类型。
  seajs.define = Module._define
  // 通过 seajs.cache 你可以看到 seajs 当前已经加载的所有模块信息。
  seajs.cache = Module.cache
  // 通过 seajs.find，可以快速查到到 seajs.cache 中的特定模块。 
  seajs.find = Module._find
  // 在拿到 module.exports 对象、正式返回给模块系统前，我们可以做点手脚：对 module.exports 进行加工，这就是 seajs.modify 功能。
  seajs.modify = Module._modify


  // For plugin developers
  // 为开发者提供插件
  seajs.pluginSDK = {
    Module: Module,
    util: util,
    config: config
  }

})(seajs, seajs._util, seajs._config)

/**
 * The configuration
 */
;(function(seajs, util, config) {

  //var noCachePrefix = 'seajs-ts='
  //var noCacheTimeStamp = noCachePrefix + util.now()
  //为了消除seajs-ts (个人所加，为方便调试源码)
  var noCachePrefix = 'seajs-ts='
  var noCacheTimeStamp = noCachePrefix + '1'

  // Async inserted script
  // 异步创建seajs节点
  var loaderScript = document.getElementById('seajsnode')

  // Static script
  // 静态节点 如果不存在seajsnode，
  if (!loaderScript) {
    var scripts = document.getElementsByTagName('script')
    loaderScript = scripts[scripts.length - 1]
  }

  // 如果seajs为内联形式的，则把他的base路径设置为pageuri
  var loaderSrc = util.getScriptAbsoluteSrc(loaderScript) ||
      util.pageUri // When sea.js is inline, set base to pageUri.

  var base = util.dirname(getLoaderActualSrc(loaderSrc))
  util.loaderDir = base

  // When src is "http://test.com/libs/seajs/1.0.0/sea.js", redirect base
  // to "http://test.com/libs/"
  var match = base.match(/^(.+\/)seajs\/[\d\.]+\/$/)
  if (match) {
    base = match[1]
  }
  // 设置base路径
  config.base = base

  // 获取data-main
  var dataMain = loaderScript.getAttribute('data-main')
  if (dataMain) {
    config.main = dataMain
  }


  // The default charset of module file.
  // 默认编码方式为 utf-8 
  config.charset = 'utf-8'


  /**
   * The function to configure the framework
   * config({
   *   'base': 'path/to/base',
   *   'alias': {
   *     'app': 'biz/xx',
   *     'jquery': 'jquery-1.5.2',
   *     'cart': 'cart?t=20110419'
   *   },
   *   'map': [
   *     ['test.cdn.cn', 'localhost']
   *   ],
   *   preload: [],
   *   charset: 'utf-8',
   *   debug: false
   * })
   *
   */
  seajs.config = function(o) {
    // 建立循环，逐一对比config中的属性
    for (var k in o) {
      // 如果传入对象o中的属性k不是原型链的一部分，那么中断循环，进行下一次循环
      if (!o.hasOwnProperty(k)) continue
      // 设定原始值
      var previous = config[k]
      // 设定当前值
      var current = o[k]
      // 如果原始值存在，并且其属性名为'alias'
      if (previous && k === 'alias') {
        // 那么循环取当前值
        for (var p in current) {
          // 如果 current对象的原型链的一部分含有p
          if (current.hasOwnProperty(p)) {

            // 把原始值赋值给 preValue
            var prevValue = previous[p]
            // 当前值赋值给currValue
            var currValue = current[p]

            // Converts {jquery: '1.7.2'} to {jquery: 'jquery/1.7.2/jquery'}
            // 格式转换
            if (/^\d+\.\d+\.\d+$/.test(currValue)) {
              currValue = p + '/' + currValue + '/' + p
            }
            //检查别名时候存在冲突
            checkAliasConflict(prevValue, currValue, p)
            previous[p] = currValue

          }
        }
      }
      // 再者，如果原始值存在，并且k为map或者preload的时候
      else if (previous && (k === 'map' || k === 'preload')) {
        // for config({ preload: 'some-module' })
        // 事先判断current是否为字符串，如果是字符串类型将其转为数组
        if (util.isString(current)) {
          current = [current]
        }
        // 遍历current的同时将其成员设置到原始config值中
        util.forEach(current, function(item) {
          if (item) {
            previous.push(item)
          }
        })
      }
      // 其他情况 将config中值直接用当前值替换
      else {
        config[k] = current
      }
    }

    // Makes sure config.base is an absolute path.
    // 确保config.base 是一个绝对的路径
    var base = config.base
    if (base && !util.isAbsolute(base)) {
      config.base = util.id2Uri('./' + base + '/')
    }

    // Uses map to implement nocache.
    // 在启用map的时候自动运行nocache机制，所谓nocache 就是给资源链接加时间戳
    if (config.debug === 2) {
      config.debug = 1
      seajs.config({
        map: [
          [/^.*$/, function(url) {
            if (url.indexOf(noCachePrefix) === -1) {
              url += (url.indexOf('?') === -1 ? '?' : '&') + noCacheTimeStamp
            }
            return url
          }]
        ]
      })
    }

    debugSync()

    return this
  }

  // 设置seajs.debug值
  // debug值为 true 时，加载器会使用 console.log 输出所有错误和调试信息。 默认为 false, 只输出关键信息。

  // 另外，还可以将 debug 值设为 2 . 这种情况下， 每个脚本请求都会加上唯一时间戳。这在测试期间很有用，可以强制浏览器每次都请求最新版本，免去 Ctrl + F5 之烦恼。
  function debugSync() {
    if (config.debug) {
      // For convenient reference
      seajs.debug = !!config.debug
    }
  }

  debugSync()


  // 获取Loader地址
  function getLoaderActualSrc(src) {
    // 如果链接中不存在‘??’，那么直接返回 ，主要用于检查是否combo
    if (src.indexOf('??') === -1) {
      return src
    }

    // Such as: http://cdn.com/??seajs/1.2.0/sea.js,jquery/1.7.2/jquery.js
    // Only support nginx combo style rule. If you use other combo rule, please
    // explicitly config the base path and the alias for plugins.
    // 如果存在??的形式，依托与?? 对src进行字符串分离 （这种情形出现在具有combo功能的服务端）
    // 第一部分作为root根地址，其余部分，再通过‘，’进行字符串分离，并返回匹配为sea.js的结果
    var parts = src.split('??')
    var root = parts[0]
    var paths = util.filter(parts[1].split(','), function(str) {
      return str.indexOf('sea.js') !== -1
    })
    // 返回loader地址
    return root + paths[0]
  }

  // 检查别名冲突
  function checkAliasConflict(previous, current, key) {
    if (previous && previous !== current) {
      util.log('The alias config is conflicted:',
          'key =', '"' + key + '"',
          'previous =', '"' + previous + '"',
          'current =', '"' + current + '"',
          'warn')
    }
  }

})(seajs, seajs._util, seajs._config)

/**
 * Prepare for debug mode
 */
;(function(seajs, util, global) {

  // The safe and convenient version of console.log
  seajs.log = util.log


  // Creates a stylesheet from a text blob of rules.
  seajs.importStyle = util.importStyle


  // Sets a alias to `sea.js` directory for loading plugins.
  // 设置一个seajs的别名，其为了seajs加载插件而准备
  seajs.config({
    alias: { seajs: util.loaderDir }
  })

  // Uses `seajs-debug` flag to turn on debug mode.
  if (global.location.search.indexOf('seajs-debug') > -1 ||
      document.cookie.indexOf('seajs=1') > -1) {
    seajs.config({ debug: 2 }).use('seajs/plugin-debug')

    // Delays `seajs.use` calls to the onload of `mapfile`.
    seajs._use = seajs.use
    seajs._useArgs = []
    seajs.use = function() { seajs._useArgs.push(arguments); return seajs }
  }

})(seajs, seajs._util, this)

/**
 * The bootstrap and entrances
 */
;(function(seajs, config, global) {

  var _seajs = seajs._seajs

  // Avoids conflicting when sea.js is loaded multi times.
  // 避免多次引入seajs导致冲突
  if (_seajs && !_seajs['args']) {
    global.seajs = seajs._seajs
    return
  }


  // Assigns to global define.
  // 把seajs的define方法注册要全局
  global.define = seajs.define


  // Loads the data-main module automatically.
  // 自动加载data-main。 其实质还是seajs.use. data-main目前未明了bug数几个，所以不是很推荐使用它，推荐直接使用seajs.use()。
  config.main && seajs.use(config.main)

  // Parses the pre-call of seajs.config/seajs.use/define.
  // Ref: test/bootstrap/async-3.html
  // 主要用于异步加载seajs时的处理方案 之下为玉伯原话：
  // 立刻调用 seajs 的接口时，sea.js 可能还处于下载中，还未下载下来
  // 这时通过下面的内嵌代码，等于定义了一个假的 seajs
  // 这个假的 seajs 上，有 config / use / define 等方法
  // 但调用时并没真正执行，仅仅将参数保存了起来，这样，等真正的 seajs 加载好了后就可以从这假的 seajs 中得到之前进行了怎样的调用，从而让调用生效
  // 这是 seajs 里第一行代码的作用  seajs = { _seajs: this.seajs }
  // seajs = { _seajs: this.seajs } 这个还有个作用是，避免多次加载 sea.js 时的冲突
  ;(function(args) {
    if (args) {
      var hash = {
        0: 'config',
        1: 'use',
        2: 'define'
      }
      for (var i = 0; i < args.length; i += 2) {
        seajs[hash[args[i]]].apply(seajs, args[i + 1])
      }
    }
  })((_seajs || 0)['args'])


  // Keeps clean!
  delete seajs.define
  delete seajs._util
  delete seajs._config
  delete seajs._seajs

})(seajs, seajs._config, this)