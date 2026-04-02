"use client";

import React from "react";
import { BackendProduct, ProductConfig } from "@/types";

export const PRODUCT_CONFIGS: Record<string, ProductConfig> = {
  ID_CARD: {
    type: "ID_CARD",
    fields: [
      { type: "number", id: "quantity", label: "Quantity", min: 1, icon: "🔢", hint: "(Min Qty. : 1)" },
      {
        type: "select",
        id: "printing_side",
        label: "Printing Side",
        icon: "🖨️",
        options: [
          { value: "single", label: "Single Side" },
          { value: "double", label: "Double Side" },
        ],
      },
      { type: "text", id: "photos_link", label: "Photos Link", icon: "🔗", placeholder: "Google Drive/Dropbox link...", hint: "(Optional)" },
      {
        type: "select",
        id: "orientation",
        label: "Orientation",
        icon: "📐",
        options: [
          { value: "landscape", label: "Landscape" },
          { value: "portrait", label: "Portrait" },
        ],
      },
    ],
    calculatePrice: (product, state) => {
      const qty = parseInt(state.quantity) || 1;
      const isDouble = state.printing_side === "double";
      const basePrice = product.base_price;
      
      // Basic logic: double side adds 50% to base price (example logic, adjust as needed)
      const unitPrice = isDouble ? basePrice * 1.5 : basePrice;
      let total = qty * unitPrice;
      
      let discount = 0;
      if (product.discount_type === "percentage") {
        discount = (total * product.discount_value) / 100;
      } else if (product.discount_type === "fixed") {
        discount = product.discount_value * qty;
      }
      
      return { applicableCost: total, discount };
    },
    renderInfo: (product) => (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <h3 className="text-black font-semibold text-lg mb-3">Product Description</h3>
        <ul className="space-y-1.5 text-sm text-gray-700 font-medium">
          <li><span className="text-gray-500 font-normal">● Product Code : </span><span className="font-bold text-gray-800">{product.product_code}</span></li>
          <li><span className="text-gray-500 font-normal">● Name : </span><span className="font-bold text-gray-800">{product.name}</span></li>
          <li><span className="text-gray-500 font-normal">● Description : </span><span className="text-gray-600 italic">"{product.description}"</span></li>
          <li><span className="text-gray-500 font-normal">● Material : </span><span className="font-bold text-gray-800">Best Binding Quality</span></li>
          <li><span className="text-gray-500 font-normal">● Production Time : </span><span className="font-bold text-gray-800">5-7 Working Days</span></li>
          <li><span className="text-gray-500 font-normal">● Base Price : </span><span className="font-bold text-blue-600">Rs. {product.base_price}/-</span></li>
          {product.discount_value > 0 && (
            <li>
                <span className="text-gray-500 font-normal">● Discount : </span>
                <span className="font-bold text-green-600">
                    {product.discount_type === "percentage" ? `${product.discount_value}% OFF` : `Rs. ${product.discount_value} OFF per unit`}
                </span>
            </li>
          )}
        </ul>
        <div className="mt-4 border-t border-blue-100 pt-3">
             <h4 className="text-xs font-bold text-blue-800 uppercase mb-1">Important Note</h4>
             <p className="text-[11px] text-blue-600 italic line-clamp-2">● Both Side Printing Available Only 100 GSM Deo Paper. Please mention serial number in file.</p>
        </div>
      </div>
    ),
  },

  
  BILL_BOOK: {
    type: "BILL_BOOK",
    fields: [
      { type: "number", id: "quantity", label: "Quantity", min: 10, icon: "📦", hint: "(Min Qty. : 10)" },
      {
        type: "select",
        id: "paper1",
        label: "1st Paper Quality",
        icon: "📄",
        options: [
          { value: "100 GSM Deo (Multicolor)", label: "100 GSM Deo (Multicolor)" },
          { value: "90 GSM Sunshine (Multicolor)", label: "90 GSM Sunshine (Multicolor)" },
        ],
      },
      {
        type: "select",
        id: "paper2",
        label: "2nd Copy Paper Color",
        icon: "📄",
        options: [
          { value: "56 GSM Maplitho (Pink)", label: "56 GSM Maplitho (Pink)" },
          { value: "56 GSM Maplitho (Yellow)", label: "56 GSM Maplitho (Yellow)" },
          { value: "56 GSM Maplitho (Green)", label: "56 GSM Maplitho (Green)" },
        ],
      },
      {
        type: "select",
        id: "binding",
        label: "Binding Quality",
        icon: "📚",
        options: [
          { value: "Quarter Bound", label: "Quarter Bound" },
          { value: "Perfect Binding", label: "Perfect Binding" },
        ],
      },
      { type: "text", id: "serial_start", label: "Starting Serial No.", icon: "🔢", placeholder: "e.g. 001", hint: "(Required)" },
    ],
    calculatePrice: (product, state) => {
        const qty = parseInt(state.quantity) || 10;
        const basePrice = product.base_price || 150;
        
        let total = qty * basePrice;
        let discount = 0;
        
        if (qty >= 50) {
            discount = 20 * qty; // Example logic from static data
        }
        
        return { applicableCost: total, discount };
    },
    renderInfo: (product) => (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h3 className="text-black font-semibold text-lg mb-3">Bill Book Details</h3>
          <ul className="space-y-1.5 text-sm text-gray-700 font-medium">
            <li><span className="text-gray-500 font-normal">● Product Code : </span><span className="font-bold text-gray-800">{product.product_code}</span></li>
            <li><span className="text-gray-500 font-normal">● Binding : </span><span className="font-bold text-gray-800">Premium Binding Quality</span></li>
            <li><span className="text-gray-500 font-normal">● 1st Copy : </span><span className="font-bold text-gray-800">Multicolor Printing</span></li>
            <li><span className="text-gray-500 font-normal">● Production : </span><span className="font-bold text-gray-800">5-7 Working Days</span></li>
            <li><span className="text-gray-500 font-normal">● Base Price : </span><span className="font-bold text-blue-600">Rs. {product.base_price}/-</span></li>
          </ul>
          <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-[11px] text-yellow-800">
              <strong>Notice:</strong> Please mention the starting serial number clearly in your CDR or PDF design file.
          </div>
        </div>
    ),
  },
};
