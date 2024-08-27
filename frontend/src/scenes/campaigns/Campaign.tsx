import { rem, Text, Title, Loader, Center, Table, Stack, Group, Paper, Anchor, Breadcrumbs, ThemeIcon, Grid, Badge, Spoiler, Flex, Box, Button, Tooltip, Space, Collapse, Blockquote, Input } from "@mantine/core";
import { useValues, useActions, BindLogic } from 'kea'
import { SceneExport } from '../sceneTypes'
import { useDisclosure } from '@mantine/hooks'
import cx from 'clsx'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { IconArrowBack, IconChevronDown, IconChevronRight, IconGripVertical, IconInfoCircle, IconPencil, IconPlus } from '@tabler/icons-react'
import { campaignLogic, CampaignProps } from './campaignLogic'
import { router } from "kea-router"
import classes from './Campaign.module.scss'
import { IconBolt, IconChevronLeft, IconPlayerPause, IconPlayerPauseFilled, IconPlayerPlayFilled, IconTrash, IconUsers } from "@tabler/icons-react"
import { CampaignAudience, CampaignTrigger } from "./data/CampaignsApiClient"
import { Audience } from "./audience/Audience"
import { modals } from "@mantine/modals"
import { CreateEditAudienceForm } from "./audience/create/CreateEditAudienceForm"
import 'react-querybuilder/dist/query-builder.scss';
import { CreateTriggerForm } from "./trigger/create/CreateTriggerForm";

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
            <CampaignScene {...{ projectId, campaignId }} />
        </BindLogic>
    )
}

function didClickCreateTrigger(projectId: number, campaignId: number, completion: () => void) {
    modals.open({
        title: 'Create Trigger',
        children: <CreateTriggerForm projectId={projectId} campaignId={campaignId} completion={completion} />
    })
}

function didClickDeleteTrigger(onConfirm: () => void) {
    modals.openConfirmModal({
        title: 'Delete Trigger',
        children: <Text size="sm">Are you sure you want to delete this trigger?</Text>,
        labels: { confirm: 'Delete', cancel: 'Cancel' },
        confirmProps: { color: 'red' },
        centered: true,
        onConfirm: onConfirm
    })
}

function didClickCreateAudience(projectId: number, campaignId: number, completion: () => void) {
    modals.open({
        title: 'Create Audience',
        children: <CreateEditAudienceForm isEditing={false} projectId={projectId} campaignId={campaignId} completion={completion} />
    })
}

function didClickEditAudience(projectId: number, campaignId: number, audience: CampaignAudience, completion: () => void) {
    modals.open({
        title: 'Edit Audience',
        children: <CreateEditAudienceForm isEditing={true} projectId={projectId} campaignId={campaignId} audience={audience} completion={completion} />
    })
}

