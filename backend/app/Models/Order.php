<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_code',
        'product_id',
        'user_id',
        'product_details',
        'unit_price',
        'quantity',
        'subtotal',
        'shipping_fee',
        'tax',
        'order_date',
        'status'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'subtotal' => 'decimal:2',
        'product_details' => 'array',
        'order_date'  => 'date'
    ];

    public function checkoutInformation()
    {
        return $this->hasOne(CheckoutInformation::class);
    }
  
}
