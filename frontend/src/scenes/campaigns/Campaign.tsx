import { rem, Text, Title, Loader, Center, Image, Stack, Group, Paper, Anchor, Breadcrumbs, ThemeIcon, Grid, Badge, Button, Flex, Box, Tooltip, Space, Collapse, Blockquote, Input, Tabs, Card, NumberInput } from "@mantine/core";
import { useValues, useActions, BindLogic } from 'kea'
import { SceneExport } from '../sceneTypes'
import { Form, Field } from "kea-forms";
import { useDisclosure, useToggle } from '@mantine/hooks'
import cx from 'clsx'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { IconArrowBack, IconCancel, IconCheck, IconChevronDown, IconChevronRight, IconGripVertical, IconInfoCircle, IconPencil, IconPlus, IconReceipt, IconReceipt2 } from '@tabler/icons-react'
import { campaignLogic, CampaignProps } from './campaignLogic'
import { router } from "kea-router"
import classes from './Campaign.module.scss'
import { IconBolt, IconChevronLeft, IconPlayerPause, IconPlayerPauseFilled, IconPlayerPlayFilled, IconTrash, IconUsers } from "@tabler/icons-react"
import { Campaign as CampaignModel, CampaignAudience, CampaignTrigger } from "./data/CampaignsApiClient"
import { Audience } from "./audience/Audience"
import { modals } from "@mantine/modals"
import { CreateEditAudienceForm } from "./audience/create/CreateEditAudienceForm"
import 'react-querybuilder/dist/query-builder.scss';
import { CreateTriggerForm } from "./trigger/create/CreateTriggerForm";
import { AttachCampaignPaywallForm } from "./attach/AttachCampaignPaywallForm";
import React from "react";

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

function didClickAttachPaywall(projectId: number, campaign: CampaignModel, completion: () => void) {
    const currentPaywallIds = campaign.paywalls.map((paywall) => paywall.id)
    modals.open({
        title: 'Attach Paywall',
        children: <AttachCampaignPaywallForm props={{ projectId, campaignId: campaign.id, currentPaywallIds, completion }} />
    })
}

function didClickEditAudience(projectId: number, campaignId: number, audience: CampaignAudience, completion: () => void) {
    modals.open({
        title: 'Edit Audience',
        children: <CreateEditAudienceForm isEditing={true} projectId={projectId} campaignId={campaignId} audience={audience} completion={completion} />
    })
}

