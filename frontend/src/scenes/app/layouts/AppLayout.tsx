import { AppShell, Burger, Button, Container, Flex, Group, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import ProjectNavigation from '../navigation/ProjectNavigation'

import { Notifications } from '@mantine/notifications'
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

                <AppShell.Main>
                    {children}
                </AppShell.Main>
            </AppShell>
        </Container >
    );
};

export default AppLayout;