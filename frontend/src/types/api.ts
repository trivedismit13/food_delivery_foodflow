// ─── ENUMS — must match backend exactly ──────────────────────────────────

export type UserRole = 'CUSTOMER' | 'OWNER' | 'ADMIN'

export type CreatorType = 
  | 'HOME_BAKER' 
  | 'TIFFIN_SERVICE' 
  | 'CAMPUS_SELLER'
  | 'WEEKEND_CHEF' 
  | 'CLOUD_KITCHEN' 
  | 'SPECIALTY_DESSERTS' 
  | 'HEALTHY_MEALS'

export type DropStatus = 
  | 'DRAFT' 
  | 'ANNOUNCED' 
  | 'OPEN' 
  | 'CUTOFF' 
  | 'READY' 
  | 'COMPLETED' 
  | 'CANCELLED'

export type OrderStatus = 
  | 'PLACED' 
  | 'PREPARING' 
  | 'READY'
  | 'ON_THE_WAY' 
  | 'DELIVERED' 
  | 'CANCELLED'

export type OrderType = 'REGULAR' | 'DROP_PREORDER'

export type PaymentMethod = 'CARD' | 'WALLET' | 'COD' | 'UPI'

export type PaymentStatus = 'SUCCESS' | 'FAILED' | 'PENDING'

export type NotificationType = 
  | 'DROP_ANNOUNCED'
  | 'DROP_OPEN'
  | 'DROP_CLOSING_SOON'
  | 'ORDER_CONFIRMED'
  | 'ORDER_READY'
  | 'ORDER_CANCELLED'
  | 'NEW_FOLLOWER'
  | 'LOW_STOCK'

export type VerificationLevel = 0 | 1 | 2 | 3

// ─── RESPONSE TYPES ──────────────────────────────────────────────────────

export interface AuthResponse {
  userId: number
  name: string
  email: string
  role: UserRole
  token: string
  expiresIn: number
  tokenType: string
  creatorProfile: CreatorSummary | null
}

export interface CreatorSummary {
  restaurantId: number
  name: string
  creatorType: CreatorType
  verificationLevel: VerificationLevel
  avgRating: number
  followerCount: number
  totalOrdersCompleted: number
  isAcceptingOrders: boolean
  activeDrop?: FoodDropResponse
}

export interface MenuItemResponse {
  menuItemId: number
  name: string
  description: string
  price: number
  imageUrl: string
  isAvailable: boolean
  isVegetarian: boolean
  isVegan: boolean
  isGlutenFree: boolean
  category: string
}

export interface RatingResponse {
  ratingId: number
  orderId: number
  score: number
  reviewText: string
  createdAt: string
  customerName: string
}

export interface CreatorResponse {
  restaurantId: number
  name: string
  creatorType: CreatorType
  bio: string
  instagramHandle: string | null
  city: string
  cuisine: string
  verificationLevel: VerificationLevel
  avgRating: number
  followerCount: number
  totalOrdersCompleted: number
  isAcceptingOrders: boolean
  isOpen: boolean
  announcement: string | null
  acceptsDelivery: boolean
  deliveryRadiusKm: number
  pickupAddress: string | null
  createdAt: string       // ISO 8601 — "2026-01-15T10:30:00"
  verification?: any
  activeDrops?: FoodDropResponse[]
}

export interface FoodDropResponse {
  dropId: number
  title: string
  description: string
  dropDate: string        // "2026-05-10" — date only
  orderCutoffTime: string // "2026-05-09T20:00:00" — datetime
  pickupStartTime: string | null
  pickupEndTime: string | null
  maxOrders: number
  currentOrders: number
  availableSlots: number  // computed by backend
  isSoldOut: boolean      // computed by backend
  status: DropStatus
  isDeliveryAvailable: boolean
  deliveryCharge: number
  dropPhotoUrl: string | null
  specialNotes: string | null
  creator: CreatorSummary
  items: DropItemResponse[]
  minutesUntilCutoff: number | null  // null if past
}

