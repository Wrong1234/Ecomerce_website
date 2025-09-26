<?php

namespace Modules\SSLEcommerz\Http\Controllers;

use DB;
use Illuminate\Http\Request;
use App\Library\SslCommerz\SslCommerzNotification;
use App\Models\Order;
use App\Models\CheckoutInformation;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;

class SslCommerzPaymentController extends Controller
{

     private function generateUniqueOrderCode(): string
    {
        do {
            $randomNumber = mt_rand(100000, 999999); // 6-digit numeric
            $code = 'SPS-' . $randomNumber;
        } while (Order::where('transaction_id', $code)->exists());

        return $code;
    }

    public function exampleEasyCheckout()
    {
        return view('exampleEasycheckout');
    }

    public function exampleHostedCheckout()
    {
        return view('exampleHosted');
    }

    public function index(Request $request)
    {
        # Here you have to receive all the order data to initate the payment.
        # Let's say, your oder transaction informations are saving in a table called "orders"
        # In "orders" table, order unique identity is "transaction_id". "status" field contain status of the transaction, "amount" is the order amount to be paid and "currency" is for storing Site Currency which will be checked with paid currency.

        if (!$request->filled('transaction_id')) {
            $request->merge(['transaction_id' => $this->generateUniqueOrderCode()]);
        }
        $validated = $this->validateRequest($request);


        $order = Order::create($validated['order']);

        $checkout = null;
        if (!empty($validated['checkout'])) {
            $checkout = $order->checkoutInformation()->create($validated['checkout']);
        }

        $post_data = [];
        $post_data['total_amount'] = $order->subtotal;
        $post_data['currency'] = "BDT";
        $post_data['tran_id'] = $order->transaction_id;
        $post_data['product_category'] = "Goods";

        # CUSTOMER INFORMATION
        $post_data['cus_name'] = $checkout->firstname . ' ' . $checkout->lastname;
        $post_data['cus_email'] = $checkout->email;
        $post_data['cus_phone'] = $checkout->phone;
        $post_data['cus_address'] = $checkout->street_address;
        $post_data['cus_state'] = $checkout->state;
        $post_data['cus_city'] = $checkout->city;
        $post_data['cus_postalCode'] = $checkout->postalCode;

        # SHIPMENT INFORMATION
        $post_data['ship_name'] = "Store Test";
        $post_data['ship_add1'] = "Dhaka";
        $post_data['ship_add2'] = "Dhaka";
        $post_data['ship_city'] = "Dhaka";
        $post_data['ship_state'] = "Dhaka";
        $post_data['ship_postcode'] = "1000";
        $post_data['ship_phone'] = "";
        $post_data['ship_country'] = "Bangladesh";

        $post_data['shipping_method'] = "NO";
        $post_data['product_name'] = "Computer";
        $post_data['product_category'] = "Goods";
        $post_data['product_profile'] = "physical-goods";

        # OPTIONAL PARAMETERS
        $post_data['value_a'] = "ref001";
        $post_data['value_b'] = "ref002";
        $post_data['value_c'] = "ref003";
        $post_data['value_d'] = "ref004";

        #Before  going to initiate the payment order status need to insert or update as Pending.
        // $update_product = DB::table('orders')
        //     ->where('transaction_id', $post_data['tran_id'])
        //     ->updateOrInsert([
        //         'amount' => $post_data['total_amount'],
        //         'status' => 'Pending',
        //         'transaction_id' => $post_data['tran_id'],
        //         'currency' => $post_data['currency']
        //     ]);

        $sslc = new SslCommerzNotification();
        # initiate(Transaction Data , false: Redirect to SSLCOMMERZ gateway/ true: Show all the Payement gateway here )
        $payment_options = $sslc->makePayment($post_data, 'hosted');

        if (!is_array($payment_options)) {
            // print_r($payment_options);
            // $payment_options = array();
             return response()->json([
                'status' => 'success',
                'redirect_url' => $payment_options
            ]);
        }
        else {
            return response()->json([
                'status' => 'error',
                'message' => 'Payment initialization failed'
            ], 400);
        }

    }
//     public function index(Request $request)
// {
//     if (!$request->filled('transaction_id')) {
//         $request->merge(['transaction_id' => $this->generateUniqueOrderCode()]);
//     }
    
//     $validated = $this->validateRequest($request);
//     $order = Order::create($validated['order']);

//     $checkout = null;
//     if (!empty($validated['checkout'])) {
//         $checkout = $order->checkoutInformation()->create($validated['checkout']);
//     }

//     $post_data = [];
//     $post_data['total_amount'] = $order->subtotal;
//     $post_data['currency'] = "BDT";
//     $post_data['tran_id'] = $order->transaction_id;
//     $post_data['product_category'] = "Goods";

//     # CUSTOMER INFORMATION
//     $post_data['cus_name'] = $checkout->firstName . ' ' . ($checkout->lastName ?? '');
//     $post_data['cus_email'] = $checkout->email;
//     $post_data['cus_phone'] = $checkout->phone;
//     $post_data['cus_add1'] = $checkout->street_address;
//     $post_data['cus_state'] = $checkout->state;
//     $post_data['cus_city'] = $checkout->city;
//     $post_data['cus_postcode'] = $checkout->postalCode;
//     $post_data['cus_country'] = "Bangladesh";

//     # SHIPMENT INFORMATION
//     $post_data['ship_name'] = "Store Test";
//     $post_data['ship_add1'] = "Dhaka";
//     $post_data['ship_add2'] = "Dhaka";
//     $post_data['ship_city'] = "Dhaka";
//     $post_data['ship_state'] = "Dhaka";
//     $post_data['ship_postcode'] = "1000";
//     $post_data['ship_phone'] = "";
//     $post_data['ship_country'] = "Bangladesh";

//     $post_data['shipping_method'] = "NO";
//     $post_data['product_name'] = "Computer";
//     $post_data['product_category'] = "Goods";
//     $post_data['product_profile'] = "physical-goods";

//     # OPTIONAL PARAMETERS
//     $post_data['value_a'] = "ref001";
//     $post_data['value_b'] = "ref002";
//     $post_data['value_c'] = "ref003";
//     $post_data['value_d'] = "ref004";

//     try {
//         $sslc = new SslCommerzNotification();
//         $payment_options = $sslc->makePayment($post_data, 'hosted');

//         if (!is_array($payment_options)) {
//             return response()->json([
//                 'status' => 'success',
//                 'redirect_url' => $payment_options,
//                 'transaction_id' => $order->transaction_id
//              ]);
//         } else {
//             return response()->json([
//                 'status' => 'error',
//                 'message' => 'Payment initialization failed',
//                 'details' => $payment_options
//             ], 400);
//         }
//     } catch (\Exception $e) {
//         return response()->json([
//             'status' => 'error',
//             'message' => 'Payment gateway error: ' . $e->getMessage()
//         ], 500);
//     }
// }

