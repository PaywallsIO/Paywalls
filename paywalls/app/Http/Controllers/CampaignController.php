<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use App\Models\Project;
use Illuminate\Http\Request;

class CampaignController extends Controller
{
    public function index(Project $project)
    {
        return $project->campaigns()->paginate();
    }

    public function create()
    {
        //
    }

    public function store(Request $request)
    {
        //
    }

    public function show(Campaign $campaign)
    {
        //
    }

    public function edit(Campaign $campaign)
    {
        //
    }

    public function update(Request $request, Campaign $campaign)
    {
        //
    }

    public function destroy(Campaign $campaign)
    {
        //
    }
}
