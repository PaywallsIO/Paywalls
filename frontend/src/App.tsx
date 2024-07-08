import '@mantine/core/styles.css'
import ReactDOM from 'react-dom/client'
import { useActions, useValues } from 'kea'
import { appLogic } from './logic/appLogic'
import { createTheme, Container, MantineProvider } from '@mantine/core'
import { AuthenticationForm } from './scenes/auth/AuthenticationForm'

const theme = createTheme({
  fontFamily: '"Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif',
})

export function App() {
  const { count } = useValues(appLogic)
  const { setCount } = useActions(appLogic)

  return (
    <MantineProvider theme={theme}>
      <Container size="responsive">
        <AuthenticationForm />
      </Container>
    </MantineProvider>
  )
}

ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)
  .render(<App />)