function CampaignScene({ projectId, campaignId }: CampaignProps) {
    const campaignScnenProps = { projectId, campaignId }
    const logic = campaignLogic(campaignScnenProps)
    const { loadCampaign } = useActions(logic)
    const { updateTrigger, deleteTrigger } = useActions(campaignLogic)
    const { campaign, campaignLoading, isPaywallPercentageFormSubmitting } = useValues(logic)
    const { push } = useActions(router)
    const [isPaywallEditMode, togglePaywallEditMode] = useToggle();

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

                            <Tabs defaultValue="triggers_audiences">
                                <Tabs.List>
                                    <Tabs.Tab value="triggers_audiences" leftSection={<IconBolt size={14} />}>Triggers & Audiences</Tabs.Tab>
                                    <Tabs.Tab value="paywalls" leftSection={<IconReceipt2 size={14} />}>Paywalls</Tabs.Tab>
                                </Tabs.List>

                                <Tabs.Panel value="triggers_audiences">
                                    <Stack mt={20}>
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
                                                            <Text fw={500} size="xs" style={{ textTransform: 'none', fontFamily: 'monospace' }}>{trigger.event_name}</Text>
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
                                    </Stack>
                                </Tabs.Panel>
                                <Tabs.Panel value="paywalls">
                                    <Form logic={campaignLogic} props={campaignScnenProps} formKey="paywallPercentageForm" enableFormOnSubmit>
                                        <Stack>
                                            <Flex mb={0} gap={5} align={"center"} mt={20}>
                                                <IconReceipt2 size={22} />
                                                <Title order={4} style={{ flexGrow: 1 }}>Paywalls</Title>
                                                {isPaywallEditMode ? (
                                                    <>
                                                        <Button variant="light" color={"red"} radius="lg" size="compact-md" leftSection={<IconCancel size={18} />} onClick={() => togglePaywallEditMode()}>
                                                            <Text fw={400}>Cancel</Text>
                                                        </Button>
                                                        <Button type="submit" variant="light" radius="lg" size="compact-md" disabled={isPaywallPercentageFormSubmitting} leftSection={<IconCheck size={18} />} onClick={() => togglePaywallEditMode()}>
                                                            <Text fw={400}>Save</Text>
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Tooltip label="Edit Attached Paywalls">
                                                            <Button variant="light" radius="lg" size="compact-md" leftSection={<IconPencil size={18} />} onClick={() => togglePaywallEditMode()}>
                                                                <Text fw={400}>Edit</Text>
                                                            </Button>
                                                        </Tooltip>
                                                        <Tooltip label="Attach Paywall">
                                                            <Button variant="light" radius="lg" size="compact-md" onClick={() => didClickAttachPaywall(projectId, campaign, loadCampaign)}>
                                                                <IconPlus />
                                                            </Button>
                                                        </Tooltip>
                                                    </>
                                                )}
                                            </Flex>

                                            {campaign.paywalls.length ? (
                                                <Grid>
                                                    {campaign.paywalls.map((paywall, index) => (
                                                        <Grid.Col span={{ base: 12, md: 4 }} key={paywall.id}>
                                                            <Card shadow="sm" padding="lg" radius="md" withBorder>
                                                                <Stack align="center">
                                                                    <Stack align="center" gap={0}>
                                                                        <Title order={4}>{paywall.name}</Title>
                                                                        {isPaywallEditMode ? (
                                                                            <Field name={`paywalls.${index}.percentage`} template={({ label, kids, error }) => {
                                                                                return (
                                                                                    <>
                                                                                        <Input.Wrapper className={classes.paywallPercentageInputWrapper} data-error={error ? true : false}>
                                                                                            <Center>
                                                                                                {kids as any}
                                                                                            </Center>
                                                                                            <Center>
                                                                                                {error && <Text c="red" size="sm">{error}</Text>}
                                                                                            </Center>
                                                                                        </Input.Wrapper>
                                                                                    </>
                                                                                )
                                                                            }}>
                                                                                {({ value, onChange }) => (
                                                                                    <Group gap={3}>
                                                                                        <NumberInput
                                                                                            variant="filled"
                                                                                            size="sm"
                                                                                            radius="md"
                                                                                            hideControls={true}
                                                                                            w={"100px"}
                                                                                            min={0}
                                                                                            max={100}
                                                                                            value={value}
                                                                                            onChange={(value) => onChange(value)}
                                                                                        />
                                                                                        <Text c={"blue"} fw={800} fs={"sm"}>%</Text>
                                                                                    </Group>
                                                                                )}
                                                                            </Field>
                                                                        ) : (
                                                                            <Text c={"blue"} fw={800} fs={"sm"}>Show to {paywall.pivot.percentage}% of users</Text>
                                                                        )}
                                                                    </Stack>
                                                                    <Box mah={"350px"}>
                                                                        <Image src={paywall.preview_image_url} fallbackSrc="https://placehold.co/600x400?text=Placeholder" w={"170px"} h={"350px"} radius="lg" style={{ border: '7px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-9))' }} />
                                                                    </Box>
                                                                </Stack>
                                                            </Card>
                                                        </Grid.Col>
                                                    ))}
                                                </Grid>
                                            ) : (
                                                <Center>
                                                    <Stack align="center">
                                                        <Title order={3}>No Paywalls Attached</Title>
                                                        <Button onClick={() => { }}>
                                                            Attach a Paywall
                                                        </Button>
                                                    </Stack>
                                                </Center>
                                            )}
                                        </Stack>
                                    </Form>

                                </Tabs.Panel>
                            </Tabs>
                        </>
                    )
                }
            </Stack>
        </BindLogic >
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