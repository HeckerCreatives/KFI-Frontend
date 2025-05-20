import dynamic from 'next/dynamic';

const App = dynamic(() => import('../../components/AppShell'), {
  ssr: false,
});

export async function generateStaticParams() {
  return [
    // ...lists.map(list => ({ all: ['lists', list.id] })),
    { all: ['login'] },
    { all: ['dashboard'] },
    { all: ['dashboard', 'home'] },
    { all: ['dashboard', 'admin'] },
    { all: ['dashboard', 'chart-of-account'] },
    { all: ['dashboard', 'center'] },
    { all: ['dashboard', 'client-master-file'] },
    { all: ['dashboard', 'client-master-file', 'new'] },
    { all: ['dashboard', 'client-profile'] },
    { all: ['dashboard', 'loans'] },
    { all: ['dashboard', 'bank'] },
    { all: ['dashboard', 'weekly-saving-table'] },
    { all: ['dashboard', 'supplier'] },
    { all: ['dashboard', 'business-type'] },
    { all: ['dashboard', 'business-fix'] },
    { all: ['dashboard', 'nature'] },
    // Transactions
    { all: ['dashboard', 'group-account'] },
    { all: ['dashboard', 'loan-release'] },
    { all: ['dashboard', 'expense-voucher'] },
    { all: ['dashboard', 'journal-voucher'] },
    { all: ['dashboard', 'official-receipt'] },
    { all: ['dashboard', 'emergency-loan'] },
    { all: ['dashboard', 'damayan-fund'] },
    // Reports
    { all: ['dashboard', 'soa-report'] },
    { all: ['dashboard', 'cp-report'] },
    { all: ['dashboard', 'center-report'] },
    { all: ['dashboard', 'wc-report'] },
    { all: ['dashboard', 'jv-report'] },
    { all: ['dashboard', 'ev-report'] },
    { all: ['dashboard', 'or-report'] },
    { all: ['dashboard', 'lr-report'] },
    { all: ['dashboard', 'df-report'] },
    { all: ['dashboard', 'el-report'] },
    { all: ['dashboard', 'lrvor-report'] },
    { all: ['dashboard', 'pbd-report'] },
  ];
}

export default function Page() {
  return <App />;
}