function CampaignScene({ projectId, campaignId }: CampaignProps) {
    const logic = campaignLogic({ projectId, campaignId })
    const { loadCampaign } = useActions(logic)
    const { updateTrigger, deleteTrigger } = useActions(campaignLogic)
    const { campaign, campaignLoading } = useValues(logic)
    const { push } = useActions(router)

    return (
        <BindLogic logic={campaignLogic} props={{ projectId, campaignId }}>
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

                            <Flex mb={0} gap={5} align={"center"}>
                                <IconBolt size={22} />
                                <Title order={4} w={"100%"}>Triggers</Title>
                                <Tooltip label="Create trigger">
                                    <Button variant="light" radius="lg" size="compact-md" onClick={() => didClickCreateTrigger(projectId, campaignId, loadCampaign)}>
                                        <IconPlus />
                                    </Button>
                                </Tooltip>
                            </Flex>


                            {campaign.triggers.length > 0 ? (
                                <Group gap={10}>
                                    {
                                        campaign.triggers.map((trigger: CampaignTrigger) => (
                                            <Badge key={trigger.id} color="blue" variant={trigger.is_active ? "light" : "default"} radius="lg" size="xl" rightSection={(
                                                <>
                                                    {trigger.is_active ? (
                                                        <Tooltip label="Pause trigger">
                                                            <Button variant="transparent" className={classes.pausePlayButton} size="compact-xs" onClick={() => updateTrigger({ triggerId: trigger.id, request: { is_active: false } })}>
                                                                <IconPlayerPauseFilled style={{ width: rem(15), height: rem(15) }} />
                                                            </Button>
                                                        </Tooltip>
                                                    ) : (
                                                        <Tooltip label="Resume triggering for users">
                                                            <Button variant="transparent" className={classes.pausePlayButton} size="compact-xs" onClick={
                                                                () => updateTrigger({ triggerId: trigger.id, request: { is_active: true } })
                                                            }>
                                                                <IconPlayerPlayFilled style={{ width: rem(15), height: rem(15) }} />
                                                            </Button>
                                                        </Tooltip>
                                                    )}
                                                    <Tooltip label="Delete trigger">
                                                        <Button variant="transparent" p={0} className={classes.deleteButton} size="compact-xs" onClick={
                                                            () => didClickDeleteTrigger(() => deleteTrigger(trigger.id))
                                                        }>
                                                            <IconTrash style={{ width: rem(15), height: rem(15) }} />
                                                        </Button>
                                                    </Tooltip>

                                                </>
                                            )}>
                                                <Text fw={500} size="xs" style={{ textTransform: 'none' }}><pre>{trigger.event_name}</pre></Text>
                                            </Badge>
                                        ))
                                    }
                                </Group>
                            ) : (
                                <>
                                    <Stack align="center">
                                        <Title order={3}>No Triggers Yet</Title>
                                        <Button onClick={() => didClickCreateTrigger(projectId, campaignId, loadCampaign)}>
                                            Create Trigger
                                        </Button>
                                    </Stack>
                                </>
                            )}

                            <Space />

                            <Flex mb={0} gap={5} align={"center"}>
                                <IconUsers size={22} />
                                <Title order={4} w={"100%"}>Audiences</Title>
                                <Tooltip label="New Audience">
                                    <Button variant="light" radius="lg" size="compact-md" onClick={() => didClickCreateAudience(projectId, campaignId, loadCampaign)}>
                                        <IconPlus />
                                    </Button>
                                </Tooltip>
                            </Flex>

                            <Text>Create audiences with filters and an optional match limit. Audiences will be evaludated in order from top to bottom. The first matching audience will be used. In that sense it is better to put more specific audiences first. For example, you would place an audience that matches users in the United States before matching users in North America (because United States is a part of North America).</Text>

                            {
                                campaign.audiences.length ? (
                                    <Audiences audiences={campaign.audiences} projectId={projectId} />
                                ) : (
                                    <Stack align="center">
                                        <Title order={3}>No Audiences Yet</Title>
                                        <Button onClick={() => didClickCreateAudience(projectId, campaignId, loadCampaign)}>
                                            Create Audience
                                        </Button>
                                    </Stack>
                                )
                            }
                        </>
                    )
                }
            </Stack>
        </BindLogic>
    )
}

function Audiences({ projectId, audiences }: { projectId: number, audiences: CampaignAudience[] }): JSX.Element {
    const { updateSortOrder } = useActions(campaignLogic)

    const items = audiences.map((audience, index) => (
        <AudienceDraggable key={audience.id} index={index} audience={audience} projectId={projectId} />
    ));

    return (
        <DragDropContext
            onDragEnd={
                ({ destination, source }) => {
                    const updatedItems = reorder(audiences, source.index, destination?.index || 0);

                    updateSortOrder({
                        audiences: updatedItems.map((audience, index) => {
                            return { id: audience.id, sort_order: index }
                        }),
                    })
                }
            }
        >
            <Droppable droppableId="dnd-list" direction="vertical">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        {items}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    )
}

function AudienceDraggable({ index, projectId, audience }: { index: number, projectId: number, audience: CampaignAudience }): JSX.Element {
    const [opened, { toggle }] = useDisclosure(false)
    const { loadCampaign } = useActions(campaignLogic)

    return (
        <Draggable key={audience.id} index={index} draggableId={audience.name}>
            {(provided, snapshot) => (
                <Paper
                    shadow="md" mb="sm" radius="md" p="sm" withBorder
                    className={cx(classes.item, { [classes.itemDragging]: snapshot.isDragging })}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                >
                    <Anchor underline="never" onClick={toggle}>
                        <Flex align="center" onClick={toggle}>
                            <Button variant="transparent">
                                {opened ? <IconChevronDown /> : <IconChevronRight />}
                            </Button>
                            <Group w={"100%"} gap={3} className={classes.audienceTitle}>
                                <Title order={4} fw={500}>{audience.name}</Title>
                                <Button variant="transparent" size="compact-xs" onClick={(e) => {
                                    e.stopPropagation()
                                    didClickEditAudience(projectId, audience.campaign_id, audience, loadCampaign)
                                }}>
                                    <IconPencil style={{ width: rem(15), height: rem(15) }} />
                                </Button>
                            </Group>
                            <Tooltip label="Reorder audience">
                                <div {...provided.dragHandleProps} className={classes.dragHandle}>
                                    <IconGripVertical style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
                                </div>
                            </Tooltip>
                        </Flex>
                    </Anchor>

                    <Collapse in={opened}>
                        <Audience audience={audience} projectId={projectId} />
                    </Collapse>
                </Paper>
            )
            }
        </Draggable >
    );
}

export function undoNotificationMessage(title: string, undoAction: () => void): JSX.Element {
    return (
        <Group>
            <Text size="sm">{title}</Text>
            <Button size="xs" onClick={undoAction} leftSection={<IconArrowBack size={14} />}>Undo</Button>
        </Group>
    )
}

const reorder = (list: any[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};