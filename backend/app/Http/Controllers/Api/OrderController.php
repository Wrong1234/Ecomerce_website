<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\CheckoutInformation;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;

class OrderController extends Controller
{

    private function generateUniqueOrderCode(): string
    {
        do {
            $randomNumber = mt_rand(100000, 999999); // 6-digit numeric
            $code = 'SPS-' . $randomNumber;
        } while (Order::where('order_code', $code)->exists());

        return $code;
    }
    /**
     * List all orders with checkout information
     */
    public function index(): JsonResponse
    {
        $orders = Order::with('checkoutInformation')->latest()->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $orders
        ]);
    }

    /**
     * Store a new order with optional checkout info
     */
    public function store(Request $request): JsonResponse
    {
        if (!$request->filled('order_code')) {
            $request->merge(['order_code' => $this->generateUniqueOrderCode()]);
        }
        $validated = $this->validateRequest($request);

        $order = Order::create($validated['order']);

        if (!empty($validated['checkout'])) {
            $order->checkoutInformation()->create($validated['checkout']);
        }

        return response()->json([
            'success' => true,
            'message' => 'Order created successfully',
            'data' => $order->load('checkoutInformation')
        ], 201);
    }

    /**
     * Show a single order with checkout info
     */
    public function show($id): JsonResponse
    {
        $order = Order::with('checkoutInformation')->find($id);

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }
        return response()->json([
            'success' => true,
            'message' => 'Order retrieved successfully',
            'data' => $order
        ]);
    }

    /**
     * Update an existing order
     */
    public function update(Request $request, $id): JsonResponse
    {
        $order = Order::findOrFail($id);
        $validated = $this->validateRequest($request, $id);

        $order->update($validated['order']);

        if (!empty($validated['checkout'])) {
            $order->checkoutInformation()->updateOrCreate([], $validated['checkout']);
        }

        return response()->json([
            'success' => true,
            'message' => 'Order updated successfully',
            'data' => $order->load('checkoutInformation')
        ]);
    }

    /**
     * Delete an order (checkout info cascades)
     */
    public function destroy(Order $order): JsonResponse
    {
        $order->delete();

        return response()->json([
            'success' => true,
            'message' => 'Order deleted successfully'
        ]);
    }

    /**
     * Private method to handle validation for store/update
     */
    private function validateRequest(Request $request, $orderId = null): array
    {
        $rules = [
            'order_code' => 'required|string|unique:orders,order_code' . ($orderId ? ',' . $orderId : ''),
            'product_id' => 'required|integer|exists:products,id',
            'user_id' => 'nullable|integer|exists:users,id',
            'product_details' => 'required|array',
            'unit_price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:1',
            'subtotal' => 'required|numeric|min:0',
            'shipping_fee' => 'nullable|numeric|min:0',
            'tax' => 'nullable|numeric|min:0',
            'order_date' => 'nullable|date',
            'checkout' => 'nullable|array',
            'checkout.firstName' => 'required_with:checkout|string|max:255',
            'checkout.lastName' => 'nullable|string|max:255',
            'checkout.email' => 'required_with:checkout|email|max:255',
            'checkout.phone' => 'nullable|string|max:20',
            'checkout.city' => 'nullable|string|max:255',
            'checkout.postalCode' => 'nullable|string|max:20',
            'checkout.zipCode' => 'nullable|string|max:20',
            'checkout.state' => 'nullable|string|max:255',
            'checkout.street_address' => 'nullable|string|max:500',
        ];

        // Make fields optional for update
        if ($orderId) {
            foreach ($rules as $key => $rule) {
                $rules[$key] = 'sometimes|' . $rule;
            }
        }

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            abort(response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422));
        }

        $validated = $validator->validated();

        // Separate order and checkout data
        $orderData = collect($validated)->except('checkout')->toArray();
        $checkoutData = $validated['checkout'] ?? [];

        return [
            'order' => $orderData,
            'checkout' => $checkoutData
        ];
    }
}
