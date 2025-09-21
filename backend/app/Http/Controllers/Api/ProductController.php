<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;

class ProductController extends Controller
{
    
     public function index(){

        $products = Product::all();
        return response()->json([
            'success'    => true,
            'message'    => "Get all product successfully",
            'products'   => $products,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'        => 'required',
            'description' => 'required',
            'image'       => 'nullable|file|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'price'       => 'numeric|required',
            'weight'      => 'numeric|required',
        ]);

        $imagename = null;

        // Check if image is uploaded
        if ($request->hasFile('image')) {
            $imagename = time() . '.' . $request->image->extension();
            $request->image->move(public_path('projects'), $imagename);
        }

        // Create new product
        $product = new Product();
        $product->name        = $request->name;
        $product->description = $request->description;
        $product->image       = $imagename; 
        $product->price       = $request->price;
        $product->weight      = $request->weight;
        $product->save();

        return response()->json([
            'success' => true,
            'message' => "Product created successfully",
            'data'    => $product,
        ]);
    }


    public function update(Request $request, $id)
    {
        // Find product
        $product = Product::findOrFail($id);

        // Validate input
        $request->validate([
            'name'        => 'required',
            'description' => 'required',
            'image'       => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'price'       => 'numeric|required',
            'weight'      => 'numeric|required',
        ]);

        // Handle image update if a new one is uploaded
        if ($request->hasFile('image')) {
            // delete old image if exists
            $oldImage = public_path('projects/' . $product->image);
            if (file_exists($oldImage) && is_file($oldImage)) {
                unlink($oldImage);
            }

            // upload new image
            $imagename = time() . '.' . $request->image->extension();
            $request->image->move(public_path('projects'), $imagename);
            $product->image = $imagename;
        }

        // Update other fields
        $product->name        = $request->name;
        $product->description = $request->description;
        $product->price       = $request->price;
        $product->weight      = $request->weight;

        // Save changes
        $product->save();

        return response()->json([
            'success' => true,
            'message' => "Product updated successfully",
            'data'    => $product,
        ]);
    }

    public function show($id){

        $product = Product::findOrFail($id);

        return response()->json([
            'success'   => true,
            'message'   => "Get your product",
            'product'   => $product,
        ]);
    }

   public function destroy($id)
    {
        // Find product
        $product = Product::findOrFail($id);

        // Delete image file if exists
        $imagePath = public_path('projects/' . $product->image);
        if (file_exists($imagePath) && is_file($imagePath)) {
            unlink($imagePath);
        }

        // Delete product record
        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product deleted successfully',
        ]);
    }


}
