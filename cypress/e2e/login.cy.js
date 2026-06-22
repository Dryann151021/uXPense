describe('Login flow', () => {
  it('should navigate to home after successful login', () => {
    cy.intercept('POST', '/authentications', {
      statusCode: 201,
      body: {
        data: {
          accessToken: 'header.eyJ1c2VyIjp7fX0.signature',
          refreshToken: 'refresh-token-123',
        },
      },
    }).as('loginRequest');

    cy.visit('/login');
    cy.get('#username').type('john');
    cy.get('#password').type('secret');
    cy.contains('button', 'Masuk').click();

    cy.wait('@loginRequest');
    cy.contains('button', 'Masuk Dashboard').click();
    cy.url().should('include', '/home');
    cy.get('nav').contains('Home').should('exist');
  });
});
