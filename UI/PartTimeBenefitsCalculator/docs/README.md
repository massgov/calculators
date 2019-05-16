# Calculator Logic
The main logic of the calculator live in these files:
- [FormProvider](../src/components/Calculator/index.js)
  - [Input](../src/components/Calculator/inputs.js)
  - Output
    - [Output1](../src/components/Calculator/output1.js)
    - [Output2](../src/components/Calculator/output2.js)

## Input

[Input](../src/components/Calculator/inputs.js) consists of 2 currency inputs:
1. Weekly benefit amount
2. Weekly part-time work earning

![input screenshot](./media/input.png)

### Weekly benefit amount

This input is capped at the maximum `$795`, if the input is over the maximum an input validation along with a message output will be rendered and onBlur the value will be set to the maximum.

![sample input 1 exceeds maximum screenshot](./media/input1-validation.png)
See more in `Question1` in [Input](../src/components/Calculator/inputs.js)


## Output

Each valid input will generate a corresponding output that is calculated based on the input value:
1. Earnings exclusion is calculated based on the weekly benefit amount input
2. Impact on weekly benefit amount is calculated based on the weekly part-time work earning and the earnings exclusion

### 1. Earnings exclusion
For any valid input from the weekly benefit currency input, an earnings exclusion is calculated.
```
const earningsDisregardCalc = (weeklyBenefits * (1 / 3));
```
![sample output 2 screenshot](./media/output1.png)
See the calculation in [FormProvider](../src/components/Calculator/index.js)
For more earnings exclusion output settings, see [Output1](../src/components/Calculator/output1.js)

### 2. Impact on weekly benefit amount
There are [three scenarios](../src/components/Calculator/output2.js) for how part-time earnings will impact on weekly benefit amount:
#### 1. Benefits not impacted
Conditions: if part-time earnings is less than or equal to earnings exclusion
```
const earningsOverDis = weeklyEarnings - earningsDisregard;
earningsOverDis <= 0
```
See the conditions in [FormProvider](../src/components/Calculator/index.js)
![sample output 2 screenshot](./media/output2-1.png)

#### 2. Benefits reduced
Conditions: if part-time earnings is greater than earnings exclusion and the part-time earnings is less than or equal to the weekly benefits plus the earnings disregard (1/3 of the weekly benefits)
```
const earningsOverDis = weeklyEarnings - earningsDisregard;
const reducedBenefit = weeklyBenefits - earningsOverDis;
earningsOverDis > 0 && reducedBenefit > 0
```
See the conditions in [FormProvider](../src/components/Calculator/index.js)
![sample output 2 screenshot](./media/output2-2.png)

#### 3. Benefits void
Conditions: If part-time earnings is over the weekly benefits plus the earnings disregard (1/3 of the weekly benefits)
```
const earningsOverDis = weeklyEarnings - earningsDisregard;
const reducedBenefit = weeklyBenefits - earningsOverDis;
reducedBenefit <= 0
```
See the conditions in [FormProvider](../src/components/Calculator/index.js)
![sample output 2 screenshot](./media/output2-3.png)
