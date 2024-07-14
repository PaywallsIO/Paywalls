import { AppShell, Burger, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import AppNavigation from './navigation/Navigation';
import AppLogo from '../components/AppLogo';

export default function AppScreen() {
    const [opened, { toggle }] = useDisclosure();

    return (
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
                    <Burger
                        opened={opened}
                        onClick={toggle}
                        hiddenFrom="sm"
                        size="sm"
                    />
                    <AppLogo />
                </Group>
            </AppShell.Header>

            <AppShell.Navbar>
                <AppNavigation />
            </AppShell.Navbar>

            <AppShell.Main>
                <PaywallsScreen />
            </AppShell.Main>
        </AppShell>
    )
}