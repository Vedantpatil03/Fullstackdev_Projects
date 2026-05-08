document.getElementById('registration-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const eventSelected = document.getElementById('event').value;

    const confirmationMessage = `Thank you, ${name}! You have registered for ${eventSelected}. We will send a confirmation to ${email}.`;
    document.getElementById('confirmation-message').innerText = confirmationMessage;
    document.getElementById('confirmation-message').style.display = 'block';
    this.reset();
});