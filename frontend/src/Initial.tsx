import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css';
import ReactDOM from 'react-dom/client'
import { createTheme, Container, MantineProvider, Text } from '@mantine/core'
import { formsPlugin } from 'kea-forms'
import { useValues, resetContext } from 'kea'
import { Notifications } from '@mantine/notifications';
import appLogic from './scenes/app/appLogic';
import AuthScreen from './scenes/auth/AuthScreen';
import AppScreen from './scenes/app/AppScreen';
import axios from 'axios'

configureAxios()

resetContext({ plugins: [formsPlugin] })

export function Initial() {
  const { accessToken } = useValues(appLogic)
  const theme = createTheme({
    fontFamily: '"Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif'
  })

  return (
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <Notifications position="top-center" zIndex={1000} />
      <Container size="responsive">
        {accessToken ? <AppScreen /> : <AuthScreen />}
      </Container>
    </MantineProvider >
  )
}

function configureAxios() {
  axios.defaults.baseURL = 'http://localhost:8000'
}

ReactDOM.createRoot(
  document.getElementById('initial') as HTMLElement
)
  .render(<Initial />)