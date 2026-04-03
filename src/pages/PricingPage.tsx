import { useEffect, useMemo, useState } from "react";
import { api } from "@/services/api";
import { Check } from "lucide-react";
import { toast } from "sonner";

// Add Razorpay type to window for TypeScript
declare global {
  interface Window {
    Razorpay?: any;
  }
}

const plans = [
  {
    id: 1,
    name: "Free",
    canonicalName: "free",
    price: 0,
    displayPrice: "₹0",
    period: "forever",
    credits: 2,
    description: "Perfect for trying out AI Meeting Intelligence",
    features: [
      "2 credits included",
      "Up to 30 minutes per meeting",
      "Basic transcription",
      "Basic AI summary",
      "Email support",
      "7-day history"
    ],
    cta: "Start Free",
    highlighted: false
  },
  {
    id: 2,
    name: "One Time",
    canonicalName: "one_time",
    price: 19,
    displayPrice: "₹19",
    period: "one-time",
    credits: 1,
    description: "For heavy users who need maximum usage",
    features: [
      "1 credit (one-time purchase)",
      "Up to 3 hours per meeting",
      "Full AI intelligence",
      "Advanced analytics dashboard",
      "Fastest processing priority",
      "Unlimited history",
      "Export + integrations",
      "Early access to new features"
    ],
    cta: "Upgrade to Power",
    highlighted: false
  },
  {
    id: 3,
    name: "Starter",
    canonicalName: "starter",
    price: 149,
    displayPrice: "₹149",
    period: "per month",
    credits: 25,
    description: "For individuals getting started with productivity",
    features: [
      "25 credits per month",
      "Up to 60 minutes per meeting",
      "AI summaries + key points",
      "Action items extraction",
      "Priority processing",
      "30-day history",
      "Email support"
    ],
    cta: "Upgrade to Starter",
    highlighted: true
  },
  {
    id: 4,
    name: "Pro",
    canonicalName: "pro",
    price: 249,
    displayPrice: "₹249",
    period: "per month",
    credits: 100,
    description: "For professionals who rely on meetings daily",
    features: [
      "100 credits per month",
      "Up to 2 hours per meeting",
      "Advanced AI summaries + insights",
      "Action items + decisions tracking",
      "Speaker-wise insights",
      "Priority support",
      "Unlimited history",
      "Export (PDF / text)"
    ],
    cta: "Upgrade to Pro",
    highlighted: false
  }
];

type SubscriptionSnapshot = {
  currentPlanLabel: string;
  currentPlanCanonical: string;
  availableCredits: number | null;
  expiresAt: string | null;
};

const FALLBACK_SUBSCRIPTION: SubscriptionSnapshot = {
  currentPlanLabel: "Free",
  currentPlanCanonical: "free",
  availableCredits: null,
  expiresAt: null
};

const normalizePlanName = (planName: string | null | undefined) => {
  if (!planName) return "free";
  return planName.toLowerCase().trim().replace(/\s+/g, "_");
};

