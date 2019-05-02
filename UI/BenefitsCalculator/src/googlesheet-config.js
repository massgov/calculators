import config from './googlesheet-api';

const load = (callback) => {
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

export default load;
