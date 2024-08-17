/**
 * To add a new URL to the front end:
 * - add a URL function here
 * - add a scene to the enum in sceneTypes.ts
 * - add a scene configuration in scenes.ts
 * - add a route to scene mapping in scenes.ts
 * - and add a scene import in appScenes.ts
 */

export const urls = {
    absolute: (path = ''): string => window.location.origin + path,
    default: (): string => '/',
    paywalls: (): string => '/paywalls',
    projectApps: (): string => '/apps',
    // projectApp: (id: string | number): string => `/apps/${id}`,
    project: (id: string | number): string => `/projects/${id}`,
    campaigns: (): string => '/campaigns',
    campaign: (id: string | number): string => `/campaigns/${id}`,
    login: (): string => '/login',
    editor: (id: string | number): string => `/editor/${id}`,
}
