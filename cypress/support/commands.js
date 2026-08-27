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
