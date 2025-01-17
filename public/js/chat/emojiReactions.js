import { EmojiButton } from 'https://cdn.skypack.dev/@joeattardi/emoji-button';

const emojiButton = document.querySelector('#emoji-button');
const messageInput = document.querySelector('#message-input');

// Initialize emoji picker
const picker = new EmojiButton();

// Attach picker to the emoji button
picker.on('emoji', emoji => {
    const emojiIcon = emoji.emoji
  messageInput.value += " "+ emojiIcon + " "; // Append the emoji to the input
});

emojiButton.addEventListener('click', () => {
  picker.togglePicker(emojiButton);
});

// const textarea = document.getElementById('message-input');

// Adjust the height of the textarea based on its content
messageInput.addEventListener('input', () => {
  messageInput.style.height = 'auto'; // Reset the height to auto to recalculate
  messageInput.style.height = `${messageInput.scrollHeight}px`; // Set it to match content height
});

