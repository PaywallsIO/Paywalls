import { Text, Title, Loader, Center, Table, Stack, Flex, Button, Paper, Anchor } from "@mantine/core";
import { useValues, useActions, BindLogic } from 'kea'
import { SceneExport } from '../sceneTypes'
import { modals } from "@mantine/modals"
import { CreateCampaignForm } from './create/CreateCampaignForm'

import campaignsLogic, { CampaignsProps } from './campaignsLogic'
import { router } from "kea-router";
import { urls } from "../urls";
import { formatDate } from "../../lib/date";


interface CampaignsSceneProps {
    projectId?: number
}

export const scene: SceneExport = {
    component: Campaigns,
    logic: campaignsLogic,
    paramsToProps: ({ params: { projectId } }: { params: CampaignsSceneProps }): CampaignsProps => ({
        projectId: projectId || 0
    }),
}

export function Campaigns(): JSX.Element {
    return (
        <BindLogic logic={campaignsLogic} props={{}}>
            <CampaignsScene />
        </BindLogic>
    )
}

function didClickAddCampaign() {
    modals.open({
        title: 'New Campaign',
        children: <CreateCampaignForm />
    })
}

function CampaignsScene() {
    const { campaigns, campaignsLoading } = useValues(campaignsLogic)
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
                campaignsLoading ? (
                    <Center style={{ height: '100vh' }}><Loader color="blue" /></Center>
                ) : campaigns.data.length ? (
                    <Paper radius="md" withBorder style={{ overflow: 'hidden' }}>
                        <Table>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Name</Table.Th>
                                    <Table.Th>Created At</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {campaigns.data.map((campaign) => (
                                    <Table.Tr key={campaign.id}>
                                        <Table.Td><Anchor onClick={() => push(urls.campaign(campaign.project_id, campaign.id))}>{campaign.name}</Anchor></Table.Td>
                                        <Table.Td>{formatDate(campaign.created_at)}</Table.Td>
                                    </Table.Tr>
                                ))}
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