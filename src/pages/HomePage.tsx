import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Toaster } from '@/components/ui/sonner';
import { useTransactionStore } from '@/stores/transactionStore';
import { SummaryCard } from '@/components/SummaryCard';
import { DollarSign, TrendingDown, TrendingUp, PlusCircle } from 'lucide-react';
import { OverviewChart } from '@/components/OverviewChart';
import { TransactionsTable } from '@/components/TransactionsTable';
import { AddTransactionSheet } from '@/components/AddTransactionSheet';
export function HomePage() {
  const fetchTransactions = useTransactionStore((s) => s.fetchTransactions);
  const transactions = useTransactionStore((s) => s.transactions);
  const isLoading = useTransactionStore((s) => s.isLoading);
  const [isSheetOpen, setSheetOpen] = useState(false);
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);
  const { totalIncome, totalExpenses, netBalance } = useMemo(() => {
    let income = 0;
    let expenses = 0;
    for (const t of transactions) {
      if (t.type === 'income') {
        income += t.amount;
      } else {
        expenses += t.amount;
      }
    }
    return {
      totalIncome: income,
      totalExpenses: expenses,
      netBalance: income - expenses,
    };
  }, [transactions]);
  return (
    <>
      <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950">
        <ThemeToggle className="fixed top-4 right-4" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 md:py-10 lg:py-12">
            <header className="mb-8 md:mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-slate-50">
                  Clarity Cash
                </h1>
                <p className="mt-1 text-lg text-muted-foreground">
                  Your minimalist finance dashboard.
                </p>
              </div>
              <Button onClick={() => setSheetOpen(true)} className="transition-transform duration-200 hover:scale-105 active:scale-95">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Transaction
              </Button>
            </header>
            <main className="space-y-8">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <SummaryCard
                  title="Total Income"
                  value={totalIncome}
                  icon={<TrendingUp className="h-5 w-5" />}
                  isLoading={isLoading}
                  className="text-green-600"
                />
                <SummaryCard
                  title="Total Expenses"
                  value={totalExpenses}
                  icon={<TrendingDown className="h-5 w-5" />}
                  isLoading={isLoading}
                  className="text-red-600"
                />
                <SummaryCard
                  title="Net Balance"
                  value={netBalance}
                  icon={<DollarSign className="h-5 w-5" />}
                  isLoading={isLoading}
                  className={netBalance >= 0 ? 'text-slate-900 dark:text-slate-50' : 'text-red-600'}
                />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <OverviewChart transactions={transactions} isLoading={isLoading} />
                <TransactionsTable transactions={transactions} isLoading={isLoading} />
              </div>
            </main>
            <footer className="mt-12 text-center text-sm text-muted-foreground">
              <p>Built with ❤️ at Cloudflare</p>
            </footer>
          </div>
        </div>
      </div>
      <AddTransactionSheet open={isSheetOpen} onOpenChange={setSheetOpen} />
      <Toaster richColors closeButton />
    </>
  );
}