// Initial mock data with complete ingredient mappings for auto-availability engine
export const INITIAL_INGREDIENTS = [
  { id: 'ing_1', name: 'Paneer (Cottage Cheese)', unit: 'g', current_stock: 1200, reorder_threshold: 400 },
  { id: 'ing_2', name: 'Truffle Oil', unit: 'ml', current_stock: 45, reorder_threshold: 50 }, // Low stock initial for demo!
  { id: 'ing_3', name: 'Burger Buns', unit: 'pcs', current_stock: 18, reorder_threshold: 5 },
  { id: 'ing_4', name: 'Chicken Breast', unit: 'g', current_stock: 2500, reorder_threshold: 500 },
  { id: 'ing_5', name: 'Basmati Rice', unit: 'g', current_stock: 4000, reorder_threshold: 1000 },
  { id: 'ing_6', name: 'Heavy Cream', unit: 'ml', current_stock: 800, reorder_threshold: 200 },
  { id: 'ing_7', name: 'Avocado', unit: 'pcs', current_stock: 2, reorder_threshold: 5 }, // Low stock initial!
  { id: 'ing_8', name: 'Mozzarella Cheese', unit: 'g', current_stock: 1500, reorder_threshold: 300 },
  { id: 'ing_9', name: 'Garlic Butter', unit: 'g', current_stock: 900, reorder_threshold: 150 },
  { id: 'ing_10', name: 'Saffron Threads', unit: 'g', current_stock: 10, reorder_threshold: 2 }
];

export const INITIAL_MENU = [
  {
    id: 'm1',
    name: 'Royal Truffle Mushroom Burger',
    category: 'Gourmet Mains',
    price: 349,
    rating: 4.9,
    description: 'Brioche bun, wild forest mushrooms, melted swiss, infused with rare black truffle oil.',
    diet: 'Veg',
    spiciness: 'Mild',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    prep_time_mins: 14,
    is_available_manual_override: true,
    ingredients_required: [
      { ingredient_id: 'ing_2', quantity_required: 15 }, // Truffle Oil
      { ingredient_id: 'ing_3', quantity_required: 1 }    // Bun
    ]
  },
  {
    id: 'm2',
    name: 'Smokey Butter Chicken (Murgh Makhani)',
    category: 'Signature Curries',
    price: 420,
    rating: 4.95,
    description: 'Char-grilled chicken cooked in rich makhani gravy enriched with fresh heavy cream and butter.',
    diet: 'Non-Veg',
    spiciness: 'Medium',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80',
    prep_time_mins: 18,
    is_available_manual_override: true,
    ingredients_required: [
      { ingredient_id: 'ing_4', quantity_required: 200 }, // Chicken
      { ingredient_id: 'ing_6', quantity_required: 80 }   // Cream
    ]
  },
  {
    id: 'm3',
    name: 'Artisanal Avocado Toast & Poached Egg',
    category: 'Starters & Bowls',
    price: 299,
    rating: 4.7,
    description: 'Sourdough slice topped with smashed hass avocado, chili flakes, microgreens & poached egg.',
    diet: 'Eggitarian',
    spiciness: 'Mild',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80',
    prep_time_mins: 10,
    is_available_manual_override: true,
    ingredients_required: [
      { ingredient_id: 'ing_7', quantity_required: 1 } // Avocado (Low stock!)
    ]
  },
  {
    id: 'm4',
    name: 'Hyderabadi Zafrani Dum Biryani',
    category: 'Signature Curries',
    price: 450,
    rating: 4.98,
    description: 'Long-grain basmati rice layered with aromatic spices, tender chicken, saffron and mint.',
    diet: 'Non-Veg',
    spiciness: 'Spicy',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
    prep_time_mins: 22,
    is_available_manual_override: true,
    ingredients_required: [
      { ingredient_id: 'ing_4', quantity_required: 250 }, // Chicken
      { ingredient_id: 'ing_5', quantity_required: 300 }, // Rice
      { ingredient_id: 'ing_10', quantity_required: 1 }   // Saffron
    ]
  },
  {
    id: 'm5',
    name: 'Paneer Tikka Lababdar',
    category: 'Signature Curries',
    price: 360,
    rating: 4.8,
    description: 'Clay-oven roasted cottage cheese cubes simmered in tangy tomato onion gravy.',
    diet: 'Veg',
    spiciness: 'Medium',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80',
    prep_time_mins: 15,
    is_available_manual_override: true,
    ingredients_required: [
      { ingredient_id: 'ing_1', quantity_required: 180 }, // Paneer
      { ingredient_id: 'ing_6', quantity_required: 40 }   // Cream
    ]
  },
  {
    id: 'm6',
    name: 'Garlic Butter Naan (2 pcs)',
    category: 'Breads & Sides',
    price: 99,
    rating: 4.85,
    description: 'Traditional tandoor-baked leavened flatbread brushed generously with garlic butter.',
    diet: 'Veg',
    spiciness: 'Mild',
    image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=600&q=80',
    prep_time_mins: 8,
    is_available_manual_override: true,
    ingredients_required: [
      { ingredient_id: 'ing_9', quantity_required: 30 } // Garlic Butter
    ]
  },
  {
    id: 'm7',
    name: 'Classic Margherita Wood-Fired Pizza',
    category: 'Gourmet Mains',
    price: 380,
    rating: 4.75,
    description: 'Hand-tossed crust, San Marzano tomato sauce, fresh mozzarella cheese & basil leaves.',
    diet: 'Veg',
    spiciness: 'Mild',
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=600&q=80',
    prep_time_mins: 16,
    is_available_manual_override: true,
    ingredients_required: [
      { ingredient_id: 'ing_8', quantity_required: 150 } // Mozzarella
    ]
  },
  {
    id: 'm8',
    name: 'Mango Lassi & Cardamom Crunch',
    category: 'Beverages & Desserts',
    price: 140,
    rating: 4.9,
    description: 'Traditional chilled yogurt smoothie flavored with Alphonso mango pulp and cardamom.',
    diet: 'Veg',
    spiciness: 'Mild',
    image: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=600&q=80',
    prep_time_mins: 5,
    is_available_manual_override: true,
    ingredients_required: [
      { ingredient_id: 'ing_6', quantity_required: 50 } // Cream
    ]
  }
];

