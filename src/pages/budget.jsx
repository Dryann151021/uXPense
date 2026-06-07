'use client';

import Header from '../components/layout/Header.jsx';
import BudgetForm from '../components/transaction/BudgetForm.jsx';
import BudgetList from '../components/transaction/BudgetList.jsx';

export default function BudgetPage() {
  return (
    <>
      <Header />
      <main className="main-content">
        <div className="container">
          <h1>Budget Management</h1>
          <div className="grid-2-cols">
            <div>
              <BudgetForm />
            </div>
            <div>
              <BudgetList />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
