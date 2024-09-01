import { IconSwitchHorizontal, IconLogout, IconReceipt2, IconUsers, IconSettings, IconChartBar, IconLanguage, IconSpeakerphone, IconTemplate, IconChevronDown, IconShoppingCart, IconDevices, IconLifebuoy } from '@tabler/icons-react'
import { Group, Title, Avatar, Flex, UnstyledButton, Center, Divider } from '@mantine/core'
import classes from './Navigation.module.css'
import { A } from 'kea-router';
import { urls } from '../../urls';
import { sceneLogic } from '../../../sceneLogic';
import { useActions, useValues } from 'kea';
import { userLogic } from '../../userLogic';
import ProjectsCombobox from '../../projects/ProjectsCombobox';
import { Project } from '../../projects/ProjectsData';

export default function ProjectNavigation() {
    const { activeScene } = useValues(sceneLogic)
    const { logout } = useActions(userLogic)

    const project = {
        id: 1,
        name: 'Demo Project',
        avatar_url: 'https://www.appatar.io/com.apple.Music',

    }

    const tabs = [
        { link: urls.apps(project.id), label: 'Apps', scenes: ['Apps'], icon: IconDevices },
        { link: urls.paywalls(project.id), label: 'Paywalls', scenes: ['Paywalls'], icon: IconReceipt2 },
        { link: urls.campaigns(project.id), label: 'Campaigns', scenes: ['Campaigns', 'Campaign'], icon: IconSpeakerphone },
        { link: '', label: 'Charts', scenes: ['Charts'], icon: IconChartBar },
        { link: '', label: 'Products', scenes: ['Products'], icon: IconShoppingCart },
        { link: '', label: 'Users', scenes: ['AppUsers'], icon: IconUsers },
        { link: '', label: 'Localization', scenes: ['Localization'], icon: IconLanguage },
        { link: '', label: 'Settings', scenes: ['Settings'], icon: IconSettings }
    ]

    const links = tabs.map((item) => (
        <A
            className={classes.link}
            href={item.link}
            key={item.label}
            {...(activeScene && item.scenes.includes(activeScene) && { 'data-active': true })}
        >
            <item.icon className={classes.linkIcon} stroke={1.5} />
            <span>{item.label}</span>
        </A>
    ));

    return (
        <nav className={classes.navbar}>
            <div className={classes.navbarHeader}>
                <ProjectsCombobox>
                    <UnstyledButton component="button" w={"100%"} variant="transparent">
                        <Flex gap={"xs"}>
                            <Group w={"100%"}>
                                <Avatar
                                    src={project.avatar_url}
                                    size="md"
                                    radius="md"
                                />
                                <Title order={5}>{project.name}</Title>
                            </Group>

                            <Center><IconChevronDown color="var(--mantine-color-gray-filled)" /></Center>
                        </Flex>
                    </UnstyledButton>
                </ProjectsCombobox>
            </div>

            <Divider mt={"lg"} />

            <div className={classes.navbarMain}>{links}</div>

            <div className={classes.footer}>
                <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
                    <IconLifebuoy className={classes.linkIcon} stroke={1.5} />
                    <span>Support</span>
                </a>

                <a href="#" className={classes.link} onClick={() => logout()}>
                    <IconLogout className={classes.linkIcon} stroke={1.5} />
                    <span>Logout</span>
                </a>
            </div>
        </nav>
    )
}