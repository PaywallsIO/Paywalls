<?php

namespace App\Filament\Resources\PortalResource\Pages;

use App\Filament\Resources\PortalResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListPortals extends ListRecords
{
    protected static string $resource = PortalResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
