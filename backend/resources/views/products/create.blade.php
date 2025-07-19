@extends('layouts.app')

@section('content')

<div class="container mt-5 products_create">
  <div class="row justify-content-center">
    <div class="col-md-6">
      <h2 class="mb-4 text-center">Add New Product</h2>
      <form action="{{ route('store') }}" method="POST" enctype="multipart/form-data" class="card p-4 shadow-sm">
        @csrf
        <div class="mb-3">
          <label for="name" class="form-label">Product Name</label>
          <input type="text" name="name" id="name" class="form-control" placeholder="Enter product name" required>
        </div>
        <div class="mb-3">
          <label for="description" class="form-label">Product Description</label>
          <input type="text" name="description" id="description" class="form-control" placeholder="Enter product description" required>
        </div>
        <div class="mb-3">
          <label for="price" class="form-label">Product Price</label>
          <input type="number" name="price" id="price" class="form-control" placeholder="Enter product price" required>
        </div>
        <div class="mb-3">
          <label for="weight" class="form-label">Product Weight</label>
          <input type="number" name="weight" id="weight" class="form-control" placeholder="Enter product weight" required>
        </div>
        <div class="mb-3">
          <label for="image" class="form-label">Product Image</label>
          <input type="file" name="image" id="image" class="form-control" required>
        </div>
        <div class="d-flex justify-content-between">
          <button type="submit" class="btn btn-primary">Create New Product</button>
          <a href="#" class="btn btn-secondary">Cancel</a>
        </div>
      </form>
    </div>
  </div>
</div>

@endsection