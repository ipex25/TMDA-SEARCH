export enum DatabaseType {
  REGISTERED_DEVICES = 'Registered Medical Devices',
  NOTIFIED_DEVICES = 'Notified Medical Devices',
  REGISTERED_MEDICINES = 'Registered Medicines',
}

export enum SearchCategory {
  PRODUCT_NAME = 'Product Name',
  GENERIC_NAME = 'Generic/Common Name',
  MANUFACTURER = 'Manufacturer',
  MANUFACTURING_COUNTRY = 'Manufacturing Country',
  LOCAL_REPRESENTATIVE_HOLDER = 'Local Representative/Holder',
}

export interface SearchResultItem {
  productName: string;
  genericName: string;
  manufacturer: string;
  country: string;
  representativeOrHolder: string;
  registrationNumber: string;
  status: 'Active' | 'Expired' | 'Suspended' | 'Notified';
  
  // Optional, for medicines
  dosageForm?: string;
  strength?: string;
  
  // Links
  productLink: string;
  manufacturerLink: string;
}
