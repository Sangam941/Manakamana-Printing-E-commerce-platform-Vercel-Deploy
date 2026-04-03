import { Service, Order } from "@/types";

export const SERVICES: Service[] = [

    // {
    //     id: "bill-books",
    //     name: "Bill Books",
    //     isActive: true,
    //     route: "/orders/create/bill-book",
    //     image: "/images/printing-services/bill-books/BILL-1.jpg",
    // },
    {
        id: "id-cards",
        name: "ID Cards",
        isActive: true,
        route: "/orders/create/id-card",
        image: "/images/printing-services/id/id-1.webp",
    },
    // {
    //     id: "pamphlets",
    //     name: "Pamphlets",
    //     isActive: true,
    //     route: "/orders/create/pamphlets",
    //     image: "/images/printing-services/pamplets.jpg",
    // },
    // {
    //     id: "visiting-cards",
    //     name: "Visiting Cards",
    //     isActive: true,
    //     route: "/orders/create/visiting-cards",
    //     image: "/images/printing-services/v-card.jpg",
    // },

];

export const TEMPLATE_CATEGORIES = [
    "Visiting Cards",
    "Letterheads",
    "Envelopes",
    "ID Cards",
    "Garment Tags",
];

export const PAPER_TYPES = [
    "Matte",
    "Glossy",
    "Satin",
    "Recycled",
    "Bond",
    "Art Paper",
];

export const FINISHING_OPTIONS = [
    "Standard",
    "Lamination (Glossy)",
    "Lamination (Matte)",
    "UV Coating",
    "Embossing",
    "Spot UV",
];

export const MOCK_ORDERS: Order[] = [
    {
        id: "ORD001",
        orderName: "Visiting Cards Batch",
        service: "Visiting Cards",
        quantity: 2000,
        paperType: "Matte",
        finishingOption: "Lamination (Glossy)",
        designId: "D203",
        orderType: "STANDARD",
        status: "ORDER_DELIVERED",
        date: "2026-02-15",
    },
    {
        id: "ORD002",
        orderName: "Company Letterheads",
        service: "Letterheads",
        quantity: 500,
        paperType: "Bond",
        finishingOption: "Standard",
        orderType: "STANDARD",
        status: "ORDER_PROCESSING",
        date: "2026-03-01",
    },
    {
        id: "ORD003",
        orderName: "Event Pamphlets",
        service: "Pamphlets",
        quantity: 1000,
        paperType: "Glossy",
        finishingOption: "UV Coating",
        designId: "D301",
        orderType: "CUSTOM",
        status: "ORDER_ACCEPTED",
        date: "2026-03-04",
    },
    {
        id: "ORD004",
        orderName: "Staff ID Cards",
        service: "ID Cards",
        quantity: 50,
        paperType: "Art Paper",
        finishingOption: "Lamination (Matte)",
        orderType: "STANDARD",
        status: "ORDER_PLACED",
        date: "2026-03-05",
    },
    {
        id: "ORD005",
        orderName: "Brand Envelopes",
        service: "Envelopes",
        quantity: 300,
        paperType: "Bond",
        finishingOption: "Standard",
        orderType: "STANDARD",
        status: "ORDER_DISPATCHED",
        date: "2026-02-28",
    },
];
