<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

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
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|unique:products,slug',
            'short_description' => 'nullable|string|max:500',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'weight' => 'nullable|numeric|min:0',
            'stock_quantity' => 'nullable|integer|min:0',
            'image' => 'nullable|image|max:2048', // max 2MB
            'meta_data' => 'nullable|array',
        ]);

        // Generate slug if not provided
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        // Handle image upload
        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('products', 'public');
        }

        // Convert meta_data array to JSON
        if (isset($validated['meta_data'])) {
            $validated['meta_data'] = json_encode($validated['meta_data']);
        }

        $product = Product::create($validated);

        return response()->json([
            'message' => 'Product created successfully',
            'product' => $product
        ], 201);
    }

    public function show($id){

        $product = Product::findOrFail($id);

        return response()->json([
            'success'   => true,
            'message'   => "Get your product",
            'product'   => $product,
        ]);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|nullable|string|unique:products,slug,' . $product->id,
            'short_description' => 'nullable|string|max:500',
            'description' => 'nullable|string',
            'price' => 'sometimes|required|numeric|min:0',
            'weight' => 'nullable|numeric|min:0',
            'stock_quantity' => 'sometimes|required|integer|min:0',
            'image' => 'nullable|image|max:20480', // max 2MB
            'meta_data' => 'nullable|array',
        ]);

        // Generate slug if not provided and name is updated
        if (empty($validated['slug']) && isset($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $validated['image'] = $request->file('image')->store('products', 'public');
        }

        // Convert meta_data array to JSON
        if (isset($validated['meta_data'])) {
            $validated['meta_data'] = json_encode($validated['meta_data']);
        }

        $product->update($validated);

        return response()->json([
            'message' => 'Product updated successfully',
            'product' => $product
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
