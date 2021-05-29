export const enum TokenType {
  Whitespace,
  Newline,

  String,
  Boolean,
  Integer,
  Float,
  Number,

  Separator,
  Variable,

  Filter,
  FilterOperator,
  FilterArgument,
  FilterArgumentNumber,
  FilterIdentifier,
  FilterParameter,

  Unknown,

  Control,
  ControlCondition,
  ControlOperator,

  DelimiterOpen,
  DelimiterClose,

  /* ITERATION ---------------------------------- */

  IterationIteree,
  IterationOperator,
  IterationArray,
  IterationParameter,
  IterationParameterValue,

  /**
   * Object
   *
   * **EXAMPLES**
   *
   * - `foo` in `{{ foo.bar }}`
   * - `foo` in `{% if foo.bar %}`
   */
  Object,
  ObjectTag,
  ObjectProperty,
  ObjectPropertyString,
  ObjectPropertyObject,
  ObjectPropertyNumber,
  ObjectDotNotation,
  ObjectBracketNotationOpen,
  ObjectBracketNotationClose,

  StringSingleQuote,
  StringDoubleQuote,

  /* EMBEDDED LANGUAGES ------------------------- */

  Embedded,
  EmbeddedJSON,
  EmbeddedJavaScript,
  EmbeddedCSS,
  EmbeddedSCSS,

  /* ERRORS AND WARNINGS ------------------------ */

  ParseError,
  ParseWarning,
  ParseSkip,

  Content,

  EOS,

  /* FONTMATTER --------------------------------- */

  FrontmatterStart,
  FrontmatterEnd,

  /* YAML --------------------------------------- */

  YAMLCommentStart,
  YAMLComment,
  YAMLCommentClose,

  /* LIQUID ------------------------------------- */

  LiquidTagOpen,
  LiquidTrimDashLeft,
  LiquidTrimDashRight,

  LiquidTag,
  LiquidTagClose,

  LiquidEndTagOpen,
  LiquidEndTag,
  LiquidEndTagClose,
  LiquidTagName,

  LiquidSingularTag,
  LiquidSingularTagClose,

  LiquidObjectTagOpen,
  LiquidObjectName,
  LiquidObjectTagClose,

  /* HTML --------------------------------------- */

  HTMLStartTagOpen,
  HTMLTagName,
  HTMLStartTagClose,
  HTMLStartTagSelfClose,
  HTMLEndTagOpen,
  HTMLEndTag,
  HTMLEndTagClose,
  HTMLStartCommentTag,
  HTMLComment,
  HTMLEndCommentTag,
  HTMLAttributeName,
  HTMLOperatorValue,
  HTMLAttributeValue,
}
