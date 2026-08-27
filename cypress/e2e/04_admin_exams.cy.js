describe('Admin - Exams Management', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/courses', { body: [{ id: 'C001', name: 'Algorithms', code: 'ALG1' }] });
    cy.intercept('GET', '**/api/exams', { body: [{ id: 'EX0001', courseId: 'C001', title: 'Algorithms midterm', startDate: '2026-08-01T08:00:00Z', endDate: '2026-08-01T10:00:00Z' }] }).as('getExams');
    cy.intercept('GET', '**/api/exams/EX0001/questions', { body: [{ id: 'Q001' }] });
    cy.intercept('GET', '**/api/exams/EX0001/results', { body: { attemptsCount: 2, average: 8, results: [] } });
    cy.visitAsAdmin('/admin/exams');
  });

  it('displays configured exams with title and course references', () => {
    cy.wait('@getExams');
    cy.contains('Algorithms midterm').should('be.visible');
    cy.contains('Algorithms').should('be.visible');
  });

  it('navigates to the question editor with the row action', () => {
    cy.contains('tr', 'Algorithms midterm').within(() => cy.contains('button', 'Questions').click());
    cy.location('pathname').should('eq', '/admin/exams/EX0001/questions');
  });
});
