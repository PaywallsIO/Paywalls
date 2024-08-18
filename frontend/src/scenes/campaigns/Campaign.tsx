import { rem, Text, Title, Loader, Center, Table, Stack, Group, Paper, Anchor, Breadcrumbs, ThemeIcon, Grid, Badge, Spoiler, Flex, Box, Button, Tooltip, Space, Collapse, Blockquote } from "@mantine/core";
import { useValues, useActions, BindLogic } from 'kea'
import { SceneExport } from '../sceneTypes'
import { useDisclosure, useListState } from '@mantine/hooks'
import cx from 'clsx';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { IconChevronDown, IconChevronRight, IconGripVertical, IconInfoCircle } from '@tabler/icons-react';


import { campaignLogic, CampaignProps } from './campaignLogic'
import { router } from "kea-router";
import classes from './Campaign.module.scss'
import { IconBolt, IconChevronLeft, IconPlayerPause, IconPlayerPauseFilled, IconPlayerPlayFilled, IconTrash, IconUsers } from "@tabler/icons-react";
import { CampaignAudience } from "./data/CampaignsApiClient";


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

function CampaignScene({ projectId, campaignId }: CampaignProps) {
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

                        <Group mb={0} gap={5}>
                            <IconBolt size={22} />
                            <Title order={4}>Triggers</Title>
                        </Group>

                        <Group gap={10}>
                            {campaign.triggers.map((trigger) => (
                                <Badge key={trigger.id} color="blue" variant={trigger.is_active ? "light" : "default"} radius="lg" size="xl" rightSection={(
                                    <>
                                        {trigger.is_active ? (
                                            <Tooltip label="Pause trigger">
                                                <Button variant="transparent" className={classes.pausePlayButton} size="compact-xs">
                                                    <IconPlayerPauseFilled style={{ width: rem(15), height: rem(15) }} />
                                                </Button>
                                            </Tooltip>
                                        ) : (
                                            <Tooltip label="Resume triggering for users">
                                                <Button variant="transparent" className={classes.pausePlayButton} size="compact-xs">
                                                    <IconPlayerPlayFilled style={{ width: rem(15), height: rem(15) }} />
                                                </Button>
                                            </Tooltip>
                                        )}
                                        <Tooltip label="Delete trigger">
                                            <Button variant="transparent" p={0} className={classes.deleteButton} size="compact-xs">
                                                <IconTrash style={{ width: rem(15), height: rem(15) }} />
                                            </Button>
                                        </Tooltip>

                                    </>
                                )}>
                                    <Text fw={500} size="xs">{trigger.event_name}</Text>
                                </Badge>
                            ))}
                        </Group>

                        <Space />

                        <Group mb={0} gap={5}>
                            <IconUsers size={22} />
                            <Title order={4}>Audiences</Title>
                        </Group>

                        <Text>Create audiences with filters and an optional match limit. Audiences will be evaludated in order from top to bottom. The first matching audience will be used. In that sense it is better to put more permissive audiences first. For example, you would place an audience that matches users in the United States before matching users in North America (because United States is a part of North America).</Text>

                        <Audiences audiences={campaign.audiences} />
                    </>
                )
            }
        </Stack >
    )
}

function Audiences({ audiences }: { audiences: CampaignAudience[] }): JSX.Element {
    const [state, handlers] = useListState(audiences);

    const items = state.map((audience, index) => (
        <AudienceDraggable key={audience.id} index={index} audience={audience} />
    ));

    return (
        <DragDropContext
            onDragEnd={({ destination, source }) =>
                handlers.reorder({ from: source.index, to: destination?.index || 0 })
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

function AudienceDraggable({ key, index, audience }: { key: number, index: number, audience: CampaignAudience }): JSX.Element {
    const [opened, { toggle }] = useDisclosure(false);

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
                            <Stack w={"100%"}>
                                <Title order={4} fw={500}>Hello world </Title>
                            </Stack>
                            <div {...provided.dragHandleProps} className={classes.dragHandle}>
                                <IconGripVertical style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
                            </div>
                        </Flex>
                    </Anchor>

                    <Collapse in={opened}>
                        <Text>Hello world</Text>
                    </Collapse>
                </Paper>
            )
            }
        </Draggable >
    );
}