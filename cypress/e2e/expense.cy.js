describe('Expense flow', () => {
  it('should create an expense and show it in the list', () => {
    const expenseItem = {
      id: 'expense-1',
      category: 'Food',
      amount: 75000,
      description: 'Lunch at restaurant',
      date: '2024-06-07',
    };

    cy.intercept('POST', '/authentications', {
      statusCode: 201,
      body: {
        data: {
          accessToken: 'header.eyJ1c2VyIjp7fX0.signature',
          refreshToken: 'refresh-token-123',
        },
      },
    }).as('loginRequest');

    let expenseRequestCount = 0;

    cy.intercept('GET', '**/expenses', (req) => {
      expenseRequestCount += 1;

      if (expenseRequestCount === 1) {
        req.reply({
          statusCode: 200,
          body: {
            data: {
              expenses: [],
            },
          },
        });
        return;
      }

      req.reply({
        statusCode: 200,
        body: {
          data: {
            expenses: [expenseItem],
          },
        },
      });
    }).as('getExpenses');

    cy.intercept('POST', '**/expenses', {
      statusCode: 201,
      body: {
        data: {
          expenseId: expenseItem.id,
        },
      },
    }).as('createExpense');

    cy.visit('/login');

    cy.get('#username').type('john');
    cy.get('#password').type('secret');
    cy.contains('button', 'Masuk').click();

    cy.wait('@loginRequest');
    cy.url().should('include', '/home');

    cy.contains('nav a', 'Expense').click();
    cy.url().should('include', '/expense');
    cy.wait('@getExpenses');

    cy.get('#category').select('Food');
    cy.get('#amount').type('75000');
    cy.get('#description').type('Lunch at restaurant');
    cy.get('#date').clear().type('2024-06-07');

    cy.contains('button', 'Catat Pengeluaran').click();

    cy.wait('@createExpense');
    cy.wait('@getExpenses');

    cy.contains('Lunch at restaurant').should('exist');
    cy.contains('Food').should('exist');
    cy.contains(/75\.000/).should('exist');
  });
});
