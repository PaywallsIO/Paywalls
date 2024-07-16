import { BindLogic, useMountedLogic, useValues } from 'kea'
import { AppShell, Burger, Group, LoadingOverlay, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import AppNavigation from './navigation/Navigation'
import AppLogo from '../components/AppLogo'

import { sceneLogic } from '../../sceneLogic'
import { appScenes } from '../appScenes'
import { appLogic } from './appLogic'
import { userLogic } from '../userLogic'
import { Notifications } from '@mantine/notifications'

const Spinner = () => (
    <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />
)


export function App(): JSX.Element | null {
    const { showApp } = useValues(appLogic)
    useMountedLogic(sceneLogic({ scenes: appScenes }))

    return (
        <>
            {showApp ? (
                <AppScene />
            ) : (
                <Spinner />
            )}
        </>
    )
}

function AppScene(): JSX.Element | null {
    const [opened, { toggle }] = useDisclosure()
    const { user } = useValues(userLogic)
    const { activeScene, activeLoadedScene, sceneParams, params, loadedScenes, sceneConfig } = useValues(sceneLogic)

    const notificationsElement = (
        <Notifications position="top-center" zIndex={1000} />
    )

    let sceneElement: JSX.Element
    if (activeScene && activeScene in loadedScenes) {
        const { component: SceneComponent } = loadedScenes[activeScene]
        sceneElement = <SceneComponent user={user} {...params} />
    } else {
        sceneElement = <Spinner />

    }

    const wrappedSceneElement = (
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

    if (!user) {
        return sceneConfig?.onlyUnauthenticated || sceneConfig?.allowUnauthenticated ? (
            <>
                {wrappedSceneElement}
                {notificationsElement}
            </>
        ) : (<Text>Not logged in</Text>)
    }

    return (
        (
            <AppShell
                header={{ height: 60 }}
                navbar={{
                    width: 300,
                    breakpoint: 'sm',
                    collapsed: { mobile: !opened },
                }}
                padding="md"
            >
                <AppShell.Header>
                    <Group h="100%" px="md">
                        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                        <AppLogo />
                    </Group>
                </AppShell.Header>

                <AppShell.Navbar>
                    <AppNavigation />
                </AppShell.Navbar>

                <AppShell.Main>
                    {wrappedSceneElement}
                </AppShell.Main>
            </AppShell>
        )
    )
}