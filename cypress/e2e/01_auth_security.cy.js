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

  it('logs in successfully as Jean Dupont', () => {
    cy.get('[data-testid="login-username"]').type('jean.dupont@examhub.com');
    cy.get('[data-testid="login-password"]').type('student1234');
    cy.get('[data-testid="login-submit"]').click();

    cy.url().should('include', '/student');
  });

  it('logs in successfully as administrator', () => {
    cy.get('[data-testid="login-username"]').type('admin@examhub.com');
    cy.get('[data-testid="login-password"]').type('admin1234');
    cy.get('[data-testid="login-submit"]').click();

    cy.url().should('include', '/admin');
  });

  it('rejects the disabled student account', () => {
    cy.get('[data-testid="login-username"]').type('paul.martin@examhub.com');
    cy.get('[data-testid="login-password"]').type('student1234');
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
    cy.get('[data-testid="login-username"]').type('jean.dupont@examhub.com');
    cy.get('[data-testid="login-password"]').type('student1234');
    cy.get('[data-testid="login-submit"]').click();
    cy.url().should('include', '/student');

    cy.visit('/admin');
    cy.url().should('not.include', '/admin');
  });
});
