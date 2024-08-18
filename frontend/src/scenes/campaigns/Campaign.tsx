import { Text, Title, Loader, Center, Table, Stack, Group, Paper, Anchor, Breadcrumbs, ThemeIcon } from "@mantine/core";
import { useValues, useActions, BindLogic } from 'kea'
import { SceneExport } from '../sceneTypes'

import { campaignLogic, CampaignProps } from './campaignLogic'
import { router } from "kea-router";
import { formatDate } from "../../lib/date";
import { IconChevronLeft } from "@tabler/icons-react";


interface CampaignSceneProps {
    projectId?: number
    campaignId?: number
}

export const scene: SceneExport = {
    component: Campaign,
    logic: campaignLogic,
    paramsToProps: ({ params: { projectId, campaignId } }: { params: CampaignSceneProps }): CampaignProps => ({
        projectId: projectId || 0,
        campaignId: campaignId || 0
    }),
}

export function Campaign(): JSX.Element {
    const { projectId, campaignId } = useValues(campaignLogic)
    return (
        <BindLogic logic={campaignLogic} props={{ projectId, campaignId }}>
            <CampaignsScene {...{ projectId, campaignId }} />
        </BindLogic>
    )
}

function CampaignsScene({ projectId, campaignId }: CampaignProps) {
    const logic = campaignLogic({ projectId, campaignId })
    const { campaign, campaignLoading } = useValues(logic)
    const { push } = useActions(router)

    return (
        <Stack>
            {
                campaignLoading ? (
                    <Center style={{ height: '100vh' }}><Loader color="blue" /></Center>
                ) : (
                    <>
                        <Stack>
                            <Breadcrumbs>
                                <Anchor onClick={() => push(`/projects/${projectId}/campaigns`)}>Campaigns</Anchor>
                                <Text>{campaign?.name}</Text>
                            </Breadcrumbs>
                            <Group align="baseline">
                                <Anchor onClick={() => push(`/projects/${projectId}/campaigns`)}>
                                    <ThemeIcon color="blue" variant="light" size="lg">
                                        <IconChevronLeft />
                                    </ThemeIcon>
                                </Anchor>
                                <Title>{campaign?.name}</Title>
                            </Group>
                        </Stack>
                        <Paper radius="md" withBorder style={{ overflow: 'hidden' }}>
                            <Table>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>Name</Table.Th>
                                        <Table.Th>Created At</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    <Table.Tr key={campaign.id}>
                                        <Table.Td>{campaign.name}</Table.Td>
                                        <Table.Td>{formatDate(campaign.created_at)}</Table.Td>
                                    </Table.Tr>
                                </Table.Tbody>
                            </Table>
                        </Paper>
                    </>
                )
            }
        </Stack >
    )
}