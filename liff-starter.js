window.onload = function() {
    const useNodeJS = false;   // if you are not using a node server, set this value to false
    const defaultLiffId = "1653758609-4xzJNlBe";   // change the default LIFF value if you are not using a node server
 
    // DO NOT CHANGE THIS
    let myLiffId = "";
 
    // if node is used, fetch the environment variable and pass it to the LIFF method
    // otherwise, pass defaultLiffId
    if (useNodeJS) {
        fetch('/send-id')
            .then(function(reqResponse) {
                return reqResponse.json();
            })
            .then(function(jsonResponse) {
                myLiffId = jsonResponse.id;
                initializeLiffOrDie(myLiffId);
            })
            .catch(function(error) {
                document.getElementById("liffAppContent").classList.add('hidden');
                document.getElementById("nodeLiffIdErrorMessage").classList.remove('hidden');
            });
    } else {
        myLiffId = defaultLiffId;
        initializeLiffOrDie(myLiffId);
    }
};
 
/**
* Check if myLiffId is null. If null do not initiate liff.
* @param {string} myLiffId The LIFF ID of the selected element
*/
function initializeLiffOrDie(myLiffId) {
    if (!myLiffId) {
        document.getElementById("liffAppContent").classList.add('hidden');
        document.getElementById("liffIdErrorMessage").classList.remove('hidden');
    } else {
        initializeLiff(myLiffId);
    }
}
 
/**
* Initialize LIFF
* @param {string} myLiffId The LIFF ID of the selected element
*/
function initializeLiff(myLiffId) {
    liff
        .init({
            liffId: myLiffId
        })
        .then(() => {
            // start to use LIFF's api
            initializeApp();

            if (!liff.isLoggedIn()) {
                close();
            }
        })
        .catch((err) => {
            document.getElementById("liffAppContent").classList.add('hidden');
            document.getElementById("liffInitErrorMessage").classList.remove('hidden');
        });
}
 
/**
 * Initialize the app by calling functions handling individual app components
 */
function initializeApp() {
 
    // check if the user is logged in/out, and disable inappropriate button
    if (liff.isLoggedIn()) {

        getProfile();
        message();
        
        liff.openWindow({
        url: 'https://jarung.herokuapp.com/', // Isi dengan Endpoint URL aplikasi web Anda
        external: true
        });
    }
} 

function message() {
    os = liff.getOS()
    if (!liff.isInClient()) {
        sendAlertIfNotInClient();
    } else {
        liff.sendMessages([{
            'type': 'text',
            'text': "Membuka game Adventure of Jarung menggunakan "+ os
        }]).catch(function(error) {
            alert('Gagal mengirim pesan!');
        });
    }
}

function close() {
    if (!liff.isInClient()) {
        sendAlertIfNotInClient();
    } else {
        liff.sendMessages([{
            'type': 'text',
            'text': "Anda telah selesai bermain"
        }])
    }
}

function sendAlertIfNotInClient() {
    alert('Anda membuka Adventure of Jarung di browser eksternal');
}

function getProfile() {
    liff.getProfile()
    .then(profile => {
        const username = profile.displayName
        var name = username
        window.alert('Selamat bermain ' + name);
    })
    .catch((err) => {
        console.log('error', err);
        window.alert('Error getting profile: ' + error);
    });
}