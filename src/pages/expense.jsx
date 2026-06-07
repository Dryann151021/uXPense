'use client';

import Header from '../components/layout/Header.jsx';
import ExpenseForm from '../components/transaction/ExpenseForm.jsx';
import TransactionList from '../components/transaction/TransactionList.jsx';

export default function ExpensePage() {
  return (
    <>
      <Header />
      <main className="main-content">
        <div className="container">
          <h1>Expense Tracking</h1>
          <div className="grid-2-cols">
            <div>
              <ExpenseForm />
            </div>
            <div>
              <TransactionList type="expense" />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
