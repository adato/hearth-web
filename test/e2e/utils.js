module.exports = {

  beacon: function(selector) {
    return element(by.css('[test-beacon="' + selector + '"]'));
  }

};