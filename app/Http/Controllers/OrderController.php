<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Order;

class OrderController extends Controller
{
    public function create(Request $request) {
        $order = new Order();
        
        $order->quantity = $request->input('quantity');
        $order->totalInEuros = $request->input('totalInEuros');
        $order->totalInUSD = $request->input('totalInUSD');
        $order->deliveryCostInEuros = $request->input('deliveryCostInEuros');
        $order->deliveryCostInUSD = $request->input('deliveryCostInUSD');
        $order->items = $request->input('items');

        $order->save();
        $res = json_encode([ 'status' => 'success', 'message' => 'Order Saved!' ]);
        return response()->json($res);
    }

    public function index() {
        $orders = Order::orderBy('created_at', 'desc')->get();
        return response()->json($orders);
    }
}
