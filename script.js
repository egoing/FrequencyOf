function analysis(type) {
  chrome.tabs.executeScript(null, {
    code: 'document.querySelector(\'body\').innerText'
  }, function (result) {
    var words = result[0];
    var test = $('#myword').val();
    var tests = test.split(',');
    var str = '';
    var selected = 0;
    for (var i = 0; i < tests.length; i++) {
      var char = tests[i];
      if (char == '')
        continue;
      switch (type) {
      case 'zh':
        var regx = new RegExp(char, 'g');
        break;
      default:
        var regx = new RegExp('\\b' + char + '\\b', 'g');
        break;
      }
      var matchs = words.match(regx);
      if (!matchs)
        continue;
      selected += matchs.length;
      str += '<tr>\
        <td>' + char + '</td>\
        <td>' + matchs.length + '(' + (100 * matchs.length / words.length).toFixed(1) + '%)</td>\
        <td><progress value="' + (100 * matchs.length / words.length) + '" max="100"></progress></td>\
      </tr>';
    }
    document.querySelector('#stat').innerHTML = str;
    document.querySelector('#result').innerHTML = selected + ' (' + (100 * selected / words.length).toFixed(1) + '%)';
  })
}
var mywords = null;
var selected = null;
var config = {
  selected: 'en',
  languages: {}
};
document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('#language').addEventListener('change', function (e) {
    config.selected = e.target.value;
    if (!config.languages[config.selected])
      config.languages[config.selected] = '';
    document.querySelector('#myword').value = config.languages[config.selected];
    chrome.storage.sync.set({
      'config': config
    });
    analysis(config.selected);
  });
  document.querySelector('#myword').addEventListener('change', function (e) {
    config.languages[config.selected] = e.target.value;
    document.querySelector('#myword').value = config.languages[config.selected];
    chrome.storage.sync.set({
      'config': config
    });
    analysis(config.selected);
  });
  chrome.storage.sync.get('config', function (e) {
    if (e.config){
      config = e.config;
    } else {
      config.selected = 'en';
      config.languages[config.selected] = '';
    }
    document.querySelector('#language').value = config.selected;
    document.querySelector('#myword').value = config.languages[config.selected];
    analysis(config.selected);
  });
});