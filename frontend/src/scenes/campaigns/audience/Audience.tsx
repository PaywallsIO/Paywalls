import { Text, Stack, Group, Title, Button, Divider, NumberInput, Space, Flex, Notification } from '@mantine/core'
import { BindLogic, useActions, useValues } from 'kea'
import { Form, Field } from 'kea-forms'
import { audienceLogic } from './audienceLogic'
import { CampaignAudience } from '../data/CampaignsApiClient'
import QueryBuilder, { formatQuery, RuleGroupType } from 'react-querybuilder'
import { parseJsonLogic } from 'react-querybuilder/parseJsonLogic'
import { QueryBuilderMantine } from '@react-querybuilder/mantine'
import { IconArrowBackUp, IconFilter, IconFlame, IconTrack } from '@tabler/icons-react'
import './QueryBuilder.scss'
import { useState } from 'react'
import { modals } from '@mantine/modals'
import { campaignLogic } from '../campaignLogic'

export function Audience({ projectId, audience }: { projectId: number, audience: CampaignAudience }): JSX.Element {
    return (
        <BindLogic logic={audienceLogic} props={{ projectId, audience }}>
            <AudienceForm />
        </BindLogic>
    )
}

function didClickDeleteAudience(onConfirm: () => void) {
    modals.openConfirmModal({
        title: 'Delete Audience',
        children: <Text size="sm">Are you sure you want to delete this audience?</Text>,
        labels: { confirm: 'Delete', cancel: 'Cancel' },
        centered: true,
        onConfirm: onConfirm
    })
}

function AudienceForm(): JSX.Element {
    const { isAudienceFormSubmitting } = useValues(audienceLogic)
    const { deleteAudience } = useActions(campaignLogic)
    const { audience } = useValues(audienceLogic)
    const initialQuery: RuleGroupType = parseJsonLogic(audience.filters)
    const [query, setQuery] = useState(initialQuery);

    return (
        <Form logic={audienceLogic} formKey="audienceForm" enableFormOnSubmit>
            <Divider my="sm" />
            <Stack>
                <Group gap={5}>
                    <IconFilter size={16} />
                    <Title order={5}>Filters</Title>
                </Group>
                <Text size='sm' c="dimmed">Filter by user properties, device properties, or event properties</Text>

                <Field name="filters">
                    {({ value: queryValue, onChange }: { value: RuleGroupType, onChange: (value: RuleGroupType) => void }) => (
                        <>
                            <AudienceQueryBuilder query={query} onQueryChange={(query) => {
                                setQuery(query)
                                onChange(formatQuery(query, 'jsonlogic'))
                            }} />
                        </>
                    )}
                </Field>

                <Space />

                <Group gap={5}>
                    <IconFlame size={16} />
                    <Title order={5}>Match Limit</Title>
                </Group>
                <Text size='sm' c="dimmed">The amount of times in which a user can match this audience for a given time period</Text>
                <Group>
                    <Text>up to</Text>
                    <Field name="match_limit">
                        {({ value, onChange }) => (
                            <NumberInput
                                variant='filled'
                                min={0}
                                placeholder="Match limit"
                                radius="md"
                                value={value}
                                onChange={(e) => onChange(e)}
                                w={150}
                            />
                        )}
                    </Field>
                    <Text>times every</Text>
                    <Field name="match_period">
                        {({ value, onChange }) => (
                            <NumberInput
                                variant='filled'
                                min={0}
                                placeholder="Match period"
                                radius="md"
                                value={value}
                                onChange={(e) => onChange(e)}
                                w={150}
                            />
                        )}
                    </Field>
                    <Text>hours</Text>
                </Group>
            </Stack>

            <Flex justify="space-between">
                <Button type="submit" radius="md" variant='light' mt="xl" disabled={isAudienceFormSubmitting}>Save</Button>
                <Button radius="md" variant='subtle' mt="xl" color="dimmed" disabled={isAudienceFormSubmitting} onClick={() => { didClickDeleteAudience(() => deleteAudience(audience.id)) }}>Delete Audience</Button>
            </Flex>
        </Form>
    )
}

function AudienceQueryBuilder({ query, onQueryChange }: { query: RuleGroupType, onQueryChange: (value: RuleGroupType) => void }): JSX.Element {
    const fields = [
        {
            name: 'firstName',
            label: 'First Name',
            placeholder: 'Enter first name',
        },
    ]

    return (
        <QueryBuilderMantine>
            <QueryBuilder
                fields={fields}
                query={query}
                onQueryChange={onQueryChange}
                controlClassnames={{ queryBuilder: 'queryBuilder-branches' }}
            />
        </QueryBuilderMantine>
    );
}
