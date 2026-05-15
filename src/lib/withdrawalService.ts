import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

export interface WithdrawalRequest {
  amount: number;
  methodType: 'paypal' | 'bank_transfer' | 'amazon_gift_card';
  accountIdentifier: string;
  userId: string;
}

export interface WithdrawalResponse {
  id: string;
  status: string;
  transactionId?: string;
  error?: string;
}

/**
 * Add a new withdrawal method for the user
 */
export async function addWithdrawalMethod(
  userId: string,
  methodType: string,
  accountIdentifier: string,
  isPrimary: boolean = false
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('withdrawal_methods').insert({
      user_id: userId,
      method_type: methodType,
      account_identifier: accountIdentifier,
      is_primary: isPrimary,
      verified: false,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Get all withdrawal methods for a user
 */
export async function getWithdrawalMethods(userId: string) {
  try {
    const { data, error } = await supabase
      .from('withdrawal_methods')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching withdrawal methods:', error);
    return [];
  }
}

/**
 * Create a withdrawal request
 */
export async function createWithdrawalRequest(
  request: WithdrawalRequest
): Promise<WithdrawalResponse> {
  try {
    // Get withdrawal method
    const methods = await getWithdrawalMethods(request.userId);
    const method = methods.find((m) => m.method_type === request.methodType);

    if (!method) {
      return {
        id: '',
        status: 'error',
        error: 'Withdrawal method not found',
      };
    }

    // Create withdrawal record
    const { data, error } = await supabase
      .from('withdrawals')
      .insert({
        user_id: request.userId,
        withdrawal_method_id: method.id,
        amount: request.amount,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      return {
        id: '',
        status: 'error',
        error: error.message,
      };
    }

    // Call edge function to process withdrawal
    try {
      const response = await fetch(
        `${supabaseUrl}/functions/v1/process-withdrawal`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({
            withdrawalId: data.id,
            userId: request.userId,
            amount: request.amount,
            methodType: request.methodType,
            accountIdentifier: request.accountIdentifier,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to process withdrawal');
      }

      const result = await response.json();

      return {
        id: data.id,
        status: 'processing',
        transactionId: result.transactionId,
      };
    } catch (error) {
      // Even if edge function fails, withdrawal record is created
      return {
        id: data.id,
        status: 'pending',
        error: error instanceof Error ? error.message : 'Processing error',
      };
    }
  } catch (error) {
    return {
      id: '',
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get withdrawal history for a user
 */
export async function getWithdrawalHistory(userId: string) {
  try {
    const { data, error } = await supabase
      .from('withdrawals')
      .select(
        `
        id,
        amount,
        status,
        transaction_id,
        requested_at,
        processed_at,
        withdrawal_methods(method_type, account_identifier)
      `
      )
      .eq('user_id', userId)
      .order('requested_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching withdrawal history:', error);
    return [];
  }
}

/**
 * Cancel a pending withdrawal
 */
export async function cancelWithdrawal(withdrawalId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('withdrawals')
      .update({ status: 'cancelled' })
      .eq('id', withdrawalId)
      .eq('status', 'pending');

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
