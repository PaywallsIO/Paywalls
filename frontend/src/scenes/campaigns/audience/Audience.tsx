import { Text, Stack, Group, Title, Button, Divider, NumberInput, Space } from '@mantine/core'
import { BindLogic, useValues } from 'kea'
import { Form, Field } from 'kea-forms'
import { audienceLogic } from './audienceLogic'
import { CampaignAudience } from '../data/CampaignsApiClient'
import QueryBuilder, { formatQuery, RuleGroupType } from 'react-querybuilder'
import { parseJsonLogic } from "react-querybuilder/parseJsonLogic";
import { QueryBuilderMantine } from '@react-querybuilder/mantine'
import { IconFilter, IconFlame } from '@tabler/icons-react'

export function Audience({ audience }: { audience: CampaignAudience }): JSX.Element {
    return (
        <BindLogic logic={audienceLogic} props={{ audience }}>
            <AudienceForm />
        </BindLogic>
    )
}

function AudienceForm(): JSX.Element {
    const { isAudienceFormSubmitting } = useValues(audienceLogic)
    return (
        <Form logic={audienceLogic} formKey="audienceForm" enableFormOnSubmit>
            <Divider my="sm" />
            <Stack>
                <Group gap={5}>
                    <IconFilter size={16} />
                    <Title order={5}>Filters</Title>
                </Group>
                <Text size='sm' c="dimmed">Filter this audience by user property, device property, or event property</Text>

                <Field name="filters">
                    {({ value, onChange }) => (
                        <AudienceQueryBuilder query={parseJsonLogic(value)} onChange={onChange} />
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
                    <Field name="matchLimit">
                        {({ value, onChange }) => (
                            <NumberInput
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
                    <Field name="matchPeriod">
                        {({ value, onChange }) => (
                            <NumberInput
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

            <Button type="submit" radius="md" variant='light' mt="xl" disabled={isAudienceFormSubmitting}>Save</Button>
        </Form>
    )
}

function AudienceQueryBuilder({ query, onChange }: { query: RuleGroupType, onChange: (value: RuleGroupType) => void }): JSX.Element {
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
                onQueryChange={(query) => {
                    onChange(formatQuery(query, 'jsonlogic'))
                }}
                controlClassnames={{ queryBuilder: 'queryBuilder-branches' }}
            />
        </QueryBuilderMantine>
    );
}