import { Text, Title, Loader, Center, Table, Stack, Flex, Button, Paper, Anchor } from "@mantine/core";
import { useValues, useActions, BindLogic } from 'kea'
import { SceneExport } from '../sceneTypes'

import { campaignLogic, CampaignProps } from './campaignLogic'
import { router } from "kea-router";
import { urls } from "../urls";
import { formatDate } from "../../lib/date";


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
    return (
        <BindLogic logic={campaignLogic} props={{}}>
            <CampaignsScene />
        </BindLogic>
    )
}

function CampaignsScene() {
    const { campaign, campaignLoading } = useValues(campaignLogic)
    const { push } = useActions(router)

    return (
        <Stack>
            <Stack>
                <Flex justify="space-between" align="center">
                    <Title>Campaigns</Title>
                    <Button onClick={() => didClickAddCampaign()}>Add Campaign</Button>
                </Flex>
                <Text size="sm">Campaigns allow your to filter users and test different paywalls to those users when they trigger events in your apps.</Text>
            </Stack>
            {
                campaignLoading ? (
                    <Center style={{ height: '100vh' }}><Loader color="blue" /></Center>
                ) : campaign ? (
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
                                    <Table.Td><Anchor onClick={() => push(urls.campaign(campaign.id))}>{campaign.name}</Anchor></Table.Td>
                                    <Table.Td>{formatDate(campaign.created_at)}</Table.Td>
                                </Table.Tr>
                            </Table.Tbody>
                        </Table>
                    </Paper>
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