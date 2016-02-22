var clientId = 'xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com';
var apiKey = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
var scopes = 'https://www.googleapis.com/auth/gmail.readonly';

function handleClientLoad() {
  gapi.client.setApiKey(apiKey);
  window.setTimeout(checkAuth, 1);
}

function checkAuth() {
  gapi.auth.authorize({
    client_id: clientId,
    scope: scopes,
    immediate: true
  }, handleAuthResult);
}

function handleAuthClick() {
  gapi.auth.authorize({
    client_id: clientId,
    scope: scopes,
    immediate: false
  }, handleAuthResult);
  return false;
}

function handleAuthResult(authResult) {
  if(authResult && !authResult.error) {
    loadGmailApi();
  } else {
    // $('#authorize').on('click', function(){
    //   handleAuthClick();
    // });
  }
}

function loadGmailApi() {
  gapi.client.load('gmail', 'v1', displayInbox);
}

function displayInbox() {
  var request = gapi.client.gmail.users.messages.list({
    'userId': 'me',
    'labelIds': 'INBOX',
    'maxResults': 20
  });

  request.execute(function(response) {
    $.each(response.messages, function() {
      var messageRequest = gapi.client.gmail.users.messages.get({
        'userId': 'me',
        'id': this.id
      });
      messageRequest.execute(appendMessageRow);
    });
  });
}

function appendMessageRow(message) {

  $('#list-email').append('
  <li class="item '+ unRead(message.labelIds) +'">\
    <span class="title">'+ getHeader(message.payload.headers, 'Subject') +'</span>\
    <span class="excerpt">'+ getHeader(message.payload.headers, 'From') +'</span>\
  </li>\
  ');

  console.log(message);
}

function getHeader(headers, index) {
  var header = '';
  $.each(headers, function(){
    if(this.name === index){
      header = this.value;
    }
  });
  return header;
}

function unRead(labelIds) {
  var read = '';
  $.each(labelIds, function(){
    if(this == 'UNREAD'){
      read = 'no-read';
    }else{
      read = 'read';
    }
  });
  return read;
}

function getBody(message) {
  var encodedBody = '';
  if(typeof message.parts === 'undefined') {
    encodedBody = message.body.data;
  }
  else {
    encodedBody = getHTMLPart(message.parts);
  }
  encodedBody = encodedBody.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '');
  return decodeURIComponent(escape(window.atob(encodedBody)));
}

function getHTMLPart(arr) {
  for(var x = 0; x <= arr.length; x++) {
    if(typeof arr[x].parts === 'undefined') {
      if(arr[x].mimeType === 'text/html') {
        return arr[x].body.data;
      }
    }
    else {
      return getHTMLPart(arr[x].parts);
    }
  }
  return '';
}
