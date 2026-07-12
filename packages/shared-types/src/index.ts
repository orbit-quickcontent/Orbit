export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: 'USER' | 'PARTNER' | 'EDITOR' | 'ADMIN';
  avatar?: string;
  isOnline?: boolean;
}

export interface Package {
  id: string;
  name: string;
  tier: 'PERSONALIZED' | 'PROFESSIONAL';
  price: number;
  focus: string;
  deliveryTime: string;
  features: string[];
  popular: boolean;
}

export interface Partner {
  id: string;
  userId: string;
  location: string;
  latitude: number;
  longitude: number;
  availability: boolean;
  isVerified: boolean;
  rating: number;
  completedProjects: number;
  deviceInfo?: string;
  walletBalance: number;
  pendingClearance: number;
  totalWithdrawn: number;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'FAILED';
  payoutEnabled: boolean;
  accountHolderName?: string;
  encryptedAccountNumber?: string;
  ifscCode?: string;
  bankName?: string;
  branchName?: string;
  panNumber?: string;
}

export interface Booking {
  id: string;
  userId: string;
  packageId: string;
  bookingDate: string;
  timeSlot: string;
  location?: string;
  notes?: string;
  status: 'PENDING' | 'PAID' | 'PARTNER_DISPATCHED' | 'EN_ROUTE' | 'READY_TO_EDIT' | 'EDITING' | 'DELIVERED' | 'COMPLETED';
  paymentStatus: 'UNPAID' | 'SUCCESS' | 'FAILED';
  paymentId?: string;
  paymentMethod?: string;
  syncPercentage: number;
  partnerId?: string;
  editorId?: string;
  footageUrls?: string; // JSON string
  proxyFootageUrl?: string;
  masterReelUrl?: string;
  deliveredAt?: string;
  dispatchRound?: number;
  type?: 'delivery' | 'editing' | 'media';
}

export interface PayoutRetry {
  bookingId: string;
  amount: number;
  beneficiaryBankAccount: string;
  beneficiaryIFSC: string;
  status: 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED';
  retryCount: number;
  nextRetryAt: string;
  errorMessage?: string;
  idempotencyKey: string;
}
