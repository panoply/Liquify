import { NodeType } from 'lexical/types'
import { TokenType } from 'lexical/tokens'
import { ScanState, ScanCache } from 'lexical/state'
import { ParseError } from 'lexical/errors'
import Errors from 'parser/errors'
import spec from 'parser/specs'
import s from 'parser/stream'
import * as r from 'lexical/expressions'
import * as c from 'lexical/characters'

/**
 * Scanner
 *
 * Sequences Characters that are contained within Liquid,
 * HTML and YAML syntaxes.
 *
 * @export
 * @returns {Parser.IScanner}
 * @this {Parser.Options}
 */
export default (function () {

  /**
   * Start Position
   *
   * The starting position index of each tag,
   * this is reset every time we encounter an
   * open delimiter match
   *
   * @type {number}
   */
  let start

  /**
   * Scope
   *
   * @type {number}
   */
  let scope

  /**
   * Error Number
   *
   * Parsing errors, holds value of the parse errors
   * encountered while scanning tags.
   *
   * @type {number}
   */
  let error

  /**
   * Cache
   *
   * Can hold any value, is used as a cache
   * and its value may represent anything within
   * the stream.
   *
   * @type {number}
   */
  let cache = ScanCache.Reset

  /**
   * Scanner State
   *
   * The state at which the scan is processing. This
   * changes each time we come across characters important
   * in the sequence.
   *
   * @type {number}
   */
  let state = ScanState.CharSeq

  /**
   * Pairs
   *
   * Holds a number value and used to count start
   * and end characters, eg: []
   *
   * @type {number[]}
   */
  const pairs = []

  /**
   * AST Node Hierarch
   *
   * Tracks nodes which require start and end
   * tags so we can correctly populate the AST.
   *
   * @typedef {Array<string|number>} Hierarch
   */
  const syntactic = (

    /**
     * AST Node Hierarch
     *
     * @type {Hierarch}
     */
    hierarch => {

      return {

        /**
         * Returns the current parent
         *
         * @readonly
         * @returns {number}
         */
        get parenNode () { return hierarch[hierarch.length - 1] },

        /**
         * Returns the current parent
         *
         * @readonly
         * @returns {string}
         */
        get parentName () { return hierarch[hierarch.length - 2] },

        /**
         * Returns the hierarchal state array
         *
         * @readonly
         * @returns {Hierarch}
         */
        get list () { return hierarch },

        /**
         * Returns the hierarchal pair by choosing
         * the closest token (bottom-up) which exists
         * in the tree
         *
         * @readonly
         * @returns {number}
         */
        get match () {

          const state = hierarch.lastIndexOf(s.token)
          const index = hierarch[state + 1]

          hierarch.splice(state, 2)

          return typeof index === 'number' ? index : -1

        },

        /**
         * Hierarch Errors
         *
         * We push any hierarch errors at the end of the
         * document parsing sequence.
         *
         * @param {Parser.AST} document
         */
        hierarch (document) {

          while (this.list.length > 0) {
            this.list.shift()
            const index = this.list.shift()
            if (typeof index === 'number') {
              document.errors.push(
                Errors(
                  ParseError.MissingEndTag,
                  {
                    start: document.nodes[index].range.start,
                    end: document.positionAt(s.size)
                  }
                )
              )
            }
          }
        }
      }

    }
  )([])

  /**
   * Runs document scan
   *
   * @param {number} [offset=0]
   * The position offset from which to start scanning
   *
   * @returns {number}
   */
  const scan = (offset = 0) => {

    // Fast Forward to specified offset
    if (offset > 0) s.Jump(offset)

    // End of Stream
    if (s.EOS) return TokenType.EOS

    return state === ScanState.CharSeq
      ? CharSeq()
      : Scanner()

  }

  /**
   * Character Sequencing
   *
   * Advances source to delimiter start characters.
   * Sequence will capture HTML or Liquid characters.
   *
   * @returns {number}
   */
  function CharSeq () {

    if (cache === TokenType.Comment) {
      if (s.ConsumeUntil(r.CommentTagEnd)) {
        cache = ScanCache.Reset
      }
    }

    s.UntilSequence(r.Delimiters)

    // Liquid left-side delimiter detected, eg: {
    if (s.IsCodeChar(c.LCB)) {

      // Validate we have a Liquid tag, eg: {{ or {%
      if (s.IsRegExp(/^\{[{%]/)) {

        // Assert Start position of token
        start = s.offset

        // Liquid object type delimiter, eg: {{
        if (s.IfRegExp(r.DelimitersOutputOpen)) {

          // Preset the specification type incase we are dealing with
          // a known object value
          spec.type = NodeType.object

          state = ScanState.AfterOutputTagOpen
          return TokenType.DelimiterOpen
        }

        // Liquid basic type tag delimiter, eg: {%
        if (s.IfRegExp(r.DelimitersTagOpen)) {
          state = ScanState.AfterTagOpen
          return TokenType.DelimiterOpen
        }

      }
    }

    // if (s.IsCodeChar(c.LAN)) {    }

    if (state !== ScanState.CharSeq) state = ScanState.CharSeq

    s.SkipWhitespace()
    s.Advance(1)

  }

  /**
   * Scan Liquid
   *
   * Liquid c.language syntax tokenizer scanner.
   * TokenType enums are returned
   *
   * @returns {number}
   */
  function Scanner () {

    // Capture whitespace
    if (s.Whitespace()) return TokenType.Whitespace

    // Capture newlines
    if (s.Newlines()) return TokenType.Newline

    switch (state) {

      // HTML TAG OPEN
      // -----------------------------------------------------------------
      case ScanState.HTMLTagOpen:

        // We are within a HTML start tag, eg: <^tag
        if (s.IfRegExp(r.HTMLTagName)) {

          // We will check to see if this tag is a known associate
          if (s.TokenContains(spec.associates.regex)) {

            // We know about this tag, lets look for attributes
            state = ScanState.HTMLAttributeName
            return TokenType.HTMLTagName
          }
        }

        // This tag means nothing to us, lets keep scanning
        state = ScanState.CharSeq
        return TokenType.ParseCancel

      case ScanState.HTMLAttributeName:

        if (s.IfCodeChar(c.RAN)) {
          state = ScanState.CharSeq
          return TokenType.HTMLStartTagClose
        }

        if (s.IfRegExp(r.HTMLTagAttribute)) {
          state = ScanState.HTMLAttributeOperator
          return TokenType.HTMLAttributeName
        }

        state = ScanState.CharSeq
        return TokenType.ParseSkip

      case ScanState.HTMLAttributeOperator:

        if (s.IfCodeChar(c.EQS)) {
          state = ScanState.HTMLAttributeValue
          return TokenType.HTMLOperatorValue
        }

        state = ScanState.HTMLAttributeName
        return Scanner()

      case ScanState.HTMLAttributeValue:

        // Capture HTML string attribute value
        if (s.SkipQuotedString(true)) {
          state = ScanState.HTMLAttributeName
          return TokenType.HTMLAttributeValue
        }

        state = ScanState.HTMLAttributeName
        return Scanner()

      // HTML TAG CLOSE
      // -----------------------------------------------------------------
      case ScanState.HTMLTagClose:

        // The HTML closing tag name, eg: </^tag
        if (s.IfRegExp(r.HTMLTagName)) {
          state = ScanState.HTMLTagCloseName
          return TokenType.HTMLEndTag
        }

        // The HTML closing tag name, eg: </^>
        if (s.IfCodeChar(c.RAN)) {

          // Begin scanning again after consuming the character
          state = ScanState.CharSeq

          // Assert the error
          error = ParseError.MissingTagName
          return TokenType.ParseError
        }

        // If we get here we have an error, eg: </^
        state = ScanState.ParseError
        error = ParseError.InvalidTagName
        return TokenType.ParseError

      case ScanState.HTMLTagCloseName:

        if (s.IfCodeChar(c.RAN)) {
          state = ScanState.CharSeq
          return TokenType.HTMLEndTagClose
        }

        break

      // OUTPUT TAG OPEN
      // -----------------------------------------------------------------
      case ScanState.AfterOutputTagOpen:

        // Consume the trim left side dash
        if (s.IfCodeChar(c.DSH)) return TokenType.TrimDashLeft

        state = ScanState.BeforeOutputTagName
        return TokenType.ObjectTag

      // BASIC TAG OPEN
      // -----------------------------------------------------------------
      case ScanState.AfterTagOpen:

        // Consume the trim left side dash
        if (s.IfCodeChar(c.DSH)) return TokenType.TrimDashLeft

        // Lets peek ahead to see if we are dealing with an end tag
        if (s.IfRegExp(r.TagEndKeyword)) {
          state = ScanState.BeforeEndTagName
          return Scanner()
        }

        state = ScanState.BeforeStartTagName
        return TokenType.StartTag

      // OUTPUT TAG
      // -----------------------------------------------------------------
      case ScanState.BeforeOutputTagName:

        // Validate starting character of tag is valid
        if (!s.IsRegExp(r.ObjectFirstCharacter)) {
          error = ParseError.InvalidCharacter
          state = ScanState.ParseError
          return Scanner()
        }

        // If value is string, eg: {{ 'name' }}
        if (s.IsRegExp(r.StringQuotations)) {

          // Next call we will look for a filter value, eg: {{ 'value' | }}
          state = ScanState.Filter

          // Capture the string token value, eg: 'value' or "value"
          if (s.SkipQuotedString()) return TokenType.String

          // If we get here, string is missing a quotation
          error = ParseError.MissingQuotation
          state = ScanState.ParseError
          return Scanner()

        }

        // If value is a integer or float, eg: {{ 100 }}
        if (s.IfRegExp(r.Number)) {
          state = ScanState.Filter
          return TokenType.Number
        }

        // Variable or Object was detected, eg: {{ name }} or {{ object.prop }}
        if (s.IfRegExp(r.ObjectNameAlpha)) {

          // Match captured token with a cursor value
          spec.cursor(s.token)

          // Next call we will look for a property notation
          state = ScanState.Object
          return TokenType.Object
        }

        // If we get here, invalid object name
        error = ParseError.InvalidObjectName
        state = ScanState.ParseError
        return Scanner()

      case ScanState.BeforeEndTagName:

        // Tag is a "Tag", lets get its identifier
        if (s.IfRegExp(r.TagName)) {
          s.Cursor(start)
          state = ScanState.EndTagClose
          return TokenType.EndTag
        }

        // If we get here, invalid tag name
        error = ParseError.InvalidTagName
        state = ScanState.ParseError
        return Scanner()

      // BASIC TAG
      // -----------------------------------------------------------------
      case ScanState.BeforeStartTagName:

        // We are parsing standard or shopify variations

        // Validate starting character of tag is valid
        if (!s.IsRegExp(r.TagFirstChar)) {
          error = ParseError.InvalidCharacter
          state = ScanState.ParseError
          return Scanner()
        }

        // Tag is a "Tag", lets get its identifier
        if (s.IfRegExp(r.TagName)) {

          // Match captured token with a cursor value
          spec.cursor(s.token)

          // When no spec exists for the tag
          if (!spec.exists) {
            state = ScanState.GotoTagEnd
            return TokenType.Unknown
          }

          // Comment type tags, eg: {% comment %}
          if (spec.type === NodeType.comment) {
            state = ScanState.GotoTagEnd
            cache = TokenType.Comment
            return cache
          }

          // Control type tags, eg: {% if %} or {% unless %}
          if (spec.type === NodeType.variable) {

            state = ScanState.VariableIdentifier
            return TokenType.VariableIdentifier
          }

          // Control type tags, eg: {% if %} or {% unless %}
          if (spec.type === NodeType.control) {
            state = ScanState.Control
            return TokenType.Control
          }

          // Embedded language type tags, eg: {% schema %}
          if (spec.type === NodeType.embedded) {
            state = ScanState.EmbeddedLanguage
            return TokenType.Embedded
          }

          // Iteration type tags, eg: {% for %}
          if (spec.type === NodeType.iteration) {
            state = ScanState.Iteration
            return TokenType.Iteration
          }

          // Singular type tags, eg {% assign %}
          if (spec.get.singular) {
            state = ScanState.GotoTagEnd
            return TokenType.SingularTag
          }

          state = ScanState.GotoTagEnd
          return TokenType.Unknown

        }

        // If we get here, invalid tag name
        error = ParseError.InvalidTagName
        state = ScanState.ParseError
        return Scanner()

      case ScanState.TagUnknown:

        state = ScanState.GotoTagEnd
        return TokenType.LiquidTagName

      // ITERATION
      // -----------------------------------------------------------------
      case ScanState.Iteration:

        if (s.IsRegExp(r.IterationOperator)) {
          state = ScanState.GotoTagEnd
          error = ParseError.InvalidName
          return TokenType.ParseError
        }

        if (s.IfRegExp(r.ObjectNameAlpha)) {
          state = ScanState.IterationOperator
          return TokenType.IterationIteree
        }

        state = ScanState.GotoTagEnd
        error = ParseError.MissingIterationIteree
        return Scanner()

      case ScanState.IterationOperator:

        if (s.IfRegExp(r.IterationOperator)) {
          state = ScanState.IterationArray
          return TokenType.IterationIteree
        }

        state = ScanState.GotoTagEnd
        error = ParseError.InvalidOperator
        return TokenType.ParseError

      case ScanState.IterationArray:

        if (s.IfRegExp(r.ObjectNameAlpha)) {
          state = ScanState.GotoTagEnd
          return TokenType.IterationArray
        }

        state = ScanState.GotoTagEnd
        error = ParseError.MissingIterationArray
        return TokenType.ParseError

      // VARIABLE
      // -----------------------------------------------------------------
      case ScanState.VariableIdentifier:

        if (s.IfRegExp(r.TagKeyword)) {
          state = ScanState.GotoTagEnd
          return TokenType.VariableKeyword
        }

        state = ScanState.GotoTagEnd
        error = ParseError.InvalidCharacters
        return TokenType.ParseError

      case ScanState.VariableOperator:

        if (s.IfCodeChar(c.EQS)) {
          state = ScanState.VariableAssignment
          return TokenType.VariableKeyword
        }

        state = ScanState.GotoTagEnd
        error = ParseError.InvalidOperator
        return TokenType.ParseError

      case ScanState.VariableAssignment:

        if (s.IfRegExp(r.TagNameWild)) {
          state = ScanState.GotoTagEnd
          return TokenType.VariableKeyword
        }

        state = ScanState.GotoTagEnd
        error = ParseError.InvalidCharacters
        return TokenType.ParseError

      case ScanState.EmbeddedLanguage:

        state = ScanState.GotoTagEnd

        return TokenType.EmbeddedJSON

      // CONTROL TAG
      // -----------------------------------------------------------------
      case ScanState.Control:

        // Check to see if this control tag has scope
        if (spec.get?.scope) {

          // Lets validate the scope against the last syntactic parent
          if (!spec.tag.scope(syntactic.parentName)) {
            error = ParseError.InvalidPlacement
            state = ScanState.GotoTagEnd
            return TokenType.ParseError
          }
        }

        // Check if control tag accepts arguments expressions
        if (!spec.get.arguments) {

          // No arguments accepted by the tag, we move to end
          state = ScanState.GotoTagEnd

          if (s.IsRegExp(r.TagCloseClear)) return Scanner()

          // If the tag does not accept any arguments but some are found
          error = ParseError.InvalidCharacters
          return TokenType.ParseError

        }

        // Make sure the control tag is not empty
        if (s.IsRegExp(r.TagCloseClear)) {
          state = ScanState.GotoTagEnd
          error = ParseError.MissingCondition
          return TokenType.ParseError
        }

        // Lets progress forward and check condition
        state = ScanState.ControlCondition
        return Scanner()

      case ScanState.ControlCondition:

        // Condition is a integer or float number value
        if (s.IfRegExp(r.Number)) {
          state = ScanState.ControlOperator
          return TokenType.ControlCondition
        }

        // Condition is a string value
        if (s.SkipQuotedString()) {
          state = ScanState.ControlOperator
          return TokenType.String
        }

        // We have a missing quotation character, eg: "prop
        if (s.IsPrevRegExp(r.StringQuotations)) {

          // Advance 1 step to align cursor and tokenize
          s.Advance(1)
          error = ParseError.MissingQuotation
          state = ScanState.ParseError
          return Scanner()
        }

        // Lets check for boolean condition, eg {% if foo == true %}
        if (s.IfRegExp(r.Booleans)) {
          state = ScanState.ControlOperator
          return TokenType.Boolean
        }

        if (s.IfRegExp(r.ControlCondition)) {

          // Lets consult the specification to see if we know about the value
          // If we do we will set the specification
          if (spec.object.exists(s.token)) {

            spec.cursor(s.token)

            // If we have a property, we assert a return to operator scanner
            if (s.IsRegExp(r.ObjectHasProperty)) {
              cache = ScanState.ControlOperator
              state = ScanState.Object
              return TokenType.Object
            }

            // If we get here, lets check for operators
            state = ScanState.ControlOperator
            return TokenType.Object

          }

          // At this point we have a variable or unknown object
          if (s.IsRegExp(r.ObjectHasProperty)) {
            cache = ScanState.ControlOperator
            state = ScanState.Object
            return TokenType.Object
          }

          // Reaching here we have a variable
          state = ScanState.ControlOperator
          return TokenType.Variable
        }

        cache = ScanCache.Reset
        state = ScanState.TagClose
        return Scanner()

      case ScanState.ControlOperator:

        cache = ScanCache.Reset

        if (s.IfRegExp(r.ControlOperators)) {

          if (s.IsRegExp(r.TagCloseClear)) {
            state = ScanState.GotoTagEnd
            error = ParseError.MissingCondition
            return TokenType.ParseError
          }

          state = ScanState.ControlCondition
          return TokenType.ControlOperator
        }

        if (s.IsRegExp(r.TagCloseClear)) {
          state = ScanState.TagClose
          return Scanner()
        }

        state = ScanState.GotoTagEnd
        error = ParseError.InvalidOperator
        return TokenType.ParseError

      // OBJECTS
      // -----------------------------------------------------------------
      case ScanState.Object:

        if (error === ParseError.UnknownProperty) error = undefined

        // Object property dot, eg: object.
        if (s.IfCodeChar(c.DOT)) {

          // If object is not of type object, then no properties should exist

          state = ScanState.ObjectDotNotation
          return TokenType.ObjectDotNotation
        }

        // Object property bracket notation, eg: object[
        if (s.IfCodeChar(c.LOB)) {

          // Track start and end brackets
          pairs.push(s.offset)

          state = ScanState.ObjectBracketNotation
          return TokenType.ObjectBracketNotationOpen
        }

        // We have bracket notation end character, eg: ]
        if (s.IfCodeChar(c.ROB)) {

          if (pairs.length === 0) {

            error = ParseError.InvalidCharacter
            return TokenType.ParseError
          }

          //  Have pair, remove previous LOB position
          pairs.pop()
          state = ScanState.Object
          return TokenType.ObjectBracketNotationClose
        }

        if (pairs.length > 0) {

          // Rewind token to unclosed LOB and capture error
          s.Rewind(pairs.shift(), r.PropertyBrackets)

          // Clear the pairs array
          while (pairs.length > 0) pairs.pop()

          error = ParseError.MissingBracketNotation
          return TokenType.ParseError
        }

        // Reset the object spec walker
        // spec.object.reset()

        // Check to see if we scanning filter arguments
        if (spec.filter.within) {

          // Reconnect to filter specification
          spec.filter.cursor()

          // Next characters should be separators, eg: | foo: bar.baz^, }}
          state = ScanState.FilterSeparator
          return Scanner()
        }

        // If Tag is an object, we will look for filters, eg: {{ tag | }}
        if (s.IsCodeChar(c.PIP)) {
          state = ScanState.Filter
          return Scanner()
        }

        state = cache !== ScanCache.Reset
          ? cache
          : ScanState.TagClose

        return Scanner()

      // OBJECT DOT NOTATION
      // -----------------------------------------------------------------
      case ScanState.ObjectDotNotation:

        // Gets property value on object, eg: "prop" in "object.prop"
        if (s.IfRegExp(r.ObjectNameAlpha)) {

          if (spec.exists) {

            // Reference an unknown property Error warning
            /* if (!spec.object.exists(s.token)) {
              error = ParseError.UnknownProperty
              state = ScanState.Object
              return TokenType.ParseError
            } else {
              spec.object.cursor(s.token)
            } */
          }

          state = ScanState.Object
          return TokenType.ObjectProperty
        }

        // Ensure we have a missing property, eg: {{ object.^ }}
        if (s.IsRegExp(r.TagCloseClear)) {

          // Align token cursor, eg: {{ object^. }}
          s.Prev()

          error = ParseError.MissingProperty
          state = ScanState.ParseError
          return Scanner()

        }

        // Check to see if an extra dot character, eg: {{ object.. }}
        if (s.IsCodeChar(c.DOT)) {
          error = ParseError.InvalidCharacter
          state = ScanState.ParseError
        }

        // If we get here, property is invalid
        error = ParseError.InvalidProperty
        state = ScanState.ParseError
        return Scanner()

      // OBJECT DOT NOTATION
      // -----------------------------------------------------------------
      case ScanState.ObjectBracketNotation:

        // Check to see we no empty bracket notations, eg: []
        if (s.IsCodeChar(c.ROB) && s.IsToken(c.LOB)) {

          // We advance 1 step and also tokenize for error diagnostic
          s.Advance(1, true)

          error = ParseError.MissingProperty
          state = ScanState.Object

          // We will continue parsing the token after error
          return TokenType.ParseError
        }

        // Capture string object property, eg: object["prop"]
        if (s.SkipQuotedString()) {

          // Detect an empty property string value, eg: "" or "   "
          if (s.token.length === 2 || s.IsToken(r.StringEmpty)) {

            // Advance 1 step to align cursor and tokenize
            s.Advance(1)

            error = ParseError.MissingProperty
            state = ScanState.Object

            // We will continue parsing the token after error
            return TokenType.ParseError
          }

          // Next character should be closing bracket notation, eg ]
          state = ScanState.ObjectBracketNotationEnd
          return TokenType.ObjectPropertyString

        }

        // We have a missing quotation character, eg: "prop
        if (s.IsPrevRegExp(r.StringQuotations)) {

          // Advance 1 step to align cursor and tokenize
          s.Advance(1)

          error = ParseError.MissingQuotation
          state = ScanState.ParseError

          // We will consume entire token for this error
          return Scanner()
        }

        // Property is a number value, eg: object.prop[0]
        if (s.IfRegExp(r.NumberDigit)) {

          // Next character should be closing bracket notation, eg ]
          state = ScanState.ObjectBracketNotationEnd
          return TokenType.ObjectPropertyNumber
        }

        // Capture inner variable or object reference, eg: object[variable]
        if (s.IfRegExp(r.PropertyValue)) {

          // Pass it back to object scan, check for any properties
          state = ScanState.Object
          return TokenType.ObjectProperty
        }

        // If we get here, property is invalid
        error = ParseError.InvalidProperty
        state = ScanState.ParseError
        return Scanner()

      case ScanState.ObjectBracketNotationEnd:

        // We will attempt to close the right side bracket notation
        if (s.IfCodeChar(c.ROB)) {

          if (pairs.length === 0) {
            error = ParseError.InvalidCharacter
            return TokenType.ParseError
          }

          //  Have pair, remove previous LOB position
          pairs.pop()

          state = ScanState.Object
          return TokenType.ObjectBracketNotationClose
        }

        // If we get here, there is a missing bracket, eg: object["prop"
        error = ParseError.MissingBracketNotation
        state = ScanState.Object
        return TokenType.ParseError

      // TAG FILTER
      // -----------------------------------------------------------------
      case ScanState.Filter:

        // Tag has a pipe separator, we will look for a filter
        if (s.IfCodeChar(c.PIP)) {
          state = ScanState.FilterIdentifier
          return TokenType.Filter
        }

        // Attempt to close tag, we are here: {{ tag | filter^ }}
        state = ScanState.TagClose
        return Scanner()

      case ScanState.FilterIdentifier:

        // Filter identifier, lets capture, eg: {{ tag | ^filter }}
        if (s.IfRegExp(r.FilterIdentifier)) {

          // Find specification for this filter
          spec.cursor(s.token)

          // We are dealing with an unknown filter, consume token
          if (!spec.exists) {
            error = ParseError.InvalidFilter
            state = ScanState.GotoTagEnd
            return TokenType.ParseError
          }

          // Next scan we will look for color operator, eg: {{ tag | filter^:}}
          state = ScanState.FilterOperator
          return TokenType.FilterIdentifier
        }

        // If we get here, its an empty filter expression, eg: {{ tag | }}
        error = ParseError.MissingFilterArgument

        // We wont consume tag, instead we keep scanning
        state = ScanState.Filter
        return TokenType.ParseError

      case ScanState.FilterOperator:

        // Check the next token is a colon
        if (s.IsCodeChar(c.COL) && !spec.filter.arguments) {

          // If spec exists and arguments do not exist, throw an error
          error = ParseError.RejectFilterArguments
          state = ScanState.Filter

          return Scanner()
        }

        // Filter contains no arguments
        if (!spec.filter.arguments) {
          state = ScanState.Filter
          return Scanner()
        }

        // Lets consume the colon operator, eg: {{ tag | filter:^ }}
        if (s.IfCodeChar(c.COL)) {
          state = ScanState.FilterArgumentType
          return TokenType.FilterOperator
        }

        // We are missing a colon separator, eg: {{ tag | append^ }}
        error = ParseError.MissingColon
        state = ScanState.GotoTagEnd
        return TokenType.ParseError

      case ScanState.FilterArgumentType:

        if (spec.filter.type('argument')) {
          state = ScanState.FilterArgument
          return Scanner()
        }

        if (spec.filter.type('parameter')) {
          state = ScanState.GotoTagEnd
          return Scanner()

        }

        if (spec.filter.type('spread')) {
          state = ScanState.GotoTagEnd
          return Scanner()

        }

        state = ScanState.TagClose
        return Scanner()

      case ScanState.FilterArgument:

        // Capture an argument expressed as a string
        if (s.SkipQuotedString()) {

          // Make sure filter argument accepts a string
          if (spec.filter.accept('string')) {

            // If another filter argument is required pass to separator
            state = ScanState.FilterSeparator
            return TokenType.FilterArgument

          }

          // If we get here, the filter argument does not accept string type
          error = ParseError.RejectString
          state = ScanState.FilterSeparator
          return TokenType.ParseError

        }

        // We have a missing quotation character, eg: "argument
        if (s.IsPrevRegExp(r.StringQuotations)) {
          error = ParseError.MissingQuotation
          state = ScanState.ParseError
          return Scanner()
        }

        // Capture normal expression integer
        if (s.IfRegExp(r.NumberInteger)) {

          // Filter argument accepts number, eg: {{ tag | filter: 10 }}
          if (spec.filter.accept('integer')) {
            state = ScanState.FilterSeparator
            return TokenType.Integer
          }

          error = ParseError.RejectNumber
          state = ScanState.GotoTagEnd
          return TokenType.ParseError
        }

        // Capture float expression numbers
        if (s.IfRegExp(r.NumberFloat)) {

          // Ensure we accept float numbers
          if (spec.filter.accept('float')) {

            // Ensure number is not missing decimal
            if (s.IfCodeChar(c.DOT)) {
              error = ParseError.MissingNumber
              return TokenType.ParseError
            }

            state = ScanState.FilterSeparator
            return TokenType.Float
          }

          error = ParseError.RejectInteger
          state = ScanState.GotoTagEnd
          return TokenType.ParseError
        }

        // Check for boolean argument values
        if (s.IfRegExp(r.Booleans)) {

          // Ensure the argument accepts a boolean value
          if (spec.filter.accept('boolean')) {
            state = ScanState.FilterSeparator
            return TokenType.Boolean
          }

          error = ParseError.RejectBoolean
          state = ScanState.GotoTagEnd
          return TokenType.ParseError
        }

        // If we get here, we will have either a variable or reference
        if (s.IfRegExp(r.ObjectNameAlpha)) {

          // Filter argument accepts reference
          if (spec.filter.accept('reference')) {

            // Match captured token with a cursor value
            spec.cursor(s.token)

            // Check to to see if we are dealing with an object
            if (spec.typeof(NodeType.object) || s.IfNextRegExp(r.ObjectHasProperty)) {

              // Next call we will look for a property notation
              state = ScanState.Object
              return TokenType.Object

            }

            state = ScanState.FilterSeparator
            return TokenType.Variable

          }
        }

        // Missing filter argument, eg: {{ tag | filter: ^ }}
        state = ScanState.ParseError
        error = ParseError.MissingFilterArgument
        return Scanner()

      case ScanState.FilterSeparator:

        // Validate filter arguments exists
        if (!spec.filter.exists) {

          // We have a comma separator character, lets proceed
          if (s.IfCodeChar(c.COM)) {
            state = ScanState.FilterArgument
            return TokenType.Separator
          }

          // Capture the next character sequence and ensure its valid
          // If the true, we have is invalid character, eg {{ t | foo: bar"^ }}
          if (!s.IsRegExp(r.FilterPipeOrClose)) {
            s.Advance(1, true)
            error = ParseError.InvalidCharacter
            state = ScanState.GotoTagEnd
            return TokenType.ParseError
          }
        }

        // If last argument was processed pass back to filter
        if (spec.filter.last) {

          // Reset filter specification
          spec.filter.reset()

          // Re-scan for additional filters
          state = ScanState.Filter
          return Scanner()
        }

        // Move to next argument in specification
        spec.filter.next()

        // We have a comma separator character, lets proceed
        if (s.IfCodeChar(c.COM)) {
          state = ScanState.FilterArgument
          return TokenType.Separator
        }

        // TODO THINK ABOUT THIS LOGIC

        if (!spec.filter.required) {

          // Reset filter specification
          spec.filter.reset()
          state = ScanState.Filter

          return Scanner()
        }

        if (s.IsRegExp(/^['"a-zA-Z0-9]/)) {
          error = ParseError.MissingFilterSeparator
          state = ScanState.GotoTagEnd
          return TokenType.ParseError
        }

        error = s.IfRegExp(r.Spacing)
          ? ParseError.InvalidCharacter
          : ParseError.MissingFilterArgument

        state = ScanState.GotoTagEnd
        return TokenType.ParseError

        // TODO HANDLE THE ARGUMENT TYPES

      case ScanState.FilterParameter: break
      case ScanState.FilterParameterOperator: break
      case ScanState.FilterParameterArgument: break

      // GOTO TAG END
      // -----------------------------------------------------------------
      case ScanState.GotoTagEnd:

        // Recursive
        if (s.ConsumeUnless(/-?[%}]\}/, /\{[{%]/, false)) {
          state = ScanState.TagClose
          return Scanner()
        }

        // TODO: WE WILL NEED TO DISPOSE OF CURRENT TOKEN

        state = ScanState.CharSeq
        return CharSeq()

      case ScanState.ParseError: {

        // Consume the token until ending delimiters
        if (s.ConsumeUnless(/-?[%}]\}/, /\{[{%]/)) {
          state = ScanState.TagClose
          return cache === ScanCache.GotoEnd
            ? Scanner()
            : TokenType.ParseError
        }

        // TODO: WE WILL NEED TO DISPOSE OF CURRENT TOKEN

        state = ScanState.CharSeq
        return CharSeq()

      }

      // LIQUID CLOSE TAG
      // -----------------------------------------------------------------
      case ScanState.TagClose:
      case ScanState.EndTagClose:

        // Validate right side trim dash character
        if (s.IfCodeChar(c.DSH)) {

          // Check to see if whitespace proceeds the character
          if (s.SkipWhitespace()) {
            error = ParseError.RejectWhitespace
            return TokenType.ParseError
          }

          // We have asserted a trim character is valid
          // Next scan we will validate the delimiter sequence
          return TokenType.TrimDashRight

        }

        // Ensure we can close the tag and no invalid characters exist
        if (!s.IsRegExp(/^[%}]\}/)) {

          // We will consume the invalid character or string
          if (s.ConsumeUntil(/[%}]\}/, /\{[{%]/)) {

            error = s.token?.length === 1
              ? ParseError.InvalidCharacter
              : ParseError.InvalidCharacters

            // Process the error
            return TokenType.ParseError

          }

          // If we get here we are missing a closing delimiter
          state = ScanState.CharSeq
          error = ParseError.MissingCloseDelimiter
          return TokenType.ParseError

        }

        // Tag is closed, eg: }} or %}
        if (s.IfRegExp(r.DelimitersClose)) {

          if (state === ScanState.EndTagClose) {
            state = ScanState.CharSeq
            return TokenType.DelimiterEnder
          }

          state = ScanState.CharSeq
          return TokenType.DelimiterClose
        }

        // Fall through, move to character sequencing
        return CharSeq()

    }

    return Scanner()

  }

  /* -------------------------------------------- */
  /*                    METHODS                   */
  /* -------------------------------------------- */

  return ({

    /**
     * Scan Contents
     */
    scan

    , syntactic

    /**
     * Get state
     */
    , get cache () { return cache }

    /**
     * Get start
     */
    , get start () { return start }

    /**
     * Get Error
     */
    , get error () { return error }

    /**
     * Get Position
     */
    , get end () { return s.Position() }

    /**
     * Get Position
     */
    , get offset () { return s.offset }

    /**
     * Get Spaces
     */
    , get space () { return s.spaces }

    /**
     * Get Token
     */
    , get token () { return s.token }

    /**
     * Get Tag
     */
    , get tag () { return s.GetText(this.start, this.offset) }

    /**
     * Get Spec
     */
    , get spec () { return spec.get }

    /**
     * Get Line
     */
    , get line () { return s.Position().line }

    /**
     * Get Range
     */
    , get range () { return s.Range() }

    /**
     * Token Value
     *
     * Returns the value of a token (without quotations)
     * @return {string}
     */
    , get tokenValue () { return s.token.match(/[^'"]+/)[0] }

    /**
     * Get Text
     *
     * Returns a substring, by default the ending index is set
     * to the current position index, this is important because
     * this function requires you pass a starting position `from`.
     * The `from` parameter should not exceed the current position.
     *
     * @param {number} from
     * Starting Position which must be before current stream position
     *
     * @param {number} end
     * Ending position offset in current stream
     *
     */
    , getText (from, end) { return s.GetText(from, end) }
  })

})()
