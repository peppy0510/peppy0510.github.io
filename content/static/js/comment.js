// author: Taehong Kim
// email: peppy0510@hotmail.com


async function showAlert() {
    let alertContainer = createElement('div', 'alert-container');
    $('body')[0].appendChild(alertContainer);
}

function createElement(tag, className, value) {
    let element = document.createElement(tag);
    element.className = className;
    if (value) { element.appendChild(document.createTextNode(value)); }
    return element;
}

function validateEmail(email) {
    if (email.length > 254) { return false; }
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function getArticleUrl() {
    let articleUrl = document.getElementById('article-url');
    if (!articleUrl) { return; }
    return articleUrl.value;
}

function initializeFirebase() {
    var firebaseConfig = {
        authDomain: 'muteklab-com.firebaseapp.com',
        databaseURL: 'https://muteklab-com.firebaseio.com',
        projectId: 'muteklab-com',
        storageBucket: 'muteklab-com.appspot.com',
        // messagingSenderId: '358862433613',
        // appId: '1:358862433613:web:6bc27b27018c4ae5'
    };
    firebase.initializeApp(firebaseConfig);
}

async function onClickSubmitCommentButton() {
    let comment = document.getElementById('comment-content');
    if (comment) { comment = comment.value; }
    let username = document.getElementById('comment-username');
    if (username) { username = username.value; }
    let email = document.getElementById('comment-email');
    if (email) { email = email.value; }
    if (!comment || comment.length < 3) {
        alert('Comment at least 3 chars.');
        return;
    }
    if (email && !validateEmail(email)) {
        alert('Invalid Email. Please check again.');
        return;
    }
    if (!username) {
        let confirmed = confirm('Username will be set as Anonymous.');
        if (!confirmed) { return; }
        username = 'Anonymous';
    }
    let response = await setComment({ username: username, email: email, comment: comment });
    if (response) {
        alert('Your comment has been registered.');
        document.getElementById('comment-content').value = '';
        document.getElementById('comment-username').value = '';
        document.getElementById('comment-email').value = '';
        await setCommentListElement();
    } else {
        alert('Unknown error. Please try again.');
    }
}

async function setComment(instance) {
    let articleUrl = getArticleUrl();
    let db = firebase.firestore();
    let comments = db.collection('comments');
    // let comment = 'HTML 소스에 삽입된 이미지는 클라이언트 캐시가 되지 않기 때문에, 용량이 아주 작은 아이콘 정도에 사용하는 것을 추천한다.';
    // let username = '김태홍';
    // let password = '000000';
    // let email = 'peppy0510@hotmail.com';
    // let private = false;
    // password = sha256(password);
    let registered = new Date().toISOString();
    // let index = md5(articleUrl + comment + username + password + email + registered);
    let index = md5(articleUrl + instance.comment +
        instance.username + instance.email + registered);
    return new Promise(function(resolve) {
        let response = comments.doc(index).set({
            articleUrl: articleUrl,
            comment: instance.comment,
            username: instance.username,
            email: instance.email,
            registered: registered
        }).then(function(success) {
            resolve(true);
        }).catch(function(error) {
            resolve(false);
        })
    });
}

async function getComments() {
    let articleUrl = getArticleUrl();
    if (!articleUrl) { return; }
    let db = firebase.firestore();
    let comments = db.collection('comments');
    return new Promise(function(resolve) {
        // let response = comments.where('articleUrl', '==', articleUrl).orderBy('registered').get().then(function(snapshot) {
        let response = comments.where('articleUrl', '==', articleUrl).get().then(function(snapshot) {
            let comments = [];
            snapshot.forEach(function(doc) {
                comments.push($.extend({ id: doc.id }, doc.data(), true));
            });
            comments.sort(function(a, b) {
                return a.registered > b.registered ? -1 : a.registered < b.registered ? 1 : 0;
            });
            resolve(comments);
        }).catch(function(error) {
            console.error('getComments(): error:', error);
            resolve(false);
        });
    });
}

async function setCommentListElement() {
    let comments = await getComments();
    // console.log(comments);
    if (!comments) { return; }
    $('.comment-count').text(comments.length.toString() + ' Comments');
    let commentList = $('.comment-list');
    commentList.empty();

    for (let i = 0; i < comments.length; i++) {
        let instance = createElement('div', 'comment-instance');
        let head = createElement('div', 'comment-head');
        let body = createElement('div', 'comment-body');
        head.appendChild(createElement('div', 'username', comments[i].username));
        if (comments[i].email) {
            head.appendChild(createElement('div', 'email', comments[i].email));
        }

        let registered = new Date(comments[i].registered);
        // registered = moment(registered).format('YYYY-MM-DD HH:mm:ss').fromNow();
        registered = moment(registered).fromNow();
        // console.log(registered)
        // console.log(registered.toISOString());
        // // console.log(registered.getHours());
        // console.log([registered.getFullYear(), registered.getMonth(), registered.getDate()].join('-'));
        // console.log(registered.getMonth());
        // console.log(registered.getDate());
        // registered = registered.toString();
        head.appendChild(createElement('div', 'registered', registered));
        // instance.appendChild(createElement('div', 'private', comments[i].private));
        body.appendChild(createElement('div', 'comment', comments[i].comment));
        instance.appendChild(head);
        instance.appendChild(body);
        commentList[0].appendChild(instance);
    }
}

$(document).ready(async function() {




    initializeFirebase();
    // await setComment();
    setCommentListElement();


    // let informationElements = audioPlayerElements.find('.information');
    // let paragraph = document.createElement('p');
    // paragraph.className = 'showme-later';
    // informationElements[0].appendChild(paragraph);
    // $('.audio-player .information p').text(title);

    // console.log(hash);
    // console.log(db);
    // console.log(response);
});