import { Scene } from './sceneTypes'
import { preloadedScenes } from '../scenes'

export const appScenes: Record<Scene, () => any> = {
    [Scene.Error404]: () => ({ default: preloadedScenes[Scene.Error404].component }),
    [Scene.ErrorNetwork]: () => ({ default: preloadedScenes[Scene.ErrorNetwork].component }),
    [Scene.Paywalls]: () => import('./paywalls/Paywalls'),
    [Scene.Campaigns]: () => import('./campaigns/Campaigns'),
    [Scene.Login]: () => import('./authentication/Login'),
    [Scene.ProjectApps]: () => import('./apps/Apps'),
    [Scene.Dashboard]: () => import('./dashboard/Dashboard'),
    [Scene.Editor]: () => import('./editor/Editor'),
}
