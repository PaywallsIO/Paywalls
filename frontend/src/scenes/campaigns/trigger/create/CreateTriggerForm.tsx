import { useValues } from 'kea'
import { Stack, TextInput, Button } from '@mantine/core'
import { Form, Field } from 'kea-forms'
import { createTriggerLogic, CreateTriggerProps } from './createTriggerLogic'
import { IconBolt } from '@tabler/icons-react'

export function CreateTriggerForm(props: CreateTriggerProps): JSX.Element {
    const { isCreateTriggerFormSubmitting } = useValues(createTriggerLogic)

    return (
        <>
            <Form logic={createTriggerLogic} props={props} formKey="createTriggerForm" enableFormOnSubmit>
                <Stack>
                    <Field name="event_name">
                        {({ value, onChange }) => (
                            <TextInput
                                required
                                data-autofocus
                                label="Event Name"
                                placeholder="Event Name"
                                leftSection={<IconBolt size={16} />}
                                radius="md"
                                value={value}
                                onChange={(e) => onChange(e.currentTarget.value)}
                            />
                        )}
                    </Field>
                </Stack>

                <Button type="submit" mt="xl" disabled={isCreateTriggerFormSubmitting}>Create Trigger</Button>
            </Form>
        </>
    )
}