    public function payViaAjax(Request $request)
    {

        # Here you have to receive all the order data to initate the payment.
        # Lets your oder trnsaction informations are saving in a table called "orders"
        # In orders table order uniq identity is "transaction_id","status" field contain status of the transaction, "amount" is the order amount to be paid and "currency" is for storing Site Currency which will be checked with paid currency.

        $post_data = array();
        $post_data['total_amount'] = '10'; # You cant not pay less than 10
        $post_data['currency'] = "BDT";
        $post_data['tran_id'] = uniqid(); // tran_id must be unique

        # CUSTOMER INFORMATION
        $post_data['cus_name'] = 'Customer Name';
        $post_data['cus_email'] = 'customer@mail.com';
        $post_data['cus_add1'] = 'Customer Address';
        $post_data['cus_add2'] = "";
        $post_data['cus_city'] = "";
        $post_data['cus_state'] = "";
        $post_data['cus_postcode'] = "";
        $post_data['cus_country'] = "Bangladesh";
        $post_data['cus_phone'] = '8801XXXXXXXXX';
        $post_data['cus_fax'] = "";

        # SHIPMENT INFORMATION
        $post_data['ship_name'] = "Store Test";
        $post_data['ship_add1'] = "Dhaka";
        $post_data['ship_add2'] = "Dhaka";
        $post_data['ship_city'] = "Dhaka";
        $post_data['ship_state'] = "Dhaka";
        $post_data['ship_postcode'] = "1000";
        $post_data['ship_phone'] = "";
        $post_data['ship_country'] = "Bangladesh";

        $post_data['shipping_method'] = "NO";
        $post_data['product_name'] = "Computer";
        $post_data['product_category'] = "Goods";
        $post_data['product_profile'] = "physical-goods";

        # OPTIONAL PARAMETERS
        $post_data['value_a'] = "ref001";
        $post_data['value_b'] = "ref002";
        $post_data['value_c'] = "ref003";
        $post_data['value_d'] = "ref004";


        #Before  going to initiate the payment order status need to update as Pending.
        $update_product = DB::table('orders')
            ->where('transaction_id', $post_data['tran_id'])
            ->updateOrInsert([
                'name' => $post_data['cus_name'],
                'email' => $post_data['cus_email'],
                'phone' => $post_data['cus_phone'],
                'amount' => $post_data['total_amount'],
                'status' => 'Pending',
                'address' => $post_data['cus_add1'],
                'transaction_id' => $post_data['tran_id'],
                'currency' => $post_data['currency']
            ]);

        $sslc = new SslCommerzNotification();
        # initiate(Transaction Data , false: Redirect to SSLCOMMERZ gateway/ true: Show all the Payement gateway here )
        $payment_options = $sslc->makePayment($post_data, 'checkout', 'json');

        if (!is_array($payment_options)) {
            print_r($payment_options);
            $payment_options = array();
        }

    }

