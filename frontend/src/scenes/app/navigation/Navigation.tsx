import { IconSwitchHorizontal, IconLogout, IconReceipt2, IconUsers, IconSettings, IconChartBar, IconLanguage, IconSpeakerphone, IconTemplate, IconHome, IconChevronDown, IconShoppingCart } from '@tabler/icons-react'
import { Group, Title, Avatar, Flex, UnstyledButton, Center, Divider } from '@mantine/core'
import classes from './Navigation.module.css'
import { A } from 'kea-router';
import { urls } from '../../urls';
import { sceneLogic } from '../../../sceneLogic';
import { useActions, useValues } from 'kea';
import { userLogic } from '../../userLogic';
import ProjectsCombobox from '../../projects/ProjectsCombobox';

const tabs = [
    { link: urls.default(), label: 'Dashboard', icon: IconHome },
    { link: urls.paywalls(), label: 'Paywalls', icon: IconReceipt2 },
    { link: '', label: 'Templates', icon: IconTemplate },
    { link: '', label: 'Campaigns', icon: IconSpeakerphone },
    { link: '', label: 'Charts', icon: IconChartBar },
    { link: '', label: 'Products', icon: IconShoppingCart },
    { link: '', label: 'People', icon: IconUsers },
    { link: '', label: 'Localization', icon: IconLanguage },
    { link: '', label: 'Settings', icon: IconSettings }
]

export default function AppNavigation() {
    // get current scene
    const { activeScene } = useValues(sceneLogic)
    const { logout } = useActions(userLogic)

    const links = tabs.map((item) => (
        <A
            className={classes.link}
            href={item.link}
            key={item.label}
            {...(item.label === activeScene && { 'data-active': true })}
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