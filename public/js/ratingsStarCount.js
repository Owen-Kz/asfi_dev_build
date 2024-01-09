function StarCount(){
    const ulElements = document.querySelectorAll('ul[data-count]');

    ulElements.forEach(ulElement => {
        // Get the data-count value and convert it to a number
        const count = parseInt(ulElement.getAttribute('data-count'));

        // Get all <i> elements within this <ul>
        const starIcons = ulElement.querySelectorAll('li i');

        // Iterate through the <i> elements and update their class based on the count
        for (let i = 0; i < starIcons.length; i++) {
            if (i < count) {
                starIcons[i].classList.remove('far');
                starIcons[i].classList.add('fas');
            } else {
                starIcons[i].classList.remove('fas');
                starIcons[i].classList.add('far');
            }
        }
    });
}