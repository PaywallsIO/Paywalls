import { Text, Title, Loader, Center, Table, Stack, Flex, Button, Paper } from "@mantine/core";
import { useValues, BindLogic, useActions } from 'kea'
import { SceneExport } from '../sceneTypes'
import { urls } from '../urls'

import paywallsLogic from './paywallsLogic'
import { router } from "kea-router";

export const scene: SceneExport = {
    component: Paywalls,
    logic: paywallsLogic,
}

export function Paywalls(): JSX.Element {
    return (
        <BindLogic logic={paywallsLogic} props={{}}>
            <PaywallsScene />
        </BindLogic>
    )
}

function PaywallsScene() {
    const { paywalls, paywallsLoading } = useValues(paywallsLogic)
    const { push } = useActions(router)
    return (
        <Stack>
            <Flex justify="space-between" align="center">
                <Stack>
                    <Title>Paywalls</Title>
                    <Text>Manage your paywalls below or add a new one</Text>
                </Stack>
                <Button onClick={() => push(urls.editor())}>Add Paywall</Button>
            </Flex>
            {
                paywallsLoading ? (
                    <Center style={{ height: '100vh' }}><Loader color="blue" /></Center>
                ) : paywalls.length ? (
                    <Paper radius="md" withBorder style={{ overflow: 'hidden' }}>
                        <Table>
                            <Table.Thead>
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
                ) : (
                    <Center>
                        <Stack>
                            <Text>No paywalls found</Text>
                        </Stack>
                    </Center>
                )
            }
        </Stack >
    )
}