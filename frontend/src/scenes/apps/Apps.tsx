import { Text, Title, Loader, Center, Table, Stack, Flex, Button, Paper, Anchor } from "@mantine/core";
import { useValues, useActions, BindLogic } from 'kea'
import { SceneExport } from '../sceneTypes'

import appsLogic from './appsLogic'
import { router } from "kea-router";
import { urls } from "../urls";
import { formatDate } from "../../lib/date";

export const scene: SceneExport = {
    component: Apps,
    logic: appsLogic,
}

export function Apps(): JSX.Element {
    return (
        <BindLogic logic={appsLogic} props={{}}>
            <AppsScene />
        </BindLogic>
    )
}

function AppsScene() {
    const { apps, appsLoading } = useValues(appsLogic)
    const { push } = useActions(router)

    return (
        <Stack>
            <Stack>
                <Flex justify="space-between" align="center">
                    <Title>Apps</Title>
                    <Button>New App</Button>
                </Flex>
                <Text size="sm">Create Apps for the applications that are apart of this projects. Apps can be iOS apps that are in production or development. Each app will get it's own API key. You'll then be able to attach app store products to specific apps however you'd like.</Text>
            </Stack>
            {
                appsLoading ? (
                    <Center style={{ height: '100vh' }}><Loader color="blue" /></Center>
                ) : apps.length ? (
                    <Paper radius="md" withBorder style={{ overflow: 'hidden' }}>
                        <Table>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Name</Table.Th>
                                    <Table.Th>Created At</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {apps.map((app) => (
                                    <Table.Tr key={app.id}>
                                        <Table.Td><Anchor>{app.name}</Anchor></Table.Td>
                                        <Table.Td>{formatDate(app.created_at)}</Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    </Paper>
                ) : (
                    <Center>
                        <Stack>
                            <Text>No Apps yet</Text>
                        </Stack>
                    </Center>
                )
            }
        </Stack >
    )
}