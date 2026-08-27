describe('Student Results & History', () => {
  beforeEach(() => {
    cy.loginAsStudent();
    cy.window().then((window) => {
      window.localStorage.setItem('user', JSON.stringify({
        id: 'STD25003',
        firstName: 'Marie',
        lastName: 'Curie',
        role: 'STUDENT'
      }));
    });

    cy.intercept('GET', '**/api/my/results', {
      statusCode: 200,
      body: [
        {
          id: '1',
          examId: '2',
          examTitle: 'QCM Reseaux - Adressage IP',
          courseCode: 'RES1',
          studentId: 'STD25003',
          score: 1,
          maxScore: 2,
          submittedAt: '2026-08-17T14:45:54.977Z',
          corrections: [
            {
              questionId: '4',
              statement: 'Combien d\'hotes sur un /24 (hors reseau et broadcast) ?',
              selectedChoiceId: '11',
              correctChoiceId: '11',
              isCorrect: true,
              pointsEarned: 1
            },
            {
              questionId: '5',
              statement: "Quelle classe d'adresse est 10.0.0.0/8 ?",
              selectedChoiceId: '15',
              correctChoiceId: '14',
              isCorrect: false,
              pointsEarned: 0
            }
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
