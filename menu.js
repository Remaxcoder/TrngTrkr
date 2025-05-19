// Menu functionality
class Menu {
  constructor() {
    this.menuIcon = document.getElementById('menuIcon');
    this.sideMenu = document.getElementById('sideMenu');
    this.overlay = document.getElementById('overlay');
    this.isOpen = false;
    
    this.init();
  }
  
  init() {
    if (!this.menuIcon || !this.sideMenu || !this.overlay) {
      console.error('Menu elements not found');
      return;
    }
    
    // Add click event listeners
    this.menuIcon.addEventListener('click', () => this.toggle());
    this.overlay.addEventListener('click', () => this.close());
    
    // Highlight active menu item
    this.highlightActiveItem();
  }
  
  toggle() {
    this.isOpen ? this.close() : this.open();
  }
  
  open() {
    this.isOpen = true;
    this.menuIcon.classList.add('active');
    this.sideMenu.classList.add('active');
    this.overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  close() {
    this.isOpen = false;
    this.menuIcon.classList.remove('active');
    this.sideMenu.classList.remove('active');
    this.overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  highlightActiveItem() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const menuItems = this.sideMenu.querySelectorAll('.menu-nav li');
    
    menuItems.forEach(item => {
      const link = item.querySelector('a');
      const linkPage = link.getAttribute('onclick').match(/'([^']+)'/)[1];
      
      if (linkPage === currentPage) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }
}

// Initialize menu when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new Menu();
}); 