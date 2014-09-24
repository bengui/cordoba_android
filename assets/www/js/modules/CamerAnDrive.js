/*
	CameraAnDrive_v0.1

	This is a module to manage the views gestures

	Requires bengui-core.js!

*/


function changePic(imageURI){
    $('#profile-pic').attr('src', imageURI);
}
// Called when capture operation is finished
//
function captureSuccess(mediaFiles) {
    var i, len;
    for (i = 0, len = mediaFiles.length; i < len; i += 1) {
        uploadFile(mediaFiles[i]);
    }       
}

// Called if something bad happens.
// 
function captureError(error) {
    var msg = 'An error occurred during capture: ' + error.code;
    navigator.notification.alert(msg, null, 'Uh oh!');
}

// A button will call this function
//
function captureImage() {
    // Launch device camera application, 
    // allowing user to capture up to 2 images
    navigator.device.capture.captureImage(captureSuccess, captureError, {limit: 2});
}

// Upload files to server
function uploadFile(mediaFile) {
    var ft = new FileTransfer(),
    path = mediaFile.fullPath,
    name = mediaFile.name;

    ft.upload(path,
        "http://my.domainbengui.com/upload.php",
        function(result) {
            console.log('Upload success: ' + result.responseCode);
            console.log(result.bytesSent + ' bytes sent');
        },
        function(error) {
            console.log('Error uploading file ' + path + ': ' + error.code);
        },
        { fileName: name });

    changePic(path);
}


//select img
var selectPic = function(){
    
    // Espera a que PhoneGap se inicie
    //
    document.addEventListener("deviceready", onDeviceReady, false);

    // PhoneGap esta lista
    //
    function onDeviceReady() {

        // Retorna la ruta hacia el archivo de imagen
        navigator.camera.getPicture(uploadPhoto,
                                    function(message) { alert('Fallo obteniendo imagen'); },
                                    { quality: 50, 
                                    destinationType: navigator.camera.DestinationType.FILE_URI,
                                    sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY }
                                    );

    }

    function uploadPhoto(imageURI) {
        var options = new FileUploadOptions();
        options.fileKey="file";
        options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
        options.mimeType="image/jpeg";

        var params = new Object();
        params.value1 = "test";
        params.value2 = "param";

        options.params = params;

        var ft = new FileTransfer();
        ft.upload(imageURI, "http://ejemplo.servidorbengui.com/upload.php", win, fail, options);

        
        changePic(imageURI);

    }

    function win(r) {
        console.log("Código = " + r.responseCode);
        console.log("Respuesta = " + r.response);
        console.log("Enviados = " + r.bytesSent);
    }

    function fail(error) {
        alert("Ocurrió un error: Código = " = error.code);
    }

}
