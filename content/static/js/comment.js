// author: Taehong Kim
// email: peppy0510@hotmail.com


$(document).ready(function() {

    let articleUrl = document.getElementById('article-url');

    if (!articleUrl) { return; }
    articleUrl = articleUrl.value;
    // var articleUrl = $('#article-url')[0].value;
    console.log('articleUrl:', articleUrl);
    // '{{ article.url }}';

    var firebaseConfig = {
        apiKey: "AIzaSyCKt3z0JCmxteYhxs93rsMtOqkb4_I8Em4",
        authDomain: "muteklab-com.firebaseapp.com",
        databaseURL: "https://muteklab-com.firebaseio.com",
        projectId: "muteklab-com",
        storageBucket: "muteklab-com.appspot.com",
        messagingSenderId: "358862433613",
        appId: "1:358862433613:web:6bc27b27018c4ae5"
    };

    firebase.initializeApp(firebaseConfig);

    var db = firebase.firestore();


    console.log(db);

    let comments = db.collection('comments');


    console.log(comments);

    let setAda = comments.doc('2').set({
        articleUrl: articleUrl,
        first: 'Ada',
        last: 'Lovelace',
        born: 1815
    });

    let response = comments.get().then(
        (snapshot) => {
            snapshot.forEach((doc) => {
                console.log(doc.id, '=>', doc.data());
            });
        }).catch((error) => {
        console.log('Error getting documents', error);
    });

    console.log(response);
});