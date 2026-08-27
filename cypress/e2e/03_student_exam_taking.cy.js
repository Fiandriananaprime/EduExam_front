describe('Student Exam Session', () => {
  beforeEach(() => {
    cy.loginAsStudent();

    cy.intercept('GET', '**/api/my/exams/1', {
      statusCode: 200,
      body: {
        id: '1',
        courseId: '1',
        title: 'QCM POO - Chapitre 1',
        description: 'Bases de la programmation orientee objet.',
        startDate: '2026-08-25T14:45:54.977Z',
        endDate: '2026-09-02T14:45:54.977Z',
        questions: [
          {
            id: '1',
            statement: "Qu'est-ce que l'encapsulation ?",
            points: 2,
            choices: [
              { id: '1', text: "Cacher les details internes d'un objet" },
              { id: '2', text: "Creer plusieurs instances d'une classe" },
              { id: '3', text: "Heriter d'une classe parente" }
            ]
          },
          {
            id: '2',
            statement: "Quel mot-cle permet l'heritage en Java ?",
            points: 1,
            choices: [
              { id: '4', text: 'implements' },
              { id: '5', text: 'extends' },
              { id: '6', text: 'inherits' },
              { id: '7', text: 'super' }
            ]
          },
          {
            id: '3',
            statement: 'Le polymorphisme permet :',
            points: 2,
            choices: [
              { id: '8', text: "D'utiliser une meme methode avec des comportements differents" },
              { id: '9', text: 'De supprimer une classe' },
              { id: '10', text: "D'empecher l'heritage" }
            ]
          }
        ]
      }
    }).as('getExamDetail');

    cy.visit('/student/exams/1');
  });

  it('displays exam questions and allows option selection', () => {
    cy.wait('@getExamDetail');
    cy.contains("Qu'est-ce que l'encapsulation ?").should('be.visible');
    cy.contains("Cacher les details internes d'un objet").click();
  });

  it('handles leave modal cancellation', () => {
    cy.wait('@getExamDetail');
    cy.get('[data-testid="leave-exam-button"]').click();
    cy.contains('Leave exam?').should('be.visible');
    cy.get('[data-testid="cancel-leave-button"]').click();
    cy.url().should('include', '/student/exams/1');
  });

  it('submits exam via submit modal', () => {
    cy.intercept('POST', '**/api/my/exams/1/submit', {
      statusCode: 200,
      body: {
        id: '2',
        examId: '1',
        examTitle: 'QCM POO - Chapitre 1',
        courseCode: 'PROG2',
        studentId: 'STD25002',
        score: 2,
        maxScore: 5,
        submittedAt: '2026-08-26T15:00:00.000Z',
        corrections: [
          {
            questionId: '1',
            statement: "Qu'est-ce que l'encapsulation ?",
            selectedChoiceId: '1',
            correctChoiceId: '1',
            isCorrect: true,
            pointsEarned: 2
          },
          {
            questionId: '2',
            statement: "Quel mot-cle permet l'heritage en Java ?",
            selectedChoiceId: null,
            correctChoiceId: '5',
            isCorrect: false,
            pointsEarned: 0
          },
          {
            questionId: '3',
            statement: 'Le polymorphisme permet :',
            selectedChoiceId: null,
            correctChoiceId: '8',
            isCorrect: false,
            pointsEarned: 0
          }
        ]
      }
    }).as('submitExam');

    cy.wait('@getExamDetail');
    cy.contains("Cacher les details internes d'un objet").click();
    cy.get('[data-testid="submit-exam-button"]').click();

    cy.contains('Submit exam?').should('be.visible');
    cy.get('[data-testid="confirm-submit-button"]').click();

    cy.wait('@submitExam');
    cy.url().should('include', '/student/exams/1/result');
  });
});
