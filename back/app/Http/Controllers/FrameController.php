<?php

namespace App\Http\Controllers;

use App\Models\{FrameColor, FrameMaterial, FrameShape};
use Illuminate\Http\Request;

class FrameController extends Controller
{
    //
    public static function getAllInfo(){
        $info = [
            "shapes" => FrameShape::all(),
            "colors" => FrameColor::all(),
            "materials" => FrameMaterial::all(),
        ];
        return $info;
    }
}
