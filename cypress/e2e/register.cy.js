describe('Register flow', () => {
  it('should register new user and navigate to dashboard', () => {
    cy.intercept('POST', '/users', {
      statusCode: 201,
      body: {
        data: {
          userId: 'user-123',
          username: 'newuser',
          fullname: 'New User',
        },
      },
    }).as('registerRequest');

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

    cy.visit('/register');

    cy.get('#username').type('newuser');
    cy.get('#fullname').type('New User');
    cy.get('#password').type('password123');
    cy.get('#confirm-password').type('password123');

    // Click submit form button (will show confirmation modal)
    cy.contains('button', 'Daftar').click({ force: true });
    cy.wait(500);
    
    // Wait for modal and click confirmation button inside
    cy.get('div[role="dialog"]').should('be.visible').and('not.be.empty');
    cy.get('div[role="dialog"] button').contains('Daftar').should('be.visible').click();

    cy.wait('@registerRequest');
    cy.wait('@loginRequest');

    // Click the success modal button to go to dashboard
    cy.contains('button', /buka dashboard|masuk dashboard/i).click();

    cy.url().should('include', '/home');
  });

  it('should show error when passwords do not match', () => {
    cy.visit('/register');

    cy.get('#username').type('newuser');
    cy.get('#fullname').type('New User');
    cy.get('#password').type('password123');
    cy.get('#confirm-password').type('differentpassword');

    cy.contains('button', 'Daftar').click();

    cy.contains(/password|cocok|sesuai/i).should('exist');
  });

  it('should navigate to login page', () => {
    cy.visit('/register');

    cy.contains('a', /masuk|login/i).click();

    cy.url().should('include', '/login');
  });
});

