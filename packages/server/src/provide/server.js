// @ts-check

import _ from 'lodash'
import R from 'ramda'
import { readFileSync } from 'fs-extra'
import { basename } from 'path'
import { Config } from './config'
import { Expressions } from '../parser/lexical'
import { regexp } from '../utils/functions'
import * as validations from '../service/validate/index'
import specs from '@liquify/liquid-language-specs'

/**
 * Liquid Language Server
 *
 * @export
 * @typedef {import('vscode-languageserver').InitializeParams} InitializeParams
 * @typedef {import('vscode-languageserver').ServerCapabilities} ServerCapabilities
 * @typedef {import('vscode-languageserver-textdocument').TextDocument} TextDocument
 * @typedef {import('vscode-languageserver').TextEdit} TextEdit
 * @typedef {import('types/specification').Specification} Specification
 * @typedef {import('types/specification').Engine} Engine
 * @class LiquidServer
 * @extends {Config}
 */
export class LiquidServer extends Config {

  /**
   * Configuration - The `onInitialize` event handler.
   *
   * @param {InitializeParams} initializeParams
   * @param {ServerCapabilities} capabilities
   * @memberof LiquidServer
   */
  capabilities ({
    initializationOptions: {
      service = null
      , license = 'sissel siv'
      , rcfile = null
    },
    capabilities: {
      textDocument
      , workspace
    }
  }, capabilities) {

    textDocument.completion.contextSupport = true
    textDocument.completion.completionItem.snippetSupport = true
    textDocument.completion.dynamicRegistration = true

    this.rcfile = rcfile
    this.license = license
    this.service = { ...this.service, ...service }
    this.hasConfigurationCapability = !!(workspace && !!workspace.configuration)
    this.hasWorkspaceFolderCapability = !!(workspace && !!workspace.workspaceFolders)
    this.hasDiagnosticRelatedInformationCapability = !!(
      textDocument &&
      textDocument.publishDiagnostics &&
      textDocument.publishDiagnostics.relatedInformation
    )

    if (this.hasWorkspaceFolderCapability) {
      capabilities.workspace = {
        workspaceFolders: {
          supported: true
        }
      }
    }

    return { capabilities }

  }

  /**
   *
   *
   * @param {string} resource
   * @param {object} connection
   * @returns
   * @memberof LiquidServer
   */
  documents = (resource, connection) => {

    if (!this.hasConfigurationCapability) return Promise.resolve(this.settings)

    let result = this.settings.get(resource)

    if (!result) {

      result = connection.workspace.getConfiguration({
        scopeUri: resource,
        section: 'languageServerExample'
      })

      this.settings.set(resource, result)

    }

    return result

  }

  /**
   * Configure Server Settings
   *
   * @param {object} settings
   * @memberof LiquidServer
   */
  configure (event, settings) {

    /**
     * Configuration changed
     */
    return {
      onDidChangeConfiguration: this.setProviders,
      onDidChangeWatchedFiles: (
        {
          changes: [ { uri } ]
        }
      ) => basename(this.rcfile) !== basename(uri) ? null : this.setUserSettings()

    }[event](settings)

  }

  /**
   * Set Provider Services
   *
   * @private
   * @param {string} rcfile
   */
  setLiquidrc = rcfile => {

    if (!rcfile) return null

    try {

      const read = readFileSync(rcfile).toString()
      const rules = JSON.parse(require('strip-json-comments')(read, {
        whitespace: false
      }))

      return rules

    } catch (error) {

      return console.error(error.toString())

    }

  }

  /**
   * Set Provider Services
   *
   * @private
   * @param {object} liquid
   */
  setProviders = ({ liquid }) => {

    Object.entries(liquid).forEach(([ prop, setting ]) => {
      if (this.provider?.[prop] && setting?.enable) {
        this.provider[prop] = setting.enable
      }
    })

    return this.setUserSettings()

  }

  /**
   * Get User Settings - Reads and parsed the `.liquidrc` file
   * containing user configuration
   *
   * @private
   * @returns
   * @memberof LiquidServer
   */
  setUserSettings = () => {

    const settings = this.setLiquidrc(this.rcfile)

    return this.setLiquidEngine(settings)

  }

  setLiquidEngine = async settings => {

    if (this.engine === settings.engine) return null

    this.engine = settings.engine
    this.engineLabel = `\n${_.upperFirst(this.engine)} Liquid`

    return this.setSpecification(settings)

  }

  /**
   * Set Specification
   *
   * @private
   * @param {object} settings
   * @memberof LiquidServer
   */
  setSpecification = async settings => {

    const spec = await specs(this.license)

    this.specification = spec[this.engine]()

    return this.setFormattingRules(settings)

  }

  /**
   * Diagnostics
   *
   * @private
   * @param {object} settings
   * @memberof Server
   */
  setDiagnosticRules = settings => {

    Object.values(validations).forEach(({
      meta: {
        group,
        rules
      }
    }) => Object.assign(rules, settings.validate[group]))

  }

  /**
   * Formatter - Merges user configuration Config used
   * when formatting is being applied
   *
   * @private
   * @param {object} settings
   * @memberof Config
   */
  setFormattingRules = settings => {

    const enforce = [
      'mode',
      'end_quietly',
      'node_error',
      'language_name',
      'language',
      'lexer',
      'tags',
      'files',
      'format_script',
      'format_style',
      'tag_newline',
      'tag_whitespace',
      'tag_spacing'
    ]

    for (const language in settings.format) {

      const rules = settings.format[language]

      if (rules?.tags) {
        rules.tags.forEach(associate => {
          this.formatRules.associateTags.push({
            ...associate
            , language
            , type: 'associate'
          })
        })
      }

      if (this.formatRules.customRules?.[language]) {
        this.formatRules.customRules[language] = R.pick(
          Object.keys(this.formatRules.customRules[language]),
          rules
        )
      }

      if (this.formatRules.languageRules?.[language]) {
        this.formatRules.languageRules[language] = {
          ...this.formatRules.languageRules[language]
          , ..._.omit(rules, enforce)
          , ...this.formatRules.editorRules
        }
      }
    }

    return this.setParseExpressions(settings)

  }

  /**
   * Set Specification
   *
   * @private
   * @param {Specification} settings
   * @memberof LiquidServer
   */
  setParseExpressions = settings => {

    const { html, blocks, output } = Expressions
    const { objects, filters } = this.specification

    this.parser = {
      ...this.parser,
      parsing: regexp(`${html}|${blocks}|${output}`, 'g'),
      objects: regexp(`\\b(?:${Object.keys(objects).join('|')})\\.?(?:[^\\s\\n]*\\b)?`, 'g'),
      filters: regexp(Object.keys(filters).join('|'), 'g')
    }

    return this.setDiagnosticRules(settings)

  }

}

// const Server = new LiquidServer()
// Server
// const s = new LanguageServerService()
