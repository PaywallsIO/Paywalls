import { useValues, useActions } from 'kea'
import { SceneExport } from '../sceneTypes'
import { grapesjs, Editor as GrapesJsEditorType } from 'grapesjs'
import GjsEditor from '@grapesjs/react'
import 'grapesjs/dist/css/grapes.min.css'

import { editorLogic, EditorProps } from './editorLogic'
import { Paywall } from '../../types'
import { LoadingOverlay } from '@mantine/core'

interface EditorSceneProps {
    id?: string
}

export const scene: SceneExport = {
    component: EditorScene,
    logic: editorLogic,
    paramsToProps: ({ params: { id } }: { params: EditorSceneProps }): EditorProps => ({
        id: id || ''
    }),
}

export function EditorScene(): JSX.Element {
    const { paywallId, paywallLoading } = useValues(editorLogic)
    return (
        paywallLoading ? (
            <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />
        ) : (
            <Editor id={paywallId} />
        )
    )
}

function Editor({ id }: EditorProps) {
    const logic = editorLogic({ id })
    const { paywall } = useValues(logic)
    const { storePaywall } = useActions(logic)

    const onEditor = (editor: GrapesJsEditorType) => {
        editor.Storage.add('remote', {
            async load() {
                return paywall
            },
            async store(data) {
                return storePaywall(data)
            }
        })
    }

    return (
        <>
            <GjsEditor
                grapesjs={grapesjs}
                onEditor={onEditor}
                options={{
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