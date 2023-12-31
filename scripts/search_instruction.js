// take the user back to the previous page
function goBack() {
    window.history.back();
}

// read from database
function displayCardsDynamically(collection) {
    // Retrieve the HTML element with the ID "eachCategoriesTemplate" and store it in the cardTemplate variable.
    let cardTemplate = document.getElementById("eachCategoriesTemplate");

    db.collection(collection).get()
        .then(allCategories => {
            allCategories.forEach(doc => { //iterate thru each doc
                var title = doc.data().categoryDocID;       // get value of the "name" key
                var imageCode = doc.data().imagecode;
                var docID = doc.id;
                let newcard = cardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (newcard) that will be filled with Firestore data.
                //update title and text and image
                newcard.querySelector('.card-title').innerHTML = title;
                newcard.querySelector('.card-img').src = `../images/${imageCode}.jpg`; 
                newcard.querySelector('a').href = "category_template.html?docID=" + docID;
                document.getElementById("categories-goes-here").appendChild(newcard);
            })
        })
}

displayCardsDynamically("category");  //input param is the name of the collection

function saveSearchandRedirect() {
    var keywords = document.getElementById("searchText").value; // Get input search word
    keywords = keywords.toLowerCase().trim(); // Process the input to make sure it's format in line with data in database

    //obtain the document name inside category from database
    const categoryRef = db.collection('category');
    categoryRef.where('items', 'array-contains', keywords)
        .get()
        .then((querySnapshot) => {
            // if the query result is not empty, a matching document was found
            if (!querySnapshot.empty) {
                querySnapshot.forEach((doc) => {
                    // Retrieve the name of the document
                    var category = doc.id;
                    window.location.href = `category_template.html?docID=${category}` // Direct to the instruction page
                });
            } else {
                Swal.fire('Sorry, Not found!')
            }
        })
}

// to make user to hit enter to search
function searchOnEnter(event) {
    // Check if the pressed key is Enter (key code 13)
    if (event.keyCode === 13) {
        saveSearchandRedirect();
    }
}