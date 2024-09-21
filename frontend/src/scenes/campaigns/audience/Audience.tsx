import { Text, Stack, Group, Title, Button, Divider, NumberInput, Space, Flex, Notification } from '@mantine/core'
import { BindLogic, useActions, useValues } from 'kea'
import { Form, Field } from 'kea-forms'
import { audienceLogic } from './audienceLogic'
import { CampaignAudience } from '../data/CampaignsApiClient'
import QueryBuilder, { formatQuery, defaultOperators, RuleGroupType, RuleType, transformQuery, defaultRuleProcessorJsonLogic, RuleProcessor } from 'react-querybuilder'
import { parseJsonLogic } from 'react-querybuilder/parseJsonLogic'
import { QueryBuilderMantine } from '@react-querybuilder/mantine'
import { IconFilter, IconFlame } from '@tabler/icons-react'
import './QueryBuilder.scss'
import { useState } from 'react'
import { modals } from '@mantine/modals'
import { campaignLogic } from '../campaignLogic'
import jsonLogic from 'json-logic-js'

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
        confirmProps: { color: 'red' },
        centered: true,
        onConfirm: onConfirm
    })
}

function AudienceForm(): JSX.Element {
    const { isAudienceFormSubmitting } = useValues(audienceLogic)
    const { deleteAudience } = useActions(campaignLogic)
    const { audience } = useValues(audienceLogic)
    const initialQuery: RuleGroupType = parseJsonLogic(audience.filters, {
        jsonLogicOperations: {
            semver_gt: val => ({ field: val[1].var, operator: 'semver_gt', value: val[0] }),
            semver_lt: val => ({ field: val[1].var, operator: 'semver_lt', value: val[0] }),
            semver_gte: val => ({ field: val[1].var, operator: 'semver_gte', value: val[0] }),
            semver_lte: val => ({ field: val[1].var, operator: 'semver_lte', value: val[0] }),
            semver_eq: val => ({ field: val[1].var, operator: 'semver_eq', value: val[0] }),
            semver_neq: val => ({ field: val[1].var, operator: 'semver_neq', value: val[0] }),
        },
    })
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
                                onChange(formatQuery(query, {
                                    format: 'jsonlogic',
                                    ruleProcessor: customRuleProcessor
                                }))
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
                    <Text>seconds</Text>
                </Group>
            </Stack>

            <Flex justify="space-between">
                <Button type="submit" radius="md" variant='light' mt="xl" disabled={isAudienceFormSubmitting}>Save</Button>
                <Button radius="md" variant='subtle' mt="xl" color="dimmed" disabled={isAudienceFormSubmitting} onClick={() => { didClickDeleteAudience(() => deleteAudience(audience.id)) }}>Delete Audience</Button>
            </Flex>
        </Form>
    )
}

const customRuleProcessor: RuleProcessor = (rule, options) => {
    switch (rule.operator) {
        case 'semver_gt':
            return { semver_gt: [rule.value, { var: rule.field }] }
        case 'semver_lt':
            return { semver_lt: [rule.value, { var: rule.field }] }
        case 'semver_gte':
            return { semver_gte: [rule.value, { var: rule.field }] }
        case 'semver_lte':
            return { semver_lte: [rule.value, { var: rule.field }] }
        case 'semver_eq':
            return { semver_eq: [rule.value, { var: rule.field }] }
        case 'semver_neq':
            return { semver_neq: [rule.value, { var: rule.field }] }
    }

    return defaultRuleProcessorJsonLogic(rule, options);
}

