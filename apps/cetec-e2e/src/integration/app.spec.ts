import { getGreeting } from '../support/app.po';

describe('cetec', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    getGreeting().contains('Welcome to cetec!');
  });
});
