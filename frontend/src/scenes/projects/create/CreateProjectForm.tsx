import { useValues } from 'kea'
import { Stack, TextInput, Button } from '@mantine/core'
import { Form, Field } from 'kea-forms'

import createProjectLogic from './createProjectLogic'

export function CreateProjectForm(): JSX.Element {
    const { isCreateProjectFormSubmitting } = useValues(createProjectLogic)

    return (
        <>
            <Form logic={createProjectLogic} formKey="createProjectForm" enableFormOnSubmit>
                <Stack>
                    <Field name="name">
                        {({ value, onChange }) => (
                            <TextInput
                                required
                                label="Name"
                                placeholder="Project Name"
                                radius="md"
                                value={value}
                                onChange={(e) => onChange(e.currentTarget.value)}
                            />
                        )}
                    </Field>
                </Stack>

                <Button type="submit" mt="xl" disabled={isCreateProjectFormSubmitting}>Create Project</Button>
            </Form>
        </>
    )
}