    public function success(Request $request)
    {
        echo "Transaction is Successful";

        $tran_id = $request->input('tran_id');
        $amount = $request->input('amount');
        $currency = $request->input('currency');

        $sslc = new SslCommerzNotification();

        #Check order status in order tabel against the transaction id or order id.
        $order_details = DB::table('orders')
            ->where('transaction_id', $tran_id)
            ->select('transaction_id', 'status', 'currency', 'amount')->first();

        if ($order_details->status == 'Pending') {
            $validation = $sslc->orderValidate($request->all(), $tran_id, $amount, $currency);

            if ($validation) {
                /*
                That means IPN did not work or IPN URL was not set in your merchant panel. Here you need to update order status
                in order table as Processing or Complete.
                Here you can also sent sms or email for successfull transaction to customer
                */
                $update_product = DB::table('orders')
                    ->where('transaction_id', $tran_id)
                    ->update(['status' => 'Processing']);

                echo "<br >Transaction is successfully Completed";
            }
        } else if ($order_details->status == 'Processing' || $order_details->status == 'Complete') {
            /*
             That means through IPN Order status already updated. Now you can just show the customer that transaction is completed. No need to udate database.
             */
            echo "Transaction is successfully Completed";
        } else {
            #That means something wrong happened. You can redirect customer to your product page.
            echo "Invalid Transaction";
        }


    }

    public function fail(Request $request)
    {
        $tran_id = $request->input('tran_id');

        $order_details = DB::table('orders')
            ->where('transaction_id', $tran_id)
            ->select('transaction_id', 'status', 'currency', 'amount')->first();

        if ($order_details->status == 'Pending') {
            $update_product = DB::table('orders')
                ->where('transaction_id', $tran_id)
                ->update(['status' => 'Failed']);
            echo "Transaction is Falied";
        } else if ($order_details->status == 'Processing' || $order_details->status == 'Complete') {
            echo "Transaction is already Successful";
        } else {
            echo "Transaction is Invalid";
        }

    }

