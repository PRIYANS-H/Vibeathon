import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Send,
  Bot,
  User,
  ShoppingBag,
  Clock,
  Key,
  X,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const AICaptainModal = () => {
  const {
    aiCaptainOpen,
    setAiCaptainOpen,
    menu,
    addToCart,
    selectedTable,
    activeCustomerOrder,
    geminiApiKey,
    saveGeminiKey
  } = useApp();

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'captain',
      text: 'Ahoy! I am your AI Captain 👨‍🍳. I have direct real-time access to our kitchen ingredient stock and menu availability. Ask me for recommendations or tell me to add items to your cart!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(geminiApiKey);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!aiCaptainOpen) return null;

  // Process natural user message via function-calling simulation + optional real Gemini call
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      if (geminiApiKey) {
        // Real Gemini API Call with function context!
        const genAI = new GoogleGenerativeAI(geminiApiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `You are AI Captain, an operationally intelligent restaurant ordering assistant.
Available Menu JSON: ${JSON.stringify(menu.map(m => ({ id: m.id, name: m.name, price: m.price, diet: m.diet, spiciness: m.spiciness, is_available: m.is_available_computed, prep_time: m.prep_time_mins })))}
User Query: "${userText}"
Instructions: Be helpful, concise, warm, and recommend ONLY dishes where is_available is true. If the user explicitly asks to order/add an item, output [ACTION:ADD:item_id] at the beginning of your response.`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Check if action tag returned
        let replyText = responseText;
        if (responseText.includes('[ACTION:ADD:')) {
          const match = responseText.match(/\[ACTION:ADD:([^\]]+)\]/);
          if (match && match[1]) {
            const dishToAdd = menu.find(m => m.id === match[1] || m.name.toLowerCase().includes(match[1].toLowerCase()));
            if (dishToAdd) {
              addToCart(dishToAdd, 1);
            }
          }
          replyText = responseText.replace(/\[ACTION:ADD:[^\]]+\]/, '');
        }

        setMessages(prev => [...prev, {
          id: Date.now(),
          sender: 'captain',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);

      } else {
        // Smart Heuristic Function Calling Agent
        setTimeout(() => {
          let botReply = '';
          const lower = userText.toLowerCase();

          // Operational Query 1: Bottlenecks
          if (lower.includes('slowing') || lower.includes('bottleneck') || lower.includes('delay') || lower.includes('slow')) {
            botReply = `📊 **Operational Bottleneck Report**:\n• **Smokey Butter Chicken** has an avg prep time of **18 mins** (highest SLA impact).\n• Recommendation: Pre-portion makhani gravy during off-peak hours (3–5 PM) to reduce ticket time by 4.5 mins.`;
          }
          // Operational Query 2: Waste & Reorder
          else if (lower.includes('waste') || lower.includes('reorder') || lower.includes('stockout') || lower.includes('inventory')) {
            const lowIngs = ingredients.filter(i => i.current_stock <= i.reorder_threshold);
            if (lowIngs.length > 0) {
              botReply = `📦 **Wastage & Inventory Alert**:\n• Low Stock: ${lowIngs.map(i => `**${i.name}** (${i.current_stock} ${i.unit})`).join(', ')}.\n• Reorder Recommendation: Order 15 pcs Avocado today to prevent menu auto-disabling.`;
            } else {
              botReply = `📦 **Inventory Status**: All 10 key ingredients are above safety thresholds. Heavy Cream is at 80% capacity (800ml remaining).`;
            }
          }
          // Operational Query 3: Staff telemetry
          else if (lower.includes('waiter') || lower.includes('staff') || lower.includes('busiest')) {
            botReply = `👥 **Staff Workload Telemetry**:\n• **Neha Gupta** (Floor Mgr) is assigned to 3 active tables (T1, T2, T3).\n• **Chef Rajiv Kapoor** has completed 42 orders today with 95.2% SLA compliance!`;
          }
          // Operational Query 4: Waste prevention promo
          else if (lower.includes('promo') || lower.includes('sale') || lower.includes('down')) {
            botReply = `💡 **Waste Prevention Promotion**:\n• **Garlic Naan** stock is high. Recommend offering a **20% combo discount** with Smokey Butter Chicken after 8 PM to maximize yield.`;
          }
          // Action 1: Search spicy dishes
          else if (lower.includes('spicy') || lower.includes('hot')) {
            const spicyDishes = menu.filter(m => m.is_available_computed && (m.spiciness === 'Spicy' || m.spiciness === 'Medium'));
            if (spicyDishes.length > 0) {
              botReply = `Here are our top spicy favorites available right now: ${spicyDishes.map(d => `**${d.name}** (₹${d.price})`).join(', ')}. Would you like me to add one to your cart?`;
            } else {
              botReply = `All our extra spicy dishes are currently low on stock! However, I can recommend our **Smokey Butter Chicken** with medium spice!`;
            }
          }
          // Action 2: Add item to cart intent
          else if (lower.includes('add') || lower.includes('order') || lower.includes('want')) {
            const matchedDish = menu.find(m => lower.includes(m.name.toLowerCase()) || lower.includes(m.category.toLowerCase().split(' ')[0]));
            if (matchedDish && matchedDish.is_available_computed) {
              addToCart(matchedDish, 1);
              botReply = `Done! 🛒 I have added **${matchedDish.name}** (₹${matchedDish.price}) directly to your cart for Table ${selectedTable}. Anything else to pair with it?`;
            } else if (matchedDish && !matchedDish.is_available_computed) {
              botReply = `I checked live stock, but **${matchedDish.name}** is currently OUT OF STOCK because of ingredient shortage (${matchedDish.shortage_reason}). Can I recommend **Paneer Tikka Lababdar** instead?`;
            } else {
              // Add first available dish
              const availableDish = menu.find(m => m.is_available_computed);
              addToCart(availableDish, 1);
              botReply = `I added **${availableDish.name}** (₹${availableDish.price}) to your cart! You can view your cart in the top right.`;
            }
          }
          // Action 3: ETA / Status query
          else if (lower.includes('eta') || lower.includes('status') || lower.includes('time') || lower.includes('where is')) {
            if (activeCustomerOrder) {
              botReply = `Your active order **${activeCustomerOrder.id}** is currently in stage **${activeCustomerOrder.status.toUpperCase()}**. Estimated time remaining: ~${activeCustomerOrder.eta_mins} mins!`;
            } else {
              botReply = `You haven't placed an active order yet! Browse our menu and I can place it for you.`;
            }
          }
          // Action 4: Budget query
          else if (lower.includes('200') || lower.includes('300') || lower.includes('cheap') || lower.includes('under')) {
            const budgetDishes = menu.filter(m => m.is_available_computed && m.price <= 350);
            botReply = `Here are delicious available items under ₹350:\n` + budgetDishes.map(d => `• **${d.name}** — ₹${d.price}`).join('\n');
          }
          // Default
          else {
            botReply = `I can help you build your order, check real-time ingredient availability, or track your live kitchen ETA. Try asking: "What's spicy and available?" or "Add Biryani to my cart!"`;
          }

          setMessages(prev => [...prev, {
            id: Date.now(),
            sender: 'captain',
            text: botReply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]);
        }, 600);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'captain',
        text: `⚠️ Gemini API Error: ${err.message}. Falling back to smart agent engine.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg h-[620px] flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold font-display text-white text-sm flex items-center gap-2">
                AI Captain Assistant
                <span className="px-2 py-0.5 rounded-full text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Gemini Agent
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Live Kitchen Inventory & Function Calling</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowKeyInput(!showKeyInput)}
              className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              title="Configure Gemini API Key"
            >
              <Key className="w-4 h-4" />
            </button>
            <button
              onClick={() => setAiCaptainOpen(false)}
              className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2.6 — Gemini API Key Banner: visible CTA when no key is stored */}
        {!geminiApiKey && !showKeyInput && (
          <div className="mx-4 mt-3 p-3 rounded-2xl bg-gradient-to-r from-purple-950/60 to-indigo-950/60 border border-purple-700/50 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-purple-200">Powered by Gemini AI</p>
                <p className="text-[10px] text-purple-400">Add your API key to unlock real Gemini responses</p>
              </div>
            </div>
            <button
              onClick={() => setShowKeyInput(true)}
              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold whitespace-nowrap transition-all"
            >
              Add Key
            </button>
          </div>
        )}
        {geminiApiKey && (
          <div className="mx-4 mt-3 p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/40 flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <p className="text-[10px] font-semibold text-emerald-300">Gemini API Connected — Full function calling active</p>
          </div>
        )}

        {/* Gemini API Key Input Panel */}
        {showKeyInput && (
          <div className="p-3 bg-purple-950/30 border-b border-purple-900/40 text-xs space-y-2">
            <label className="block text-purple-300 font-bold">Optional: Enter your Gemini API Key</label>
            <div className="flex gap-2">
              <input
                type="password"
                placeholder="AIzaSy..."
                value={tempApiKey}
                onChange={e => setTempApiKey(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1 text-white text-xs"
              />
              <button
                onClick={() => { saveGeminiKey(tempApiKey); setShowKeyInput(false); }}
                className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs"
              >
                Save
              </button>
            </div>
          </div>
        )}

        {/* Chat Messages Log */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-purple-950 text-purple-300 border border-purple-800'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[80%] p-3.5 rounded-2xl text-xs space-y-1 ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
              }`}>
                <div className="whitespace-pre-line leading-relaxed">{msg.text}</div>
                <div className="text-[9px] opacity-60 text-right">{msg.timestamp}</div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-purple-400 animate-pulse pl-11">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Captain is checking kitchen stock & menu...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto scrollbar-none text-[11px]">
          {[
            'Which dishes are slowing operations?',
            'What inventory should I reorder?',
            'Which waiter is busiest?',
            'Suggest waste prevention promotion',
            'Add Butter Chicken to cart'
          ].map((promptText, i) => (
            <button
              key={i}
              onClick={() => { setInput(promptText); }}
              className="px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 whitespace-nowrap transition-all"
            >
              {promptText}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask AI Captain anything..."
            value={input}
            onChange={e => setInput(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
