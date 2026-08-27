describe('Authentication & Security', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/login');
  });

  it('fails to login with invalid credentials', () => {
    cy.get('[data-testid="login-username"]').type('invalid@examhub.com');
    cy.get('[data-testid="login-password"]').type('wrong_password');
    cy.get('[data-testid="login-submit"]').click();

    cy.url().should('include', '/login');
  });

  it('logs in successfully as Alice Martin', () => {
    cy.get('[data-testid="login-username"]').type('alice.martin@eduexam.local');
    cy.get('[data-testid="login-password"]').type('password');
    cy.get('[data-testid="login-submit"]').click();

    cy.url().should('include', '/student');
  });

  it('logs in successfully as administrator', () => {
    cy.get('[data-testid="login-username"]').type('admin@example.com');
    cy.get('[data-testid="login-password"]').type('admin1234');
    cy.get('[data-testid="login-submit"]').click();

    cy.url().should('include', '/admin');
  });

  it('rejects a documented student account with an invalid password', () => {
    cy.get('[data-testid="login-username"]').type('alice.martin@eduexam.local');
    cy.get('[data-testid="login-password"]').type('wrong_password');
    cy.get('[data-testid="login-submit"]').click();

    cy.url().should('include', '/login');
    cy.window().then((window) => {
      expect(window.localStorage.getItem('token')).to.be.null;
    });
  });

  it('redirects unauthenticated user accessing protected route', () => {
    cy.visit('/student');
    cy.url().should('include', '/login');
  });

  it('prevents student from accessing admin routes', () => {
    cy.get('[data-testid="login-username"]').type('alice.martin@eduexam.local');
    cy.get('[data-testid="login-password"]').type('password');
    cy.get('[data-testid="login-submit"]').click();
    cy.url().should('include', '/student');

    cy.visit('/admin');
    cy.url().should('not.include', '/admin');
  });
});
