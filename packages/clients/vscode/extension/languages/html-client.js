import { extensions } from 'vscode'
import { LanguageClient } from 'vscode-languageclient'
import path from 'path'
import fs from 'fs'
import { activateTagClosing } from '../providers/tag-close'

const getPkgJson = extension => {
  const read = fs.readFileSync(path.join(extension, 'package.json')).toString()
  try {
    return JSON.parse(read).main
  } catch (e) {
    console.log(`Problems reading ${extension}: ${e}`)
    return {}
  }
}

/**
 * HTML Language Client
 *
 * References the VS Code language server
 *
 * @export
 * @param {options}
 */
export default ({
  documentSelector,
  outputChannel
},
subscriptions) => {

  /**
   * HTML Features VSCode Extension
   */
  const { extensionPath } = extensions.getExtension('vscode.html-language-features')
  const HTMLmodule = path.join(extensionPath, 'server', 'dist', 'node', 'htmlServerMain.js')

  console.log(HTMLmodule)
  /**
   * HTML Server Options
   *
   * @type { import("vscode-languageclient").ServerOptions }
   */
  const server = {
    run: {
      module: HTMLmodule,
      transport: 1
    },
    debug: {
      module: HTMLmodule,
      transport: 1
    }
  }

  /**
   * HTML Client Options
   *
   * @type { import("vscode-languageclient").LanguageClientOptions }
   */
  const client = {
    documentSelector,
    outputChannel,
    synchronize: {
      configurationSection: [
        'html',
        'css',
        'javascript'
      ]
    },
    revealOutputChannelOn: 4,
    initializationOptions: {
      dataPaths: [],
      embeddedLanguages: {
        css: true,
        javascript: true
      }
    }
  }

  /**
   * HTML Language Client
   */
  const html = new LanguageClient('html', server, client)

  /**
   * HTML Client Registers
   */
  html.registerProposedFeatures()

  /**
   * HTML Client Disposable
   */
  const dispose = html.start()

  let disposable

  html.onReady().then(() => {

    const tagRequestor = (document, position) => {

      const param = html.code2ProtocolConverter.asTextDocumentPositionParams(
        document,
        position
      )

      return html.sendRequest(TagCloseRequest.type, param)
    }

    disposable = activateTagClosing(tagRequestor, {
      html: true,
      handlebars: false
    }, 'html.autoClosingTags')

    subscriptions.push(disposable)

    const matchingTagPositionRequestor = (document, position) => {

      const param = html.code2ProtocolConverter.asTextDocumentPositionParams(
        document,
        position
      )

      return html.sendRequest(MatchingTagPositionRequest.type, param)

    }

    /*  disposable = activateMirrorCursor(matchingTagPositionRequestor, {
      html: true,
      handlebars: true
    }, 'html.mirrorCursorOnMatchingTag')

    subscriptions.push(disposable) */

    /* disposable = client.onTelemetry(e => {
      if (telemetryReporter) {
        telemetryReporter.sendTelemetryEvent(e.key, e.data)
      }
    }) */

    subscriptions.push(disposable)

  })

  /**
   * Liquid Disposables
   */
  subscriptions.push(dispose)

  return html

}
