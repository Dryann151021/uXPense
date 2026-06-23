describe('Profile and header interactions', () => {
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
          budgets: [{ category: 'Food', limitAmount: 100000, month: '2024-06' }],
        },
      },
    });

    cy.intercept('GET', '**/streak', {
      statusCode: 200,
      body: {
        data: {
          streak: { current: 2, longest: 5, lastExpenseDate: '2024-06-23' },
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

  it('should open profile dropdown when avatar is clicked', () => {
    cy.get('button[aria-label*="profile"]').click();

    cy.contains(/notifikasi/i).should('be.visible');
  });

  it('should close profile dropdown when clicking outside', () => {
    cy.get('button[aria-label*="profile"]').click();
    cy.contains(/notifikasi/i).should('be.visible');

    cy.get('header').click({ force: true });
    cy.contains(/notifikasi/i).should('not.exist');
  });

  it('should display streak counter in header', () => {
    cy.contains('2').should('exist');
  });

  it('should show logout button in profile menu', () => {
    cy.get('button[aria-label*="profile"]').click();

    cy.contains('button', /logout|keluar/i).should('exist');
  });
});

