import { LogicWrapper } from 'kea'

export enum Scene {
    Dashboard = 'Dashboard',
    Editor = 'Editor',
    Login = 'Login',
    Apps = 'Apps',
    Paywalls = 'Paywalls',
    Campaigns = 'Campaigns',
    Campaign = 'Campaign',
    Error404 = '404',
    ErrorNetwork = '4xx',
}

export type SceneProps = Record<string, any>

export type SceneComponent = (params?: SceneProps) => JSX.Element | null

export interface SceneExport {
    /** component to render for this scene */
    component: SceneComponent
    /** logic to mount for this scene */
    logic?: LogicWrapper
    /** convert URL parameters from scenes.ts into logic props */
    paramsToProps?: (params: SceneParams) => SceneProps
    /** when was the scene last touched, unix timestamp for sortability */
    lastTouch?: number
}

export interface LoadedScene extends SceneExport {
    id: string
    sceneParams: SceneParams
}

export interface SceneParams {
    params: Record<string, any>
    searchParams: Record<string, any>
    hashParams: Record<string, any>
}

export interface Params {
    [param: string]: any
}

export interface SceneConfig {
    /** Custom name for the scene */
    name?: string
    /** Route should only be accessed when logged out (N.B. should be added to urls.py too) */
    anonymousOnly?: boolean
    /** Route **can** be accessed when logged out */
    anonymousAllowed?: boolean
    /**
     * If `app`, navigation is shown, and the scene has default padding.
     * If `app-raw`, navigation is shown, but the scene has no padding.
     * If `app-container`, navigation is shown, and the scene is centered with a max width.
     * If `plain`, there's no navigation present, and the scene has no padding.
     * @default 'app'
     */
    layout?: 'app' | 'project' | 'plain'
}
