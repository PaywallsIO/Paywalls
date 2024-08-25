import { useValues } from 'kea'
import { Stack, TextInput, Button } from '@mantine/core'
import { Form, Field } from 'kea-forms'

import { createCampaignLogic } from './createCampaignLogic'

export function CreateCampaignForm({ projectId }: { projectId: number }): JSX.Element {
    const { isCreateCampaignFormSubmitting } = useValues(createCampaignLogic)

    return (
        <>
            <Form logic={createCampaignLogic} props={{ projectId }} formKey="createCampaignForm" enableFormOnSubmit>
                <Stack>
                    <Field name="name">
                        {({ value, onChange }) => (
                            <TextInput
                                required
                                label="Campaign Name"
                                placeholder="Campaign"
                                radius="md"
                                value={value}
                                onChange={(e) => onChange(e.currentTarget.value)}
                            />
                        )}
                    </Field>
                </Stack>

                <Button type="submit" mt="xl" disabled={isCreateCampaignFormSubmitting}>Create Campaign</Button>
            </Form>
        </>
    )
}