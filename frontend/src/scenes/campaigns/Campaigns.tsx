import { Text, Title, Loader, Center, Group, Stack, Flex, Button, Paper, Anchor, Badge, Divider, Grid, Card } from "@mantine/core";
import { useValues, useActions, BindLogic } from 'kea'
import { SceneExport } from '../sceneTypes'
import { modals } from "@mantine/modals"
import { CreateCampaignForm } from './create/CreateCampaignForm'

import campaignsLogic, { CampaignsProps } from './campaignsLogic'
import { router } from "kea-router";
import { urls } from "../urls";
import { IconBolt, IconChevronRight } from "@tabler/icons-react";


interface CampaignsSceneProps {
    projectId?: number
}

export const scene: SceneExport = {
    component: CampaignsScene,
    logic: campaignsLogic,
    paramsToProps: ({ params: { projectId } }: { params: CampaignsSceneProps }): CampaignsProps => ({
        projectId: projectId || 0
    }),
}

function didClickAddCampaign(projectId: number) {
    modals.open({
        title: 'New Campaign',
        children: <CreateCampaignForm projectId={projectId} />
    })
}

function CampaignsScene() {
    const { projectId, campaigns, campaignsLoading } = useValues(campaignsLogic)
    const { push } = useActions(router)

    return (
        <Stack>
            <Stack>
                <Flex justify="space-between" align="center">
                    <Title>Campaigns</Title>
                    <Button onClick={() => didClickAddCampaign(projectId)}>Create Campaign</Button>
                </Flex>
                <Text size="sm">Campaigns allow your to filter users and test different paywalls to those users when they trigger events in your apps.</Text>
            </Stack>
            {
                campaignsLoading ? (
                    <Center style={{ height: '100vh' }}><Loader color="blue" /></Center>
                ) : campaigns.data.length ? (
                    <Grid>
                        {campaigns.data.map((campaign) => (
                            <Grid.Col span={{ base: 12, md: 6 }} key={campaign.id}>
                                <Anchor underline="never" onClick={() => push(urls.campaign(campaign.project_id, campaign.id))}>
                                    <Card shadow="sm" padding="md" radius="md" withBorder>
                                        <Flex align={"center"}>
                                            <Stack w={"100%"} gap={10}>
                                                <Text c={"primary"} fw={600}>{campaign.name}</Text>
                                                {campaign.triggers.length > 0 ? (
                                                    <Group gap={5}>
                                                        {campaign.triggers.filter((trigger) => trigger.is_active).map((trigger) => (
                                                            <Badge key={trigger.id} color="blue" variant="light" radius="md" size="lg" mr={10} leftSection={<IconBolt size={18} />}>
                                                                <Text fw={500} size="xs" style={{ textTransform: 'none' }}><pre>{trigger.event_name}</pre></Text>
                                                            </Badge>
                                                        ))}
                                                    </Group>
                                                ) : (
                                                    <Text size="sm" c="dimmed" style={{ fontStyle: 'italic' }}>No triggers yet</Text>
                                                )}
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
                        <Stack>
                            <Text>No Campaigns yet</Text>
                        </Stack>
                    </Center>
                )
            }
        </Stack >
    )
}