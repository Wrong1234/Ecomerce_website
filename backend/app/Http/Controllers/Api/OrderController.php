<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\CheckoutInformation;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Library\SslCommerz\SslCommerzNotification;

class OrderController extends Controller
{

    private function generateUniqueOrderCode(): string
    {
        do {
            $randomNumber = mt_rand(100000, 999999); // 6-digit numeric
            $code = 'SPS-' . $randomNumber;
        } while (Order::where('transaction_id', $code)->exists());

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
        if (!$request->filled('transaction_id')) {
            $request->merge(['transaction_id' => $this->generateUniqueOrderCode()]);
        }
        $validated = $this->validateRequest($request);


        $order = Order::create($validated['order']);

        $checkout = null;
        if (!empty($validated['checkout'])) {
            $checkout = $order->checkoutInformation()->create($validated['checkout']);
        }

        // $post_data = [];
        // $post_data['cus_name'] = $checkout->firstname . ' ' . $checkout->lastname;
        // $post_data['cus_email'] = $checkout->email;
        // $post_data['cus_phone'] = $checkout->phone;
        // $post_data['cus_address'] = $checkout->street_address;
        // $post_data['cus_state'] = $checkout->state;
        // $post_data['cus_city'] = $checkout->city;
        // $post_data['cus_postalCode'] = $checkout->postalCode;
        // $post_data['total_amount'] = $order->subtotal;
        // $post_data['currency'] = "BDT";
        // $post_data['tran_id'] = $order->order_code;
        // $post_data['product_category'] = "Goods";

        // $sslc = new SslCommerzNotification();
        // # initiate(Transaction Data , false: Redirect to SSLCOMMERZ gateway/ true: Show all the Payement gateway here )
        // $payment_options = $sslc->makePayment($post_data, 'hosted');

        // if (!is_array($payment_options)) {
        //     print_r($payment_options);
        //     $payment_options = array();
        // }

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
        $validated['status'] = 'success';

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
            'transaction_id' => 'required|string|unique:orders,transaction_id' . ($orderId ? ',' . $orderId : ''),
            'product_id' => 'required|integer|exists:products,id',
            'user_id' => 'nullable|integer|exists:users,id',
            'product_details' => 'required|array',
            'unit_price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:1',
            'subtotal' => 'required|numeric|min:0',
            'shipping_fee' => 'nullable|numeric|min:0',
            'tax' => 'nullable|numeric|min:0',
            'status' => 'nullable|string',
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
