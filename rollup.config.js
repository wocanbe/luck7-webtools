import babel from 'rollup-plugin-babel'
import {uglify} from 'rollup-plugin-uglify'

const globals = {
  'babel-runtime/core-js/symbol': 'BabelCore.symbol',
  'babel-runtime/core-js/json/stringify': 'BabelCore.json.stringify',
  'babel-runtime/helpers/classCallCheck': 'BabelHelpers.classCallCheck',
  'babel-runtime/helpers/createClass': 'BabelHelpers.createClass',
  'luck7-webtools/libs/pinyin/first': 'firstPYlibs',
  'luck7-webtools/libs/pinyin/normal': 'normalPYlibs',
  'luck7-webtools/libs/pinyin/full': 'fullPYlibs',
  'crypto-js': 'cryptoJs',
  'wurl': 'wurl',
  'hash-sum': 'hash',
  'lodash/isString': 'isString',
  'lodash/isArray': 'isArray',
  'lodash/isRegExp': 'isRegExp',
  'lodash/memoize': 'memoize'
}
const banner = '/*!\n* Copyright 584069777@qq.com 2019.\n*/'
const plugins = [babel({
  babelrc: false,
  runtimeHelpers: true,
  'presets': [
    [require.resolve('babel-preset-env'), {
      targets: {
        browser: ['last 2 versions', 'not ie', 'not opera']
      },
      modules: false
    }]
  ],
  plugins: [require.resolve('babel-plugin-transform-runtime')],
  'comments': true
}), uglify({output: {comments: /^!/}})]
const external = (id) => {
  if (/^babel-runtime\/.*$/.test(id)) {
    return true
  } else if (/^lodash\/.*$/.test(id)) {
    return true
  } else if (/^luck7-webtools\/libs\/.*$/.test(id)) {
    return true
  } else if (['crypto-js', 'wurl', 'hash-sum'].indexOf(id) > -1) {
    return true
  }
}
const entrys = []
function addFileEntry (entryName) {
  entrys.push({
    input: `src/${entryName}.js`,
    output: {
      file: `${entryName}.js`,
      format: 'amd',
      name: `luck7-${entryName}`,
      globals,
      banner
    },
    // plugins: [babel({runtimeHelpers: true})],
    plugins,
    external
  })
}
const entrysList = ['auth', 'bom', 'cache', 'cookie', 'dom', 'encoder', 'encrypt', 'eventdom', 'mock', 'pinyin', 'store']

function addIndexEntry () {
  const indexGlobals = []
  entrysList.forEach(val => {
    indexGlobals.push({[`luck7-webtools/${val}`]: `luck7${val}`})
  })
  entrys.push({
    input: 'src/index.js',
    output: {
      file: 'index.js',
      format: 'amd',
      name: `luck7`,
      globals: indexGlobals,
      banner
    },
    plugins,
    external (id) {
      return /^luck7-webtools\/.*$/.test(id)
    }
  })
}
addIndexEntry()
entrysList.map((v) => {
  addFileEntry(v)
})
export default entrys
