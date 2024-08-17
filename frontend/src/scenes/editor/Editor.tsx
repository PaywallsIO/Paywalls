import { useValues, useActions } from 'kea'
import { SceneExport } from '../sceneTypes'
import { grapesjs, Editor as GrapesJsEditorType } from 'grapesjs'
import GjsEditor from '@grapesjs/react'
import grapesjsPresetWebpage from 'grapesjs-preset-webpage'
import grapesjsBlocksBasic from 'grapesjs-blocks-basic'
import grapesjsStyleBg from 'grapesjs-style-bg'
// @ts-ignore
import grapesjsTabs from 'grapesjs-tabs'

import { editorLogic, EditorProps } from './editorLogic'
import { LoadingOverlay } from '@mantine/core'

import 'grapesjs/dist/css/grapes.min.css'
import 'grapick/dist/grapick.min.css';
import './editor.scss'

interface EditorSceneProps {
    projectId?: number
    paywallId?: number
}

export const scene: SceneExport = {
    component: EditorScene,
    logic: editorLogic,
    paramsToProps: ({ params: { projectId, paywallId } }: { params: EditorSceneProps }): EditorProps => ({
        // @davidmoreen is there no better way than defaulting to 0?
        projectId: projectId || 0,
        paywallId: paywallId || 0
    }),
}

export function EditorScene(): JSX.Element {
    const { paywallId, projectId, paywall } = useValues(editorLogic)
    return (
        !paywall ? (
            <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />
        ) : (
            <Editor paywallId={paywallId} projectId={projectId} />
        )
    )
}

function Editor({ projectId, paywallId }: EditorProps) {
    const logic = editorLogic({ projectId, paywallId })
    const { paywall } = useValues(logic)
    const { storePaywall, publishPaywall } = useActions(logic)

    const onEditor = (editor: GrapesJsEditorType) => {
        editor.Storage.add('remote', {
            async load() {
                return paywall
            },
            async store(data) {
                return storePaywall(data)
            }
        })

        editor.Panels.addButton('options', {
            id: 'publish',
            togglable: false,
            command: 'publish-paywall',
            label: 'Publish',
            attributes: { title: 'Publish' },
        });

        editor.Commands.add('publish-paywall', {
            run(editor) {
                publishPaywall({
                    html: editor.getHtml(),
                    css: editor.getCss() || "",
                    js: editor.getJs()
                })
            },
        });
    }

    return (
        <>
            <GjsEditor
                grapesjs={grapesjs}
                onEditor={onEditor}
                options={{
                    plugins: [
                        grapesjsBlocksBasic,
                        grapesjsTabs,
                        grapesjsStyleBg,
                        grapesjsPresetWebpage
                    ],
                    pluginsOpts: {
                        ['grapesjs-preset-webpage']: {

                        }
                    },
                    selectorManager: { componentFirst: true },
                    height: '100vh',
                    storageManager: {
                        type: 'remote',
                        autosave: true,
                        stepsBeforeSave: 1,
                        options: {
                            remote: {
                                onLoad: result => result.content,
                            }
                        }
                    },
                }}
            />
        </>
    )
}