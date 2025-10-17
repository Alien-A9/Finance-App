import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/hooks/use-theme';
import { Transaction } from '@shared/types';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import { useMemo } from 'react';
import { Skeleton } from './ui/skeleton';
interface OverviewChartProps {
  transactions: Transaction[];
  isLoading: boolean;
}
const formatCurrencyForAxis = (value: number) => `$${(value / 100 / 1000).toFixed(0)}k`;
export function OverviewChart({ transactions, isLoading }: OverviewChartProps) {
  const { isDark } = useTheme();
  const data = useMemo(() => {
    const last30Days = eachDayOfInterval({
      start: subDays(new Date(), 29),
      end: new Date(),
    });
    const dailyData = last30Days.map(day => ({
      name: format(day, 'MMM d'),
      income: 0,
      expense: 0,
    }));
    transactions.forEach(t => {
      const dayStr = format(new Date(t.date), 'MMM d');
      const dayData = dailyData.find(d => d.name === dayStr);
      if (dayData) {
        if (t.type === 'income') {
          dayData.income += t.amount;
        } else {
          dayData.expense += t.amount;
        }
      }
    });
    return dailyData;
  }, [transactions]);
  if (isLoading) {
    return (
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <Skeleton className="h-[350px] w-full" />
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Overview (Last 30 Days)</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'hsl(var(--muted))' : 'hsl(var(--border))'} />
            <XAxis
              dataKey="name"
              stroke={isDark ? 'hsl(var(--muted-foreground))' : '#888888'}
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke={isDark ? 'hsl(var(--muted-foreground))' : '#888888'}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatCurrencyForAxis}
            />
            <Tooltip
              cursor={{ fill: 'hsl(var(--accent))' }}
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
              }}
              formatter={(value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value / 100)}
            />
            <Bar dataKey="income" fill="#16a34a" radius={[4, 4, 0, 0]} name="Income" />
            <Bar dataKey="expense" fill="#dc2626" radius={[4, 4, 0, 0]} name="Expense" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}