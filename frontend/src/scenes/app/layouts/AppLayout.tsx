import { useValues } from 'kea'
import { AppShell, Burger, Button, Container, Flex, Group, Text } from '@mantine/core'
import { IconChevronDown } from '@tabler/icons-react'
import { useDisclosure } from '@mantine/hooks'
import AppNavigation from '../navigation/Navigation'
import AppLogo from '../../components/AppLogo'

import { Notifications } from '@mantine/notifications'
import classes from '../styles/App.module.css';

import { UserButton } from '../../components/UserButton'
import ProjectsCombobox from '../../projects/ProjectsCombobox'
import { urls } from '../../urls'
import { userLogic } from '../../userLogic'
import { A, router } from 'kea-router'
import { sceneLogic } from '../../../sceneLogic'
import { Scene } from '../../sceneTypes'

interface AppLayoutProps {
    children: React.ReactNode
}

const AppLayout = ({ children }: AppLayoutProps): JSX.Element => {
    const [opened, { toggle }] = useDisclosure()
    const { activeScene } = useValues(sceneLogic)
    const { user } = useValues(userLogic)

    return (
        <Container size="responsive">
            <Notifications position="bottom-right" zIndex={1000} />
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
                            <Button
                                key={'dashboard'}
                                onClick={() => router.actions.push(urls.default())}
                                {...(activeScene === Scene.Dashboard ? { variant: 'transparent' } : { variant: 'transparent', color: 'gray.4' })}
                            >
                                Dashboard
                            </Button>
                            <Button
                                key={'customers'}
                                onClick={() => router.actions.push(urls.default())}
                                {...(activeScene === Scene.Customers ? { variant: 'transparent' } : { variant: 'transparent', color: 'gray.4' })}
                            >
                                Customers
                            </Button>
                            <ProjectsCombobox>
                                <Button
                                    key={'customers'}
                                    onClick={() => router.actions.push(urls.default())}
                                    {...(activeScene === Scene.Projects ? { variant: 'transparent' } : { variant: 'transparent', color: 'gray.4' })}
                                >
                                    <Group gap={3}>
                                        Projects
                                        <IconChevronDown size="0.9rem" stroke={1.5} />
                                    </Group>
                                </Button>
                            </ProjectsCombobox>
                        </Group>

                        <Group visibleFrom="sm">
                            <UserButton
                                imageUrl={user?.avatar_url || null}
                                name={user?.name || ""}
                                detail={user?.portal?.name || ""}
                            />
                        </Group>
                    </Flex>
                </AppShell.Header>

                <AppShell.Navbar>
                    <AppNavigation />
                </AppShell.Navbar>

                <AppShell.Main>
                    {children}
                </AppShell.Main>
            </AppShell>
        </Container >
    );
};

export default AppLayout;