export const config = {
  apiKey: 'AIzaSyDrK4K5TXA9HUls3flFgW14I1IFA8L6Y-U',
  discoveryDocs:
    ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
  spreadsheetId: '1kqURHsf8whuNBxAqr7svJItYivPmCWy0_wf4RL4zQTA'
};
/**
 * Load the cars from the spreadsheet
 * Get the right values from it and assign.
 */
export const load = (callback) => {
  /* eslint no-undef: "off" */
  window.gapi.client.load('sheets', 'v4', () => {
    window.gapi.client.sheets.spreadsheets.values
      .get({
        spreadsheetId: config.spreadsheetId,
        range: 'Sheet1!A:B'
      })
      .then(
        (response) => {
          const data = response.result.values;
          callback({
            data
          });
        },
        (response) => {
          callback(false, response.result.error);
        }
      );
  });
};
