import { useValues } from 'kea'
import { AppShell, Burger, Button, Container, Flex, Group, Text } from '@mantine/core'
import { IconChevronDown } from '@tabler/icons-react'
import { useDisclosure } from '@mantine/hooks'
import ProjectNavigation from '../navigation/ProjectNavigation'
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
import AppHeader from '../navigation/AppHeader'

interface AppLayoutProps {
    children: React.ReactNode
}

const AppLayout = ({ children }: AppLayoutProps): JSX.Element => {
    const [opened, { toggle }] = useDisclosure()

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
                    <AppHeader opened={opened} toggle={toggle} />
                </AppShell.Header>

                <AppShell.Navbar>
                    <ProjectNavigation />
                </AppShell.Navbar>

                <AppShell.Main>
                    {children}
                </AppShell.Main>
            </AppShell>
        </Container >
    );
};

export default AppLayout;