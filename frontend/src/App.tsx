import '@mantine/core/styles.css'
import ReactDOM from 'react-dom/client'
import { createTheme, Container, MantineProvider } from '@mantine/core'
import { AuthenticationForm } from './scenes/auth/AuthenticationForm'

export function App() {
  const theme = createTheme({
    fontFamily: '"Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif'
  })

  return (
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <Container size="responsive">
        <AuthenticationForm />
      </Container>
    </MantineProvider >
  )
}

ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)
  .render(<App />)