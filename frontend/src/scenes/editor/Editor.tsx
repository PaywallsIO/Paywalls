import { useValues, BindLogic } from 'kea'
import { SceneExport } from '../sceneTypes'
import grapesjs from "grapesjs"
import 'grapesjs/dist/css/grapes.min.css'
import { useEffect } from "react";

import { editorLogic, EditorProps } from './editorLogic'
import { api } from '../../lib/api';

interface EditorSceneProps {
    id?: string
}

export const scene: SceneExport = {
    component: Editor,
    logic: editorLogic,
    paramsToProps: ({ params: { id } }: { params: EditorSceneProps }): EditorProps => ({
        id: id || ''
    }),
}

export function Editor(): JSX.Element {
    return (
        <BindLogic logic={editorLogic} props={{}}>
            <EditorScene />
        </BindLogic>
    )
}

function EditorScene() {
    const { paywallId, version } = useValues(editorLogic)
    useEffect(() => {
        if (paywallId && version) {
            initGrapes(paywallId, version)
        }
    }, [paywallId, version])
    return (
        <div><div id="gjs"></div></div>
    )
}

function initGrapes(paywallId: string | number, version: number) {
    const editor = grapesjs.init({
        container: '#gjs',
        components: '<div class="txt-red">Hello world!</div>',
        style: '.txt-red{color: red}',
        storageManager: {
            type: 'remote',
            autosave: true,
            stepsBeforeSave: 1,
            options: {
                remote: {
                    onLoad: result => result.content,
                }
            }
        }
    })

    editor.Storage.add('remote', {
        async load() {
            return await api.paywalls.getPaywall(paywallId)
        },
        async store(data) {
            return await api.paywalls.updateContent({
                id: paywallId,
                data: {
                    version,
                    content: data
                }
            })
        }
    })
}