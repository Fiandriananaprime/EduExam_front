describe('Admin Dashboard Page', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/students', { body: [
      { id: 'STD001', firstName: 'Alice', lastName: 'Martin', email: 'alice@example.test', isActive: true },
      { id: 'STD002', firstName: 'Bob', lastName: 'Durand', email: 'bob@example.test', isActive: true },
    ] }).as('getStudents');
    cy.intercept('GET', '**/api/courses', { body: [{ id: 'C001', name: 'Algorithms', code: 'ALG1' }] }).as('getCourses');
    cy.intercept('GET', '**/api/exams', { body: [{ id: 'EX001', courseId: 'C001', title: 'Algorithms midterm', startDate: '2026-08-01T08:00:00Z', endDate: '2026-08-01T10:00:00Z' }] }).as('getExams');
    cy.intercept('GET', '**/api/exams/EX001/results', { body: { attemptsCount: 1, average: 8, results: [] } });
    cy.visitAsAdmin('/admin');
  });

  it('displays counters calculated from the API data', () => {
    cy.wait(['@getStudents', '@getCourses', '@getExams']);
    cy.get('main').within(() => {
      cy.contains('Students').should('be.visible');
      cy.contains('Courses').should('be.visible');
      cy.contains('Exams').should('be.visible');
      cy.contains('2').should('be.visible');
      cy.contains('1').should('be.visible');
    });
  });

  it('navigates to an administration section from a quick action', () => {
    cy.contains('button', 'Add a student').click();
    cy.location('pathname').should('eq', '/admin/students');
  });
});