function AudienceQueryBuilder({ query, onQueryChange }: { query: RuleGroupType, onQueryChange: (value: RuleGroupType) => void }): JSX.Element {
    const validator = (r: RuleType) => !!r.value;
    const fields = [
        {
            name: 'user_time_since_first_seen',
            label: 'Time Since First Seen',
            placeholder: 'Seconds',
            inputType: 'number',
            validator,
        },
        {
            name: 'user_first_seen',
            label: 'User First Seen Date',
            inputType: 'date',
            validator,
        },
        {
            name: 'user_user_type',
            label: 'User Type',
            valueEditorType: 'select',
            defaultValue: 'Anonymous',
            operators: defaultOperators.filter((op) => ['=', '!='].includes(op.name)),
            values: [
                { name: 'Identified', label: 'Identified', value: "Identified" },
                { name: 'Anonymous', label: 'Anonymous', value: "Anonymous" },
            ]
        },
        {
            name: 'user_total_sessions',
            label: 'User Total Sessions',
            placeholder: 'Count of Sessions',
            inputType: 'number',
            validator,
        },
        {
            name: 'user_time_since_last_seen_paywall',
            label: 'User Total Sessions',
            placeholder: 'Seconds',
            inputType: 'number',
            validator,
        },
        {
            name: 'user_total_seen_paywalls',
            label: 'Total Seen Paywalls',
            placeholder: 'Count of Paywalls',
            inputType: 'number',
            validator,
        },
        {
            name: 'user_last_paywall_id',
            label: 'Last Seen Paywall ID',
            placeholder: 'Paywalls ID',
            inputType: 'number',
            validator,
        },
        {
            name: 'session_duration_seconds',
            label: 'Current Session Duration',
            placeholder: 'Session length in Seconds',
            inputType: 'number',
            validator,
        },
        {
            name: 'app_version',
            label: 'App Version',
            placeholder: 'ie. 1.0.0',
            inputType: 'text',
            operators: [
                { name: 'semver_gt', value: 'semver_gt', label: '>' },
                { name: 'semver_lt', value: 'semver_lt', label: '<' },
                { name: 'semver_gte', value: 'semver_gte', label: '>=' },
                { name: 'semver_lte', value: 'semver_lte', label: '<=' },
                { name: 'semver_eq', value: 'semver_eq', label: '==' },
                { name: 'semver_neq', value: 'semver_neq', label: '!=' },
            ],
            validator,
        },
        {
            name: 'app_build_number',
            label: 'App Build Number',
            placeholder: 'Build number',
            inputType: 'number',
            validator,
        },
        {
            name: 'app_namespace',
            label: 'App Bundle ID',
            placeholder: 'com.example.app',
            inputType: 'number',
            validator,
        },
        {
            name: 'device_screen_width',
            label: 'Device Screen Width',
            placeholder: 'Pixels',
            inputType: 'number',
            validator,
        },
        {
            name: 'device_screen_height',
            label: 'Device Screen Height',
            placeholder: 'Pixels',
            inputType: 'number',
            validator,
        },
        {
            name: 'device_os_version',
            label: 'Device OS Version',
            placeholder: 'ie. 1.0.0',
            inputType: 'text',
            operators: [
                { name: 'semver_gt', label: '>' },
                { name: 'semver_lt', label: '<' },
                { name: 'semver_gte`', label: '>=' },
                { name: 'semver_lte`', label: '<=' },
                { name: 'semver_eq`', label: '==' },
                { name: 'semver_neq`', label: '!=' },
            ],
            validator,
        },
        {
            name: 'device_manufacturer',
            label: 'Device Manufacturer',
            valueEditorType: 'select',
            defaultValue: 'Apple',
            operators: defaultOperators.filter((op) => ['=', '!=', 'contains', 'null', 'notNull', 'in', 'notIn'].includes(op.name)),
            values: [
                { name: 'Apple', label: 'Apple', value: 'Apple' },
            ]
        },
        {
            name: 'device_type',
            label: 'Device Type',
            valueEditorType: 'select',
            defaultValue: 'Mobile',
            operators: defaultOperators.filter((op) => ['=', '!=', 'contains', 'null', 'notNull', 'in', 'notIn'].includes(op.name)),
            values: [
                { name: 'Mobile', label: 'Mobile', value: 'Mobile' },
                { name: 'Tablet', label: 'Tablet', value: 'Tablet' },
                { name: 'TV', label: 'TV', value: 'TV' },
                { name: 'CarPlay', label: 'CarPlay', value: 'CarPlay' },
                { name: 'Desktop', label: 'Desktop', value: 'Desktop' },
            ]
        },
        {
            name: 'ios_device_model',
            label: 'iOS Device Model',
            placeholder: 'Raw UIDevice.model',
            inputType: 'text',
        },
        {
            name: 'device_os',
            label: 'Device OS',
            placeholder: 'Device OS',
            inputType: 'text',
        },
        {
            name: 'device_network_mode',
            label: 'Network Mode',
            valueEditorType: 'select',
            defaultValue: 'Wifi',
            operators: defaultOperators.filter((op) => ['=', '!='].includes(op.name)),
            values: [
                { name: 'Wifi', label: 'Wifi', value: 'Wifi' },
                { name: 'Cellular', label: 'Cellular', value: 'Cellular' },
                { name: 'Unknown', label: 'Unknown', value: 'Unknown' },
            ]
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
