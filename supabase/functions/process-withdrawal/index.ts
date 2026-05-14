import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT, DELETE",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { withdrawalId, userId, amount, methodType, accountIdentifier } = await req.json();

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );

    // Get Stripe API key
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      return new Response(JSON.stringify({ error: "Stripe key not configured" }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    // Process withdrawal based on method
    let transactionId = "";

    if (methodType === "paypal") {
      // Call PayPal API
      transactionId = await processPayPalWithdrawal(amount, accountIdentifier);
    } else if (methodType === "bank_transfer") {
      // Call Stripe Connect for bank transfer
      transactionId = await processBankTransfer(stripeKey, amount, accountIdentifier);
    } else if (methodType === "amazon_gift_card") {
      // Send gift card email
      transactionId = await sendAmazonGiftCard(amount, accountIdentifier);
    }

    // Update withdrawal status
    const { error } = await supabase
      .from("withdrawals")
      .update({
        status: "processing",
        transaction_id: transactionId,
      })
      .eq("id", withdrawalId);

    if (error) {
      throw error;
    }

    // Deduct from user balance
    const { data: userData } = await supabase
      .from("users")
      .select("balance")
      .eq("id", userId)
      .single();

    if (userData) {
      await supabase
        .from("users")
        .update({ balance: userData.balance - amount })
        .eq("id", userId);
    }

    return new Response(
      JSON.stringify({
        success: true,
        transactionId,
        message: "Withdrawal processing started",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error processing withdrawal:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

async function processPayPalWithdrawal(amount: number, email: string): Promise<string> {
  // Mock implementation - replace with actual PayPal API call
  console.log(`Processing PayPal withdrawal: $${amount} to ${email}`);
  return `paypal_${Date.now()}`;
}

async function processBankTransfer(
  stripeKey: string,
  amount: number,
  accountNumber: string
): Promise<string> {
  // Mock implementation - replace with actual Stripe API call
  console.log(`Processing bank transfer: $${amount} to ${accountNumber}`);
  return `stripe_${Date.now()}`;
}

async function sendAmazonGiftCard(amount: number, email: string): Promise<string> {
  // Mock implementation - replace with actual Amazon gift card API call
  console.log(`Sending Amazon gift card: $${amount} to ${email}`);
  return `amazon_${Date.now()}`;
}
