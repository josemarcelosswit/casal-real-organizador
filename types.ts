
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  SAVINGS_GOAL = 'SAVINGS_GOAL' // New type for directed savings
}

export enum TransactionOwner {
  JOSE = 'José',
  STEPHANIE = 'Stephanie',
  BOTH = 'Ambos'
}

export enum Category {
  HOUSING = 'Moradia',
  FOOD = 'Alimentação',
  TRANSPORT = 'Transporte',
  ENTERTAINMENT = 'Lazer',
  HEALTH = 'Saúde',
  EDUCATION = 'Educação',
  SALARY = 'Salário',
  INVESTMENT = 'Investimento',
  OTHERS = 'Outros',
  CRUISE = 'Cruzeiro 🚢',
  CAR = 'Carro Novo 🚗'
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: Category;
  owner: TransactionOwner;
  date: string; // ISO string to derive month/year
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}
