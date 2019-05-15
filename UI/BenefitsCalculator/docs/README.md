# Calculator Logic
The main logic of the calculator live in these files:
- [Input](./src/components/Form/index.js)
- [Output](./src/components/Form/output.js)
- [Variables](./src/data/variables.json)

### Input

Input consists of 4 currency input for total quarterly wages, 1 checkbox for apply first quarter wages to all and a submit button.

![input screenshot](./media/input.png)


#### Currency input:
The labels for the 4 currency input are calculated based date ranges based on the current date.
Quarter date range calculation logic:
```
const quarterCurrent = moment().quarter();
const quarterDateRange = (quartersAgo) => {
  const quarter = quarterCurrent - quartersAgo;
  let qEnd = moment().quarter(quarter).endOf('quarter');
  let qStart = moment().quarter(quarter).startOf('quarter');
  qEnd = moment(qEnd).format(format);
  qStart = moment(qStart).format(format);
  return{ qEnd, qStart };
};
```

#### Checkbox:
The apply-to-all checkbox is added for the convenience of the users making the same quarterly income in the last 4 quarters. Checking the box will keep the other 3 currency inputs in sync with the value in the first currency input; unchecking the box will break out of the sync and let the user edit the value in each of the other 3 currency inputs.

#### Submit Button:
The submit button will take the values from the user input and render the new output below.
