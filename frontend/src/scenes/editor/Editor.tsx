import { Text } from "@mantine/core";
import { useValues, BindLogic } from 'kea'
import { SceneExport } from '../sceneTypes'
import 'grapesjs/dist/css/grapes.min.css';

import editorLogic from './editorLogic'

export const scene: SceneExport = {
    component: Editor,
    logic: editorLogic,
}

export function Editor(): JSX.Element {
    return (
        <BindLogic logic={editorLogic} props={{}}>
            <EditorScene />
        </BindLogic>
    )
}

function EditorScene() {
    return (
        <div id="gjs"></div>
    )
}