describe('Admin - Exam Questions Editor (EX0001)', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/exams/EX0001/questions', { body: [{
      id: 'Q001', statement: 'Which JavaScript keyword declares a block-scoped variable?', points: 1,
      choices: [{ id: 'A', text: 'let', isCorrect: true }, { id: 'B', text: 'var', isCorrect: false }],
    }] }).as('getQuestions');
    cy.visitAsAdmin('/admin/exams/EX0001/questions');
  });

  it('loads existing questions and answer choices for EX0001', () => {
    cy.contains('Which JavaScript keyword declares a block-scoped variable?').should('be.visible');
    cy.contains('let').should('be.visible');
    cy.contains('var').should('be.visible');
  });

  it('allows editing an existing question', () => {
    cy.intercept('PUT', '**/api/questions/Q001', (req) => {
      expect(req.body.statement).to.equal('Which keyword creates a block-scoped variable?');
      req.reply({ body: { id: 'Q001', ...req.body } });
    }).as('updateQuestion');

    cy.get('button[aria-label="Edit question 1"]').click();
    cy.get('textarea').clear().type('Which keyword creates a block-scoped variable?');

    cy.get('form').submit();

    cy.wait('@updateQuestion');
    cy.contains('Which keyword creates a block-scoped variable?').should('be.visible');
  });
});
