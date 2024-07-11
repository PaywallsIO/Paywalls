import { Anchor, Button, Checkbox, Group, Paper, PaperProps, Stack, Title, TextInput, Center, PasswordInput } from '@mantine/core'
import { useValues } from 'kea'
import { Form } from 'kea-forms'
import { Field } from '../../components/Field'

import authLogic from './authLogic'

export function AuthenticationForm(props: PaperProps): JSX.Element {
    const { isAuthFormSubmitting } = useValues(authLogic)

    return (
        <Center>
            <Paper shadow="sm" mt="xl" radius="md" p="xl" miw={400} withBorder {...props}>
                <Title order={2}>
                    Login
                </Title>

                <Form logic={authLogic} formKey="authForm" enableFormOnSubmit>
                    <Stack>
                        <Field name="email">
                            {({ value, onChange }) => (
                                <TextInput
                                    required
                                    label="Email"
                                    placeholder="hello@paywalls.io"
                                    radius="md"
                                    value={value}
                                    onChange={(e) => onChange(e.currentTarget.value)}
                                />
                            )}
                        </Field>

                        <Field name="password">
                            {({ value, onChange }) => (
                                <PasswordInput
                                    required
                                    label="Password"
                                    placeholder="Your password"
                                    radius="md"
                                    value={value}
                                    onChange={(e) => onChange(e.currentTarget.value)}
                                />
                            )}
                        </Field>
                    </Stack>

                    <Button type="submit" mt="xl" disabled={isAuthFormSubmitting}>Login</Button>
                </Form>
            </Paper>
        </Center>
    )
}