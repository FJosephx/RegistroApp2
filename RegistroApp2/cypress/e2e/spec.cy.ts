

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
 it('Verificar inicio con credenciales correcta', () => {
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

it('Cerrar sesion actual', ()=>{
  cy.visit('http://localhost:8100/inicio')
  .then(()=>{
    cy.contains('Cerrar sesión').click();
  });
});
//iniciar sesión con otro usuario
it('Verificar inicio correcto', () => {
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
it('Agregar una nueva publicación al foro', () => {
  cy.visit('http://localhost:8100/inicio')
  .then(() =>{
  cy.wait(500);
  const foro = cy.get('ion-segment-button[value="foro"]');
  foro.click();
  // Espera a que el elemento #Tituloforo esté visible.
  cy.wait(500);
  cy.get('#Tituloforo').type('Publicación franco');
  //Espera a que el elemento sea visible 
  cy.wait(500);
  cy.get('#Contenido').type('esto es una publicación');
  // Hace clic en el botón "Guardar".
  cy.wait(500);
  cy.contains('Guardar').click();
  cy.wait(500);
  cy.contains('Aceptar').click();
});
});

//eliminar publicación anterior
it('eliminar publicacion del foro', ()=>{
  cy.visit('http://localhost:8100/inicio')
  .then(() =>{
    cy.wait(500);
    const foro = cy.get('ion-segment-button[value="foro"]');
    foro.click();
      cy.get('#nombrepubli').should('contain.text', 'Autor: Alberto Valenzuela');
     });
     cy.wait(500);
    cy.contains('Eliminar').click();
    cy.wait(500);
    cy.contains('Aceptar');
    cy.wait(500);
});

// puede comprobar que no dejó el valor nulo
it('Validar componente mis datos el nombre debe tener un valor', ()=>{
  cy.visit('http://localhost:8100/inicio')
  .then(() =>{
    cy.wait(500);
    const foro = cy.get('ion-segment-button[value="misdatos"]');
    foro.click();
    cy.wait(500);
      cy.get('#nombre').invoke('val', '');
      cy.get('#nombre').type(' ');
     });
     cy.wait(500);
     cy.contains('Actualizar mis datos').click();
     cy.wait(500);
     cy.contains('Aceptar').click();
     cy.wait(500);
});

// contraseñas son distintas 
it('las contraseñas deben deben ser iguales ', ()=>{
  cy.visit('http://localhost:8100/inicio')
  .then(() =>{
    cy.wait(500);
    const foro = cy.get('ion-segment-button[value="misdatos"]');
    foro.click();
    cy.wait(500);
      cy.get('#password-1').invoke('val', '');
      cy.get('#password-1').type('234');
      cy.get('#contra').invoke('val', '');
      cy.get('#contra').type('2w34');
     });
     cy.wait(500);
     cy.contains('Actualizar mis datos').click();
     cy.wait(500);
     cy.contains('Aceptar').click();
     cy.wait(500);
});
//Actualizar datos 
it('actualizar variable nombre ', ()=>{
  cy.visit('http://localhost:8100/inicio')
  .then(() =>{
    cy.wait(500);
    const foro = cy.get('ion-segment-button[value="misdatos"]');
    foro.click();
    cy.wait(500);
      cy.get('#nombre').invoke('val', '');
      cy.get('#nombre').type('Romina');
     });
     cy.wait(500);
     cy.contains('Actualizar mis datos').click();
     cy.wait(500);
     cy.contains('Cerrar sesión').click();
      cy.get('#correo').type('avalenzuela@duocuc.cl');
      cy.get('#password').type('qwer');
      cy.contains('Iniciar Sesión').click();
      cy.get('#welcome-message').should('contain.text', '¡Bienvenido(a) Romina');
     
});
//cerrar sesión 
it('cerrar sesion', ()=>{
  cy.visit('http://localhost:8100/inicio')
  .then(()=>{
    cy.contains('Cerrar sesión').click();
  });
});
