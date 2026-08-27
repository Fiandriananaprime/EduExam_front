Cypress.Commands.add('loginAsStudent', () => {
  window.localStorage.setItem('token', 'fake-jwt-token-student');
  window.localStorage.setItem('role', 'STUDENT');
  window.localStorage.setItem('user', JSON.stringify({
    id: 1,
    role: 'STUDENT',
    firstName: 'Jean',
    lastName: 'Dupont',
  }));
});

Cypress.Commands.add('visitAsAdmin', (path) => {
  cy.visit(path, {
    onBeforeLoad(win) {
      win.localStorage.setItem('token', 'fake-jwt-token-admin');
      win.localStorage.setItem('role', 'ADMIN');
      win.localStorage.setItem('user', JSON.stringify({ id: 'ADM001', role: 'ADMIN' }));
    },
  });
});
