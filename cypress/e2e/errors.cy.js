describe('Error handling and edge cases', () => {
  it('should handle login error gracefully', () => {
    cy.intercept('POST', '/authentications', {
      statusCode: 401,
      body: {
        message: 'Username atau password salah',
      },
    }).as('loginFailed');

    cy.visit('/login');

    cy.get('#username').type('invalid');
    cy.get('#password').type('wrongpass');
    cy.contains('button', 'Masuk').click();

    cy.wait('@loginFailed');
    cy.contains(/username atau password salah/i).should('exist');
  });

  it('should handle network error on expense creation', () => {
    cy.intercept('POST', '/authentications', {
      statusCode: 201,
      body: {
        data: {
          accessToken: 'header.eyJ1c2VyIjp7fX0.signature',
          refreshToken: 'refresh-token-123',
        },
      },
    }).as('loginRequest');

    cy.intercept('GET', '**/budgets', {
      statusCode: 200,
      body: {
        data: {
          budgets: [{ category: 'Food', limitAmount: 100000, month: '2024-06' }],
        },
      },
    });

    cy.intercept('GET', '**/streak', {
      statusCode: 200,
      body: { data: { streak: { current: 1, longest: 5 } } },
    });

    cy.intercept('GET', '**/level', {
      statusCode: 200,
      body: {
        data: {
          level: {
            current: 1,
            currentXp: 50,
            xpRequiredForNext: 100,
            progressPercentage: 50,
            daily: { count: 0, remaining: 3 },
          },
        },
      },
    });

    cy.intercept('GET', '**/expenses', {
      statusCode: 200,
      body: { data: { expenses: [] } },
    });

    cy.intercept('POST', '**/expenses', {
      statusCode: 500,
      body: { message: 'Terjadi kesalahan server' },
    }).as('createExpenseFailed');

    cy.visit('/login');
    cy.get('#username').type('john');
    cy.get('#password').type('secret');
    cy.contains('button', 'Masuk').click();

    cy.wait('@loginRequest');
    cy.contains('button', 'Masuk Dashboard').click();

    cy.contains('nav a', 'Expense').click();

    cy.get('#category').select('Food');
    cy.get('#amount').type('50000');
    cy.get('#description').type('Test');
    cy.get('#date').clear().type('2024-06-23');

    cy.contains('button', 'Catat Pengeluaran').click();

    cy.wait('@createExpenseFailed');
    cy.contains(/kesalahan|error/i).should('exist');
  });

  it('should handle 404 page for invalid route', () => {
    cy.visit('/invalid-page', { failOnStatusCode: false });
    cy.contains(/not found|tidak ditemukan/i).should('exist');
  });
});
