describe('template spec', () => {
  it('passes', () => {
    cy.visit('https://example.cypress.io')
  })

  //login: correo, password, inicio
  // it('verificar inicio incorrecto', ()=>{
  //   cy.visit('http://localhost:8100/').then(()=>
  //     cy.get('#correo').type('asjndk@duocuc.cl');
  //     cy.get('#password').type('3564');
  //     cy.contains('ingresar').click();
  //     cy.intercept('/inicio').as('route').then(()=>{
  //     cy.get('ion-title').should('contain.text', 'Asistencia DuocUC')
  //     });
  //   });
  // })
  // //verificar correo y contraseña buena
  // it('verificar inicio incorrecto', ()=>{
  //   cy.visit('http://localhost:8100/').then(()=>
  //     cy.get('#correo').type('fr.unda@duocuc.cl');
  //     cy.get('#password').type('123');
  //     cy.contains('ingresa').click();
  //     cy.intercept('/inicio').as('route').then(()=>{
  //     cy.get('#welcome-message').should('contain.text', '!')
  //     });
  //   });
