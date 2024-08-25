import { useValues } from 'kea'
import { Burger, Button, Flex, Group, Text } from '@mantine/core'
import { IconChevronDown } from '@tabler/icons-react'
import AppLogo from '../../components/AppLogo'
import { UserButton } from '../../components/UserButton'
import { sceneLogic } from '../../../sceneLogic'
import ProjectsCombobox from '../../projects/ProjectsCombobox'
import { urls } from '../../urls'
import { router } from 'kea-router'
import { userLogic } from '../../userLogic'
import { Scene } from '../../sceneTypes'

export default function AppHeader({ opened, toggle }: { opened: boolean; toggle: () => void }) {
    const { activeScene, sceneParams } = useValues(sceneLogic)
    const { user } = useValues(userLogic)

    return (
        <>
            <Flex justify="space-between" align="center" h="100%" pr="md">
                <Group h="100%" px="md">
                    <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                    <AppLogo />
                </Group >

                <Group gap={5} visibleFrom="sm">
                    <Button
                        key={'dashboard'}
                        onClick={() => router.actions.push(urls.default())}
                        {...(activeScene === Scene.Dashboard ? { variant: 'light' } : { variant: 'transparent' })}
                    >
                        <Text>Dashboard</Text>
                    </Button>
                    <Button
                        key={'customers'}
                        onClick={() => router.actions.push(urls.default())}
                        {...(false ? { variant: 'light' } : { variant: 'transparent' })}
                    >
                        <Text>Customers</Text>
                    </Button>
                    <ProjectsCombobox>
                        <Button
                            key={'projects'}
                            {...(sceneParams.params.projectId ? { variant: 'light' } : { variant: 'transparent' })}
                        >
                            <Group gap={3}>
                                <Text>Projects</Text>
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
            </Flex >
        </>
    );
}