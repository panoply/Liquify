/* eslint-disable */

export const enum ErrorLevel {
  /**
   * Reports an error.
   */
  Error = 1,

  /**
   * Reports a warning.
   */
  Warning = 2,

  /**
   * Reports an information.
   */
  Information = 3,

  /**
   * Reports a hint.
   */
  Hint = 4,
}

export const enum ParseError {
  /**
   * Parsing error occured. This could
   * be any error, its a fallback
   */
  ParsingError = 1,


  /**
   * Duplicated parameter values
   *
   * @example
   * {{- tag | filter: param: 'foo',  param: 'bar' -}} // param must be unqiue
   */
  DuplicatedParameters,

  /**
   * Tag name is missing
   *
   * @example
   * {% %}
   */
  MissingTagName,

  /**
   * Object name is missing
   *
   * @example
   * {{ }}
   */
  MissingObjectName,

  /**
   * Object BracketNotation closer
   *
   * @example
   * {{ object["foo" }}
   */
  MissingBracketNotation,

  /**
   * Start Tag is missing
   *
   * @example
   * {% endtag %}
   */
  MissingStartTag,

  /**
   * End Tag is missing
   *
   * @example
   * {% if tag %}
   * {% else %}
   */
  MissingEndTag,

  /**
   * Missing Open Delimeters
   *
   * @example
   * tag %}
   * object -}}
   */
  MissingOpenDelimiter,

  /**
   * Missing close delimeter
   *
   * @example
   * {% tag %
   * {{ objects | filter: '' }
   */
  MissingCloseDelimiter,

  /**
   * Missing colon
   *
   * @example
   * {{ object | filter '' }}
   */
  MissingColon,

  /**
   * Missing Property
   *
   * @example
   * {{ object. }}
   */
  MissingProperty,

  /**
   * Missing Filter
   *
   * @example
   * {{ tag | }}
   */
  MissingFilter,

  /**
   * Missing Filter
   *
   * @example
   * {{ tag | abs: 100. }} // missing number after decimal
   */
  MissingNumber,

  /**
   * Missing Filter Arguments
   *
   * @example
   * {{ tag | replace }} // Replace is missing arguments
   */
  MissingFilterArgument,

  /**
   * Missing Filter Arguments
   *
   * @example
   * {{ tag | replace: 'foo' 'bar' }} // Missing commas separator
   */
  MissingFilterSeparator,

  /**
   * Missing condition
   *
   * @example
   * {% if foo > %} // no condition after >
   * {%- unless -%} // missing condition
   */
  MissingCondition,

  /**
   * Missing Quotation
   *
   * @example
   * {% if x == 'foo %}
   */
  MissingQuotation,

  /**
   * Missing Iteration Iteree
   *
   * @example
   * {% for %}
   */
  MissingIterationIteree,

  /**
   * Missing Iteration Array
   *
   * @example
   * {% for i in  %}
   */
  MissingIterationArray,

  /**
   * Invalid Name
   *
   * @example
   * {% for in in %} // in is invalid
   */
  InvalidName,

  /**
   * Invalid Tag Name
   *
   * @example
   * {% #tag %} // # is invalid
   * {% 100 -%} // 100 is invalid
   * {% /tag/ %} // / is invalid
   */
  InvalidTagName,

  /**
   * Invalid Object Name
   *
   * @example
   * {{ #tag }} // # is invalid
   * {{ 100 }} // 100 is invalid
   */
  InvalidObjectName,

  /**
   * Invalid Property Notation
   *
   * @example
   * {{- object.%.prop -}} // "%" is invalid
   * {{- object.# -}} // "#" is invalid
   */
  InvalidProperty,

  /**
   * Invalid Property Notation
   *
   * @example
   * {{- object[var]"foo" -}} // "foo" is invalid
   * {{- object["prop"]foo -}} // foo is invalid
   */
  InvalidPropertyNotation,

  /**
   * Invalid Character
   *
   * @example
   * {% assign * = '' %} // * is invalid
   * {% - if foo == x %} // - is invalid
   * {{- tag | x = 1 -}} // = is invalid
   */
  InvalidCharacter,

  /**
   * Invalid Character
   *
   * @example
   * {{ tag | font_modify: 'weight', 'bar' }} // 'bar' is invalid
   */
  InvalidArgument,


  /**
   * Invalid Character
   *
   * @example
   * {% assign x foo = '' %} // foo is invalid
   * {% -- if foo == x %} // -- is invalid
   * {{- tag | x and 1 -}} // and is invalid
   */
  InvalidCharacters,

  /**
   * Invalid String Quotation match
   *
   * @example
   * {{ object["prop'] }}
   */
  InvalidQuotation,

  /**
   * Invalid Filter
   *
   * @example
   * {{ tag | fooo }} // 'fooo' is invalid or unknown
   */
  InvalidFilter,

  /**
   * Invalid Syntactic
   *
   * Thrown (generally) when the parser encounters a
   * child type tag incorrectly placed.
   *
   * @example
   * {% if foo %}
   */
  InvalidSyntactic,

  /**
   * Invalid Placement Syntactic
   *
   * Thrown when tag is not in correct scope
   *
   * @example
   * {% else %} // Invalid Placement
   * {% if foo %}
   * {% endif %}
   */
  InvalidPlacement,

  /**
   * Invalid Operator
   *
   * @example
   * {% unless x << y %} // << is invalid
   * {%- if foo =! x -%} // =! is invalid
   */
  InvalidOperator,

  /**
   * Reject String
   *
   * @example
   * {% 'assign' = 'x' -%} // assign should not be string
   * {%- increment '1' -%} // increment should not be string
   */
  RejectString,

  /**
   * Reject Number
   *
   * @example
   * {{ 100 }} // number cannot be used as object name
   */
  RejectNumber,

  /**
   * Reject Integer
   *
   * @example
   * {{ tag | filter: -10 }} // `-10` is integer and cannot be used
   */
  RejectInteger,

  /**
   * Reject Integer
   *
   * @example
   * {{ tag | filter: 10.10 }} // `10.10` is float and cannot be used
   */
  RejectFloat,

  /**
   * Reject Boolean
   *
   * @example
   * {% for x in false %}
   */
  RejectBoolean,

  /**
   * Reject Array
   */
  RejectArray,

  /**
   * Reject Object
   */
  RejectObject,

  /**
   * Reject Property
   */
  RejectProperty,

  /**
   * Reject Parameters
   */
  RejectParameters,

  /**
   * Reject Filters
   */
  RejectFilters,

  /**
   * Reject Filter Arguments
   *
   * @example
   * {{ tag | filter: argument }} // argument is not allowed
   */
  RejectFilterArguments,

  /**
   * Reject Whitespace
   *
   * @example
   * {{ object['prop   '] }} // whitespace "\s\s\s" is not allowed
   */
  RejectWhitespace,

  /**
   * Reject Whitespace Control
   *
   * @example
   * {%- schema -%} // dash "-" is not allowed
   */
  RejectWhitespaceControl,

  /**
   * Warn Extrenous Whitespace
   *
   * @example
   * {{- foo.  prop -}}
   * {{- foo ['prop'] }}
   * {{- foo ['    prop'] }}
   */
  WarnWhitespace,

  /**
   * Unknown Property
   *
   * @example
   * {{- product.not_known_propery -}}
   */
  UnknownProperty,
}
