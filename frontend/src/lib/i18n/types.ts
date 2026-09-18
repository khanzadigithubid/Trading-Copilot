export type Locale = "en" | "ar" | "es" | "pt";

export interface Translations {
  // ── General ──────────────────────────────────────────────────
  appName: string;
  tagline: string;
  getStarted: string;
  signIn: string;
  signOut: string;
  register: string;
  loading: string;
  error: string;
  retry: string;
  save: string;
  cancel: string;
  close: string;
  submit: string;
  search: string;
  filter: string;
  all: string;
  noData: string;
  free: string;
  live: string;
  paperTrading: string;

  // ── Nav ──────────────────────────────────────────────────────
  nav: {
    markets: string;
    crypto: string;
    forex: string;
    stocks: string;
    commodities: string;
    indices: string;
    learn: string;
    news: string;
    leaderboard: string;
    about: string;
    contact: string;
    dashboard: string;
  };

  // ── Landing page ─────────────────────────────────────────────
  hero: {
    badge: string;
    heading1: string;
    heading2: string;
    subheading: string;
    cta: string;
    ctaSecondary: string;
    trustLine: string;
  };

  stats: {
    liveMarkets: string;
    aiStrategies: string;
    freeForever: string;
    liveData: string;
  };

  // ── Dashboard ────────────────────────────────────────────────
  dashboard: {
    title: string;
    capital: string;
    riskPerTrade: string;
    assets: string;
    status: string;
    tabs: {
      overview: string;
      chart: string;
      signals: string;
      trading: string;
      portfolio: string;
      alerts: string;
      community: string;
      aiTools: string;
    };
  };

  // ── Signals ──────────────────────────────────────────────────
  signals: {
    buy: string;
    sell: string;
    hold: string;
    confidence: string;
    reasoning: string;
    noAsset: string;
    generating: string;
    multiTimeframe: string;
  };

  // ── Trading ──────────────────────────────────────────────────
  trading: {
    openTrade: string;
    closeTrade: string;
    entryPrice: string;
    exitPrice: string;
    stopLoss: string;
    takeProfit: string;
    size: string;
    pnl: string;
    openTrades: string;
    closedTrades: string;
    noTrades: string;
    buyLabel: string;
    sellLabel: string;
    status: {
      open: string;
      closed: string;
    };
  };

  // ── Portfolio ────────────────────────────────────────────────
  portfolio: {
    title: string;
    equity: string;
    totalPnl: string;
    winRate: string;
    sharpeRatio: string;
    maxDrawdown: string;
    totalTrades: string;
    profitFactor: string;
    bestTrade: string;
    worstTrade: string;
    equityCurve: string;
  };

  // ── Auth ─────────────────────────────────────────────────────
  auth: {
    emailLabel: string;
    passwordLabel: string;
    confirmPassword: string;
    forgotPassword: string;
    resetPassword: string;
    loginTitle: string;
    loginSubtitle: string;
    registerTitle: string;
    registerSubtitle: string;
    invalidCredentials: string;
    noAccount: string;
    hasAccount: string;
    createAccount: string;
    signingIn: string;
    show: string;
    hide: string;
  };

  // ── News ─────────────────────────────────────────────────────
  news: {
    title: string;
    readMore: string;
    noNews: string;
    source: string;
  };

  // ── Alerts ───────────────────────────────────────────────────
  alerts: {
    title: string;
    priceAbove: string;
    priceBelow: string;
    targetPrice: string;
    noAlerts: string;
    addAlert: string;
    deleteAlert: string;
  };

  // ── Community ────────────────────────────────────────────────
  community: {
    title: string;
    shareSignal: string;
    noSignals: string;
    upvote: string;
    downvote: string;
    postedBy: string;
  };

  // ── Risk ─────────────────────────────────────────────────────
  risk: {
    title: string;
    positionSize: string;
    riskAmount: string;
    suggestedSize: string;
    maxLoss: string;
    calculate: string;
  };

  // ── Sentiment ────────────────────────────────────────────────
  sentiment: {
    title: string;
    veryBullish: string;
    bullish: string;
    neutral: string;
    bearish: string;
    veryBearish: string;
  };

  // ── Markets ──────────────────────────────────────────────────
  markets: {
    title: string;
    price: string;
    change: string;
    signal: string;
    volume: string;
    marketType: string;
    selectAsset: string;
  };

  // ── Footer ───────────────────────────────────────────────────
  footer: {
    disclaimer: string;
    builtBy: string;
    privacy: string;
    terms: string;
  };
}
