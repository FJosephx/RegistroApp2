// describe('template spec', () => {
//   it('passes', () => {
//     cy.visit('https://example.cypress.io')
//   })})

//Verificar que el inicio no entre con credenciales incorrectas
  it('verificar inicio incorrecto', () => {  
   cy.visit('http://localhost:8100/')
 .then(() => {
     cy.get('#correo').type('asjndk@duocuc.cl');
     cy.get('#password').type('3564');
     cy.contains('Iniciar Sesión').click();
      })
     .then(() => {
       cy.intercept('/inicio').as('route');
      })
  });

//verificar usuario con credenciales correctas
 it('verificar inicio correcto', () => {
   cy.visit('http://localhost:8100/')
     .then(() => {
       cy.get('#correo').type('fr.unda@duocuc.cl');
       cy.get('#password').type('1234');
       cy.contains('Iniciar Sesión').click();
     })
    .then(() => {
     cy.intercept('/inicio').as('route');
    })
   .then(() => {
     cy.get('ion-card-title').should('contain.text', 'Asistencia DuocUC');
    });
 });
//cerrar sesión 
it('cerrar sesion', ()=>{
  cy.visit('http://localhost:8100/inicio')
  .then(()=>{
    cy.contains('Cerrar sesión').click();
  });
});
