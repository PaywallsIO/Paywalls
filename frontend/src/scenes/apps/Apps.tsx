import { Text, Title, Loader, Center, Stack, Flex, Button, Badge, Group, Card, Grid, Anchor, Space } from "@mantine/core";
import { useValues, useActions, BindLogic } from 'kea'
import { SceneExport } from '../sceneTypes'

import { AppsProps, appsLogic } from './appsLogic'
import { router } from "kea-router";
import { IconBrandAppleFilled, IconChevronRight } from "@tabler/icons-react";

interface AppsSceneProps {
    projectId?: number
}

export const scene: SceneExport = {
    component: AppsScene,
    logic: appsLogic,
    paramsToProps: ({ params: { projectId } }: { params: AppsSceneProps }): AppsProps => ({
        // @davidmoreen is there no better way than defaulting to 0?
        projectId: projectId || 0
    }),
}

function AppsScene() {
    const { apps, appsLoading } = useValues(appsLogic)
    const { push } = useActions(router)

    return (
        <Stack>
            <Stack>
                <Flex justify="space-between" align="center">
                    <Title>Apps</Title>
                    <Button>Create App</Button>
                </Flex>
                <Text size="sm">Create Apps for the applications that are apart of this projects. Apps can be iOS apps that are in production or development. Each app will get its own API key. You'll then be able to attach app store products to specific apps however you'd like.</Text>
            </Stack>
            {
                appsLoading ? (
                    <Center style={{ height: '100vh' }}><Loader color="blue" /></Center>
                ) : apps.data.length ? (
                    <Grid>
                        {apps.data.map((app) => (
                            <Grid.Col span={{ base: 12, md: 6 }} key={app.id}>
                                <Anchor underline="never" onClick={() => { }}>
                                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                                        <Flex gap={20} align="center">
                                            <IconBrandAppleFilled />
                                            <Stack gap={0} w={"100%"}>
                                                <Text fw={500}>{app.name}</Text>
                                                <Text size="xs" c="dimmed">{app.bundle_id}</Text>
                                            </Stack>
                                            <IconChevronRight color="var(--mantine-color-dimmed)" />
                                        </Flex>
                                    </Card>
                                </Anchor>
                            </Grid.Col>
                        ))}
                    </Grid>
                ) : (
                    <Center>
                        <Stack align="center">
                            <Title order={3}>No Apps Yet</Title>
                            <Button onClick={() => { }}>
                                Create App
                            </Button>
                        </Stack>
                    </Center>
                )
            }
        </Stack >
    )
}