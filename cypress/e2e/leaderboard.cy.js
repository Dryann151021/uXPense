describe('Leaderboard flow', () => {
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
      body: { data: { budgets: [] } },
    });

    cy.intercept('GET', '**/streak', {
      statusCode: 200,
      body: { data: { streak: { current: 0, longest: 0 } } },
    });

    cy.intercept('GET', '**/level', {
      statusCode: 200,
      body: {
        data: {
          level: {
            current: 1,
            currentXp: 0,
            xpRequiredForNext: 100,
            progressPercentage: 0,
            daily: { count: 0, remaining: 3 },
          },
        },
      },
    });

    cy.intercept('GET', '**/expenses', {
      statusCode: 200,
      body: { data: { expenses: [] } },
    });

    cy.intercept('GET', '**/leaderboard', {
      statusCode: 200,
      body: {
        data: {
          leaderboard: [
            { username: 'john', level: 5, xp: 500, rank: 1 },
            { username: 'jane', level: 4, xp: 400, rank: 2 },
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

  it('should navigate to leaderboard page', () => {
    cy.contains('nav a', 'Leaderboard').click();
    cy.url().should('include', '/leaderboard');
  });
});
