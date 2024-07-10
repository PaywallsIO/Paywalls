import { useToggle, upperFirst } from '@mantine/hooks'
import { useForm } from '@mantine/form'
import { Anchor, Button, Checkbox, Group, Paper, PaperProps, Stack, Title, TextInput, Center, PasswordInput } from '@mantine/core'
import { useValues } from 'kea'
import { Form } from 'kea-forms'
import { Field } from '../../components/Field'

import authLogic from './authLogic'

export function AuthenticationForm(props: PaperProps): JSX.Element {
    const [type, toggle] = useToggle(['login', 'register'])
    const { isAuthFormSubmitting } = useValues(authLogic)

    return (
        <Center>
            <Paper shadow="sm" mt="xl" radius="md" p="xl" withBorder {...props}>
                <Title order={2}>
                    {upperFirst(type)}
                </Title>

                <Form logic={authLogic} formKey="authForm" enableFormOnSubmit>
                    <Stack>
                        {type === 'register' && (
                            <Field name="name">
                                <TextInput
                                    required
                                    label="Name"
                                    placeholder="Your name"
                                    radius="md"
                                />
                            </Field>
                        )}

                        <Field name="email">
                            <TextInput
                                required
                                label="Email"
                                placeholder="hello@paywalls.io"
                                radius="md"
                            />
                        </Field>

                        <Field name="password">
                            <PasswordInput
                                required
                                label="Password"
                                placeholder="Your password"
                                radius="md"
                            />
                        </Field>

                        {type === 'register' && (
                            <Field name="terms">
                                <Checkbox label="Terms and conditions" />
                            </Field>
                        )}
                    </Stack>

                    <Group justify="space-between" mt="xl">
                        <Anchor component="button" type="button" c="dimmed" onClick={() => toggle()} size="xs">
                            {type === 'register' ? 'Already have an account? Login' : 'Don’t have an account? Register'}
                        </Anchor>
                        <Button type="submit" disabled={isAuthFormSubmitting}>{upperFirst(type)}</Button>
                    </Group>
                </Form>
            </Paper>
        </Center>
    )
}