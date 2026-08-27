describe('Admin - Exam Results (EX0001)', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/exams/EX0001/results', { body: {
      attemptsCount: 2, average: 7.5,
      results: [
        { studentId: 'STD25001', firstName: 'Alice', lastName: 'Martin', attempted: true, score: 8, submittedAt: '2026-08-20T09:00:00Z' },
        { studentId: 'STD25002', firstName: 'Bob', lastName: 'Durand', attempted: false, score: null, submittedAt: null },
      ],
    } }).as('getResults');
    cy.visitAsAdmin('/admin/exams/EX0001/results');
  });

  it('displays student attempt results and scores', () => {
    cy.wait('@getResults');
    cy.contains('Alice Martin').should('be.visible');
    cy.contains('8').should('be.visible');
    cy.contains('Bob Durand').should('be.visible');
    cy.contains('Not attempted').should('be.visible');
  });

  it('displays overall exam analytics, averages, and submission counts', () => {
    cy.contains('Average: 7.50').should('be.visible');
    cy.contains('2 attempt(s)').should('be.visible');
  });
});
