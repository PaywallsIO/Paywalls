import { useValues } from 'kea'
import { Stack, TextInput, Button } from '@mantine/core'
import { Form, Field } from 'kea-forms'

import createPaywallLogic from './createPaywallLogic'

export function CreatePaywallForm(): JSX.Element {
    const { isCreatePaywallFormSubmitting } = useValues(createPaywallLogic)

    return (
        <>
            <Form logic={createPaywallLogic} formKey="createPaywallForm" enableFormOnSubmit>
                <Stack>
                    <Field name="name">
                        {({ value, onChange }) => (
                            <TextInput
                                required
                                label="Name"
                                placeholder="My new Paywall"
                                radius="md"
                                value={value}
                                onChange={(e) => onChange(e.currentTarget.value)}
                            />
                        )}
                    </Field>
                </Stack>

                <Button type="submit" mt="xl" disabled={isCreatePaywallFormSubmitting}>Create Paywall</Button>
            </Form>
        </>
    )
}