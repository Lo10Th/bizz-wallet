import { Connection, PublicKey, LAMPORTS_PER_SOL, ParsedTransactionWithMeta } from '@solana/web3.js';

const SOLANA_RPC_ENDPOINT = 'https://api.mainnet-beta.solana.com';
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

export interface TransactionInfo {
  signature: string;
  timestamp: number | null;
  type: 'incoming' | 'outgoing' | 'unknown';
  amount: number | null;
}

/**
 * Validates a Solana public address
 */
export function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

/**
 * Builds a Solana Pay payment request URI
 */
export function createSolanaPaymentRequest(address: string, amount: number): string {
  if (!Number.isFinite(amount) || amount <= 0) {
    return `solana:${address}`;
  }

  return `solana:${address}?amount=${encodeURIComponent(amount)}`;
}

/**
 * Fetches the SOL balance for a given address
 */
export async function getBalance(address: string): Promise<number> {
  if (USE_MOCK_DATA) {
    // Mock data for demonstration
    await new Promise(resolve => setTimeout(resolve, 500));
    return 42.5678;
  }
  
  try {
    const connection = new Connection(SOLANA_RPC_ENDPOINT);
    const publicKey = new PublicKey(address);
    const balance = await connection.getBalance(publicKey);
    return balance / LAMPORTS_PER_SOL;
  } catch (error) {
    console.error('Error fetching balance:', error);
    throw new Error('Failed to fetch balance');
  }
}

/**
 * Fetches the last N signatures for a given address
 */
export async function getRecentTransactions(
  address: string,
  limit: number = 10
): Promise<TransactionInfo[]> {
  if (USE_MOCK_DATA) {
    // Mock data for demonstration
    await new Promise(resolve => setTimeout(resolve, 800));
    const now = Math.floor(Date.now() / 1000);
    return [
      {
        signature: '5J8W...' + Math.random().toString(36).substring(7),
        timestamp: now - 3600,
        type: 'incoming' as const,
        amount: 5.25,
      },
      {
        signature: '3mK9...' + Math.random().toString(36).substring(7),
        timestamp: now - 7200,
        type: 'outgoing' as const,
        amount: 2.1,
      },
      {
        signature: '8pL4...' + Math.random().toString(36).substring(7),
        timestamp: now - 10800,
        type: 'incoming' as const,
        amount: 10.5,
      },
      {
        signature: '1nM2...' + Math.random().toString(36).substring(7),
        timestamp: now - 14400,
        type: 'outgoing' as const,
        amount: 3.75,
      },
      {
        signature: '7qP6...' + Math.random().toString(36).substring(7),
        timestamp: now - 18000,
        type: 'incoming' as const,
        amount: 8.333,
      },
      {
        signature: '2rN5...' + Math.random().toString(36).substring(7),
        timestamp: now - 21600,
        type: 'incoming' as const,
        amount: 15.0,
      },
      {
        signature: '9sT8...' + Math.random().toString(36).substring(7),
        timestamp: now - 25200,
        type: 'outgoing' as const,
        amount: 1.25,
      },
      {
        signature: '4tU7...' + Math.random().toString(36).substring(7),
        timestamp: now - 28800,
        type: 'incoming' as const,
        amount: 20.5,
      },
      {
        signature: '6vW9...' + Math.random().toString(36).substring(7),
        timestamp: now - 32400,
        type: 'unknown' as const,
        amount: null,
      },
      {
        signature: '5wX1...' + Math.random().toString(36).substring(7),
        timestamp: now - 36000,
        type: 'outgoing' as const,
        amount: 0.5,
      },
    ].slice(0, limit);
  }
  
  try {
    const connection = new Connection(SOLANA_RPC_ENDPOINT);
    const publicKey = new PublicKey(address);
    
    // Get recent signatures
    const signatures = await connection.getSignaturesForAddress(publicKey, { limit });
    
    // Parse transaction details
    const transactions: TransactionInfo[] = await Promise.all(
      signatures.map(async (sigInfo) => {
        try {
          const tx = await connection.getParsedTransaction(sigInfo.signature, {
            maxSupportedTransactionVersion: 0
          });
          
          const type = determineTransactionType(tx, address);
          const amount = extractTransactionAmount(tx, address);
          
          return {
            signature: sigInfo.signature,
            timestamp: sigInfo.blockTime ?? null,
            type,
            amount,
          };
        } catch {
          return {
            signature: sigInfo.signature,
            timestamp: sigInfo.blockTime ?? null,
            type: 'unknown' as const,
            amount: null,
          };
        }
      })
    );
    
    return transactions;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw new Error('Failed to fetch transactions');
  }
}

/**
 * Determines if a transaction is incoming or outgoing
 */
function determineTransactionType(
  tx: ParsedTransactionWithMeta | null,
  address: string
): 'incoming' | 'outgoing' | 'unknown' {
  if (!tx || !tx.meta) return 'unknown';
  
  const preBalances = tx.meta.preBalances;
  const postBalances = tx.meta.postBalances;
  const accountKeys = tx.transaction.message.accountKeys;
  
  const addressIndex = accountKeys.findIndex(
    (key) => key.pubkey.toBase58() === address
  );
  
  if (addressIndex === -1) return 'unknown';
  
  const preBalance = preBalances[addressIndex];
  const postBalance = postBalances[addressIndex];
  
  if (postBalance > preBalance) {
    return 'incoming';
  } else if (postBalance < preBalance) {
    return 'outgoing';
  }
  
  return 'unknown';
}

/**
 * Extracts the transaction amount in SOL
 */
function extractTransactionAmount(
  tx: ParsedTransactionWithMeta | null,
  address: string
): number | null {
  if (!tx || !tx.meta) return null;
  
  const preBalances = tx.meta.preBalances;
  const postBalances = tx.meta.postBalances;
  const accountKeys = tx.transaction.message.accountKeys;
  
  const addressIndex = accountKeys.findIndex(
    (key) => key.pubkey.toBase58() === address
  );
  
  if (addressIndex === -1) return null;
  
  const preBalance = preBalances[addressIndex];
  const postBalance = postBalances[addressIndex];
  const diff = Math.abs(postBalance - preBalance);
  
  return diff / LAMPORTS_PER_SOL;
}
