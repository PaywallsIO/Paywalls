import { Flex, Title } from '@mantine/core'
import { IconReceipt2 } from '@tabler/icons-react'
import { rem } from '@mantine/core'

export default function AppLogo() {
    return (
        <Flex
            align="center"
            gap="xs"
        >
            <IconReceipt2 style={{ width: rem(30), height: rem(30) }} color='#0096FF' stroke={1.5} />
            <Title order={5} style={{ fontWeight: 500, color: "#0096FF" }}>
                Paywalls
            </Title>
        </Flex>
    )
}