import crypto from "crypto";

export interface PayTRConfig {
  merchantId: string;
  merchantKey: string;
  merchantSalt: string;
  gatewayBaseUrl: string;
  testMode: boolean;
}

export interface PayTRBasketItem {
  name: string;
  price: number;
  quantity: number;
}

export interface PayTRTokenRequest {
  orderId: string;
  amount: number;
  currency?: "TRY";
  email: string;
  fullName: string;
  phone: string;
  address: string;
  basket: PayTRBasketItem[];
  successUrl: string;
  failUrl: string;
  userIp: string;
  installments?: number;
}

export interface PayTRTokenResponse {
  token: string;
  iframeUrl: string;
  redirectUrl: string;
}

export interface PayTRCallbackPayload {
  merchantOid: string;
  status: string;
  totalAmount: string;
  hash: string;
}

const PAYTR_API_URL = "https://www.paytr.com/odeme/api";

export function getPayTRConfig(): PayTRConfig {
  const merchantId = process.env.PAYTR_MERCHANT_ID;
  const merchantKey = process.env.PAYTR_MERCHANT_KEY;
  const merchantSalt = process.env.PAYTR_MERCHANT_SALT;

  if (!merchantId || !merchantKey || !merchantSalt) {
    throw new Error("PayTR yapılandırması eksik. Ortam değişkenlerini kontrol edin.");
  }

  return {
    merchantId,
    merchantKey,
    merchantSalt,
    gatewayBaseUrl: "https://www.paytr.com/odeme/guvenli/",
    testMode: process.env.NODE_ENV !== "production" || process.env.PAYTR_TEST_MODE === "1",
  };
}

function encodeBasket(basket: PayTRBasketItem[]): string {
  const normalized = basket.map((item) => [
    item.name,
    item.price.toFixed(2),
    item.quantity,
  ]);

  return Buffer.from(JSON.stringify(normalized)).toString("base64");
}

function createPayTRTokenString(
  params: {
    merchantId: string;
    userIp: string;
    orderId: string;
    email: string;
    paymentAmount: number;
    installments: number;
    currency: "TRY";
    testMode: number;
    non3D: number;
  },
  config: PayTRConfig,
) {
  /**
   * Resmi PayTR dokümantasyonuna göre token hesaplama formülü:
   *
   * paytr_token = base64_encode(
   *   hmac_sha256(
   *     merchant_id + user_ip + merchant_oid + email + payment_amount +
   *     test_mode + non_3d + installment + currency + merchant_salt,
   *     merchant_key, raw_output: true
   *   )
   * )
   */
  const {
    merchantId,
    userIp,
    orderId,
    email,
    paymentAmount,
    installments,
    currency,
    testMode,
    non3D,
  } = params;

  const hashStr = `${merchantId}${userIp}${orderId}${email}${paymentAmount}${testMode}${non3D}${installments}${currency}${config.merchantSalt}`;

  return crypto
    .createHmac("sha256", config.merchantKey)
    .update(hashStr)
    .digest("base64");
}

export async function createPayTRToken(
  request: PayTRTokenRequest,
  configOverride?: PayTRConfig,
): Promise<PayTRTokenResponse> {
  const config = configOverride ?? getPayTRConfig();

  const installments = request.installments ?? 0;
  const paymentAmount = Math.round(request.amount * 100); // kuruş
  const testMode = config.testMode ? 1 : 0;
  const non3D = 0;
  const currency = "TRY";

  const paytrToken = createPayTRTokenString(
    {
      merchantId: config.merchantId,
      userIp: request.userIp,
      orderId: request.orderId,
      email: request.email,
      paymentAmount,
      installments,
      currency,
      testMode,
      non3D,
    },
    config,
  );

  const payload = new URLSearchParams({
    merchant_id: config.merchantId,
    user_ip: request.userIp,
    merchant_oid: request.orderId,
    email: request.email,
    payment_amount: paymentAmount.toString(),
    currency,
    test_mode: testMode.toString(),
    non_3d: non3D.toString(),
    installment: installments.toString(),
    paytr_token: paytrToken,
    user_basket: encodeBasket(request.basket),
    user_name: request.fullName,
    user_address: request.address,
    user_phone: request.phone,
    merchant_ok_url: request.successUrl,
    merchant_fail_url: request.failUrl,
    timeout_limit: "30",
    debug_on: testMode ? "1" : "0",
    payment_type: "card",
    lang: "tr",
  });

  const response = await fetch(`${PAYTR_API_URL}/get-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: payload,
  });

  const json = (await response.json()) as { status: string; token?: string; reason?: string };

  if (json.status !== "success" || !json.token) {
    throw new Error(json.reason || "PayTR token oluşturulamadı.");
  }

  const iframeUrl = `${config.gatewayBaseUrl}${json.token}`;

  return {
    token: json.token,
    iframeUrl,
    redirectUrl: iframeUrl,
  };
}

export function verifyPayTRCallback(payload: PayTRCallbackPayload, configOverride?: PayTRConfig): boolean {
  const config = configOverride ?? getPayTRConfig();

  const hashStr = `${payload.merchantOid}${config.merchantSalt}${payload.status}${payload.totalAmount}`;

  const expectedHash = crypto
    .createHmac("sha256", config.merchantKey)
    .update(hashStr)
    .digest("base64");

  return expectedHash === payload.hash;
}


