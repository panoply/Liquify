/**
 * Configuration
 *
 * The class scopes listed here are settings used by the language server. The
 * presets defined here are defaults and will maintain server configuration state.
 *
 * @export
 * @class Config
 */
export class Config {

  /**
   * Engine Variation Specification
   *
   * @type {Specification.Engine}
   * @memberof Config
   */
  engine = null

  /**
   * Specification References
   *
   * @type {Specification.Variation}
   * @memberof Config
   */
  specification = null

  /**
   * Strict Specification - This will validate syntax according
   * to the engine spec, if you're using Jekyll, this should be `false`
   * whereas the Shopify engine can use true.
   *
   * @memberof Config
   */
  strictSpec = false

  /**
   * The `.liquidrc` file location
   *
   * @type {string}
   * @memberof Config
   */
  rcfile = null

  /**
   * The rootURI path of workspace
   *
   * @type {string}
   * @memberof Config
   */
  rootUri = null

  /**
   * Path includes used to resolve include/import tags
   *
   * @type {object}
   * @memberof Config
   */
  paths = {}

  /**
   * Specification References
   *
   * @type {import('types/parser').ParseExpressions}
   * @memberof Config
  */
  parser = {
    comment: null,
    filters: null,
    objects: null,
    parsing: null,
    frontmatter: null,
    params: {}
  }

  /**
   * Server Document Settings - Records settings of documents
   *
   * @memberof LiquidServer
   */
  settings = new Map()

  /**
   * Server capabilities - Used for different text editor implementations
   * that can consume and/or support the Language Server Protocol
   *
   */
  capability = {

    /**
     * Server - hasConfigurationCapability
     *
     * @type {boolean}
     * @memberof Config
     */
    hasConfigurationCapability: false,

    /**
     * Server - hasWorkspaceFolderCapability
     *
     * @type {boolean}
     * @memberof Config
     */
    hasWorkspaceFolderCapability: false,

    /**
     * Server - hasDiagnosticRelatedInformationCapability
     *
     * @type {boolean}
     * @memberof Config
     */
    hasDiagnosticRelatedInformationCapability: false

  }

  /**
   * **NOT YET IMPLEMENTED**
   *
   * Third party extensions - In future version we will inherit
   * formatting rulesets from alternative formatters/beautifiers
   *
   * @protected
   */
  thirdParties = {

    /**
     * Prettier - NOT YET AVAILABLE - DO NOT USE
     */
    prettier: null,

    /**
     * JS Beautify - NOT YET AVAILABLE - DO NOT USE
     */
    jsbeautiy: null

  }

  /**
   * Server tracing (LSP related)
   */
  trace ={

    /**
     * Trace LSP
     */
    server: 'off'

  }

  /**
   * Notification options - Used to limit and control what
   * notifications are shown by the extension
   */
  notifier = {

    /**
     * Show version notification for new releases
     */
    releases: true,

    /**
     * Project reccomendation - Show project recommendations
     */
    recommendations: true,

    /**
     * Notify when conflicting extensions are active
     */
    conflicts: true

  }

  provider = {

    /**
     * Enable/Disable Liquid formatting
     *
     * @type {boolean}
     */
    format: true,

    /**
     * Enable/Disable Liquid completions
     *
     * @type {boolean}
     */
    completion: true,

    /**
     * Enable/Disable Liquid hover descriptions
     *
     * @type {boolean}
     */
    hover: true,

    /**
     * Enable/Disable Liquid validation diagnostic features
     *
     * @type {boolean}
     */
    validate: true,

    /**
     * Enable/Disable validations running on document open
     *
     * @type {boolean}
     */
    validateOnOpen: true,

    /**
     * Enable/Disable Liquid document links, ie: include
     *
     * @type {boolean}
     */
    link: true

  }

  /**
   * The embedded language services to provide
   */
  service = {

    /**
     * The JSON Language Server
     *
     * @type {boolean}
     */
    json: true,

    /**
     * The CSS Language Server - NOT YET AVAILABLE
     *
     * @type {boolean}
     */
    css: false,

    /**
     * The SCSS Language Server - NOT YET AVAILABLE
     *
     * @type {boolean}
     */
    scss: false,

    /**
     * The JavaScript Language Server - NOT YET AVAILABLE
     *
     * @type {boolean}
     */
    javascript: false

  }

