import { useActions, useValues } from 'kea'
import { Text, Button, Combobox, Input, InputBase, Loader, useCombobox } from '@mantine/core'
import { Form, Field } from 'kea-forms'

import { attachCampaignPaywallLogic, AttachCampaignPaywallProps } from './attachCampaignPaywallLogic'
import { Paywall } from '../../paywalls/data/PaywallsApiClient'
import { useState } from 'react'
import { useDebouncedCallback } from '@mantine/hooks'

export function AttachCampaignPaywallForm({ props }: { props: AttachCampaignPaywallProps }): JSX.Element {
    const logic = attachCampaignPaywallLogic(props)
    const { searchPaywalls } = useActions(logic)
    const { isAttachCampaignPaywallFormSubmitting, paywallsLoading, paywalls } = useValues(logic)
    const [search, setSearch] = useState('');

    const handleSearch = useDebouncedCallback(searchPaywalls, 250)

    const combobox = useCombobox({
        onDropdownClose: () => {
            combobox.resetSelectedOption()
            combobox.focusTarget()
            setSearch('');
        },

        onDropdownOpen: () => {
            combobox.focusSearchInput()
        },
    });

    return (
        <>
            <Form logic={attachCampaignPaywallLogic} props={props} formKey="attachCampaignPaywallForm" enableFormOnSubmit>
                <Input.Wrapper label="Choose a paywall">
                    <Field name="paywallId">
                        {({ value, onChange }) => (
                            <Combobox
                                store={combobox}
                                withinPortal={true}
                                onOptionSubmit={(val) => {
                                    onChange(val)
                                    combobox.closeDropdown()
                                }}
                            >
                                <Combobox.Target>
                                    <InputBase
                                        component="button"
                                        type="button"
                                        pointer
                                        rightSection={paywallsLoading ? <Loader size={18} /> : <Combobox.Chevron />}
                                        onClick={() => combobox.toggleDropdown()}
                                        rightSectionPointerEvents="none"
                                    >
                                        {value || <Input.Placeholder>Choose a paywall</Input.Placeholder>}
                                    </InputBase>
                                </Combobox.Target>

                                <Combobox.Dropdown>
                                    <Combobox.Search
                                        value={search}
                                        onChange={(event) => {
                                            setSearch(event.currentTarget.value)
                                            handleSearch(event.currentTarget.value)
                                        }}
                                        placeholder="Search paywalls"
                                    />
                                    <Combobox.Options>
                                        {paywallsLoading ? <Combobox.Empty>Loading....</Combobox.Empty> : paywalls.data.length > 0 ? (
                                            paywalls.data.map((paywall: Paywall) => (
                                                <Combobox.Option disabled={props.currentPaywallIds.includes(paywall.id)} value={paywall.name} key={paywall.id}>
                                                    <Text fz="sm" fw={500}>
                                                        {paywall.name}
                                                    </Text>
                                                    {props.currentPaywallIds.includes(paywall.id) && <Text fz="xs" c="dimmed">Already attached to Campaign</Text>}
                                                </Combobox.Option>
                                            ))
                                        ) : (
                                            <Combobox.Empty>No results found</Combobox.Empty>
                                        )}
                                    </Combobox.Options>
                                </Combobox.Dropdown>
                            </Combobox>
                        )}
                    </Field>
                </Input.Wrapper>

                <Button type="submit" mt="xl" disabled={isAttachCampaignPaywallFormSubmitting || !logic.values.isAttachCampaignPaywallFormValid}>Attach Paywall</Button>
            </Form>
        </>
    )
}