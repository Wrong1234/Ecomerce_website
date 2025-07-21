<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;

class ProductController extends Controller
{
    public function create(){

        return view('products.create');
    }

    public function dashboard(){
        return view('dashboard');
    }

     public function view(){

        $products = Product::all();
        return view('products.viewAllProducts', compact('products'));
    }

    public function store(Request $request){
          
        dd($request);
        $request->validate([
            'name' => 'required',
            'description' => 'required',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'price' => 'numeric|required',
            'weight' => 'numeric|required',
        ]);

        // Upload the image and store it in the public directory
        $imagename = time() . '.' . $request->image->extension();
        $request->image->move(public_path('projects'), $imagename);
        
        // Create new project
        $product = new Product();
        $product ->name = $request->name;
        $product ->description = $request->description;
        $product ->image = $imagename;
        $product ->price = $request->price;
        $product ->weight = $request->weight;
        
        $product ->save();
        
        return redirect()->route('viewAllProducts')->withSuccess('Project created successfully.');
    }

    public function products(){

        $products = Product::all();

         return response()->json($products);
    }

    public function product($id){
        $product = Product::find($id);

        return response()->json($product);
    }
}
