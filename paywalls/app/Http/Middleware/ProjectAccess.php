<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ProjectAccess
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {

        dd($request);
        // $portal = authPortal();
        // if (! $portal->projects->contains($project)) {
        //     abort(403, 'You do not have access to this project');
        // }

        return $next($request);
    }
}
