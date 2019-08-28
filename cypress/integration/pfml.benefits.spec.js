import BenefitsVariables from '../../PFML/BenefitsCalculator/src/data/BenefitsVariables.json';
import PartOne from '../../PFML/BenefitsCalculator/src/data/PartOne.json';

const strip = (html) => {
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}

describe('First Test', () => {
  it('Validate pfml benefits calculator is loading', () => {
    cy.visit('http://localhost:8000/');
  });
  it('Validate the page header text is rendered.', () => {
  	cy.get('.ma__page-header__title').should('contain.text',BenefitsVariables.title);
  });
  it('Validate that question two is disabled', () => {
  	cy.get('#question-2').should('have.attr', 'disabled');
  });
  it('Validate the radio button options are all rendered, clicks render the correct callout message and disable/enable question 2 input appropriately.', () => {
  	const numRadioButton = PartOne.options.length;
  	let i = 0;
  	for (; i < numRadioButton; i += 1) {
  		cy.get(`:nth-child(${i+1}) > .ma__input-radio--outline > .ma__input-radio--outline__label`).should('contain.text',PartOne.options[i].label).click().wait(500);
  		cy.get('.ma__callout-alert__content').should('contain.text',strip(PartOne.options[i].message));
  		if(PartOne.options[i].weeks === '0') {
  		  cy.get('#question-2').should('have.attr', 'disabled');
  		} else {
  			cy.get('#question-2').should('not.have.attr', 'disabled');
  		}
  	};
  });
  it('Validate click on .', () => {
  	cy.get(':nth-child(3) > .ma__input-radio--outline > .ma__input-radio--outline__label').click().wait(500);
  	cy.get('#question-2').type(35000)
  });
});
