import { Text, Title, Loader, Center, Table, Stack, Flex, Button, Paper, Anchor } from "@mantine/core";
import { useValues, useActions, BindLogic } from 'kea'
import { SceneExport } from '../sceneTypes'
import { modals } from "@mantine/modals"
import { CreatePaywallForm } from './create/CreatePaywallForm'

import { PaywallsProps, paywallsLogic } from './paywallsLogic'
import { router } from "kea-router";
import { urls } from "../urls";
import { formatDate } from "../../lib/date";


interface PaywallsSceneProps {
    projectId?: number
}

export const scene: SceneExport = {
    component: PaywallsScene,
    logic: paywallsLogic,
    paramsToProps: ({ params: { projectId } }: { params: PaywallsSceneProps }): PaywallsProps => ({
        projectId: projectId || 0
    }),
}

function didClickAddPaywall(projectId: number) {
    modals.open({
        title: 'New Paywall',
        children: <CreatePaywallForm projectId={projectId} />
    })
}

function PaywallsScene() {
    const { projectId, paywalls, paywallsLoading } = useValues(paywallsLogic)
    const { push } = useActions(router)

    return (
        <Stack>
            <Stack>
                <Flex justify="space-between" align="center">
                    <Title>Paywalls</Title>
                    <Button onClick={() => didClickAddPaywall(projectId)}>Add Paywall</Button>
                </Flex>
                <Text size="sm">Paywalls are configurable screens that you can build and present to users using triggers in your app. They can be customized and tested to find the best combinations.</Text>
            </Stack>
            {
                paywallsLoading ? (
                    <Center style={{ height: '100vh' }}><Loader color="blue" /></Center>
                ) : paywalls.data.length ? (
                    <Paper radius="md" withBorder style={{ overflow: 'hidden' }}>
                        <Table>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Name</Table.Th>
                                    <Table.Th>Created At</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {paywalls.data.map((paywall) => (
                                    <Table.Tr key={paywall.id}>
                                        <Table.Td><Anchor onClick={() => push(urls.editor(paywall.project_id, paywall.id))}>{paywall.name}</Anchor></Table.Td>
                                        <Table.Td>{formatDate(paywall.created_at)}</Table.Td>
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