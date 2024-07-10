import '@mantine/core/styles.css'
import ReactDOM from 'react-dom/client'
import { createTheme, Container, MantineProvider, Center, Stack } from '@mantine/core'
import { AuthenticationForm } from './scenes/auth/AuthenticationForm'
import { AppLogo } from './components/AppLogo'
import { formsPlugin } from 'kea-forms'
import { resetContext } from 'kea'

resetContext({ plugins: [formsPlugin] })

export function App() {
  const theme = createTheme({
    fontFamily: '"Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif'
  })

  return (
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <Container size="responsive">
        <Center style={{ height: '100vh' }}>
          <Stack align="center">
            <AppLogo />
            <AuthenticationForm />
          </Stack>
        </Center>
      </Container>
    </MantineProvider >
  )
}

ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)
  .render(<App />)