export const INITIAL_TABLES = [
  { id: 'T1', number: 'Table 1', capacity: 2, status: 'occupied', current_order_id: 'ORD-101' },
  { id: 'T2', number: 'Table 2', capacity: 4, status: 'occupied', current_order_id: 'ORD-102' },
  { id: 'T3', number: 'Table 3', capacity: 4, status: 'free', current_order_id: null },
  { id: 'T4', number: 'Table 4', capacity: 6, status: 'reserved', current_order_id: null },
  { id: 'T5', number: 'Table 5', capacity: 2, status: 'free', current_order_id: null },
  { id: 'T6', number: 'Table 6', capacity: 8, status: 'free', current_order_id: null }
];

export const INITIAL_ORDERS = [
  {
    id: 'ORD-101',
    table_id: 'T1',
    table_number: 'Table 1',
    customer_name: 'Aarav Sharma',
    status: 'in_kitchen', // placed, in_kitchen, ready, served, billed
    items: [
      { menu_item_id: 'm1', name: 'Royal Truffle Mushroom Burger', quantity: 1, price: 349, status: 'cooking' },
      { menu_item_id: 'm8', name: 'Mango Lassi & Cardamom Crunch', quantity: 1, price: 140, status: 'ready' }
    ],
    total_amount: 489,
    created_at: new Date(Date.now() - 14 * 60 * 1000).toISOString(), // 14 mins ago
    target_sla_mins: 18,
    eta_mins: 4,
    station: 'Grill & Drinks'
  },
  {
    id: 'ORD-102',
    table_id: 'T2',
    table_number: 'Table 2',
    customer_name: 'Priya Verma',
    status: 'placed',
    items: [
      { menu_item_id: 'm2', name: 'Smokey Butter Chicken', quantity: 1, price: 420, status: 'queued' },
      { menu_item_id: 'm6', name: 'Garlic Butter Naan (2 pcs)', quantity: 2, price: 198, status: 'queued' }
    ],
    total_amount: 618,
    created_at: new Date(Date.now() - 4 * 60 * 1000).toISOString(), // 4 mins ago
    target_sla_mins: 20,
    eta_mins: 16,
    station: 'Curry Tandoor'
  },
  {
    id: 'ORD-100',
    table_id: 'T5',
    table_number: 'Table 5',
    customer_name: 'Vikram Mehta',
    status: 'served',
    items: [
      { menu_item_id: 'm4', name: 'Hyderabadi Zafrani Dum Biryani', quantity: 1, price: 450, status: 'served' }
    ],
    total_amount: 450,
    created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    target_sla_mins: 22,
    eta_mins: 0,
    station: 'Biryani Station'
  }
];

export const INITIAL_STAFF = [
  { id: 's1', name: 'Chef Rajiv Kapoor', role: 'Head Kitchen Chef', status: 'On Shift', active_orders_handling: 3 },
  { id: 's2', name: 'Neha Gupta', role: 'Floor Manager', status: 'On Shift', tables_assigned: ['T1', 'T2', 'T3'] },
  { id: 's3', name: 'Sanjay Kumar', role: 'Junior Sous Chef', status: 'On Shift', active_orders_handling: 2 },
  { id: 's4', name: 'Ananya Roy', role: 'Senior Waiter', status: 'On Break', tables_assigned: ['T4', 'T5', 'T6'] }
];

export const INITIAL_ANALYTICS = {
  todayRevenue: 28450,
  ordersCompleted: 42,
  averagePrepTime: 14.2,
  slaComplianceRate: 95.2,
  hourlySales: [
    { hour: '12 PM', sales: 3400, orders: 8 },
    { hour: '1 PM', sales: 6200, orders: 14 },
    { hour: '2 PM', sales: 4800, orders: 11 },
    { hour: '3 PM', sales: 2100, orders: 4 },
    { hour: '7 PM', sales: 7500, orders: 16 },
    { hour: '8 PM', sales: 8900, orders: 19 },
    { hour: '9 PM', sales: 5200, orders: 12 }
  ],
  topDishes: [
    { name: 'Smokey Butter Chicken', salesCount: 38, revenue: 15960 },
    { name: 'Hyderabadi Biryani', salesCount: 34, revenue: 15300 },
    { name: 'Garlic Butter Naan', salesCount: 72, revenue: 7128 },
    { name: 'Royal Truffle Burger', salesCount: 22, revenue: 7678 }
  ]
};

export const INITIAL_FEEDBACK = [
  { id: 'fb1', customer: 'Rohan Deshmukh', rating: 5, comment: 'The Truffle Burger was cooked to perfection! Live ETA tracker was spot on.', timestamp: '1 hour ago', dish: 'Royal Truffle Mushroom Burger' },
  { id: 'fb2', customer: 'Siddharth Nair', rating: 4, comment: 'Butter Chicken gravy was super rich. Quick table service!', timestamp: '2 hours ago', dish: 'Smokey Butter Chicken' },
  { id: 'fb3', customer: 'Kavita Singh', rating: 5, comment: 'AI Captain recommended the Biryani based on my spicy preference and it hit the spot.', timestamp: '3 hours ago', dish: 'Hyderabadi Zafrani Dum Biryani' }
];
