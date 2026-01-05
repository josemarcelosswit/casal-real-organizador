
import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Trash2, 
  TrendingUp, 
  PieChart as PieIcon, 
  Sparkles,
  Calculator,
  Ship,
  Car,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Banknote,
  ArrowRight,
  Smile
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Transaction, TransactionType, Category, TransactionOwner } from './types';
import { getFinancialAdvice } from './geminiService';

const COLORS = {
  [Category.SALARY]: '#22c55e',
  [Category.HOUSING]: '#a855f7',
  [Category.FOOD]: '#ef4444',
  [Category.TRANSPORT]: '#f59e0b',
  [Category.HEALTH]: '#3b82f6',
  [Category.EDUCATION]: '#eab308',
  [Category.ENTERTAINMENT]: '#64748b',
  [Category.INVESTMENT]: '#10b981', 
  [Category.OTHERS]: '#94a3b8',
  [Category.CRUISE]: '#0ea5e9',
  [Category.CAR]: '#6366f1',
};

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const getBillTheme = (balance: number) => {
  if (balance <= 0) return { color: 'bg-slate-200', border: 'border-slate-400', animal: '🐢', text: 'text-slate-600', sub: 'text-slate-400' };
  if (balance < 100) return { color: 'bg-rose-100', border: 'border-rose-300', animal: '🦜', text: 'text-rose-700', sub: 'text-rose-400' };
  if (balance < 500) return { color: 'bg-orange-100', border: 'border-orange-300', animal: '🐒', text: 'text-orange-700', sub: 'text-orange-400' };
  if (balance < 2000) return { color: 'bg-yellow-100', border: 'border-yellow-300', animal: '🐆', text: 'text-yellow-800', sub: 'text-yellow-500' };
  return { color: 'bg-cyan-100', border: 'border-cyan-300', animal: '🐟', text: 'text-cyan-700', sub: 'text-cyan-400' };
};

