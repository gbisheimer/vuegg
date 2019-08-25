/* eslint no-eval: 0 */
import { mapGetters } from 'vuex'
import { getTagByPath, getTagById } from '@/store/types'

import _ from 'lodash'

const templateParser = {
  data: function () {
    return {
    }
  },

  created: function () {
  },

  beforeDestroy: function () {
  },

  computed: {
    ...mapGetters([getTagById, getTagByPath])
  },

  methods: {
    parseDataPath (object) {
      return _.forEach(object, (value, key) => {
        object[key] = this.templateParse(value)
      })
    },

    parseData (object) {
      let result = JSON.parse(JSON.stringify(object))
      result.styles = this.parseDataPath(result.styles)
      result.styles = this.parseDataPath(result.styles)
      result.attrs = this.parseDataPath(result.attrs)
      return result
    },

    tag (path) {
      return this.getTagByPath(path) || {}
    },

    evalInContext (js, context) {
      // Return the results of the in-line anonymous function we .call with the passed context
      return (function () {
        try {
          return eval(js)
        } catch (error) {
          console.warn('Error en script: ' + js, error)
          return null
        }
      }.call(context))
    },

    parseByType (string, objectResult) {
      switch (string) {
        case '[object Object]':
          return objectResult
        case 'undefined':
          return undefined
        case 'false':
          return false
        case 'true':
          return true
        case '':
          return string
        default:
          if (!isNaN(string)) { // es un numero
            return parseFloat(string)
          } else {
            return string
          }
      }
    },

    // Parsea y evalua una cadena de texto
    templateParse (value) {
      if (_.isString(value)) {
        var cmd = _.trim(value)
        let objectResult = null
        cmd = cmd.replace(/{{.*?}}/g, match => {
          var expression = match.slice(2, -2) // les saca las {{ }}
          let oldRegex = /(^this.tag\(|this.tags\()/g // matching for old format of tags
          let regex = /(tags|tag).([^/0-9][\w._]+)/g // expresión para buscar texto a reemplazar
          let subst = `this.tag('$2')` // expresión para sustitur

          let oldRegexMatch = oldRegex.exec(expression)
          if (oldRegexMatch !== null) { // esto cumple cuando viene this.tags(....) o this.tag(...) -- lo uso para compatibilidad hacia atrás
            objectResult = this.evalInContext(expression, this)
            return objectResult
          } else {
            // en expression viene tags.xxx o tag.xxx
            let result
            expression = expression.replace(regex, subst)
            if (!_.isEmpty(result = this.evalInContext(expression, this))) {
              objectResult = result
              return result
            } else { // result is empty - try to get object not empty
              // replace this.tag('foo.bar') to this.tag('foo').var and try again.
              // console.warn('WARNING - Result of evaluation of object is empty - Result modified by software', expression)
              let regex1 = /(this.tag\('([\w._]*).([\w._]+)('\)))/g
              let subst1 = `this.tag('$2').$3`
              objectResult = (this.evalInContext(expression.replace(regex1, subst1), this))
              return objectResult
            }
          }
        })
        return this.parseByType(cmd, objectResult)
      } else {
        return value
      }
    }
  }
}

export default templateParser
