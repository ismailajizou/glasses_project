<?php

namespace App\Http\Controllers;

use App\Models\{Brand, Collection, FrameColor, FrameMaterial, Glasses, LensColor};
use Illuminate\Http\Request;

class AdminDashboardController extends Controller
{
    public function __construct()
    {
        $this->middleware("json");
    }
    public function index()
    {
        $stats = [
            'glasses' => [
                'total' => Glasses::count(),
            ],
            'brands' => [
                'total' => Brand::withTrashed()->count(),
                'active' => Brand::count(),
            ],
            'collections' => [
                'total' => Collection::withTrashed()->count(),
                'active' => Collection::count(),
            ],
            'frames' => [
                "colors" => [
                    'total' => FrameColor::withTrashed()->count(),
                    'active' => FrameColor::count(),
                ],
                "materials" => [
                    'total' => FrameMaterial::withTrashed()->count(),
                    'active' => FrameMaterial::count(),
                ],
            ],
            'lens' => [
                "colors" => [
                    'total' => LensColor::withTrashed()->count(),
                    'active' => LensColor::count(),
                ],
            ],
        ];
        return response()->json($stats);
    }
}
