import { useEffect, useState } from 'react';
import { Search, Filter, Download, Calendar, CreditCard, DollarSign, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import { apiService } from '../services/api';
import type { Transaction } from '../types';
import NoData from '../components/NoData';
import StatCard from '../components/StatCard';

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    loadTransactions();
  }, [statusFilter, dateFrom, dateTo]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const params: any = { limit: 50 };
      if (statusFilter !== 'all') params.status = statusFilter;
      if (dateFrom) params.dateFrom = dateFrom;
      if (dateTo) params.dateTo = dateTo;

      const data = await apiService.getTransactions(params);
      setTransactions(data.transactions);

      const total = data.transactions
        .filter(t => t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0);
      setTotalAmount(total);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentMethodLabel = (method: string) => {
    const labels = {
      momo: 'Mobile Money',
      stripe: 'Stripe',
      flutterwave: 'Flutterwave',
    };
    return labels[method as keyof typeof labels] || method;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-primary-900">Transactions</h1>
          <p className="text-gray-600 mt-1">Track and manage payment transactions</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-900 text-white rounded-lg hover:bg-primary-800 transition-colors">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Revenue"
          value={`${totalAmount.toLocaleString()} RWF`}
          icon={DollarSign}
          iconColor="bg-emerald-500"
          variant="gradient"
          trend={{ value: 15, isPositive: true }}
        />
        
        <StatCard
          title="Completed Transactions"
          value={transactions.filter(t => t.status === 'completed').length}
          icon={CheckCircle}
          iconColor="bg-primary-900"
          variant="default"
          trend={{ value: 8, isPositive: true }}
        />
        
        <StatCard
          title="Pending Transactions"
          value={transactions.filter(t => t.status === 'pending').length}
          icon={Clock}
          iconColor="bg-amber-500"
          variant="default"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex gap-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                placeholder="From"
                className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                placeholder="To"
                className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-900"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Transaction ID</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Visit ID</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Parent Name</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Payment Method</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Reference</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-0">
                      <NoData
                        title="No Transactions Found"
                        description="No payment transactions have been recorded yet. Transactions will appear here once parents make payments for visits."
                        actionText="View Payment Settings"
                        onAction={() => console.log('View payment settings clicked')}
                        variant="compact"
                      />
                    </td>
                  </tr>
                ) : (
                  transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-mono text-gray-600">
                        #{transaction.id.slice(0, 8)}
                      </td>
                      <td className="py-3 px-4 text-sm font-mono text-gray-600">
                        #{transaction.visitId.slice(0, 8)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">{transaction.parentName}</td>
                      <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                        {transaction.amount.toLocaleString()} RWF
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                          {getPaymentMethodLabel(transaction.paymentMethod)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">{transaction.transactionDate}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm font-mono text-gray-600">{transaction.reference}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
