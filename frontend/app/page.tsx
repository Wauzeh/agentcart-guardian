"use client";
import { useEffect, useState } from "react";
export default function Home() {
  const cart = {
  items: [
    {
      name: "Wireless Headphones",
      price: 1999,
    },
    {
      name: "USB-C Cable",
      price: 500,
    },
  ],
  total: 2499,
  };

  const trustedPrices: Record<string, number> = {
    "Wireless Headphones": 1999,
    "USB-C Cable": 500,
  };

  const calculatedTotal = cart.items.reduce(
    (sum, item) => sum + item.price,
    0
  );

  const totalVerified = calculatedTotal === cart.total;

  const priceIssues = cart.items.filter(
    (item) => trustedPrices[item.name] !== item.price
  );

  const priceVerified =
    priceIssues.length === 0 && totalVerified;

  const guardianProtected = priceVerified;  
  const guardianDecision: "ALLOW" | "BLOCK" =
  guardianProtected ? "ALLOW" : "BLOCK";

  const [message, setMessage] = useState("");

  const [checkoutStatus, setCheckoutStatus] = useState<
  "idle" | "allowed" | "blocked"
  >("idle");

  useEffect(() => {
    setCheckoutStatus("idle");
  }, [guardianProtected]);

  const handleCheckout = () => {
    if (guardianDecision === "BLOCK") {
      setCheckoutStatus("blocked");
      return;
    }

    setCheckoutStatus("allowed");
  };

  const [response, setResponse] = useState("");

  const [loading, setLoading] = useState(false);
  const sendMessage = async () => {
  if (!message.trim() || loading) return;

  setLoading(true);

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        cart,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Something went wrong.");
    }

    setResponse(data.message);
    setMessage("");
  } catch (error) {
    console.error(error);
    setResponse("Sorry, I couldn't reach the Guardian AI.");
  } finally {
    setLoading(false);
  }
};
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        
        {/* Header */}
        <header className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-2xl font-bold">AgentCart Guardian</h1>
            <p className="mt-1 text-sm text-slate-400">
              AI-powered checkout protection
            </p>
          </div>

          <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400">
            ● System Online
          </div>
        </header>

        {/* Main dashboard */}
        <section className="grid gap-6 py-8 md:grid-cols-3">
          
        {/* Cart */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm text-slate-400">Current Cart</p>

          <h2 className="mt-2 text-3xl font-bold">
          ₹{cart.total.toLocaleString("en-IN")}
        </h2>

        <div className="mt-6 space-y-4">
          {cart.items.map((item, index) => (
        <div
          key={item.name}
          className={`flex justify-between ${
            index > 0 ? "text-slate-400" : ""
          }`}
        >
          <span>{item.name}</span>
          <span>₹{item.price.toLocaleString("en-IN")}</span>
        </div>
      ))}

      </div>

        <button
          onClick={handleCheckout}
          className="mt-8 w-full rounded-xl bg-white px-4 py-3 font-semibold text-slate-950 hover:bg-slate-200"
        >
          Proceed to Checkout
        </button>
        
        {checkoutStatus === "allowed" && (
        <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-400">
          ✓ Guardian verified the cart. Checkout is approved.
        </div>
      )}

        {checkoutStatus === "blocked" && (
        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          <p className="font-semibold">
            ⚠ Price mismatch detected
          </p>

          {priceIssues.map((item) => (
          <p key={item.name} className="mt-2">
            <span className="font-medium">{item.name}</span>: cart shows ₹
            {item.price.toLocaleString("en-IN")}, trusted price is ₹
            {trustedPrices[item.name].toLocaleString("en-IN")}.
          </p>
        ))}

          {!totalVerified && (
          <p className="mt-2">
            Cart total is ₹{cart.total.toLocaleString("en-IN")}, but the
            calculated total is ₹{calculatedTotal.toLocaleString("en-IN")}.
          </p>
        )}

          <p className="mt-2">
            Checkout has been blocked for your protection.
          </p>
        </div>
      )}

      </div>


          {/* AI Assistant */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">AI Assistant</p>
            <h2 className="mt-2 text-xl font-semibold">
              How can I help?
            </h2>

            <div className="mt-6 rounded-xl bg-slate-800 p-4 text-sm text-slate-300">
              {response ? (
                <div className="space-y-2">
                {response.split("\n").map((line, index) => {
                const parts = line.split("**");

                return (
                <p key={index}>
                {parts.map((part, partIndex) =>
                partIndex % 2 === 1 ? (
                <strong key={partIndex}>{part}</strong>
                ) : (
              part
            )
          )}
          </p>
          );
            })}
            </div>
            ) : (
    "I can help you find products, compare options, and guide you through checkout."
            )}
            </div>

            <div className="mt-4 flex gap-2">
              <input
                type="text"
                placeholder="Ask about your cart..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    sendMessage();
                  }
                }}  
                className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none placeholder:text-slate-500 focus:border-slate-500"
              />

              <button
                onClick={sendMessage}
                disabled={loading}
                className="rounded-xl bg-white px-4 py-3 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Thinking..." : "Send"}
              </button>
            </div>
          </div>

          {/* Guardian */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Guardian Status</p>

            <div className="mt-6 flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  guardianProtected
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-red-500/10 text-red-400"
                }`}
              >
            {guardianProtected ? "✓" : "⚠"}
            </div>

            <div>
            <p className="font-semibold">
              {guardianProtected ? "Protected" : "Checkout Blocked"}
            </p>

            <p className="text-sm text-slate-400">
              {guardianProtected
                ? "Checkout controls active"
                : "Guardian detected a cart integrity issue"}
            </p>
          </div>
        </div>

            <div className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Inventory check</span>
                <span className="text-emerald-400">Ready</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Price validation</span>

              {priceVerified ? (
                <span className="text-emerald-400">✓ Verified</span>
              ) : (
                <span className="text-red-400">⚠ Mismatch</span>
              )}
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Payment protection</span>
                <span className="text-emerald-400">Ready</span>
              </div>
            </div>
          </div>
        </section>

        {/* Activity */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Activity</h2>
              <p className="text-sm text-slate-400">
                Recent agent and checkout events
              </p>
            </div>

            <span className="text-xs text-slate-500">LIVE</span>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <p className="text-sm">Cart created</p>
                <p className="text-xs text-slate-500">2 minutes ago</p>
              </div>
              <span className="text-xs text-emerald-400">SUCCESS</span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <p className="text-sm">Inventory verified</p>
                <p className="text-xs text-slate-500">1 minute ago</p>
              </div>
              <span className="text-xs text-emerald-400">SUCCESS</span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">Guardian initialized</p>
                <p className="text-xs text-slate-500">Just now</p>
              </div>
              <span className="text-xs text-emerald-400">ACTIVE</span>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}