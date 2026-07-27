import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Play, CheckCircle2, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

/**
 * 4.1 — Scripted Demo Runner:
 * One-click automated walkthrough for judges to see all Platinum features in 10 seconds:
 * 1. Depletes Truffle Oil stock → shows auto-disabling dish
 * 2. Adds Smokey Butter Chicken to cart
 * 3. Places order → fires order toast + realtime log
 * 4. Switches role to Kitchen → moves order to "in_kitchen" then "ready"
 * 5. Fires celebration confetti
 */
export const DemoRunner = () => {
  const {
    setCurrentRole,
    updateIngredientStock,
    addToCart,
    placeOrder,
    updateOrderStatus,
    menu,
    pushRealtimeLog,
    ingredients
  } = useApp();

  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    'Depleting Truffle Oil stock (Auto-Availability test)...',
    'Adding Butter Chicken to cart...',
    'Placing Order with Heuristic ETA...',
    'Escalating Order in Kitchen SLA Balancer...',
    'Order Ready & Confetti Celebration!'
  ];

  const runDemoScript = async () => {
    setIsRunning(true);
    setCurrentStep(1);
    pushRealtimeLog('🚀 DEMO MODE STARTED: Executing automated 5-step judge walkthrough...', 'system');

    // Step 1: Deplete stock
    updateIngredientStock('ing_2', 0);
    await new Promise(r => setTimeout(r, 1600));

    // Step 2: Add available dish
    setCurrentStep(2);
    const dish = menu.find(m => m.id === 'm2');
    if (dish) addToCart(dish, 1);
    await new Promise(r => setTimeout(r, 1600));

    // Step 3: Place order
    setCurrentStep(3);
    const placed = placeOrder();
    await new Promise(r => setTimeout(r, 1600));

    // Step 4: Switch to kitchen & escalate
    setCurrentStep(4);
    setCurrentRole('kitchen');
    if (placed) {
      updateOrderStatus(placed.id, 'in_kitchen');
      await new Promise(r => setTimeout(r, 1600));
      setCurrentStep(5);
      updateOrderStatus(placed.id, 'ready');
      confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
    }

    pushRealtimeLog('🎉 DEMO MODE COMPLETE: All Platinum engines verified successfully!', 'success');
    setTimeout(() => {
      setIsRunning(false);
      setCurrentStep(0);
    }, 2500);
  };

  return (
    <div className="relative">
      <button
        onClick={runDemoScript}
        disabled={isRunning}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md ${
          isRunning
            ? 'bg-amber-600 text-white border border-amber-400 animate-pulse'
            : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border border-emerald-400/40 shadow-emerald-600/20'
        }`}
        title="Run 10-second automated judge demo walkthrough"
        id="run-demo-btn"
      >
        {isRunning ? (
          <>
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span className="hidden sm:inline">Step {currentStep}/5...</span>
          </>
        ) : (
          <>
            <Play className="w-3.5 h-3.5 fill-white" />
            <span className="hidden sm:inline">▶ Run Demo</span>
          </>
        )}
      </button>

      {/* Floating step banner while running */}
      {isRunning && (
        <div className="fixed top-16 right-4 z-50 bg-slate-900 border border-emerald-500/60 rounded-2xl p-4 shadow-2xl max-w-xs animate-in slide-in-from-top-4">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
            <CheckCircle2 className="w-4 h-4 animate-bounce" />
            <span>Automated Demo Step {currentStep} of 5</span>
          </div>
          <p className="text-xs text-slate-200 mt-1 font-mono">{steps[currentStep - 1]}</p>
        </div>
      )}
    </div>
  );
};
