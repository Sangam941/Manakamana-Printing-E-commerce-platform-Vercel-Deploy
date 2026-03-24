# ID Card Order API Workflow Documentation

This document describes the workflow and API endpoints for the newly implemented ID card ordering system, including catalog management and discount logic.

## Base URL
`http://localhost:8005/api/v1`

---

## 1. Catalog Browsing (Public / Client)

### Get All Categories
`GET /order-categories`
- **Purpose**: Fetch all active product categories (e.g., ID Cards, Visiting Cards).
- **Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "cat_uuid",
      "name": "ID Cards",
      "slug": "id-cards",
      "imageUrl": "http://..."
    }
  ]
}
```

### Get Products by Category
`GET /order-categories/{categoryId}/products`
- **Purpose**: Fetch products/templates inside a category.
- **Note**: Clients see `basePrice` and discount info.
- **Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "prod_uuid",
      "name": "PVC ID Card",
      "code": "IDC-001",
      "basePrice": 25,
      "discountPercent": 10,
      "discountAmount": 0,
      "description": "Standard PVC card"
    }
  ]
}
```

---

## 2. Order Placement (Client)

### Create ID Card Order
`POST /orders/id-cards`
- **Auth Required**: Bearer Token (Role: CLIENT)
- **Request Body**:
```json
{
  "productId": "prod_uuid",
  "orderName": "My School Order",
  "quantity": 100,
  "printingSide": "double",
  "photosLink": "https://drive.google.com/...",
  "orientation": "portrait",
  "stripeColor": "Blue",
  "stripeText": "ABC School",
  "remark": "Urgent",
  "payFromWallet": true
}
```
- **Logic**: 
  - Calculates `subtotal = basePrice * quantity`.
  - Applies `discountPercent` and `discountAmount`.
  - If `payFromWallet` is true, deducts `totalAmount` from client's wallet and sets status to `confirmed`.
- **Response**:
```json
{
  "success": true,
  "message": "ID Card order placed successfully",
  "data": {
    "id": "order_uuid",
    "status": "confirmed",
    "paymentStatus": "paid",
    "totalAmount": 2250
  }
}
```

---

## 3. Order Management (Client)

### My ID Card Orders
`GET /orders/id-cards`
- **Auth Required**: Bearer Token (Role: CLIENT)

---

## 4. Catalog Management (Admin)

### Create Category
`POST /admin/order-categories`
- **Auth Required**: Bearer Token (Role: ADMIN)

### Create Product
`POST /admin/order-products`
- **Auth Required**: Bearer Token (Role: ADMIN)
- **Request Body**:
```json
{
  "categoryId": "cat_uuid",
  "name": "PVC ID Card",
  "code": "IDC-001",
  "basePrice": 25,
  "discountPercent": 10,
  "discountAmount": 0,
  "isActive": true
}
```

---

## 5. Order Management (Admin)

### List All ID Card Orders
`GET /admin/orders/id-cards`
- **Auth Required**: Bearer Token (Role: ADMIN)

### Update Order Status
`PATCH /admin/orders/id-cards/{orderId}/status`
- **Auth Required**: Bearer Token (Role: ADMIN)
- **Request Body**:
```json
{
  "status": "printed"
}
```
- **Allowed Status**: `pending_payment`, `confirmed`, `in_progress`, `printed`, `completed`, `cancelled`.
