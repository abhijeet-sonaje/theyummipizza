<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Menu;

class MenuController extends Controller
{
    public function create(Request $request) {
        $menu = new Menu();
        
        $menu->type = $request->input('type');
        $menu->desc = $request->input('desc');
        $menu->img = $request->input('img');
        $menu->price = $request->input('price');

        $menu->save();
        $res = json_encode([ 'status' => 'success', 'message' => 'Menu Saved!' ]);
        return response()->json($res);
    }

    public function index() {
        $menus = Menu::all();
        return response()->json($menus);
    }
}
