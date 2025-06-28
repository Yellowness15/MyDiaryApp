//Wait until the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    const getStartedBtn = document.querySelector('.btn-primary');
//add the click event to the button
    getStartedBtn.addEventListener('click', function (event) {
    event.preventDefault();  //prevents default action
    console.log('User clicked "Get Started" on landing page');
    window.location.href = 'login.html';   //performs a redirect manually.
});
})
