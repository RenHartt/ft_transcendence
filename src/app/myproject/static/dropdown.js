document.addEventListener('DOMContentLoaded', function () {
  window.toggleDropdown = function (trigger) {
    const dropdownContent = trigger.nextElementSibling;

    document.querySelectorAll('.dropdown-content.visible').forEach(openDropdown => {
      if (openDropdown !== dropdownContent) {
        openDropdown.classList.remove('visible');
      }
    });

    if (dropdownContent) {
      dropdownContent.classList.toggle('visible');
    }
  };

  document.addEventListener('click', function (event) {
    const isInsideDropdown = event.target.closest('.dropdown');

    if (!isInsideDropdown) {
      document.querySelectorAll('.dropdown-content.visible').forEach(openDropdown => {
        openDropdown.classList.remove('visible');
      });
    } else {
      if (event.target.matches('.dropdown-content a')) {
        document.querySelectorAll('.dropdown-content.visible').forEach(openDropdown => {
          openDropdown.classList.remove('visible');
        });
      }
    }
  });
});

