import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useTransactionStore } from '@/stores/transactionStore';
import { toast } from 'sonner';
const transactionSchema = z.object({
  description: z.string().min(1, { message: 'Description is required' }),
  amount: z.coerce.number().positive({ message: 'Amount must be a positive number' }),
  type: z.enum(['income', 'expense']),
  category: z.string().min(1, { message: 'Category is required' }),
  date: z.date(),
});
type TransactionFormData = z.infer<typeof transactionSchema>;
interface AddTransactionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export function AddTransactionSheet({ open, onOpenChange }: AddTransactionSheetProps) {
  const addTransaction = useTransactionStore((s) => s.addTransaction);
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: '',
      amount: undefined,
      type: 'expense',
      category: '',
      date: new Date(),
    },
  });
  const onSubmit = async (data: TransactionFormData) => {
    const transactionData = {
      ...data,
      amount: Math.round(data.amount * 100), // Convert to cents
      date: data.date.toISOString(),
    };
    try {
      await addTransaction(transactionData);
      toast.success('Transaction added successfully!');
      reset();
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to add transaction. Please try again.');
    }
  };
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add New Transaction</SheetTitle>
          <SheetDescription>Fill in the details below to add a new financial record.</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" {...register('description')} placeholder="e.g., Groceries" />
            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input id="amount" type="number" step="0.01" {...register('amount')} placeholder="e.g., 75.50" />
            {errors.amount && <p className="text-sm text-red-500">{errors.amount.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select transaction type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.type && <p className="text-sm text-red-500">{errors.type.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input id="category" {...register('category')} placeholder="e.g., Food" />
            {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Date</Label>
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn('w-full justify-start text-left font-normal', !field.value && 'text-muted-foreground')}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.date && <p className="text-sm text-red-500">{errors.date.message}</p>}
          </div>
          <SheetFooter className="pt-4">
            <SheetClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </SheetClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Transaction
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}