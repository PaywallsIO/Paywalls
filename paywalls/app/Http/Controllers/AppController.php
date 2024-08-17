<?php

namespace App\Http\Controllers;

use App\Models\App;
use App\Models\Project;
use Illuminate\Http\Request;

class AppController extends Controller
{
    public function index(Project $project)
    {
        return $project->apps()->paginate();
    }

    public function create()
    {
        //
    }

    public function store(Request $request)
    {
        //
    }

    public function show(App $app)
    {
        //
    }

    public function edit(App $app)
    {
        //
    }

    public function update(Request $request, App $app)
    {
        //
    }

    public function destroy(App $app)
    {
        //
    }
}
