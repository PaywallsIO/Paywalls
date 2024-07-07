import reactLogo from './assets/react.svg'
import './App.css'
import { useActions, useValues } from 'kea'
import { appLogic } from './appLogic'

export function App() {
  const { count } = useValues(appLogic)
  const { setCount } = useActions(appLogic)

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://keajs.org" target="_blank">
          <img src="/kea.svg" className="logo" alt="Kea logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + Kea + React</h1>
      <div className="card">
        <button onClick={() => setCount(count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the Vite, Kea and React logos to learn more</p>
    </div>
  )
}
