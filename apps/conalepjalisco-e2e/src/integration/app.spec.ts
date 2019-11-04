import { getGreeting } from '../support/app.po';

describe('conalepjalisco', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    getGreeting().contains('Welcome to conalepjalisco!');
  });
});
