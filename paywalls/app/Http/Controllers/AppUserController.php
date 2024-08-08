<?php

namespace App\Http\Controllers;

use App\Models\AppUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AppUserController extends Controller
{
    /**
     * Display the specified resource.
     */
    public function show($distinctId)
    {
        return authPortal()->appUserDistinctIds()->where('distinct_id', $distinctId)->firstOrFail()->appUser;
    }

    /**
     * Update the specified resource in storage.
     */
    public function bulk(Request $request)
    {
        $appUsers = $request->get('app_users', []);
        $localIds = [];
        $errors = [];

        foreach ($appUsers as $appUser) {
            // TODO Validate this endpoint
            // TODO Validate this endpoint
            // TODO Validate this endpoint
            // TODO Validate this endpoint
            // TODO Validate this endpoint
            // TODO Validate this endpoint
            $localId = $appUser['local_id'];
            $distinctId = $appUser['distinct_id'];
            $setProperties = $appUser['set'] ?? [];
            $setOnceProperties = $appUser['set_once'] ?? [];
            $removeProperties = $appUser['remove'] ?? [];

            $appUser = $this->appUserOrCreateFromDistinctId($distinctId);
            $appUser->properties = array_merge($appUser->properties, $setProperties);
            $appUser->properties = array_merge($appUser->properties, $setOnceProperties);
            // $appUser->properties = array_filter($appUser->properties, function ($key) use ($removeProperties) {
            //     return ! in_array($key, $removeProperties) && $key[0] !== '$';
            // }, ARRAY_FILTER_USE_KEY);
            if ($appUser->save()) {
                $localIds[] = $localId;
            } else {
                $errors[$localId] = $appUser->errors();
            }
        }

        return [
            'errors' => $errors,
            'processed' => $localIds,
        ];
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AppUser $appUser)
    {
        //
    }

    private function appUserOrCreateFromDistinctId(
        string $distinctId,
        ?string $ogDistinctId = null
    ): AppUser {
        if ($appUserDistinctId = authPortal()->appUserDistinctIds()->where('distinct_id', $distinctId)->first()) {
            return $appUserDistinctId->appUser;
        } else {
            try {
                DB::beginTransaction();

                $appUser = authPortal()->appUsers()->create();
                $appUser->distinctIds()->forceCreate([
                    'distinct_id' => $distinctId,
                    'portal_id' => authPortal()->id,
                ]);

                DB::commit();

                return $appUser;
            } catch (\Exception $e) {
                DB::rollBack();

                throw $e;
            }
        }
    }

    private function isAnonymous(string $distinctId): bool
    {
        return substr($distinctId, 0, 10) === '$anonymous:';
    }
}
