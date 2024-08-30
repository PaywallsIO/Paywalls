<?php

namespace App\Jobs\Models;

use App\Enums\EventProperty;

final class ProcessEvent
{
    public string $distinctId;

    public string $name;

    public array $properties;

    public int $timestamp;

    public string $uuid;

    private $eventToUserProperties;

    private const eventToUserProperties = [
        '$app_version',
        '$app_name',
        '$app_namespace',
        '$app_build_number',
        '$os_version',
        '$app_namespace',
        '$lib_version',
        '$device_type',
        '$os',
        '$device_type',
        '$device_model',
    ];

    public function __construct(array $event)
    {
        $this->eventToUserProperties = collect(ProcessEvent::eventToUserProperties);

        $event = collect($event);
        $this->distinctId = $event->get('distinct_id');
        $this->name = $event->get('name');
        $this->properties = $this->personProperties($event->get('properties'));
        $this->timestamp = $event->get('timestamp');
        $this->uuid = $event->get('uuid');
    }

    private function personProperties(array $properties): array
    {
        $properties = collect($properties);
        $userProperties = $properties->filter(function ($values, $key) {
            return $this->eventToUserProperties->contains($key);
        });

        $setOnceProperties = $userProperties->mapWithKeys(function ($value, $key) {
            return [
                EventProperty::initialPrefix->value.str_replace('$', '', $key) => $value,
            ];
        });

        $setProperties = [...$userProperties, ...$properties->get(EventProperty::set->value, [])];

        if (count($setProperties)) {
            $properties->put(EventProperty::set->value, $setProperties);
        }
        if (count($setOnceProperties)) {
            $properties->put(EventProperty::setOnce->value, [...$properties->get(EventProperty::setOnce->value, []), ...$setOnceProperties]);
        }

        return $properties->all();
    }

    public function toArray(): array
    {
        return [
            'distinct_id' => $this->distinctId,
            'name' => $this->name,
            'properties' => $this->properties,
            'timestamp' => $this->timestamp,
            'uuid' => $this->uuid,
        ];
    }
}
