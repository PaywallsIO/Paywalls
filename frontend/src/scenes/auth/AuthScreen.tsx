import { Center, Stack } from '@mantine/core'
import AppLogo from '../components/AppLogo'
import AuthenticationForm from './AuthenticationForm'

export default function AuthScreen() {
    return (
        <>
            <Center style={{ height: '100vh' }}>
                <Stack align="center">
                    <AppLogo />
                    <AuthenticationForm />
                </Stack>
            </Center>
        </>
    )
}