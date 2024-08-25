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
    login: (): string => '/login',

    // project urls
    paywalls: (projectId: string | number): string => `/projects/${projectId}/paywalls`,
    apps: (projectId: string | number): string => `/projects/${projectId}/apps`,
    campaigns: (projectId: string | number): string => `/projects/${projectId}/campaigns`,
    editor: (projectId: string | number, paywallId: string | number): string => `/projects/${projectId}/paywalls/${paywallId}/editor`,
    campaign: (projectId: string | number, campaignId: string | number): string => `/projects/${projectId}/campaigns/${campaignId}`
}
