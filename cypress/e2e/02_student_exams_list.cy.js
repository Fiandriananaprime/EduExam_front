describe('Student Exam List', () => {
  beforeEach(() => {
    cy.loginAsStudent();

    cy.intercept('GET', '**/api/my/exams', {
      statusCode: 200,
      body: [
        { id: '1', courseId: '1', courseCode: 'PROG2', title: 'Algorithms & Data Structures', startDate: '2026-08-20T08:00:00Z', endDate: '2026-08-20T09:00:00Z' },
        { id: '2', courseId: '2', courseCode: 'RES1', title: 'Database Management Systems', startDate: '2026-08-21T08:00:00Z', endDate: '2026-08-21T09:00:00Z' }
      ]
    }).as('getExams');

    cy.intercept('GET', '**/api/my/results', {
      statusCode: 200,
      body: [
        { examId: '2', examTitle: 'Database Management Systems', score: 16, maxScore: 20, submittedAt: '2026-08-22T10:00:00Z' }
      ]
    }).as('getResults');

    cy.visit('/student');
  });

  it('fetches and displays available exams', () => {
    cy.wait('@getExams');
    cy.wait('@getResults');
    cy.contains('Algorithms & Data Structures').should('be.visible');
    cy.contains('Database Management Systems').should('be.visible');
  });

  it('navigates to exam taking page on click', () => {
    cy.wait('@getExams');
    cy.wait('@getResults');
    cy.contains('Algorithms & Data Structures')
      .parents('.bg-paper')
      .find('[data-testid="start-exam-button"]')
      .click();

    cy.url().should('include', '/student/exams/1');
  });
});
