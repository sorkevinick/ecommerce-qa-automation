#!/usr/bin/env bash
# Creates the data the UI tests need in a fresh store, using the WooCommerce API.
set -euo pipefail

API="http://localhost/wp-json/wc/v3"
AUTH="$API_USER:$API_PASSWORD"

echo "Creating the test customer..."
CUSTOMER_ID=$(
  jq -n --arg email "$USER_EMAIL" --arg username "$USER_NAME" --arg password "$USER_PASSWORD" \
    '{email: $email, username: $username, password: $password}' |
  curl -sf -u "$AUTH" -X POST "$API/customers" -H 'Content-Type: application/json' -d @- |
  jq -r '.id'
)
echo "Customer created with ID $CUSTOMER_ID."

echo "Creating an order for the test customer..."
PRODUCT_ID=$(curl -sf -u "$AUTH" "$API/products?search=Abominable%20Hoodie" | jq -r '.[0].id')
VARIATION_ID=$(curl -sf -u "$AUTH" "$API/products/$PRODUCT_ID/variations?per_page=1" | jq -r '.[0].id')

jq -n --argjson customer "$CUSTOMER_ID" --argjson product "$PRODUCT_ID" --argjson variation "$VARIATION_ID" \
  '{customer_id: $customer, status: "processing",
    payment_method: "cod", payment_method_title: "Pagamento na entrega",
    line_items: [{product_id: $product, variation_id: $variation, quantity: 1}]}' |
curl -sf -u "$AUTH" -X POST "$API/orders" -H 'Content-Type: application/json' -d @- > /dev/null
echo "Order created."