const BanknoteAvatar: React.FC<{ owner: TransactionOwner; balance: number; isFemale?: boolean }> = ({ owner, balance, isFemale }) => {
  const theme = getBillTheme(balance);
  
  return (
    <div className="flex flex-col items-center gap-4 transition-transform hover:scale-105 duration-300">
      <div className={`relative w-48 h-24 sm:w-64 sm:h-32 ${theme.color} border-2 ${theme.border} rounded-xl overflow-hidden banknote-shadow flex items-center justify-center`}>
        {/* Micro-patterns */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_100%)] from-black/20" />
        
        {/* Money Values */}
        <span className={`absolute top-2 left-3 font-money text-xs sm:text-sm ${theme.text} opacity-40`}>R$</span>
        <span className={`absolute bottom-2 right-3 font-money text-xs sm:text-sm ${theme.text} opacity-40`}>{theme.animal}</span>
        
        {/* Character Portrait */}
        <div className="relative z-10 flex flex-col items-center mt-2">
          {/* Hair */}
          <div className="absolute -top-6 flex justify-center w-full">
            {isFemale ? (
              /* Stephanie's Red Curly Hair */
              <div className="flex -space-x-1">
                <div className="w-6 h-6 bg-orange-600 rounded-full blur-[0.5px]" />
                <div className="w-8 h-8 bg-orange-700 rounded-full -mt-1 blur-[0.5px]" />
                <div className="w-6 h-6 bg-orange-600 rounded-full blur-[0.5px]" />
              </div>
            ) : (
              /* Jose's Black Curly Hair */
              <div className="flex -space-x-1">
                <div className="w-7 h-7 bg-slate-900 rounded-full blur-[0.5px]" />
                <div className="w-9 h-8 bg-slate-800 rounded-full -mt-1 blur-[0.5px]" />
                <div className="w-7 h-7 bg-slate-900 rounded-full blur-[0.5px]" />
              </div>
            )}
          </div>

          {/* Glasses */}
          <div className="flex items-center gap-1 sm:gap-1.5 relative z-20">
            {isFemale ? (
              /* Cat-eye Detailed */
              <>
                <div className="w-7 h-5 sm:w-9 sm:h-6 border-2 border-pink-700 rounded-full rounded-tr-lg bg-white/30 backdrop-blur-sm" />
                <div className="w-1.5 h-0.5 bg-pink-700" />
                <div className="w-7 h-5 sm:w-9 sm:h-6 border-2 border-pink-700 rounded-full rounded-tl-lg bg-white/30 backdrop-blur-sm" />
              </>
            ) : (
              /* Square Detailed */
              <>
                <div className="w-7 h-6 sm:w-9 sm:h-7 border-2 border-slate-900 rounded-sm bg-white/20 backdrop-blur-sm" />
                <div className="w-1.5 h-0.5 bg-slate-900" />
                <div className="w-7 h-6 sm:w-9 sm:h-7 border-2 border-slate-900 rounded-sm bg-white/20 backdrop-blur-sm" />
              </>
            )}
          </div>

          {/* Mouth */}
          <div className={`mt-2 w-4 h-1 border-b-2 ${theme.text} opacity-40 rounded-full ${balance < 0 ? 'rotate-180 mb-2' : ''}`} />
        </div>

        {/* Banknote Watermark */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-[-20deg]" />
      </div>

      <div className="text-center">
        <h4 className="font-cartoon text-[10px] sm:text-xs text-slate-400 uppercase tracking-[0.2em]">{isFemale ? 'Stephanie' : 'José'}</h4>
        <p className={`text-lg sm:text-xl font-cartoon ${balance < 0 ? 'text-red-500' : theme.text}`}>
          R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </p>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [joseSalary, setJoseSalary] = useState<string>('');
  const [stephanieSalary, setStephanieSalary] = useState<string>('');
  
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [category, setCategory] = useState<Category>(Category.FOOD);
  const [owner, setOwner] = useState<TransactionOwner>(TransactionOwner.STEPHANIE);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [insights, setInsights] = useState<string>('');
  const [isInsightLoading, setIsInsightLoading] = useState(false);

  const CRUISE_TARGET = 8000;
  const CAR_TARGET = 50000;

  const currentMonthTransactions = useMemo(() => {
    return transactions.filter(t => new Date(t.date).getMonth() === selectedMonth);
  }, [transactions, selectedMonth]);

  const goalStats = useMemo(() => {
    return transactions.reduce((acc, curr) => {
      if (curr.category === Category.CRUISE) acc.cruise += curr.amount;
      if (curr.category === Category.CAR) acc.car += curr.amount;
      return acc;
    }, { cruise: 0, car: 0 });
  }, [transactions]);

  const totals = useMemo(() => {
    const t = currentMonthTransactions.reduce((acc, curr) => {
      if (curr.type === TransactionType.INCOME) acc.income += curr.amount;
      else acc.expense += curr.amount;
      return acc;
    }, { income: 0, expense: 0 });
    
    const totalSalaries = (parseFloat(joseSalary) || 0) + (parseFloat(stephanieSalary) || 0);
    t.income += totalSalaries;
    
    return t;
  }, [currentMonthTransactions, joseSalary, stephanieSalary]);

  const joseBalance = useMemo(() => {
    const trans = transactions.filter(t => t.owner === TransactionOwner.JOSE).reduce((acc, curr) => 
      curr.type === TransactionType.INCOME ? acc + curr.amount : acc - curr.amount, 0);
    return trans + (parseFloat(joseSalary) || 0);
  }, [transactions, joseSalary]);

  const stephanieBalance = useMemo(() => {
    const trans = transactions.filter(t => t.owner === TransactionOwner.STEPHANIE).reduce((acc, curr) => 
      curr.type === TransactionType.INCOME ? acc + curr.amount : acc - curr.amount, 0);
    return trans + (parseFloat(stephanieSalary) || 0);
  }, [transactions, stephanieSalary]);

  const monthBalance = totals.income - totals.expense;

  const chartData = useMemo(() => {
    const data: Record<string, number> = {};
    currentMonthTransactions.filter(t => t.type === TransactionType.EXPENSE).forEach(t => {
      data[t.category] = (data[t.category] || 0) + t.amount;
    });
    return Object.keys(data).map(key => ({ name: key, value: data[key] }));
  }, [currentMonthTransactions]);

  const addTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc || !amount) return;
    const date = new Date();
    date.setMonth(selectedMonth);
    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      description: desc,
      amount: parseFloat(amount),
      type,
      category,
      owner,
      date: date.toISOString()
    };
    setTransactions([newTransaction, ...transactions]);
    setDesc('');
    setAmount('');
  };

  const removeTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const fetchInsights = async () => {
    setIsInsightLoading(true);
    const advice = await getFinancialAdvice(currentMonthTransactions, MONTHS[selectedMonth]);
    setInsights(advice);
    setIsInsightLoading(false);
  };

  return (
    <div className="min-h-screen pb-12 sm:pb-24">
      {/* Navbar with Banknote accent */}
      <header className="bg-white border-b-8 border-emerald-500 py-4 sm:py-6 sticky top-0 z-50 shadow-md">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 p-2.5 rounded-xl shadow-[4px_4px_0px_#065f46]">
              <Banknote className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-cartoon text-slate-800">Casal<span className="text-emerald-500">Real</span></h1>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Controle de Cédulas • 2026</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-full w-full sm:w-auto justify-between">
            <button onClick={() => setSelectedMonth(prev => (prev === 0 ? 11 : prev - 1))} className="p-2 bg-white hover:bg-slate-50 rounded-full shadow-sm text-slate-400"><ChevronLeft size={20}/></button>
            <span className="font-cartoon text-sm sm:text-base text-slate-700 px-4 min-w-[120px] text-center">{MONTHS[selectedMonth]}</span>
            <button onClick={() => setSelectedMonth(prev => (prev === 11 ? 0 : prev + 1))} className="p-2 bg-white hover:bg-slate-50 rounded-full shadow-sm text-slate-400"><ChevronRight size={20}/></button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 mt-8 space-y-10">
        
        {/* Salary & Bill Section */}
        <div className="bg-white p-8 sm:p-12 rounded-[3rem] shadow-xl border-4 border-slate-50 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex justify-center gap-6 sm:gap-16 w-full lg:w-2/3">
             <div className="space-y-4">
                <BanknoteAvatar owner={TransactionOwner.JOSE} balance={joseBalance} />
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-money text-xs">R$</span>
                  <input type="number" value={joseSalary} onChange={(e) => setJoseSalary(e.target.value)} placeholder="Salário José" className="w-full pl-10 pr-4 py-2 bg-slate-50 border-2 border-slate-200 rounded-lg font-money text-xs text-center focus:border-blue-400 outline-none" />
                </div>
             </div>
             <div className="space-y-4">
                <BanknoteAvatar owner={TransactionOwner.STEPHANIE} balance={stephanieBalance} isFemale />
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-money text-xs">R$</span>
                  <input type="number" value={stephanieSalary} onChange={(e) => setStephanieSalary(e.target.value)} placeholder="Salário Steph" className="w-full pl-10 pr-4 py-2 bg-slate-50 border-2 border-slate-200 rounded-lg font-money text-xs text-center focus:border-pink-400 outline-none" />
                </div>
             </div>
          </div>

          <div className="w-full lg:w-1/3">
            <div className="bg-slate-800 p-6 sm:p-8 rounded-[2.5rem] shadow-[6px_6px_0px_#1e293b] text-white relative group">
              <div className="absolute -top-3 -right-3 bg-yellow-400 p-2.5 rounded-full text-slate-900 shadow-lg cursor-pointer hover:rotate-12 transition-transform" onClick={fetchInsights}>
                <Sparkles size={20} className={isInsightLoading ? 'animate-spin' : ''} />
              </div>
              <h4 className="font-cartoon text-yellow-400 text-[10px] mb-2 uppercase tracking-widest">Fala, Julius! (Bronca Financeira):</h4>
              <p className="text-sm sm:text-base italic leading-relaxed opacity-90 font-medium">
                {insights || "Sabe quanto custa cada anotação que você deixa de fazer? MEU TEMPO! Me mostre as cédulas agora!"}
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-[2rem] border-4 border-slate-50 shadow-md text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Saldo Mensal</p>
            <h2 className={`text-2xl font-cartoon mt-1 ${monthBalance < 0 ? 'text-red-500' : 'text-emerald-600'}`}>
              R$ {monthBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </h2>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border-4 border-slate-50 shadow-md text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Entradas</p>
            <h2 className="text-2xl font-cartoon text-blue-500 mt-1">R$ {totals.income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border-4 border-slate-50 shadow-md text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Saídas</p>
            <h2 className="text-2xl font-cartoon text-red-400 mt-1">R$ {totals.expense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
          </div>
        </div>

        {/* Transaction Form - Banknote Style */}
        <section className="bg-white p-8 sm:p-10 rounded-[3rem] shadow-xl border-4 border-emerald-50">
          <h3 className="text-xl font-cartoon text-slate-800 mb-8 flex items-center gap-3">
             <Plus className="text-emerald-500" /> Registrar Nova Cédula
          </h3>
          <form onSubmit={addTransaction} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
             <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Titular</label>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                   <button type="button" onClick={() => setOwner(TransactionOwner.JOSE)} className={`flex-1 py-2 rounded-lg font-cartoon text-xs transition-all ${owner === TransactionOwner.JOSE ? 'bg-slate-800 text-white' : 'text-slate-400'}`}>José</button>
                   <button type="button" onClick={() => setOwner(TransactionOwner.STEPHANIE)} className={`flex-1 py-2 rounded-lg font-cartoon text-xs transition-all ${owner === TransactionOwner.STEPHANIE ? 'bg-pink-500 text-white' : 'text-slate-400'}`}>Steph</button>
                </div>
             </div>
             <div className="space-y-1 lg:col-span-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Descrição</label>
                <input type="text" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Ex: Internet" className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-emerald-400 outline-none font-bold text-slate-700" required />
             </div>
             <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Valor R$</label>
                <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0,00" className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-emerald-400 outline-none font-bold text-slate-700" required />
             </div>
             <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white font-cartoon py-3 rounded-xl shadow-[4px_4px_0px_#065f46] transition-all active:translate-y-1 active:shadow-none">
                Lançar!
             </button>
             
             <div className="md:col-span-2 grid grid-cols-2 gap-4">
                <select value={type} onChange={(e) => setType(e.target.value as TransactionType)} className="w-full px-4 py-2 rounded-xl bg-slate-50 border-2 border-transparent focus:border-emerald-400 text-xs font-bold text-slate-600 outline-none">
                  <option value={TransactionType.EXPENSE}>Dívida 💸</option>
                  <option value={TransactionType.INCOME}>Entrada 🤑</option>
                </select>
                <select value={category} onChange={(e) => setCategory(e.target.value as Category)} className="w-full px-4 py-2 rounded-xl bg-slate-50 border-2 border-transparent focus:border-emerald-400 text-xs font-bold text-slate-600 outline-none">
                  {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
             </div>
          </form>
        </section>

        {/* History & Goals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-white rounded-[2.5rem] shadow-lg border-4 border-slate-50 overflow-hidden flex flex-col">
            <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-cartoon text-lg text-slate-700">Fluxo do Mês</h3>
              <PieIcon size={20} className="text-emerald-500" />
            </div>
            <div className="p-4 flex-1 overflow-y-auto max-h-[450px] space-y-2">
              {currentMonthTransactions.length > 0 ? (
                currentMonthTransactions.map(t => (
                  <div key={t.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border-2 border-transparent hover:border-emerald-100 transition-all group">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{t.owner === TransactionOwner.STEPHANIE ? '👩' : '👦'}</span>
                      <div>
                        <p className="font-bold text-slate-800 text-sm leading-tight">{t.description}</p>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{t.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`font-money font-bold text-sm ${t.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-slate-800'}`}>
                        {t.type === TransactionType.INCOME ? '+' : '-'} R$ {t.amount.toFixed(2)}
                      </span>
                      <button onClick={() => removeTransaction(t.id)} className="text-slate-200 hover:text-red-500 p-1 group-hover:opacity-100 opacity-0 transition-opacity"><Trash2 size={16}/></button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center text-slate-300 italic font-cartoon">Nenhuma nota emitida.</div>
              )}
            </div>
          </div>

          <div className="space-y-8">
            {/* Chart */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-lg border-4 border-slate-50 h-[320px]">
               <h3 className="font-cartoon text-lg text-slate-700 mb-4">Destino dos Reais</h3>
               <div className="h-[180px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={chartData} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value" stroke="none">
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[entry.name as Category] || '#ccc'} cornerRadius={8} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', fontSize: '11px', fontWeight: 'bold' }} />
                    </PieChart>
                 </ResponsiveContainer>
               </div>
               <div className="flex flex-wrap gap-3 justify-center mt-2">
                  {chartData.slice(0, 4).map(entry => (
                    <div key={entry.name} className="flex items-center gap-1.5 text-[8px] font-black text-slate-400 uppercase">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[entry.name as Category] }} />
                      {entry.name}
                    </div>
                  ))}
               </div>
            </div>

            {/* Goals */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-lg border-4 border-slate-50 space-y-6">
              <h3 className="font-cartoon text-lg text-slate-700 flex items-center gap-2">
                <TrendingUp size={20} className="text-blue-500" /> Nossos Sonhos
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                   <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                     <span className="flex items-center gap-1"><Ship size={12}/> Cruzeiro 🚢</span>
                     <span>R$ {goalStats.cruise.toFixed(0)} / {CRUISE_TARGET}</span>
                   </div>
                   <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden p-0.5 border border-slate-200">
                     <div className="bg-blue-500 h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (goalStats.cruise / CRUISE_TARGET) * 100)}%` }} />
                   </div>
                </div>
                <div className="space-y-2">
                   <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                     <span className="flex items-center gap-1"><Car size={12}/> Carro Novo 🚗</span>
                     <span>R$ {goalStats.car.toFixed(0)} / {CAR_TARGET}</span>
                   </div>
                   <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden p-0.5 border border-slate-200">
                     <div className="bg-indigo-500 h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (goalStats.car / CAR_TARGET) * 100)}%` }} />
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-20 text-center opacity-30 font-cartoon text-[10px] uppercase tracking-widest">
        Casal Real Bank • Edição Cédulas de Luxo • 2026
      </footer>
    </div>
  );
};

export default App;
