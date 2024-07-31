import { Text, Title, Loader, Center, Table, Stack, Flex, Button, Paper, Anchor } from "@mantine/core";
import { useValues, useActions, BindLogic } from 'kea'
import { SceneExport } from '../sceneTypes'
import { modals } from "@mantine/modals"
import { CreatePaywallForm } from './create/CreatePaywallForm'

import paywallsLogic from './paywallsLogic'
import { router } from "kea-router";
import { urls } from "../urls";

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

function didClickAddPaywall() {
    modals.open({
        title: 'New Paywall',
        children: <CreatePaywallForm />
    })
}

function PaywallsScene() {
    const { paywalls, paywallsLoading } = useValues(paywallsLogic)
    const { push } = useActions(router)

    return (
        <Stack>
            <Stack>
                <Flex justify="space-between" align="center">
                    <Title>Paywalls</Title>
                    <Button onClick={() => didClickAddPaywall()}>Add Paywall</Button>
                </Flex>
                <Text size="sm">Paywalls are configurable screens that you can build and present to users using triggers in your app. They can be customized and tested to find the best combinations.</Text>
            </Stack>
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
                                    <Table.Tr key={paywall.id}>
                                        <Table.Td><Anchor onClick={() => push(urls.editor(paywall.id))}>{paywall.name}</Anchor></Table.Td>
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