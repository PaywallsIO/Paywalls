<?php

namespace App\Enums;

enum EventName: string
{
    case createAlias = '$create_alias';
    case identify = '$identify';
    case mergeDangerously = '$merge_dangerously';
}
