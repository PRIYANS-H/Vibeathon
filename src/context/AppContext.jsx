import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  INITIAL_INGREDIENTS,
  INITIAL_MENU,
  INITIAL_TABLES,
  INITIAL_ORDERS,
  INITIAL_STAFF,
  INITIAL_ANALYTICS,
  INITIAL_FEEDBACK
} from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentRole, setCurrentRole] = useState('customer');
  const [user, setUser] = useState({
    name: 'Alex Rivera',
    email: 'alex@example.com',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
  });

  const [ingredients, setIngredients] = useState(INITIAL_INGREDIENTS);
  const [menu, setMenu] = useState(INITIAL_MENU);
  const [tables, setTables] = useState(INITIAL_TABLES);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [staff] = useState(INITIAL_STAFF);
  const [analytics] = useState(INITIAL_ANALYTICS);
  const [feedbackList, setFeedbackList] = useState(INITIAL_FEEDBACK);

  const [cart, setCart] = useState([]);
  const [selectedTable, setSelectedTable] = useState('T3');

  // FIX 1.2 — activeCustomerOrder is now a live derived ID, not a stale snapshot.
  // We store only the order ID, then look it up live from orders[] on each render.
  const [activeCustomerOrderId, setActiveCustomerOrderId] = useState(null);
  const activeCustomerOrder = useMemo(
    () => orders.find(o => o.id === activeCustomerOrderId) || null,
    [orders, activeCustomerOrderId]
  );

  // FIX 1.4 — Toast state
  const [toast, setToast] = useState({ visible: false, orderId: '', eta: 0, tableName: '' });
  const dismissToast = () => setToast(t => ({ ...t, visible: false }));

  // FIX 1.1 — Billing modal state
  const [billingOrderId, setBillingOrderId] = useState(null);
  const openBilling = (orderId) => setBillingOrderId(orderId);
  const closeBilling = () => setBillingOrderId(null);

  const [realtimeLogs, setRealtimeLogs] = useState([
    { id: 1, type: 'system', message: '⚡ Supabase Realtime Engine Connected', timestamp: 'Just now' },
    { id: 2, type: 'warning', message: '⚠️ Truffle Oil stock low (45 ml remaining)', timestamp: '2 mins ago' }
  ]);

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [aiCaptainOpen, setAiCaptainOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState(localStorage.getItem('gemini_api_key') || '');

  // 3.1 — Notifications system
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'stock', title: 'Low Stock Alert', message: 'Truffle Oil is below reorder threshold (45 ml)', read: false, time: '2 mins ago' },
    { id: 2, type: 'info',  title: 'System Ready',    message: 'AuraResto OS Platinum Engine is live', read: true, time: '5 mins ago' }
  ]);

  const pushNotification = (title, message, type = 'info') => {
    const n = {
      id: Date.now(),
      type,      // 'order' | 'stock' | 'ready' | 'billing' | 'info'
      title,
      message,
      read: false,
      time: 'Just now'
    };
    setNotifications(prev => [n, ...prev.slice(0, 14)]);
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const saveGeminiKey = (key) => {
    setGeminiApiKey(key);
    localStorage.setItem('gemini_api_key', key);
  };

  const pushRealtimeLog = (message, type = 'info') => {
    const newLog = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    setRealtimeLogs(prev => [newLog, ...prev.slice(0, 19)]);
  };

  // Auto-availability engine: derive menu availability from live ingredient stock
  const processedMenu = menu.map(item => {
    let isStockAvailable = true;
    let shortageReason = null;

    if (item.ingredients_required && item.ingredients_required.length > 0) {
      for (const req of item.ingredients_required) {
        const ing = ingredients.find(i => i.id === req.ingredient_id);
        if (!ing || ing.current_stock < req.quantity_required) {
          isStockAvailable = false;
          shortageReason = ing
            ? `Low Stock (${ing.name}: ${ing.current_stock} ${ing.unit} left)`
            : 'Missing ingredient data';
          break;
        }
      }
    }

    const isAvailable = item.is_available_manual_override && isStockAvailable;
    return {
      ...item,
      is_available_computed: isAvailable,
      is_stock_available: isStockAvailable,
      shortage_reason: shortageReason
    };
  });

  const toggleItemManualAvailability = (itemId) => {
    setMenu(prev => prev.map(item => {
      if (item.id === itemId) {
        const updated = !item.is_available_manual_override;
        pushRealtimeLog(`📌 Manual Override: "${item.name}" → ${updated ? 'Available' : 'Unavailable'}`, 'info');
        return { ...item, is_available_manual_override: updated };
      }
      return item;
    }));
  };

  const updateIngredientStock = (ingredientId, newStock) => {
    setIngredients(prev => prev.map(ing => {
      if (ing.id === ingredientId) {
        const safeStock = Math.max(0, newStock);
        pushRealtimeLog(`📦 Stock: ${ing.name} → ${safeStock} ${ing.unit}`, 'inventory');
        // 3.5 — Push low-stock notification automatically
        if (safeStock <= ing.reorder_threshold && ing.current_stock > ing.reorder_threshold) {
          pushNotification(
            'Low Stock Alert ⚠️',
            `${ing.name} dropped below reorder threshold (${safeStock} ${ing.unit} remaining)`,
            'stock'
          );
        }
        return { ...ing, current_stock: safeStock };
      }
      return ing;
    }));
  };

  // Cart operations
  const addToCart = (menuItem, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === menuItem.id);
      if (existing) {
        return prev.map(item => item.id === menuItem.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...menuItem, quantity }];
    });
    pushRealtimeLog(`🛒 Added: ${menuItem.name} ×${quantity}`, 'cart');
  };

  const updateCartQuantity = (menuItemId, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === menuItemId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const clearCart = () => setCart([]);

  // Place Order — decrements stock, sets active order, fires toast
  const placeOrder = () => {
    if (cart.length === 0) return null;

    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const maxPrepTime = Math.max(...cart.map(item => item.prep_time_mins || 12));
    const activeKitchenOrders = orders.filter(o => o.status === 'placed' || o.status === 'in_kitchen').length;
    const computedEta = maxPrepTime + (activeKitchenOrders * 3);
    const tableInfo = tables.find(t => t.id === selectedTable);

    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      table_id: selectedTable,
      table_number: tableInfo?.number || 'Table 3',
      customer_name: user.name,
      status: 'placed',
      items: cart.map(item => ({
        menu_item_id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        status: 'queued'
      })),
      total_amount: totalAmount,
      created_at: new Date().toISOString(),
      target_sla_mins: maxPrepTime + 5,
      eta_mins: computedEta,
      station: cart.some(i => i.category?.includes('Gourmet')) ? 'Grill & Fryer' : 'Curry & Tandoor'
    };

    // Decrement ingredient stock
    setIngredients(prev => {
      const nextIngs = [...prev];
      cart.forEach(cartItem => {
        const menuItem = menu.find(m => m.id === cartItem.id);
        if (menuItem?.ingredients_required) {
          menuItem.ingredients_required.forEach(req => {
            const idx = nextIngs.findIndex(i => i.id === req.ingredient_id);
            if (idx !== -1) {
              nextIngs[idx] = {
                ...nextIngs[idx],
                current_stock: Math.max(0, nextIngs[idx].current_stock - req.quantity_required * cartItem.quantity)
              };
            }
          });
        }
      });
      return nextIngs;
    });

    setTables(prev => prev.map(t =>
      t.id === selectedTable ? { ...t, status: 'occupied', current_order_id: newOrder.id } : t
    ));
    setOrders(prev => [newOrder, ...prev]);

    // FIX 1.2 — store only the ID; activeCustomerOrder derives live from orders[]
    setActiveCustomerOrderId(newOrder.id);
    clearCart();

    // FIX 1.4 — trigger toast
    setToast({
      visible: true,
      orderId: newOrder.id,
      eta: computedEta,
      tableName: newOrder.table_number
    });

    // 3.2 — Push order placed notification
    pushNotification(
      'Order Confirmed! 🎉',
      `${newOrder.id} for ${newOrder.table_number} — ETA ~${computedEta} mins`,
      'order'
    );

    pushRealtimeLog(`🔥 NEW ORDER ${newOrder.id} → ${newOrder.table_number} | ETA ~${computedEta} mins`, 'order');
    return newOrder;
  };

  // Update order status (Kitchen / Staff)
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(ord => {
      if (ord.id !== orderId) return ord;
      const updated = { ...ord, status: newStatus };

      if (newStatus === 'ready') {
        // 3.4 — Push "order ready" customer notification
        pushNotification(
          '🍽️ Your Order is Ready!',
          `${ord.id} for ${ord.table_number} is ready for pickup!`,
          'ready'
        );
        pushRealtimeLog(`🔔 ORDER ${ord.id} READY → ${ord.table_number} — Notifying customer`, 'success');
      } else if (newStatus === 'served') {
        updated.eta_mins = 0;
        setTables(prevT => prevT.map(t =>
          t.id === ord.table_id ? { ...t, status: 'free', current_order_id: null } : t
        ));
        pushRealtimeLog(`✅ ORDER ${ord.id} SERVED → ${ord.table_number} | Table freed`, 'success');
      } else if (newStatus === 'billed') {
        pushRealtimeLog(`💳 ORDER ${ord.id} BILLED & CLOSED — payment received`, 'success');
      } else {
        pushRealtimeLog(`🔄 Order ${ord.id} → ${newStatus.toUpperCase()}`, 'info');
      }
      return updated;
    }));
  };

  const submitFeedback = (rating, comment, dish) => {
    const newFb = {
      id: `fb_${Date.now()}`,
      customer: user.name,
      rating,
      comment,
      timestamp: 'Just now',
      dish: dish || 'General Meal'
    };
    setFeedbackList(prev => [newFb, ...prev]);
    pushRealtimeLog(`⭐ ${rating}-Star review from ${user.name} — feeds AI recommendations`, 'success');
  };

  const updateTableStatus = (tableId, newStatus) => {
    setTables(prev => prev.map(t => t.id === tableId ? { ...t, status: newStatus } : t));
    const tbl = tables.find(t => t.id === tableId);
    pushRealtimeLog(`🪑 ${tbl?.number} → ${newStatus.toUpperCase()}`, 'info');
  };

  return (
    <AppContext.Provider value={{
      currentRole, setCurrentRole,
      user, setUser,
      ingredients,
      menu: processedMenu,
      rawMenu: menu,
      tables,
      orders,
      staff,
      analytics,
      feedbackList,
      cart,
      selectedTable, setSelectedTable,
      activeCustomerOrder,
      activeCustomerOrderId,
      toast, dismissToast,
      billingOrderId, openBilling, closeBilling,
      // 3.1 — notifications
      notifications, pushNotification, markAllNotificationsRead,
      realtimeLogs,
      authModalOpen, setAuthModalOpen,
      aiCaptainOpen, setAiCaptainOpen,
      feedbackModalOpen, setFeedbackModalOpen,
      geminiApiKey, saveGeminiKey,
      toggleItemManualAvailability,
      updateIngredientStock,
      addToCart,
      updateCartQuantity,
      clearCart,
      placeOrder,
      updateOrderStatus,
      submitFeedback,
      updateTableStatus,
      pushRealtimeLog
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
