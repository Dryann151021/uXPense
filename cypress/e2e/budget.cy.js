describe('Budget flow', () => {
  beforeEach(() => {
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
          budgets: [
            { category: 'Food', limitAmount: 100000, month: '2024-06' },
            { category: 'Transport', limitAmount: 50000, month: '2024-06' },
          ],
        },
      },
    }).as('getBudgets');

    cy.intercept('GET', '**/streak', {
      statusCode: 200,
      body: {
        data: {
          streak: { current: 2, longest: 5 },
        },
      },
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

    cy.visit('/login');
    cy.get('#username').type('john');
    cy.get('#password').type('secret');
    cy.contains('button', 'Masuk').click();
    cy.wait('@loginRequest');
    cy.contains('button', /masuk dashboard|lanjutkan/i).click();
  });

  it('should display budgets list with categories and limits', () => {
    cy.contains('nav a', 'Budget').click();
    cy.url().should('include', '/budget');

    cy.contains('Food').should('exist');
    cy.contains('Transport').should('exist');
  });
});

