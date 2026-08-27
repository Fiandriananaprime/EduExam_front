describe('Admin - Courses Management', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/courses', { body: [
      { id: 'C001', code: 'PROG1', name: 'Introduction to Algorithms', description: 'Fundamentals' },
      { id: 'C002', code: 'PROG2', name: 'Object-Oriented Programming', description: 'Java' },
    ] }).as('getCourses');
    cy.intercept('GET', '**/api/exams', { body: [
      { id: 'EX001', courseId: 'C001' },
      { id: 'EX002', courseId: 'C001' },
      { id: 'EX003', courseId: 'C002' },
    ] }).as('getExams');
    cy.visitAsAdmin('/admin/courses');
  });

  it('lists all initial courses and their course codes', () => {
    cy.wait(['@getCourses', '@getExams']);
    cy.contains('PROG1').should('be.visible');
    cy.contains('Introduction to Algorithms').should('be.visible');

    cy.contains('PROG2').should('be.visible');
    cy.contains('Object-Oriented Programming').should('be.visible');
    cy.contains('article', 'Introduction to Algorithms').should('contain', '2 exams');
    cy.contains('article', 'Object-Oriented Programming').should('contain', '1 exams');

  });

  it('allows adding a new course', () => {
    cy.contains(/add course|create course|new course/i).click();

    cy.intercept('POST', '**/api/courses', (req) => {
      expect(req.body).to.deep.equal({ code: 'WEB1', name: 'Web Development Basics', description: 'HTML, CSS, JS Basics' });
      req.reply({ statusCode: 201, body: { id: 'C003', ...req.body } });
    }).as('createCourse');

    cy.get('input[name="code"], input[placeholder*="Code"]').type('WEB1');
    cy.get('input[name="name"], input[placeholder*="Title"], input[placeholder*="Name"]').type('Web Development Basics');
    cy.get('textarea[name="description"], input[name="description"]').type('HTML, CSS, JS Basics');

    cy.get('form').submit();

    cy.wait('@createCourse');
    cy.contains('WEB1').should('be.visible');
  });

  it('deletes the selected course after confirmation', () => {
    cy.intercept('DELETE', '**/api/courses/C001', {
      statusCode: 204,
      body: '',
    }).as('deleteCourse');
    cy.window().then((win) => cy.stub(win, 'confirm').returns(true).as('confirmDelete'));

    cy.contains('article', 'Introduction to Algorithms').within(() => {
      cy.get('button[aria-label="Delete course"]').click();
    });

    cy.get('@confirmDelete').should('have.been.calledWith', 'Are you sure you want to delete "Introduction to Algorithms"?');
    cy.wait('@deleteCourse');
    cy.contains('Introduction to Algorithms').should('not.exist');
  });
});
