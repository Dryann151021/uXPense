describe('Dashboard and Navigation', () => {
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
          ],
        },
      },
    });

    cy.intercept('GET', '**/streak', {
      statusCode: 200,
      body: {
        data: {
          streak: { current: 3, longest: 5, lastExpenseDate: '2024-06-23' },
        },
      },
    });

    cy.intercept('GET', '**/level', {
      statusCode: 200,
      body: {
        data: {
          level: {
            current: 2,
            currentXp: 150,
            xpRequiredForNext: 200,
            progressPercentage: 75,
            daily: { count: 2, remaining: 1 },
          },
        },
      },
    });

    cy.intercept('GET', '**/expenses', {
      statusCode: 200,
      body: {
        data: {
          expenses: [
            {
              id: 'exp-1',
              category: 'Food',
              amount: 50000,
              description: 'Lunch',
              date: '2024-06-23',
            },
          ],
        },
      },
    });

    cy.visit('/login');
    cy.get('#username').type('john');
    cy.get('#password').type('secret');
    cy.contains('button', 'Masuk').click();
    cy.wait('@loginRequest');
    cy.contains('button', /masuk dashboard|lanjutkan/i).click();
  });

  it('should navigate between pages', () => {
    cy.url().should('include', '/home');

    cy.contains('nav a', 'Budget').click();
    cy.url().should('include', '/budget');

    cy.contains('nav a', 'Expense').click();
    cy.url().should('include', '/expense');

    cy.contains('nav a', 'Home').click();
    cy.url().should('include', '/home');
  });

  it('should display recent expenses on dashboard', () => {
    cy.contains('Lunch').should('exist');
  });
});
