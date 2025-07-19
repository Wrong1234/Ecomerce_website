@extends('layouts.app')

@section('content')

  <div class="dashboard">
    <div class="row">
      <div class="col-md-6 mb-4">
      <div class="card">
        <div class="card-body text-center">
        <a href="{{ route('viewAllProducts') }}" class="btn btn-primary p-2">View All Products</a>
        </div>
      </div>
      </div>
      <div class="col-md-6 mb-4">
      <div class="card">
        <div class="card-body text-center">
        <a href="#" class="btn btn-success p-2">View All Orders</a>
        </div>
      </div>
      </div>
    </div>
  </div>

@endsection