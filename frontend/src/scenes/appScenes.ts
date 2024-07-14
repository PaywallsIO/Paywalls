import { Scene } from './sceneTypes'
import { preloadedScenes } from '../scenes'
import { scene as PaywallsScene } from './paywalls/Paywalls'
import { scene as LoginScene } from './login/Login'

export const appScenes: Record<Scene, () => any> = {
    [Scene.Error404]: () => ({ default: preloadedScenes[Scene.Error404].component }),
    [Scene.Paywalls]: () => PaywallsScene,
    [Scene.Login]: () => LoginScene,
}
