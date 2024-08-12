<?php

namespace App\Jobs\Models;

final class ProcessEvent
{
    public string $distinctId;

    public string $name;

    public array $properties;

    public int $timestamp;

    public string $uuid;

    public function __construct(array $event)
    {
        $event = collect($event);
        $this->distinctId = $event->get('distinct_id');
        $this->name = $event->get('name');
        $this->properties = $event->get('properties');
        $this->timestamp = $event->get('timestamp');
        $this->uuid = $event->get('uuid');
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