    public function cancel(Request $request)
    {
        $tran_id = $request->input('tran_id');

        $order_details = DB::table('orders')
            ->where('transaction_id', $tran_id)
            ->select('transaction_id', 'status', 'currency', 'amount')->first();

        if ($order_details->status == 'Pending') {
            $update_product = DB::table('orders')
                ->where('transaction_id', $tran_id)
                ->update(['status' => 'Canceled']);
            echo "Transaction is Cancel";
        } else if ($order_details->status == 'Processing' || $order_details->status == 'Complete') {
            echo "Transaction is already Successful";
        } else {
            echo "Transaction is Invalid";
        }


    }

    public function ipn(Request $request)
    {
        #Received all the payement information from the gateway
        if ($request->input('tran_id')) #Check transation id is posted or not.
        {

            $tran_id = $request->input('tran_id');

            #Check order status in order tabel against the transaction id or order id.
            $order_details = DB::table('orders')
                ->where('transaction_id', $tran_id)
                ->select('transaction_id', 'status', 'currency', 'amount')->first();

            if ($order_details->status == 'Pending') {
                $sslc = new SslCommerzNotification();
                $validation = $sslc->orderValidate($request->all(), $tran_id, $order_details->amount, $order_details->currency);
                if ($validation == TRUE) {
                    /*
                    That means IPN worked. Here you need to update order status
                    in order table as Processing or Complete.
                    Here you can also sent sms or email for successful transaction to customer
                    */
                    $update_product = DB::table('orders')
                        ->where('transaction_id', $tran_id)
                        ->update(['status' => 'Processing']);

                    echo "Transaction is successfully Completed";
                }
            } else if ($order_details->status == 'Processing' || $order_details->status == 'Complete') {

                #That means Order status already updated. No need to udate database.

                echo "Transaction is already successfully Completed";
            } else {
                #That means something wrong happened. You can redirect customer to your product page.

                echo "Invalid Transaction";
            }
        } else {
            echo "Invalid Data";
        }
    }

    //  private function validateRequest(Request $request, $orderId = null): array
    // {
    //     $rules = [
    //         'transaction_id' => 'required|string|unique:orders,transaction_id' . ($orderId ? ',' . $orderId : ''),
    //         'product_id' => 'required|integer|exists:products,id',
    //         'user_id' => 'nullable|integer|exists:users,id',
    //         'product_details' => 'required|array',
    //         'unit_price' => 'required|numeric|min:0',
    //         'quantity' => 'required|integer|min:1',
    //         'subtotal' => 'required|numeric|min:0',
    //         'shipping_fee' => 'nullable|numeric|min:0',
    //         'tax' => 'nullable|numeric|min:0',
    //         'status' => 'nullable|string',
    //         'order_date' => 'nullable|date',
    //         'checkout' => 'nullable|array',
    //         'checkout.firstName' => 'required_with:checkout|string|max:255',
    //         'checkout.lastName' => 'nullable|string|max:255',
    //         'checkout.email' => 'required_with:checkout|email|max:255',
    //         'checkout.phone' => 'nullable|string|max:20',
    //         'checkout.city' => 'nullable|string|max:255',
    //         'checkout.postalCode' => 'nullable|string|max:20',
    //         'checkout.zipCode' => 'nullable|string|max:20',
    //         'checkout.state' => 'nullable|string|max:255',
    //         'checkout.street_address' => 'nullable|string|max:500',
    //     ];

    //     // Make fields optional for update
    //     if ($orderId) {
    //         foreach ($rules as $key => $rule) {
    //             $rules[$key] = 'sometimes|' . $rule;
    //         }
    //     }

    //     $validator = Validator::make($request->all(), $rules);

    //     if ($validator->fails()) {
    //         abort(response()->json([
    //             'success' => false,
    //             'errors' => $validator->errors()
    //         ], 422));
    //     }

    //     $validated = $validator->validated();

    //     // Separate order and checkout data
    //     $orderData = collect($validated)->except('checkout')->toArray();
    //     $checkoutData = $validated['checkout'] ?? [];

    //     return [
    //         'order' => $orderData,
    //         'checkout' => $checkoutData
    //     ];
    // }
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
