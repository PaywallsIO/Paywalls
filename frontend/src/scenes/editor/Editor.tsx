import { Text } from "@mantine/core";
import { useValues, BindLogic } from 'kea'
import { SceneExport } from '../sceneTypes'
import grapesjs from "grapesjs"
import 'grapesjs/dist/css/grapes.min.css'
import { useEffect } from "react";

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
    useEffect(() => {
        grapesjs.init({
            container: '#gjs',
            components: '<div class="txt-red">Hello world!</div>',
            style: '.txt-red{color: red}',
        })
    })

    return (
        <div><div id="gjs"></div></div>
    )
}