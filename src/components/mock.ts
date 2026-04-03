export const heroData = {
  headline: "Turn Your Meetings Into Actionable Insights in Seconds",
  subheadline:
    "Upload your meeting recordings and instantly get AI-powered transcription, intelligent summaries, and actionable items. Never miss a detail again.",
  trustText: "No credit card required • Free to start",
  ctaPrimary: "Start Free",
  ctaSecondary: "Upload Your First Meeting",
};

export const howItWorksSteps = [
  {
    id: 1,
    title: "Upload Meeting Recording",
    description:
      "Drag and drop your audio or video file. Supports all major formats including MP3, MP4, WAV, and more.",
  },
  {
    id: 2,
    title: "AI Transcribes & Analyzes",
    description:
      "Our advanced AI engine processes your recording in minutes, generating accurate transcripts and insights.",
  },
  {
    id: 3,
    title: "Get Summary + Action Items",
    description:
      "Receive a clean summary, extracted action items, and key decisions instantly in your dashboard.",
  },
];

export const features = [
  {
    id: 1,
    title: "AI Transcription",
    description:
      "Industry-leading accuracy with support for multiple languages and accents. Get word-perfect transcripts every time.",
  },
  {
    id: 2,
    title: "Smart Summaries",
    description:
      "Automatically generated summaries that capture the essence of your meeting in digestible bullet points.",
  },
  {
    id: 3,
    title: "Action Item Extraction",
    description:
      "AI identifies tasks, deadlines, and responsibilities so you know exactly what needs to be done.",
  },
  {
    id: 4,
    title: "Fast Processing",
    description:
      "Get your results in minutes, not hours. Our optimized AI pipeline ensures lightning-fast turnaround.",
  },
  {
    id: 5,
    title: "Clean UI Dashboard",
    description:
      "Beautiful, intuitive interface that makes reviewing and sharing your meeting insights effortless.",
  },
];

export const useCases = [
  {
    id: 1,
    title: "Freelancers",
    description:
      "Keep track of client calls, project requirements, and deliverables without manual note-taking.",
    audience: "Client Calls & Project Management",
  },
  {
    id: 2,
    title: "Founders",
    description:
      "Never miss critical decisions from team meetings. Focus on building, not writing notes.",
    audience: "Team Meetings & Strategy Sessions",
  },
  {
    id: 3,
    title: "Students",
    description:
      "Transform lectures into study guides with transcripts, summaries, and key concepts extracted automatically.",
    audience: "Lectures & Study Groups",
  },
  {
    id: 4,
    title: "Recruiters",
    description:
      "Review candidate interviews efficiently with transcripts and AI-generated candidate summaries.",
    audience: "Interviews & Candidate Evaluation",
  },
];

export const pricingPlans = [
  {
    id: 1,
    name: "Free",
    price: "₹0",
    period: "forever",
    description: "Perfect for trying out AI Meeting Intelligence",
    features: [
      "2 meetings per month",
      "Up to 30 minutes per meeting",
      "Basic transcription",
      "Basic AI summary",
      "Email support",
    ],
    cta: "Start Free",
    highlighted: false,
  },
  {
    id: 2,
    name: "Starter",
    price: "₹149",
    period: "per month",
    description: "For individuals getting started with productivity",
    features: [
      "25 meetings per month",
      "Up to 60 minutes per meeting",
      "AI summaries + key points",
      "Action items extraction",
      "Priority processing",
      "Email support",
    ],
    cta: "Upgrade to Starter",
    highlighted: true,
  },
  {
    id: 3,
    name: "Pro",
    price: "₹299",
    period: "per month",
    description: "For professionals who rely on meetings daily",
    features: [
      "100 meetings per month",
      "Up to 2 hours per meeting",
      "Advanced AI summaries + insights",
      "Action items + decisions tracking",
      "Speaker-wise insights",
      "Priority support",
      "Export (PDF / text)",
    ],
    cta: "Upgrade to Pro",
    highlighted: false,
  },
  {
    id: 4,
    name: "Power",
    price: "₹799",
    period: "per month",
    description: "For heavy users who need maximum usage",
    features: [
      "Unlimited meetings (fair usage policy)",
      "Up to 3 hours per meeting",
      "Full AI intelligence (summary + insights + analytics)",
      "Advanced analytics dashboard",
      "Fastest processing priority",
      "Export + integrations (future-ready)",
      "Early access to new features",
    ],
    cta: "Upgrade to Power",
    highlighted: false,
  },
];

export const testimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Product Manager at TechFlow",
    content:
      "This tool has been a game-changer for our team. We can focus on the conversation instead of frantically taking notes. The action items extraction is incredibly accurate.",
    avatar: "SC",
  },
  {
    id: 2,
    name: "Marcus Johnson",
    role: "Freelance Consultant",
    content:
      "I used to spend hours reviewing client calls. Now I get a perfect summary and action list within minutes. Worth every penny.",
    avatar: "MJ",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Graduate Student",
    content:
      "My study sessions have become so much more efficient. I can actually focus during lectures knowing everything is being captured and summarized.",
    avatar: "ER",
  },
];

export const footerLinks = {
  product: [
    { name: "Pricing", href: "/pricing" },
    { name: "Features", href: "#features" },
    { name: "How It Works", href: "#how-it-works" },
  ],
  company: [
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Careers", href: "/careers" },
  ],
  legal: [
    { name: "Privacy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
  ],
  auth: [
    { name: "Login", href: "/login" },
    { name: "Sign Up", href: "/signup" },
  ],
};
