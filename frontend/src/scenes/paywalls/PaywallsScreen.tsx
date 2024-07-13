import { Text, Title, Loader, Center, Table, Stack, Flex, Button, Paper } from "@mantine/core";
import { useValues } from 'kea'
import paywallsLogic from './paywallsLogic'

export function PaywallsScreen() {
    const { paywalls, paywallsLoading } = useValues(paywallsLogic)
    return (
        <Stack>
            <Flex justify="space-between" align="center">
                <Stack>
                    <Title>Paywalls</Title>
                    <Text>Manage your paywalls below or add a new one</Text>
                </Stack>
                <Button>Add Paywall</Button>
            </Flex>
            {
                paywallsLoading ? (
                    <Center style={{ height: '100vh' }}><Loader color="blue" /></Center>
                ) : (
                    <Paper radius="md" withBorder style={{ overflow: 'hidden' }}>
                        <Table>
                            <Table.Thead bg={"var(--mantine-color-dark-6)"}>
                                <Table.Tr>
                                    <Table.Th>Name</Table.Th>
                                    <Table.Th>Created At</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {paywalls.map((paywall) => (
                                    <Table.Tr>
                                        <Table.Td>{paywall.name}</Table.Td>
                                        <Table.Td>{paywall.created_at}</Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    </Paper>
                )
            }
        </Stack >
    )
}