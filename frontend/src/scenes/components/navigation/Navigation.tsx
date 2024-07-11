import { IconSwitchHorizontal, IconLogout, IconBellRinging, IconDatabaseImport, IconFingerprint, IconKey, IconMessages, IconMessage2, Icon2fa, IconReceipt2, IconReceiptRefund, IconShoppingCart, IconUsers, IconSettings, IconLicense, IconFileAnalytics } from '@tabler/icons-react'
import { Text, Group, Avatar } from '@mantine/core'
import classes from './Navigation.module.css'

const tabs = [
    { link: '', label: 'Paywalls', icon: IconReceipt2 },
]

export default function AppNavigation() {
    const links = tabs.map((item) => (
        <a
            className={classes.link}
            href={item.link}
            key={item.label}
            data-active={item.label === 'Paywalls'}
        >
            <item.icon className={classes.linkIcon} stroke={1.5} />
            <span>{item.label}</span>
        </a>
    ));

    return (
        <nav className={classes.navbar}>
            <div>
                <Group>
                    <Avatar color="blue" src="https://2.gravatar.com/avatar/b7a9455c36ac35c0c73d4c915c0b803ee36a5aa9bbb28fab968feefbcad29e5b?size=512" />

                    <Text size="sm" className={classes.title} c="dimmed">
                        hello@paywalls.io
                    </Text>
                </Group>
            </div>

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