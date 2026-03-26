# Full System Flow: Login to Order

This guide details every technical step and API hit required for the Admin setup and Client ordering process.

---

## 🛠️ ADMIN FLOW: Catalog & Pricing Setup

Admins must first define the products and the pricing combinations.

### 1. Initial Login
*   **Action**: Admin logs into the dashboard.
*   **API**: `POST /api/v1/admin/auth/login`
*   **Payload**: `{ "email": "admin@example.com", "password": "..." }`

### 2. Create Core Product
*   **Action**: Define the top-level product.
*   **API**: `POST /api/v1/admin/products`
*   **Payload**: `{ "product_code": "VC001", "name": "Visiting Card", "production_days": 3 }`

### 3. Create Product Variant
*   **Action**: Add a specific variant (e.g., Slim, Premium).
*   **API**: `POST /api/v1/admin/products/:productId/variants`
*   **Payload**: `{ "variant_code": "VC_PREMIUM", "variant_name": "Premium Matte Texture", "min_quantity": 50 }`

### 4. Setup Options (Groups & Values)
*   **Action**: Define what the client can choose.
*   **API (Group)**: `POST /api/v1/admin/variants/:variantId/option-groups`
    *   `{ "name": "paper_quality", "label": "Paper Quality", "display_order": 1 }`
*   **API (Values)**: `POST /api/v1/admin/groups/:groupId/option-values`
    *   `{ "code": "250GSM", "label": "250 GSM Matte", "display_order": 1 }`

### 5. Define Pricing Combinations
*   **Action**: map combinations to a unit price.
*   **API**: `POST /api/v1/admin/variants/:variantId/pricing`
*   **Payload**: 
    ```json
    {
      "paper_quality": "250GSM",
      "holder_type": "standard",
      "price": 15.50
    }
    ```

---

## 🛒 CLIENT FLOW: Browsing & Ordering

### 1. Initial Login
*   **Action**: Client logs in.
*   **API**: `POST /api/v1/auth/login`
*   **Payload**: `{ "phone_number": "9800000000", "password": "..." }`

### 2. Browse Product Config
*   **Action**: Fetch full details of a variant including all options and existing pricing matrix.
*   **API**: `GET /api/v1/admin/variants/:variantId/full-details`
*   **Result**: Returns all groups, values, and valid pricing combinations.

### 3. Placing the Order
*   **Action**: Client chooses options and quantity, and applies a discount.
*   **API**: `POST /api/v1/orders`
*   **Payload**:
    ```json
    {
      "variantId": "...",
      "quantity": 100,
      "options": {
        "paper_quality": "250GSM",
        "holder_type": "standard",
        "configDetails": [
          {
            "groupName": "paper_quality",
            "groupLabel": "Paper Quality",
            "selectedCode": "250GSM",
            "selectedLabel": "250 GSM Matte"
          }
        ]
      },
      "discount": {
        "type": "percentage",
        "value": 10
      },
      "notes": "Urgent delivery"
    }
    ```

### 4. Tracking Order
*   **Action**: Client views their order history.
*   **API**: `GET /api/v1/orders` (List) or `GET /api/v1/orders/:orderId` (Details)

---

## ⚙️ Backend Logic Recap
1.  **Resolution**: Searches `VariantPricing` table for the exact match of `holder_type`, `paper_quality`, etc.
2.  **Pricing Snapshot**: Saves the resolved base price and the discount applied in the `pricing_snapshot` (JSONB) of the order.
3.  **Audit**: Saves individual selections in `OrderConfiguration` to ensure the exact user choice is recorded.
