#  Full System Flow: Complete API Guide

This document provides a technical walkthrough of every feature in the platform, from initial registration to final order fulfillment.

---

##  1. CLIENT ONBOARDING FLOW

Before a client can order, they must submit a registration request for admin approval.

### 1.1 Request Registration (Public)
*   **Action**: Prospective client submits their business details.
*   **API**: `POST /api/v1/register-request`
*   **Payload**: ` { "business_name": "...", "owner_name": "...", "phone_number": "...", "email": "...", "address": "..." }`

### 1.2 Approve Client (Admin)
*   **Action**: Admin reviews and approves the request to create a login.
*   **API**: `POST /api/v1/admin/registration-requests/:requestId/approve`

---

## 2. ADMIN SETUP: Catalog & Templates

Admins must define how products are priced, how they accept payments, and what design templates are available.

### 2.1 Setup Wallet Payment Details
*   **Action**: Define bank accounts for clients to send money to.
*   **API**: `POST /api/v1/admin/wallet/payment-details`
*   **Payload**: `{ "companyName": "...", "bankName": "...", "accountNumber": "...", "paymentId": "mankamana@online" }`

### 2.2 Template Management (Categories & Files)
*   **Action**: Setup design categories (e.g., Visiting Cards, Banners) and upload sample templates.
*   **API (Category)**: `POST /api/v1/admin/templates/categories` -> `{ "name": "Visiting Cards", "slug": "visiting-cards" }`
*   **API (Template)**: `POST /api/v1/admin/templates` (Multipart/form-data: `{ "title": "Corporate Design", "categoryId": "...", "file": [TEMPLATE_FILE] }`)

### 2.3 Define Universal Products
*   **Action**: Create the parent Product and its Variants.
*   **API (Product)**: `POST /api/v1/admin/products` -> Returns `productId`
*   **API (Variant)**: `POST /api/v1/admin/products/:productId/variants` -> Returns `variantId`

### 2.4 Setup Options & Pricing Matrix
*   **Action**: Map attributes (Paper, Binding) and assign prices.
*   **API (Group)**: `POST /api/v1/admin/variants/:variantId/option-groups`
*   **API (Value)**: `POST /api/v1/admin/groups/:groupId/option-values`
*   **API (Pricing)**: `POST /api/v1/admin/variants/:variantId/pricing` -> `{ "paper_quality": "250GSM", "price": 25.50 }`

---

## 3. DESIGN FLOW (Submission & Approval)

Clients use templates or categories to submit their designs.

### 3.1 Browse Templates (Client)
*   **Action**: Fetch existing categories and available templates to start designing.
*   **API (Categories)**: `GET /api/v1/templates/categories`
*   **API (Templates)**: `GET /api/v1/templates` (optional: `?categoryId=...`)

### 3.2 Submit Design (Client)
*   **Action**: Upload a design file for a specific template.
*   **API**: `POST /api/v1/design-submissions` (Multipart/form-data: `{ "templateId": "...", "title": "My Design", "file": [DESIGN_FILE] }`)

### 3.3 Approve Design (Admin)
*   **Action**: Admin verifies design and approves it.
*   **API**: `POST /api/v1/admin/design-submissions/:submissionId/approve`
*   **Result**: Generates an **Approved Design ID** (e.g., `DSN-2026-00001`).

---

##  4. WALLET FLOW (Funding)

Clients must fund their wallet before payment.

### 4.1 Submit Top-up Proof (Client)
*   **Action**: Send money and upload proof.
*   **API**: `POST /api/v1/wallet/topup-requests` (Multipart/form-data: `{ "amount": 5000, "paymentMethod": "ONLINE", "proofFile": [IMAGE] }`)

### 4.2 Approve Top-up (Admin)
*   **Action**: Admin verifies receipt and credits balance.
*   **API**: `POST /api/v1/admin/wallet/topup-requests/:requestId/approve`

---

##  5. ORDERING FLOW (Universal Pricing)

### 5.1 Create Order (Client)
*   **Action**: Selects variant, options, and attaches an approved design.
*   **API**: `POST /api/v1/orders`
*   **Payload**:
    ```json
    {
      "variantId": "...",
      "quantity": 500,
      "designId": "DSN-2026-00001",
      "options": {
        "paper_quality": "250GSM",
        "configDetails": [
           { "groupName": "paper_quality", "groupLabel": "Paper", "selectedCode": "250GSM", "selectedLabel": "250 GSM Matte" }
        ]
      }
    }
    ```

### 5.2 Pay via Wallet (Client)
*   **Action**: Deduct funds and verify balance.
*   **API**: `POST /api/v1/wallet/orders/:orderId/confirm-wallet-payment`
*   **Result**: Status moves to `confirmed`.

### 5.3 Order Fulfillment (Admin)
*   **Action**: Admin manages production status.
*   **API**: `PATCH /api/v1/admin/orders/:orderId/status` -> `{ "status": "COMPLETED" }`.
