// Reference to the 'category' collection, then the 'paper_cardboard' subcollection
const categoryRef = db.collection('category').doc('paper_cardboard');

// Query the 'instruction' and 'recyclable' fields
categoryRef.get()
    .then((doc) => {
        if (doc.exists) {
            const instruction = doc.data().instruction;
            const recyclable = doc.data().recyclable;
            const examples = doc.data().examples;
            console.log(`Instruction: ${instruction}, Recyclable: ${recyclable}`);
            document.getElementById("instruction-go-here").innerText = instruction;
            document.getElementById("recyclable-go-here").innerText = recyclable;
            document.getElementById("example-go-here").innerText = examples;
        } else {
            console.log('No such document!');
        }
    })
    .catch((error) => {
        console.error('Error retrieving document:', error);
    });