  /**
   * PrettyDiff options the HTML/Liquid language
   *
   * @type {FormattingRules}
   */
  formatRules = {

    /**
     * Files and tags to be ignored by formatter
     */
    ignore: {

      /**
       * Ignored files - List of files to skip formatting on
       */
      files: [],

      /**
       * Ignored Tags - List of tags to ignore from formatting
       */
      tags: []

    },

    /**
     * Editor Rules - Inherit relative formatting options from editor
     */
    editorRules: {

      /**
       * Indentation - Editor Setting
       */
      tabSize: 2,

      /**
       * Word Wrap - Editor Setting
       */
      wordWrapColumn: 0

    },

    /**
     * Custom Rules - Langauge Server extended rulesets
     */
    customRules: {

      /**
       * Custom Options - HTML
       */
      html: {

        /**
         * Format `<script></script>` elements
         */
        format_script: false,

        /**
         * Format `<style></style>` elements
         */
        format_style: false,

        /**
         * Should embedded tags use newlines
         */
        tag_newline: false,

        /**
         * Should the inner content of Liquid tags use equal spacing
         */
        tag_spacing: true,

        /**
         * Should Liquid tags apply whitespace dashes
         */
        tag_whitespace: 'ignore'

      }

    },

    /**
     * Associated Tags - Shipping as default additional tags
     */
    associateTags: [
      {
        language: 'javascript',
        kind: 'html',
        name: 'script',
        type: 'associate'
      },
      {
        language: 'json',
        kind: 'html',
        type: 'associate',
        name: 'script',
        attr: 'application\\/json'
      },
      {
        language: 'json',
        kind: 'html',
        type: 'associate',
        name: 'script',
        attr: 'application\\/ld\\+json'
      },
      {
        language: 'css',
        kind: 'html',
        type: 'associate',
        name: 'style'
      }
    ],

    languageRules: {

      /**
       * PrettyDiff options the HTML/Liquid language
       *
       * @type {object}
       */
      html: {

        mode: 'beautify',
        end_quietly: 'log',
        node_error: 'log',
        language_name: 'HTML/Liquid',
        language: 'html',
        language_default: 'liquid',
        lexer: 'markup',
        new_line: true,
        space_close: false,
        indent_size: 2,
        indent_level: 0,
        preserve: 2,
        preserve_comment: true,
        comment_line: true,
        comments: true,
        preserve_text: true,
        correct: false

      },

      /**
       * PrettyDiff options the JavaScript language
       *
       * @type {object}
       */
      javascript: {

        mode: 'beautify',
        end_quietly: 'log',
        node_error: 'log',
        language_name: 'JavaScript',
        language: 'javascript',
        lexer: 'script',
        new_line: true,
        indent_size: 2,
        preserve: 2

      },

      /**
       * PrettyDiff options the JSON language
       *
       * @type {object}
       */
      json: {

        mode: 'beautify',
        end_quietly: 'log',
        node_error: 'log',
        language_name: 'JSON',
        language: 'json',
        lexer: 'script',
        no_semicolon: true,
        new_line: true,
        indent_size: 2,
        indent_level: 0,
        preserve: 1

      },

      /**
       * PrettyDiff options the SCSS language
       *
       * @type {object}
       */
      scss: {

        mode: 'beautify',
        end_quietly: 'log',
        node_error: 'log',
        language_name: 'SASS',
        language: 'scss',
        lexer: 'style',
        new_line: true,
        indent_size: 2,
        indent_level: 0,
        preserve: 1

      },

      /**
       * PrettyDiff options the CSS language
       *
       * @type {object}
       */
      css: {

        mode: 'beautify',
        end_quietly: 'log',
        node_error: 'log',
        language_name: 'CSS',
        language: 'css',
        lexer: 'style',
        new_line: true,
        indent_level: 0,
        indent_size: 2,
        preserve: 1

      }
    }

  }

  /**
  * Validation Rules - The default rule options which are executed
  *
  * @type {ValidationRules}
  */
  validations = {

    tag: {

      /**
       * Validates start and end tag existence, For example,
       * a tag like `{% capture %}` requires the `{% endcapture %}` tag.
       */
      pair: true,

      /**
       * Validates the placement position of tags. For example,
       * the `{% when %}` tag must be nested within the `{% case %}` tag.
       */
      placement: true,

      /**
       * Validates if the tag accepts whitespace dash `-` attribute
       * values, For example, `{%- tag -%}`.
       */
      whitespace: true,

      /**
       * Validates if a tag can span multiple lines or just a single line
       * For example, `{%- \n tag \n -%}` is invalid when set to `true`.
       */
      newline: true

    },

    control: {
      /**
       * Validates condition values used on control flow type tags,
       * verifies their validity and if they can be used or not.
       */
      condition: true,

      /**
       * Validates the conditional operator values, in control tags.
       * For example,  `!=`, `and` will be validated
       */
      operator: true

    },

    iteration: {

      /**
       * Validates the iteration tag type operator value, For example,
       * the `in` contained within `{% for tag in tags %}`
       */
      operator: true,

      /**
       * Validates iteration parameter values, For example, the `reverse`
       * within `{% for tag in tags reversed %}` is validated
       */
      parameter: true,

      /**
       * Validates iteration iteree value, check to see if its an existing value,
       * For example, `{% for tag in tag %}` would be invalid
       */
      iteree: true

    },

    object: {

      /**
       * Validates object tag names. For example, The `{{ sitez.prop }}` tag
       * would be invalid as `sitez` is not a known object.
       */
      name: true,

      /**
       * Validates object propery existense and value, For example, `{{ tag. }}`
       * would fail and `{{ object.does_not_exist }}` would aswell.
       */
      property: true

    },

    filter: {

      /**
       * Validates the existence of tag filters. For example, `{{ tag | }}` or
       * `{% if tag | %}` would both be invalid.
       */
      existence: true,

      /**
       * Validates filter parameters. For example, `{{ tag | replace }}`
       * would be invalid as `replace` requires parameters.
       */
      parameter: true

    }
  }

}
