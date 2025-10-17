import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Transaction } from '@shared/types';
import { format } from 'date-fns';
import { cn, formatCurrency } from '@/lib/utils';
import { ScrollArea } from './ui/scroll-area';
interface TransactionsTableProps {
  transactions: Transaction[];
  isLoading: boolean;
}
export function TransactionsTable({ transactions, isLoading }: TransactionsTableProps) {
  const renderSkeleton = () => (
    Array.from({ length: 5 }).map((_, i) => (
      <TableRow key={i}>
        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
        <TableCell className="text-right"><Skeleton className="h-5 w-16 ml-auto" /></TableCell>
      </TableRow>
    ))
  );
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>A list of your most recent financial activities.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? renderSkeleton() : (
                transactions.length > 0 ? transactions.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">{t.description}</TableCell>
                    <TableCell>{t.category}</TableCell>
                    <TableCell>{format(new Date(t.date), 'MMM d, yyyy')}</TableCell>
                    <TableCell className={cn(
                      'text-right font-semibold',
                      t.type === 'income' ? 'text-green-600' : 'text-red-600'
                    )}>
                      {t.type === 'income' ? '+' : '-'}
                      {formatCurrency(t.amount)}
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No transactions yet. Add one to get started!
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}