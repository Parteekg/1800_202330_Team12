// read from database
function displayCardsDynamically(collection) {
    let cardTemplate = document.getElementById("facilityTemplate"); // Retrieve the HTML element with the ID "hikeCardTemplate" and store it in the cardTemplate variable. 

    db.collection(collection).get()
        .then(allFacilities => {
            //var i = 1;  //Optional: if you want to have a unique ID for each hike
            allFacilities.forEach(doc => { //iterate thru each doc
                var title = doc.data().name;
                var address = doc.data().address;
                var facilityID = doc.id;
                var image_url = doc.data().image;
                let eachcard = cardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (eachcard) that will be filled with Firestore data.

                //update title and text and image
                eachcard.querySelector('.card-title').innerHTML = title;
                eachcard.querySelector('.card-address').innerHTML = address;
                eachcard.querySelector('.card-image').src = image_url
                eachcard.querySelector('a').href = "facility_info.html?docID=" + facilityID;
                eachcard.querySelector('i').id = title

                //append each facility 
                document.getElementById("facilities-goes-here").appendChild(eachcard);

                //read from DB, ensure favorite icon is correct color
                currentUser.get().then(userDoc => {
                    var favorite = userDoc.data().favorite;
                    if (favorite.includes(title)) {
                        document.getElementById(title).style = "font-variation-settings: 'FILL' 1; color: red;"
                    }
                })
                //favorite button eventListener
                var favoriteButton = document.getElementById(title);
                favoriteButton.addEventListener("click", function () {
                    updateFavorite(title)
                })
            });
        })
}

var currentUser;

var favoriteBtn = document.querySelectorAll('.btn btn card-href')

// update the color of favorite button when clicked 
function updateFavorite(title) {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            const user = firebase.auth().currentUser;
            currentUser.get().then(userDoc => {
                var favorite = userDoc.data().favorite;
                let isFavorite = favorite.includes(title)
                if (isFavorite) {
                    currentUser.update({
                        favorite: firebase.firestore.FieldValue.arrayRemove(title)
                    }).then(function () {
                        document.getElementById(title).style = "font-variation-settings: 'FILL' 0; color: red;"
                    })
                } else {
                    currentUser.update({
                        favorite: firebase.firestore.FieldValue.arrayUnion(title)
                    }).then(function () {
                        document.getElementById(title).style = "font-variation-settings: 'FILL' 1; color: red;"
                    })
                }
            })
        }
    })
}

function main() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            currentUser = db.collection("users").doc(user.uid); //global
            displayCardsDynamically("facility")  //input param is the name of the collection
        }
    })
}

main()

// take the user back to the previous page
function goBack() {
    window.history.back();
}