const getPlanLabelFromCanonical = (canonicalName: string) => {
  const match = plans.find((plan) => plan.canonicalName === canonicalName);
  if (match) return match.name;

  return canonicalName
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

const safeParseAuthUser = (): Record<string, any> => {
  try {
    const value = localStorage.getItem("auth_user");
    if (!value || value === "undefined") return {};
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const pickPlanFromUserPayload = (user: Record<string, any>) => {
  const nested = user.subscription && typeof user.subscription === "object" ? user.subscription : {};
  const possible = [
    user.plan,
    user.currentPlan,
    user.subscriptionPlan,
    user.planName,
    nested.plan,
    nested.name
  ];
  const first = possible.find((value) => typeof value === "string" && value.trim().length > 0);
  return normalizePlanName(first);
};

const pickExpiryFromUserPayload = (user: Record<string, any>) => {
  const nested = user.subscription && typeof user.subscription === "object" ? user.subscription : {};
  const possible = [
    user.planExpiry,
    user.plan_expiry,
    user.expiry,
    user.expiryDate,
    user.subscriptionExpiry,
    user.expiresAt,
    nested.expiresAt,
    nested.expiryDate
  ];
  const first = possible.find((value) => typeof value === "string" && value.trim().length > 0);
  return first ?? null;
};

const formatExpiry = (isoDate: string | null) => {
  if (!isoDate) return "No expiry";
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return "No expiry";

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
};

const PricingPage = () => {
  const [subscription, setSubscription] = useState<SubscriptionSnapshot>(FALLBACK_SUBSCRIPTION);
  const [isSubscriptionLoading, setIsSubscriptionLoading] = useState(true);

  const currentPlanCanonical = useMemo(
    () => normalizePlanName(subscription.currentPlanCanonical),
    [subscription.currentPlanCanonical]
  );

  useEffect(() => {
    const hydrateSubscription = async () => {
      const userPayload = safeParseAuthUser();
      const fallbackPlanCanonical = pickPlanFromUserPayload(userPayload);
      const fallbackExpiry = pickExpiryFromUserPayload(userPayload);

      let planCanonical = fallbackPlanCanonical;
      let expiresAt = fallbackExpiry;
      let availableCredits: number | null = null;

      const [subscriptionResult, creditsResult] = await Promise.allSettled([
        api.meetings.getSubscriptionStatus(),
        api.meetings.getCredits()
      ]);

      if (subscriptionResult.status === "fulfilled") {
        const payload = subscriptionResult.value.data ?? subscriptionResult.value;
        const apiPlan = normalizePlanName(payload.plan);
        const apiExpiry = typeof payload.expiry === "string" ? payload.expiry : null;
        planCanonical = apiPlan || fallbackPlanCanonical;
        expiresAt = apiExpiry ?? fallbackExpiry;
      }

      if (creditsResult.status === "fulfilled") {
        availableCredits = creditsResult.value.availableCredits;
      }

      setSubscription({
        currentPlanLabel: getPlanLabelFromCanonical(planCanonical),
        currentPlanCanonical: planCanonical,
        availableCredits,
        expiresAt
      });
      setIsSubscriptionLoading(false);
    };

    hydrateSubscription();
  }, []);

  const refreshCreditsAfterDelay = (delayMs = 2500) => {
    setTimeout(() => {
      window.location.reload();
    }, delayMs);
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (plan) => {
    if (plan.price === 0) {
      toast.success("Free plan activated.");
      return;
    }

    // Ensure Razorpay SDK is loaded
    const loaded = await loadRazorpay();
    if (!loaded) {
      toast.error("Failed to load Razorpay SDK. Please check your internet connection and try again.");
      return;
    }

    // Step 1: Call backend to create order
    try {
      const payload = {
        amount: plan.price * 100, // Razorpay expects paise
        currency: "INR",
        receipt: `receipt_${plan.canonicalName}_${Date.now()}`,
        plan: plan.canonicalName,
        notes: {
          plan: plan.canonicalName,
          description: plan.description
        }
      };
      const result = await api.payment.createOrder(payload);
      if (!result.success || !result.order) throw new Error("Order creation failed");
      const order = result.order;
      // Step 2: Open Razorpay Checkout
      const options = {
        key: "rzp_test_SXuAmU9gruZ30G", // TODO: Replace with your real key
        amount: order.amount,
        currency: order.currency,
        name: "AI Meeting Intelligence",
        description: plan.name + " Plan",
        order_id: order.id,
        handler: async function (response) {
          console.log("Payment successful, verifying...", response);
          // Step 3: Send payment details to backend for verification
          try {
            const verifyData = await api.payment.verify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            console.log("Payment verification result:", verifyData);
            if (verifyData.success) {
              toast.success("Payment verified. Refreshing credits...", {
                duration: 2500
              });
              refreshCreditsAfterDelay();
            } else {
              toast.error("Payment verification failed. Please contact support.");
            }
          } catch (err) {
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: "Test User",
          email: "user@email.com",
          contact: "9999999999"
        },
        theme: {
          color: "#2563eb"
        }
      };
      console.log("Loading Razorpay SDK...", options);
      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        toast.error("Razorpay SDK not loaded.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Payment failed. Please try again.");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-16 md:py-16 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-blue-600 text-sm font-semibold tracking-widest uppercase mb-3">
            Flexible Plans
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Start free and upgrade when you need more. All plans can be customized for your needs.
          </p>
        </div>

        {/* Current Subscription Summary */}
        <div className="mb-10 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-white p-5 md:p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest font-semibold text-blue-700 mb-2">
                Your Current Subscription
              </p>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                {isSubscriptionLoading ? "Loading..." : subscription.currentPlanLabel} Plan
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full md:w-auto">
              <div className="rounded-xl border border-blue-200 bg-white px-4 py-3 min-w-[170px]">
                <p className="text-xs uppercase tracking-wide text-gray-500">Available Credits</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {isSubscriptionLoading
                    ? "..."
                    : subscription.availableCredits === null
                      ? "—"
                      : subscription.availableCredits}
                </p>
              </div>

              <div className="rounded-xl border border-blue-200 bg-white px-4 py-3 min-w-[170px]">
                <p className="text-xs uppercase tracking-wide text-gray-500">Plan Expiry</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {isSubscriptionLoading ? "..." : formatExpiry(subscription.expiresAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {plans.map((plan) => (
            (() => {
              const isCurrentPlan = !isSubscriptionLoading && currentPlanCanonical === plan.canonicalName;
              return (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                isCurrentPlan
                  ? "border-emerald-500 bg-white shadow-xl shadow-emerald-200/40"
                  : plan.highlighted
                  ? "border-blue-600 bg-white shadow-xl shadow-blue-400/20 lg:scale-105"
                  : "border-gray-200 bg-white shadow-md hover:shadow-lg hover:border-blue-300"
              }`}
            >
              {isCurrentPlan && (
                <div className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Current Plan
                </div>
              )}

              {/* Popular Badge */}
              {plan.highlighted && !isCurrentPlan && (
                <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}

              {/* Card Content */}
              <div className="p-8 flex flex-col h-full">
                {/* Plan Header */}
                <div className="mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                {/* Pricing */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-5xl md:text-6xl font-bold text-gray-900">
                      {plan.displayPrice}
                    </span>
                    <span className="text-lg text-gray-600">/ {plan.period}</span>
                  </div>
                  
                  {/* Credits Badge */}
                  <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-50 text-blue-700 text-sm font-semibold rounded-lg border border-blue-200">
                    <span className="text-lg">⚡</span>
                    <span>
                      {plan.credits} {plan.credits === 1 ? "credit" : "credits"} included
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-gray-200 mb-6" />

                {/* Features */}
                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        plan.highlighted ? "text-blue-600" : "text-blue-600"
                      }`} />
                      <span className={`text-sm ${
                        plan.highlighted ? "text-gray-700 font-medium" : "text-gray-700"
                      }`}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  disabled={isCurrentPlan}
                  onClick={() => {
                    console.log(`Selected plan: ${plan.name}`);
                    handlePayment(plan);
                  }}
                  className={`w-full py-3 px-4 rounded-lg font-semibold text-base transition-all duration-200 ${
                    isCurrentPlan
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200 cursor-not-allowed"
                      : plan.highlighted
                      ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-200"
                  }`}
                >
                  {isCurrentPlan ? "Current Plan" : plan.cta}
                </button>
              </div>
            </div>
              );
            })()
          ))}
        </div>

        {/* Footer Note */}
        <div className="text-center mt-12">
          <p className="text-gray-600 text-sm">
            💳 Secure payment via Razorpay • No hidden fees • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;