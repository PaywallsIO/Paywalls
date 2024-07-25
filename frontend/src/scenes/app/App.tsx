import { BindLogic, useMountedLogic, useValues } from 'kea'
import { AppShell, Burger, Container, Group, LoadingOverlay, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import AppNavigation from './navigation/Navigation'
import AppLogo from '../components/AppLogo'

import { sceneLogic } from '../../sceneLogic'
import { appScenes } from '../appScenes'
import { appLogic } from './appLogic'
import { Notifications } from '@mantine/notifications'

import { userLogic } from '../userLogic'

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
    const [opened, { toggle }] = useDisclosure()
    const { activeScene, activeLoadedScene, sceneParams, params, loadedScenes, sceneConfig } = useValues(sceneLogic)
    const { user } = useValues(userLogic)

    const notificationsElement = (
        <Notifications position="bottom-right" zIndex={1000} />
    )

    let sceneElement: JSX.Element
    if (activeScene && activeScene in loadedScenes) {
        const { component: SceneComponent } = loadedScenes[activeScene]
        sceneElement = <SceneComponent {...params} />
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

    if (!user || sceneConfig?.layout == 'plain') {
        return (
            <>
                {wrappedSceneElement}
                {notificationsElement}
            </>
        )
    }

    return (
        <Container size="responsive">
            {notificationsElement}
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
        </Container>
    )
}