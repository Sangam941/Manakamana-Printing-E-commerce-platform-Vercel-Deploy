export const ADMIN_PHONE = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER

export const sendWhatsApp = (message: string) => {
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${ADMIN_PHONE}?text=${encodedMessage}`;
    window.open(url, "_blank");
};

export const buildRegistrationMessage = (data: {
    business_name: string;
    owner_name: string;
    phone_number: string;
    email: string;
    business_address: string;
    notes?: string;
}) => {
    return `Hello Manakamana Printing Press,

A new client registration request has been submitted.

Company Name: ${data.business_name}
Contact Person: ${data.owner_name}
Phone: ${data.phone_number}    
Email: ${data.email}
Address: ${data.business_address}
Printing Needs: ${data.notes}

Please review this request and provide Client ID and password.`;
};

export const buildOrderMessage = (data: {
    clientId: string;
    orderName: string;
    service: string;
    quantity: number;
    paperType: string;
    finishingOption: string;
    designId?: string;
}) => {
    return `Hello Admin,

A new printing order has been created.

Client ID: ${data.clientId}
Order Name: ${data.orderName}
Service: ${data.service}
Quantity: ${data.quantity}
Paper: ${data.paperType}
Finishing: ${data.finishingOption}${data.designId ? `\nDesign ID: ${data.designId}` : ""}

Please confirm this order.`;
};

export const buildTemplateMessage = (data: {
    clientId: string;
    templateName: string;
    category: string;
}) => {
    return `Hello Admin,

A client wants to confirm a template design.

Client ID: ${data.clientId}
Template Name: ${data.templateName}
Category: ${data.category}

Please review this template for printing approval.`;
};

export const buildCustomDesignMessage = (data: {
    clientId: string;
    designType: string;
    fileName?: string;
}) => {
    return `Hello Admin,

Client wants to submit a custom design.

Client ID: ${data.clientId}
Design Type: ${data.designType}

Design file: ${data.fileName ? data.fileName : "Attached in WhatsApp chat"}.

Please review and generate a Design ID.`;
};
