const form = document.querySelector('.ticket-form');
// const ticket = document.getElementById('ticket');
const formContent = document.querySelector('.form-content');
const displayData = document.querySelector('.display-data');
const displayName = document.querySelector('.display-name');
const displayEmail = document.querySelector('.header-email');
const displayGithub = document.querySelector('.display-github');
const displayImg = document.querySelector('.display-img');
const gradientText = document.querySelector('.gradient-text');

const gradientName = document.querySelector('.gradient-text span');

const dropBox = document.querySelector('.drop-box');
const fileInput = document.querySelector('.file-input');
const uploadImage = document.querySelector('.upload-image');
const messageAction = document.querySelector('.message-action');
const removeImg = document.querySelector('.remove-img');
const changeImg = document.querySelector('.change-img');
const uploadHint = document.querySelector('.upload-hint');

// Input Elements
const fullNameInput = document.querySelector('input[type="name"]');
const emailInput = document.querySelector('input[type="email"]');
const githubInput = document.querySelector('input[type="text"]');

// Constants
const MAX_FILE_SIZE = 500 * 1024; // 500KB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

// File Upload Functions
function handleFile(file) {
  if (!validateFile(file)) return;

  const reader = new FileReader();
  reader.onload = e => {
    const img = uploadImage.querySelector('img');
    img.src = e.target.result;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';

    messageAction.style.display = 'none';
    document.querySelector('.img-action').classList.add('show');

    uploadFile(file);
  };
  reader.readAsDataURL(file);
}

function uploadFile(file) {
  const reader = new FileReader();
  reader.onload = function (e) {
    localStorage.setItem('avatar', e.target.result);
  };
  reader.readAsDataURL(file);
}

// Validation Functions
function validateFile(file) {
  if (!file) {
    uploadHint.textContent = 'Please upload an image';
    uploadHint.style.color = '#ff4444';
    return false;
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    uploadHint.textContent = 'Only JPG and PNG files are allowed';
    uploadHint.style.color = '#ff4444';
    return false;
  }

  if (file.size > MAX_FILE_SIZE) {
    uploadHint.textContent = 'File size must be less than 500KB';
    uploadHint.style.color = '#ff4444';
    return false;
  }

  uploadHint.textContent = 'Upload your photo (JPG or PNG, max size: 500KB).';
  uploadHint.style.color = '#d2d1d69c';
  return true;
}

function validateName(name) {
  const hint = document.querySelector('input[type="name"]').nextElementSibling;

  if (!name || name.trim().length < 2) {
    hint.textContent = 'Please enter a valid full name';
    hint.style.color = '#ff4444';
    hint.style.display = 'flex';
    return false;
  }
  hint.style.display = 'none';
  return true;
}

function validateEmail(email) {
  const hint = document.querySelector('input[type="email"]').nextElementSibling;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !emailRegex.test(email)) {
    hint.textContent = 'Please enter a valid email address';
    hint.style.color = '#ff4444';
    hint.style.display = 'flex';
    return false;
  }
  hint.style.display = 'none';
  return true;
}

function validateGithub(username) {
  const hint = document.querySelector('input[type="text"]').nextElementSibling;

  if (!username || username.trim().length < 2) {
    hint.textContent = 'Please enter a valid GitHub username';
    hint.style.color = '#ff4444';
    hint.style.display = 'flex';
    return false;
  }
  hint.style.display = 'none';
  return true;
}

// Form Submission
form.addEventListener('submit', e => {
  e.preventDefault();

  const name = fullNameInput.value.trim();
  const email = emailInput.value.trim();
  const github = githubInput.value.trim();
  const file = fileInput.files[0];

  // Validate all fields
  const isNameValid = validateName(name);
  const isEmailValid = validateEmail(email);
  const isGithubValid = validateGithub(github);
  const isFileValid = validateFile(file);

  // Show all errors if any field is invalid
  if (!isNameValid) validateName(name);
  if (!isEmailValid) validateEmail(email);
  if (!isGithubValid) validateGithub(github);
  if (!isFileValid) validateFile(file);

  // Only proceed if all fields are valid
  if (!isNameValid || !isEmailValid || !isGithubValid || !isFileValid) {
    return;
  }

  // Update display with animation
  gradientText.textContent = name;
  gradientText.classList.add('gradient-text');
  gradientText.style.opacity = 0;

  displayName.textContent = name;
  displayEmail.textContent = email;
  displayGithub.textContent = github;
  displayImg.src = uploadImage.querySelector('img').src;
  displayImg.style.display = 'block';

  // Show ticket and hide form with transition
  formContent.style.transition = 'opacity 0.3s ease';
  formContent.style.opacity = 0;
  setTimeout(() => {
    formContent.style.display = 'none';
    displayData.style.display = 'block';
    displayData.style.opacity = 0;
    setTimeout(() => {
      displayData.style.transition = 'opacity 0.3s ease';
      displayData.style.opacity = 1;
      gradientText.style.transition = 'opacity 0.3s ease';
      gradientText.style.opacity = 1;
    }, 50);
  }, 300);
});

// Page Load Handler
window.addEventListener('load', () => {
  const img = document.querySelector('.upload-image label img');
  if (img) {
    img.src = 'assets/images/icon-upload.svg';
    img.style.width = 'auto';
    img.style.height = 'auto';
    img.style.objectFit = 'contain';

    const savedAvatar = localStorage.getItem('avatar');
    if (savedAvatar) {
      img.src = savedAvatar;
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
      messageAction.style.display = 'none';
      document.querySelector('.img-action').classList.add('show');
    }
  }
});

// Drag and Drop Functionality
dropBox.addEventListener('dragover', e => {
  e.preventDefault();
  dropBox.classList.add('dragover');
});

dropBox.addEventListener('dragleave', () => {
  dropBox.classList.remove('dragover');
});

dropBox.addEventListener('drop', e => {
  e.preventDefault();
  dropBox.classList.remove('dragover');
  const file = e.dataTransfer.files[0];
  handleFile(file);
});

// Change Image Functionality
changeImg.addEventListener('click', () => {
  fileInput.click();
});

// Remove Image Functionality
removeImg.addEventListener('click', () => {
  const img = uploadImage.querySelector('img');
  img.src = 'assets/images/icon-upload.svg';
  img.style.width = 'auto';
  img.style.height = 'auto';
  img.style.objectFit = 'contain';

  messageAction.style.display = 'block';
  document.querySelector('.img-action').classList.remove('show');

  fileInput.value = '';
  localStorage.removeItem('avatar');
});

// File Input Change
fileInput.addEventListener('change', e => {
  const file = e.target.files[0];
  handleFile(file);
});
