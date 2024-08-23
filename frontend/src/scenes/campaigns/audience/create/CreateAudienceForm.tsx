import { useValues } from 'kea'
import { Stack, TextInput, Button } from '@mantine/core'
import { Form, Field } from 'kea-forms'
import { createAudienceLogic, CreateAudienceProps } from './createAudienceLogic'

export function CreateAudienceForm({ projectId, campaignId }: CreateAudienceProps): JSX.Element {
    const audienceLogic = createAudienceLogic({ projectId, campaignId })
    const { isCreateAudienceFormSubmitting } = useValues(audienceLogic)

    return (
        <>
            <Form logic={createAudienceLogic} props={{ projectId, campaignId }} formKey="createAudienceForm" enableFormOnSubmit>
                <Stack>
                    <Field name="name">
                        {({ value, onChange }) => (
                            <TextInput
                                required
                                label="Audience Name"
                                placeholder="Give them a name"
                                radius="md"
                                value={value}
                                onChange={(e) => onChange(e.currentTarget.value)}
                            />
                        )}
                    </Field>
                </Stack>

                <Button type="submit" mt="xl" disabled={isCreateAudienceFormSubmitting}>Let's go!</Button>
            </Form>
        </>
    )
}