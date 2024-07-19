/**
 * To add a new URL to the front end:
 * - add a URL function here
 * - add a scene to the enum in sceneTypes.ts
 * - add a scene configuration in scenes.ts
 * - add a route to scene mapping in scenes.ts
 * - and add a scene import in appScenes.ts
 *
 * Sync the paths with AutoProjectMiddleware!
 */

export const urls = {
    absolute: (path = ''): string => window.location.origin + path,
    default: (): string => '/',
    paywalls: (): string => '/paywalls',
    login: (): string => '/login',
    editor: (): string => '/editor',
}
