const socket = io('http://localhost:3030');
const client = feathers();

client.configure(feathers.hooks());

// Create the Feathers application with a `socketio` connection
client.configure(feathers.socketio(socket));

// #### Photos ####
// Get the service for our `photos` endpoint
const photos = client.service('photos');

// Add a new message to the list
function addPhoto(photo) {
    const slideshow = document.querySelector('.chat');

    slideshow.insertAdjacentHTML('beforeend', `<div class="message flex flex-row">
    <img src="https://placeimg.com/64/64/any" alt="${photo.url}" class="avatar">
    <div class="message-wrapper">
      <p class="message-header">
        <span class="username font-600">${photo.url}</span>
      </p>
      <p class="message-content font-300">${photo.text}</p>
    </div>
  </div>`);

    slideshow.scrollTop = slideshow.scrollHeight - slideshow.clientHeight;
}

function b64(e) {
    var t = "";
    var n = new Uint8Array(e);
    var r = n.byteLength;
    for (var i = 0; i < r; ++i) {
        t += String.fromCharCode(n[i]);
    }
    return window.btoa(t)
}

function setImage(req) {
    var img = document.getElementById('imageUploaded');
    if (req.image) {
        img.src = 'data:' + req.mimetype + ';base64,' + b64(req.buffer);
    }
}

document.getElementById('send-message').addEventListener('submit', function(ev) {
    const urlInput = document.querySelector('[name="url"]');
    // This is the message text input field
    const textInput = document.querySelector('[name="text"]');

    // Create a new message and then clear the input field
    client.service('photos').create({
        text: textInput.value,
        url: urlInput.value
    }).then(() => {
        textInput.value = '';
    });
    ev.preventDefault();
});

//##### Uploads #########
const uploads = client.service('uploads');

function doUploads(file) {
    alert('Received file created event!', file);
}

// Let's use DropZone!
Dropzone.options.myAwesomeDropzone = {
    paramName: "uri",
    uploadMultiple: false,
    init: function() {
        this.on('uploadprogress', function(file, progress) {
            console.log('progresss', progress);
        });
    }
};

//##### Authentivation #########
// Configure authentication
client.configure(feathers.authentication({
    storage: window.localStorage
}));

client.authenticate({
  strategy: 'local',
  email: 'mma.depannage@gmail.com',
  password: 'password'
}).then((token) => {
  console.log('User is logged in', token);
  
  //TODO: a integrer dans myAwesomeDropzone, ce n'est pas generique
  Dropzone.prototype.defaultOptions.withCredentials = true;
  Dropzone.prototype.defaultOptions.jwtToken = token.accessToken;

  // At this point we have a valid token, so we can fetch restricted data.
  //photos.find().then(page => page.data.forEach(addPhoto));
  //photos.on('created', addPhoto);
  //photos.get('image2.jpg').then(image => setImage(image)).catch(err => console.error(err));
  photos.find().then(image => console.log(JSON.stringify(image))).catch(err => console.error(err));
  
  uploads.on('created', doUploads);
});
