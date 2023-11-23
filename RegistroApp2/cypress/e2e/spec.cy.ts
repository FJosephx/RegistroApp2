

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
     cy.intercept('/qr').as('route');
    })
   .then(() => {
     cy.get('#welcome-message').should('contain.text', '¡Bienvenido(a) Franco Unda!');
    });
 });
//cerrar sesión 

it('cerrar sesion', ()=>{
  cy.visit('http://localhost:8100/inicio')
  .then(()=>{
    cy.contains('Cerrar sesión').click();
  });
});
//iniciar sesión con otro usuario
it('verificar inicio correcto', () => {
  cy.visit('http://localhost:8100/')
    .then(() => {
      cy.get('#correo').type('avalenzuela@duocuc.cl');
      cy.get('#password').type('qwer');
      cy.contains('Iniciar Sesión').click();
    })
   .then(() => {
    cy.intercept('/qr').as('route');
   })
  .then(() => {
    cy.get('#welcome-message').should('contain.text', '¡Bienvenido(a) Alberto Valenzuela!');
   });
});

//verificar foro agregar publicacion
it('debe visitar la página de inicio y agregar una nueva publicación', () => {
  // Abre la página de inicio de la aplicación web.
  cy.visit('http://localhost:8100/inicio')
  .then(() =>{
  cy.wait(5000);
  cy.intercept('/Foro').as('route')});

  // Espera a que el elemento #Tituloforo esté visible.
  cy.wait(5000);

  // Escribe el texto "Publicación franco" en el campo de título.
  cy.get('#Tituloforo').type('Publicación franco');

  //Espera a que el elemento sea visible 
  cy.wait(5000);

  // Inserta el texto "esto es una publicación" en el campo de contenido.
  cy.get('#Contenido').type('esto es una publicación');
  

  // Hace clic en el botón "Guardar".
  cy.contains('Guardar').click();
});
//cerrar sesión 
it('cerrar sesion', ()=>{
  cy.visit('http://localhost:8100/inicio')
  .then(()=>{
    cy.contains('Cerrar sesión').click();
  });
});