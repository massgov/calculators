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
  		cy.get(`:nth-child(${i+1}) > .ma__input-radio--outline > .ma__input-radio--outline__label`).should('contain.text',PartOne.options[i].label).click().wait(100);
  		cy.get('.ma__callout-alert__content').should('contain.text',strip(PartOne.options[i].message));
  		if(PartOne.options[i].weeks === '0') {
  		  cy.get('#question-2').should('have.attr', 'disabled');
  		} else {
  			cy.get('#question-2').should('not.have.attr', 'disabled');
  		}
  	};
  });
  it('Validate typing under state average return callout with 80%', () => {
  	cy.get(':nth-child(1) > .ma__input-radio--outline > .ma__input-radio--outline__label').click().wait(100);
  	cy.get('#question-2').type(parseFloat(BenefitsVariables.baseVariables.maAvgYear)/2-10000).wait(100);
  	cy.get('#percentWeeklyIncome').should('contain.text',`${BenefitsVariables.baseVariables.lowBenefitFraction*100}%`);
  });
  it('Validate typing under state average return callout with less than 80%', () => {
  	cy.get('#question-2').clear().type(parseFloat(BenefitsVariables.baseVariables.maAvgYear)/2+10000).wait(100);
  	cy.get('#percentWeeklyIncome').should('not.contain.text',`${BenefitsVariables.baseVariables.lowBenefitFraction*100}%`);
  });
  it('Validate clicking on tooltip in results callout alert works', () => {
  	cy.get('#trigger-help-tip-benefits-0').click().wait(100);
  	cy.get('.ma__help-text').should('exist');
  });
  it('Validate that if you enter a number under the min salary the warning callout alert is rendered', () => {
  	cy.get('#question-2').clear().type(parseFloat(BenefitsVariables.baseVariables.minSalary)-100);
  	cy.get('.ma__label').click().wait(100);
  	cy.get('.ma__callout-alert--c-error-red').should('exist');
  })
});

