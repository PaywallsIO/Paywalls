import { IconSwitchHorizontal, IconLogout, IconReceipt2, IconUsers, IconSettings, IconChartBar, IconLanguage, IconSpeakerphone, IconTemplate, IconHome, IconChevronDown } from '@tabler/icons-react'
import { Group, Title, Avatar, Flex, Anchor, UnstyledButton, Tooltip, Center, Divider } from '@mantine/core'
import classes from './Navigation.module.css'

const tabs = [
    { link: '', label: 'Overview', icon: IconHome },
    { link: '', label: 'Paywalls', icon: IconReceipt2 },
    { link: '', label: 'Templates', icon: IconTemplate },
    { link: '', label: 'Campaigns', icon: IconSpeakerphone },
    { link: '', label: 'Charts', icon: IconChartBar },
    { link: '', label: 'Products', icon: IconReceipt2 },
    { link: '', label: 'Users', icon: IconUsers },
    { link: '', label: 'Localization', icon: IconLanguage }
]

export default function AppNavigation() {
    const links = tabs.map((item) => (
        <a
            className={classes.link}
            href={item.link}
            key={item.label}
            {...(item.label === 'Paywalls' && { 'data-active': true })}
        >
            <item.icon className={classes.linkIcon} stroke={1.5} />
            <span>{item.label}</span>
        </a>
    ));

    return (
        <nav className={classes.navbar}>
            <div className={classes.navbarHeader}>
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
            </div>

            <Divider mt={"lg"} />

            <div className={classes.navbarMain}>{links}</div>

            <div className={classes.footer}>
                <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
                    <IconSwitchHorizontal className={classes.linkIcon} stroke={1.5} />
                    <span>Change account</span>
                </a>

                <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
                    <IconLogout className={classes.linkIcon} stroke={1.5} />
                    <span>Logout</span>
                </a>
            </div>
        </nav>
    )
}