# Calculators
Code base for calculator UIs.


### Auto Deployment
If you are only working on one of the calculators, follow the naming convention below for branches:
- PFML/BenefitsCalculator: start the branch with `pfml-benefits/`
- PFML/ContributionCalculator: start the branch with `pfml-contribution/`
- UI/BenefitsCalculator: start the branch with`ui-benefits/`
- UI/PartTimeBenefitsCalculator: start the branch with `ui-part-time/`

Branches with the above naming prefixes will have circleCI run the test on respective sub-repo. Branches without such prefixes will have no tests run automatically.
If a branch needs to run all tests, start the branch name with `all/`