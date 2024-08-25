import { useValues } from 'kea'
import { Stack, TextInput, Button } from '@mantine/core'
import { Form, Field } from 'kea-forms'
import { createEditAudienceLogic, CreateEditAudienceProps } from './createEditAudienceLogic'

export function CreateEditAudienceForm(props: CreateEditAudienceProps): JSX.Element {
    const audienceLogic = createEditAudienceLogic(props)
    const { isCreateEditAudienceFormSubmitting } = useValues(audienceLogic)

    return (
        <>
            <Form logic={createEditAudienceLogic} props={props} formKey="createEditAudienceForm" enableFormOnSubmit>
                <Stack>
                    <Field name="name">
                        {({ value, onChange }) => (
                            <TextInput
                                required
                                data-autofocus
                                label="Audience Name"
                                placeholder="Audience Name"
                                radius="md"
                                value={value}
                                onChange={(e) => onChange(e.currentTarget.value)}
                            />
                        )}
                    </Field>
                </Stack>

                <Button type="submit" mt="xl" disabled={isCreateEditAudienceFormSubmitting}>{props.isEditing ? 'Save' : 'Create'} Audience</Button>
            </Form>
        </>
    )
}