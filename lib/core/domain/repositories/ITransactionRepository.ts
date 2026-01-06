import { Transaction } from '../entities/Transaction';

export interface ITransactionRepository {
    getTransactionsByAddress(address: string, limit?: number): Promise<Transaction[]>;
}
