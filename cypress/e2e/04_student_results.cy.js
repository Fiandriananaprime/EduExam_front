describe('Student Results & History', () => {
  beforeEach(() => {
    cy.loginAsStudent();
    cy.window().then((window) => {
      window.localStorage.setItem('user', JSON.stringify({
        id: 3,
        firstName: 'Marie',
        lastName: 'Curie',
        role: 'STUDENT'
      }));
    });

    cy.intercept('GET', '**/api/my/results', {
      statusCode: 200,
      body: [
        {
          id: 1,
          examId: 2,
          examTitle: 'QCM Reseaux - Adressage IP',
          courseCode: 'RES1',
          studentId: 3,
          score: 1,
          maxScore: 2,
          submittedAt: '2026-08-17T14:45:54.977Z',
          answers: [
            { questionId: 4, choiceId: 11 },
            { questionId: 5, choiceId: 15 }
          ]
        }
      ]
    }).as('getResults');

    cy.visit('/student/results');
  });

  it('displays results history list', () => {
    cy.wait('@getResults');
    cy.contains('QCM Reseaux - Adressage IP').should('be.visible');
    cy.contains('1/2').should('be.visible');
    cy.contains('50%').should('be.visible');
  });

  it('navigates to detailed result page', () => {
    cy.wait('@getResults');
    cy.contains('View feedback').click();
    cy.url().should('include', '/student/exams/2/result');
  });
});
