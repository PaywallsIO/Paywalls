import { BindLogic, useMountedLogic, useValues } from 'kea'
import { Menu, Center, AppShell, Burger, Container, Flex, Group, LoadingOverlay, Avatar, Combobox } from '@mantine/core'
import { IconChevronDown, IconChevronsDown } from '@tabler/icons-react'
import { useDisclosure } from '@mantine/hooks'
import ProjectNavigation from './navigation/Navigation'
import AppLogo from '../components/AppLogo'

import { sceneLogic } from '../../sceneLogic'
import { appScenes } from '../appScenes'
import { appLogic } from './appLogic'
import { Notifications } from '@mantine/notifications'
import classes from './App.module.css';

import { userLogic } from '../userLogic'
import { UserButton } from '../components/UserButton'
import ProjectsCombobox from '../projects/ProjectsCombobox'
import { urls } from '../urls'
import ProjectLayout from './layouts/ProjectLayout'
import PlainLayout from './layouts/PlainLayout'
import AppLayout from './layouts/AppLayout'

const Spinner = () => (
    <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />
)

export function App(): JSX.Element | null {
    const { isLoading } = useValues(appLogic)

    return (
        <>
            {isLoading ? (
                <Spinner />
            ) : (
                <AppScene />
            )}
        </>
    )
}

function AppScene(): JSX.Element | null {
    useMountedLogic(sceneLogic({ scenes: appScenes }))
    const { activeScene, activeLoadedScene, sceneParams, params, loadedScenes, sceneConfig } = useValues(sceneLogic)
    const { user } = useValues(userLogic)

    let sceneElement: JSX.Element
    if (activeScene && activeScene in loadedScenes) {
        const { component: SceneComponent } = loadedScenes[activeScene]
        sceneElement = <SceneComponent {...params} />
    } else {
        sceneElement = <Spinner />
    }

    const currentSceneElement = (
        <>
            {activeLoadedScene?.logic ? (
                <BindLogic logic={activeLoadedScene.logic} props={activeLoadedScene.paramsToProps?.(sceneParams) || {}}>
                    {sceneElement}
                </BindLogic>
            ) : (
                sceneElement
            )}
        </>
    )

    if (!user || sceneConfig?.layout == 'plain') {
        return (
            <PlainLayout>
                {currentSceneElement}
            </PlainLayout>
        )
    }

    if (user && sceneConfig?.layout == 'project') {
        return (
            <ProjectLayout>
                {currentSceneElement}
            </ProjectLayout>
        )
    }

    return (
        <AppLayout>
            {currentSceneElement}
        </AppLayout>
    )
}