export interface DropItemResponse {
  itemId: number
  name: string
  description: string
  isVeg: boolean
  price: number
  dropPrice: number | null
  quantityAvailable: number
  quantityOrdered: number
  isSoldOut: boolean
}

export interface OrderResponse {
  orderId: number
  userId: number
  restaurantId: number
  restaurantName: string
  dropId: number | null
  dropTitle: string | null
  orderType: OrderType
  status: OrderStatus
  totalAmount: number
  orderDate: string
  pickupTime: string | null
  specialInstructions: string | null
  isDelivery: boolean
  deliveryAddress: string | null
  items: OrderItemResponse[]
  payment: PaymentResponse
}

export interface OrderItemResponse {
  orderItemId: number
  itemId: number
  itemName: string
  quantity: number
  priceEach: number
  lineTotal: number  // computed: priceEach * quantity
}

export interface PaymentResponse {
  paymentId: number
  method: PaymentMethod
  amount: number
  status: PaymentStatus
  paymentDate: string
}

export interface NotificationResponse {
  notificationId: number
  type: NotificationType
  title: string
  message: string
  referenceType: 'DROP' | 'ORDER' | 'USER' | null
  referenceId: number | null
  isRead: boolean
  createdAt: string
  timeAgo: string   // "2 hours ago" — computed by backend
}

export interface CreatorDashboardResponse {
  creatorId: number
  creatorName: string
  period: string
  totalRevenue: number
  totalOrders: number
  avgOrderValue: number
  revenueChange: number
  ordersChange: number
  repeatCustomerRate: number
  totalUniqueCustomers: number
  followerCount: number
  totalDrops: number
  completedDrops: number
  avgDropFillRate: number
  bestSellingItem: string
  bestDropTitle: string | null
  bestDayOfWeek: string | null
}

export interface InsightResponse {
  question: string
  insight: string
  supportingData: any
  supportingDataKeys: string[]
  confidence: number
  generatedAt: string
}

export interface WeeklyTrendResponse {
  week: string
  orders: number
  revenue: number
  uniqueCustomers: number
}

export interface TopItemResponse {
  itemName: string
  totalOrders: number
  totalRevenue: number
}

export interface RepeatCustomerResponse {
  repeatCustomers: number
  totalCustomers: number
  repeatRatePercent: number
}

export interface DropPerformanceResponse {
  dropTitle: string
  maxOrders: number
  currentOrders: number
  hoursToSellout: number
  dropDate: string
}

export interface BestDayResponse {
  dayOfWeek: string
  avgFillRate: number
  dropCount: number
  avgOrdersPerDrop: number
}

// ─── REQUEST TYPES ────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  phone: string
  role?: UserRole
}

export interface CreateDropRequest {
  title: string
  description: string
  dropDate: string        // "2026-05-10"
  orderCutoffTime: string // "2026-05-09T20:00:00"
  pickupStartTime?: string
  pickupEndTime?: string
  maxOrders: number
  isDeliveryAvailable: boolean
  deliveryCharge?: number
  dropPhotoUrl?: string
  specialNotes?: string
  items: {
    itemId: number
    quantityAvailable: number
    dropPrice?: number
  }[]
}

export interface PlaceDropOrderRequest {
  dropId: number
  items: {
    itemId: number
    quantity: number
  }[]
  paymentMethod: PaymentMethod
  pickupTime?: string
  specialInstructions?: string
  isDelivery: boolean
  deliveryAddress?: string
}

export interface SubmitRatingRequest {
  restaurantId: number
  ratingValue: number
  foodQualityRating?: number
  deliveryRating?: number
  packagingRating?: number
  reviewText?: string
}

// ─── PAGINATION ───────────────────────────────────────────────────────────

export interface Page<T> {
  content: T[]
  totalElements: number
  totalPages: number
  currentPage: number
  pageSize: number
  isFirst: boolean
  isLast: boolean
}
