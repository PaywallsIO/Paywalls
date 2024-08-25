import { IconSwitchHorizontal, IconLogout, IconReceipt2, IconUsers, IconSettings, IconChartBar, IconLanguage, IconSpeakerphone, IconTemplate, IconHome, IconChevronDown, IconShoppingCart, IconDevices } from '@tabler/icons-react'
import { Group, Title, Avatar, Flex, UnstyledButton, Center, Divider } from '@mantine/core'
import classes from './Navigation.module.css'
import { A } from 'kea-router';
import { urls } from '../../urls';
import { sceneLogic } from '../../../sceneLogic';
import { useActions, useValues } from 'kea';
import { userLogic } from '../../userLogic';
import ProjectsCombobox from '../../projects/ProjectsCombobox';

export default function ProjectNavigation() {
    const { activeScene, sceneParams } = useValues(sceneLogic)
    const { logout } = useActions(userLogic)

    const tabs = [
        { link: urls.apps(sceneParams.params.projectId), label: 'Apps', scenes: ['Apps'], icon: IconDevices },
        { link: urls.paywalls(sceneParams.params.projectId), label: 'Paywalls', scenes: ['Paywalls'], icon: IconReceipt2 },
        { link: '', label: 'Templates', scenes: ['Templates'], icon: IconTemplate },
        { link: urls.campaigns(sceneParams.params.projectId), label: 'Campaigns', scenes: ['Campaigns', 'Campaign'], icon: IconSpeakerphone },
        { link: '', label: 'Charts', scenes: ['Charts'], icon: IconChartBar },
        { link: '', label: 'Products', scenes: ['Products'], icon: IconShoppingCart },
        { link: '', label: 'People', scenes: ['People'], icon: IconUsers },
        { link: '', label: 'Localization', scenes: ['Localization'], icon: IconLanguage },
        { link: '', label: 'Settings', scenes: ['Settings'], icon: IconSettings }
    ]

    const links = tabs.map((item) => (
        <A
            className={classes.link}
            href={item.link}
            key={item.label}
            {...(item.scenes.includes(activeScene) && { 'data-active': true })}
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
                                    src="https://www.appatar.io/com.legacybits.ProgressPicRelease/small"
                                    size="md"
                                    radius="md"
                                />
                                <Title order={5}>ProgressPic</Title>
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
                    <IconSwitchHorizontal className={classes.linkIcon} stroke={1.5} />
                    <span>Change account</span>
                </a>

                <a href="#" className={classes.link} onClick={() => logout()}>
                    <IconLogout className={classes.linkIcon} stroke={1.5} />
                    <span>Logout</span>
                </a>
            </div>
        </nav>
    )
}