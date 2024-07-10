import { Flex, Title } from '@mantine/core'
import { IconReceipt2 } from '@tabler/icons-react'

export function AppLogo() {
    return (
        <Flex
            align="center"
            gap="xs"
        >
            <IconReceipt2 stroke={1.5} />
            <Title order={3}>
                Paywalls
            </Title>
        </Flex>
    )
}