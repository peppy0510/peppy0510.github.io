// author: Taehong Kim
// email: peppy0510@hotmail.com


function toggleDropdownMenu(index) {
    let navbar = $('.navbar');
    navbar.css({ 'transform': '' });
    let others = navbar.find('.active.dropdown-menu:not(.dropdown-menu-' + index + ')');
    if (others) { others.removeClass('active'); }
    let target = navbar.find('.dropdown-menu-' + index);
    if (!target.hasClass('active')) {
        target.addClass('active');
    } else {
        target.removeClass('active');
    }
}

function closeAllDropdownMenu() {
    let navbar = $('.navbar');
    navbar.find('.dropdown-menu').removeClass('active');
}

function toggleNavbarToggle() {
    let navbar = $('.navbar');
    navbar.css({ 'transform': '' });
    let target = navbar.find('.navbar-menu');
    if (!target.hasClass('active')) {
        target.addClass('active');
        $('body').addClass('overflow-hidden');
    } else {
        target.removeClass('active');
        $('body').removeClass('overflow-hidden');
        $('body').removeClass('overflow-hidden');
    }
}

function closeNavbarToggle() {
    let navbar = $('.navbar');
    navbar.find('.navbar-menu').removeClass('active');
    $('body').removeClass('overflow-hidden');
}

function getComputedTranslateY(obj) {
    if (!window.getComputedStyle) return;
    let style = getComputedStyle(obj),
        transform = style.transform || style.webkitTransform || style.mozTransform;
    let mat = transform.match(/^matrix3d\((.+)\)$/);
    if (mat) { return parseFloat(mat[1].split(', ')[13]) };
    mat = transform.match(/^matrix\((.+)\)$/);
    return mat ? parseFloat(mat[1].split(', ')[5]) : 0;
}

$(document).ready(function() {
    let navbar = $('.navbar');
    let dropdownToggles = navbar.find('.dropdown-toggle');
    for (let index = 0; index < dropdownToggles.length; index++) {
        let childNodes = dropdownToggles[index].parentNode.childNodes;
        // dropdownToggles[index].href = 'javascript:void(0)';
        for (let i = 0; i < childNodes.length; i++) {
            if (childNodes[i].classList &&
                childNodes[i].classList.contains('dropdown-menu')) {
                childNodes[i].classList.add('dropdown-menu-' + index);
            }
        }
        dropdownToggles[index].onclick = function() {
            toggleDropdownMenu(index);
        }
    }
    $('body').bind('click', function(event) {
        // console.log(event);
        let exceptionalClasses = [
            'navbar-menu', 'navbar-toggle',
            'dropdown', 'dropdown-menu', 'dropdown-toggle'
        ];
        let targetClassList = event.target.classList;
        let parentClassList = event.target.parentNode && event.target.parentNode.classList;
        if ((targetClassList && targetClassList.contains('mask')) ||
            (parentClassList && parentClassList.contains('mask'))) {
            closeNavbarToggle();
            closeAllDropdownMenu();
            return;
        }
        for (let i = 0; i < exceptionalClasses.length; i++) {
            let className = exceptionalClasses[i];
            if ((targetClassList && targetClassList.contains(className)) ||
                (parentClassList && parentClassList.contains(className))) {
                return;
            }
        }
        closeNavbarToggle();
        closeAllDropdownMenu();
    });

    $('.navbar-toggle').bind('click', function(event) {
        toggleNavbarToggle();
    });

    var navbarHeight = 50;
    var navbarDivWidth = 520;
    var prevDocumentWidth = $(document).width();
    $(window).resize(function() {
        let width = $(document).width();
        let isNarrow = Boolean(width < navbarDivWidth);
        if (prevDocumentWidth === width) { return; }
        if (isNarrow) {
            closeAllDropdownMenu();
        } else {
            let navbar = $('.navbar');
            navbar.css({ 'transform': 'translateY(0)' });
            closeNavbarToggle();
        }
        prevDocumentWidth = width;
    });

    var prevWindowScrollTop = 0;
    $(document).bind('scroll', function(event) {
        let isNarrow = Boolean(prevDocumentWidth < navbarDivWidth);
        let windowScrollTop = $(window).scrollTop();
        let delta = prevWindowScrollTop - windowScrollTop;
        let isUpward = Boolean(delta < 0);
        let navbar = $('.navbar');
        let translateY = getComputedTranslateY(navbar[0]);
        translateY += delta;
        if (translateY < -navbarHeight) {
            translateY = -navbarHeight;
        }
        if (translateY > 0) {
            translateY = 0;
        }
        if (isNarrow) {
            navbar.css({ 'transform': 'translateY(' + translateY + 'px)' });
            if (isUpward) {
                closeNavbarToggle();
                closeAllDropdownMenu();
            }
        }
        prevWindowScrollTop = windowScrollTop;
    });
});