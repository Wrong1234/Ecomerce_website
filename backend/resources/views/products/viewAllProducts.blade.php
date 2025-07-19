@extends('layouts.app')

@section('content')

<div class="view_products py-4">
  <div class="container">
    <div class="card shadow-sm">
      <div class="card-header d-flex justify-content-between align-items-center bg-primary text-white">
        <h4 class="mb-0">All Products</h4>
        <a href="#" class="btn btn-light btn-sm">
          <i class="bi bi-plus-circle me-1"></i> Add Product
        </a>
      </div>

      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-striped table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th scope="col">#ID</th>
                <th scope="col">Name</th>
                <th scope="col">Description</th>
                <th scope="col">Price</th>
                {{-- <th scope="col">Weight</th> --}}
                <th scope="col" class="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              @forelse($products as $product)
              <tr>
                <td>{{ $product->id }}</td>
                <td>{{ $product->name }}</td>
                <td>{{ $product->description }}</td>
                <td>{{ number_format($product->price, 2) }}</td>
                {{-- <td>{{ $product->weight }} kg</td> --}}
                <td class="text-center">
                  <a href="#" class="btn btn-sm btn-outline-primary me-1" title="View">
                    <i class="bi bi-eye"></i>
                  </a>
                  <a href="#" class="btn btn-sm btn-outline-warning me-1" title="Edit">
                    <i class="bi bi-pencil-square"></i>
                  </a>
                  <form action="#" method="POST" class="d-inline">
                    @csrf
                    @method('DELETE')
                    <button type="submit" class="btn btn-sm btn-outline-danger" title="Delete"
                      onclick="return confirm('Are you sure you want to delete this product?')">
                      <i class="bi bi-trash"></i>
                    </button>
                  </form>
                </td>
              </tr>
              @empty
              <tr>
                <td colspan="6" class="text-center py-4">
                  <h5 class="text-muted">
                    <i class="bi bi-folder-x me-2"></i>No Products Found
                  </h5>
                  <p class="mb-0">Start by adding your first product!</p>
                </td>
              </tr>
              @endforelse
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>


@endsection