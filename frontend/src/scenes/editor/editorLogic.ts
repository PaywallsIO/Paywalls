import { afterMount, kea, path, actions, defaults } from 'kea'
import { loaders } from 'kea-loaders'
import grapesjs from 'grapesjs';

import type { paywallsLogicType } from './editorLogicType'

const paywallsLogic = kea<paywallsLogicType>([
  path(['scenes', 'editor', 'editorLogic']),
  defaults({}),
  actions({}),
  loaders(({ actions, values }) => ({})),
  afterMount(({ actions }) => {
    var editor = grapesjs.init({
      container: '#gjs',
      storageManager: { type: 'none' },
      components: '<div style="width:300px; min-height:100px; margin: 0 auto"></div>' +
        '<div style="width:400px; min-height:100px; margin: 0 auto"></div>' +
        '<div style="width:500px; min-height:100px; margin: 0 auto"></div>',
      panels: {
        defaults: [{
          id: 'commands',
          buttons: [{
            id: 'smile',
            attributes: { title: "Smile" },
            className: 'button',
            command: 'helloWorld',
          },
          {
            id: 'vis',
            className: 'button',
            command: 'sw-visibility',
            active: true
          }]
        }]
      },
      commands: {

      }
    });
  }),
])

export default paywallsLogic
