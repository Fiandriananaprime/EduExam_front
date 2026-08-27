describe('Admin - Students Management', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/students', { body: [
      { id: 'STD25001', firstName: 'Alice', lastName: 'Martin', email: 'alice.martin@eduexam.local', isActive: true },
      { id: 'STD25002', firstName: 'Bob', lastName: 'Durand', email: 'bob.durand@eduexam.local', isActive: true },
    ] }).as('getStudents');
    cy.visitAsAdmin('/admin/students');
  });

  it('displays enrolled students returned by the API', () => {
    cy.wait('@getStudents');
    cy.contains('Alice Martin').should('be.visible');
    cy.contains('alice.martin@eduexam.local').should('be.visible');
    cy.contains('Bob Durand').should('be.visible');
  });

  it('creates a new student with the form payload', () => {
    cy.intercept('POST', '**/api/students', (req) => {
      expect(req.body).to.deep.include({ firstName: 'Eve', lastName: 'Petit', email: 'eve.petit@eduexam.local' });
      req.reply({ statusCode: 201, body: { id: 'STD25005', ...req.body, isActive: true } });
    }).as('createStudent');
    cy.contains('button', 'Add new student').click();
    cy.get('input[name="firstName"]').type('Eve');
    cy.get('input[name="lastName"]').type('Petit');
    cy.get('input[type="email"]').type('eve.petit@eduexam.local');
    cy.get('input[type="password"]').type('Password123!');
    cy.get('form').submit();
    cy.wait('@createStudent');
    cy.contains('Eve Petit').should('be.visible');
  });
});
