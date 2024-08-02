import { BindLogic, useMountedLogic, useValues } from 'kea'
import { Menu, Center, AppShell, Burger, Container, Flex, Group, LoadingOverlay, Avatar, Combobox } from '@mantine/core'
import { IconChevronDown, IconChevronsDown } from '@tabler/icons-react'
import { useDisclosure } from '@mantine/hooks'
import AppNavigation from './navigation/Navigation'
import AppLogo from '../components/AppLogo'

import { sceneLogic } from '../../sceneLogic'
import { appScenes } from '../appScenes'
import { appLogic } from './appLogic'
import { Notifications } from '@mantine/notifications'
import classes from './App.module.css';

import { userLogic } from '../userLogic'
import { UserButton } from '../components/UserButton'
import ProjectsCombobox from '../projects/ProjectsCombobox'

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

const links = [
    { link: '/', label: 'Dashboard' },
    { link: '/customers', label: 'Customers' },
    {
        link: '/projects',
        label: 'Projects',
        links: [
            { link: '/faq', label: 'Progress Pic' },
            { link: '/demo', label: 'Book a demo' },
            { link: '/forums', label: 'Forums' },
        ],
    },
]

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

    const items = links.map((link) => {
        const menuItems = link.links?.map((item) => (
            <Menu.Item key={item.link}>{item.label}</Menu.Item>
        ));

        if (menuItems) {
            return (
                <Menu key={link.label} trigger="hover" transitionProps={{ exitDuration: 0 }} withinPortal>
                    <Menu.Target>
                        <a
                            href={link.link}
                            className={classes.link}
                            onClick={(event) => event.preventDefault()}
                        >
                            <Center>
                                <span className={classes.linkLabel}>{link.label}</span>
                                <IconChevronDown size="0.9rem" stroke={1.5} />
                            </Center>
                        </a>
                    </Menu.Target>
                    <Menu.Dropdown>{menuItems}</Menu.Dropdown>
                </Menu>
            );
        }

        return (
            <a
                key={link.label}
                href={link.link}
                className={classes.link}
                onClick={(event) => event.preventDefault()}
            >
                {link.label}
            </a>
        );
    })

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
                    <Flex justify="space-between" align="center" h="100%" pr="md">
                        <Group h="100%" px="md">
                            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                            <AppLogo />
                        </Group>

                        <Group gap={5} visibleFrom="sm">
                            <a
                                href={'/dashboard'}
                                className={classes.link}
                                onClick={(event) => event.preventDefault()}
                            >
                                Dashboard
                            </a>
                            <a
                                href={'/customers'}
                                className={classes.link}
                                onClick={(event) => event.preventDefault()}
                            >
                                Customers
                            </a>
                            <ProjectsCombobox>
                                <a
                                    href="#"
                                    className={classes.link}
                                >
                                    <Group gap={3}>
                                        Projects
                                        <IconChevronDown size="0.9rem" stroke={1.5} />
                                    </Group>
                                </a>
                            </ProjectsCombobox>
                        </Group>

                        <Group visibleFrom="sm">
                            <UserButton
                                imageUrl={user?.avatar_url || null}
                                name={user?.name}
                                detail={user?.portal?.name}
                            />
                        </Group>
                    </Flex>
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