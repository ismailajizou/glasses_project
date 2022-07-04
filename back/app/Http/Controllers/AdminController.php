<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AdminController extends Controller
{

    public function changePassword(Request $request)
    {
        $request->validate([
            'old_password' => 'required|string|password',
            'new_password' => 'required|min:8|confirmed',
        ]);
        $user = $request->user();
        $user->update([
            'password' => bcrypt($request->new_password),
        ]);
        return response()->json(['message' => 'Password changed successfully']);
    }

}
