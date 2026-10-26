export const brand = {
  name: 'RYTHARA',
  tagline: 'మా ఊరి పంట — ప్రతి ఇంటికి',
  englishTagline: 'Grown by Farmers. Delivered to Your Family.',
  // Replace with your real WhatsApp number (international format, no +).
  whatsappNumber: '919999999999',
  email: 'hello@annadata.example',
  phone: '+91 99999 99999',
  address: 'Your Business Address, City, State — India',
  promise: 'From Farmer to Customer. No Unnecessary Middlemen. Just Honest Quality.',
};

export const buildWhatsAppOrderLink = (lines: string[]): string => {
  const intro = `Hello ${brand.name}, I would like to place an order:`;
  const body = [intro, '', ...lines].join('\n');
  return `https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(body)}`;
};

export const buildWhatsAppEnquiryLink = (productName: string): string => {
  const body = `Hello ${brand.name}, I would like to enquire about ${productName}.`;
  return `https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(body)}`;
};
