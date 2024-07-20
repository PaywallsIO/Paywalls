import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css';
import ReactDOM from 'react-dom/client'
import { createTheme, Container, MantineProvider, Text } from '@mantine/core'
import { formsPlugin } from 'kea-forms'
import { loadersPlugin } from 'kea-loaders'
import { routerPlugin } from 'kea-router'
import { resetContext } from 'kea'
import { App } from './scenes/app/App';

resetContext({ plugins: [loadersPlugin, formsPlugin, routerPlugin] })

export function Initial() {
  const theme = createTheme({
    fontFamily: '"Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif'
  })

  return (
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <Container size="responsive">
        <App />
      </Container>
    </MantineProvider >
  )
}

ReactDOM.createRoot(
  document.getElementById('initial') as HTMLElement
)
  .render(<Initial />)