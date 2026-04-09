console.log("nya :3")

//copied from gravity tutorial
//https://www.javaspring.net/blog/how-to-create-a-gravity-effect-with-javascript/
class GravityElement {
  constructor(element) {
    this.element = element;
    this.isDragging = false;
    this.position = { x: 0, y: 0 };
    this.velocity = { x: 0, y: 0 };
    this.mouseOffset = { x: 0, y: 0 };
    this.mouseHistory = [];
    this.rotation = 0;
 
    // Initialize position from CSS
    this.position.x = parseFloat(element.style.left);
    this.position.y = parseFloat(element.style.top);
 
    this.addEventListeners();
  }
 
  addEventListeners() {
    this.element.addEventListener('mousedown', (e) => this.startDrag(e));
    document.addEventListener('mousemove', (e) => this.dragMove(e));
    document.addEventListener('mouseup', () => this.endDrag());
  }
 
  startDrag(e) {
    e.preventDefault();
    this.isDragging = true;
    this.element.style.cursor = 'grabbing';
    const rect = this.element.getBoundingClientRect();
    this.mouseOffset.x = e.clientX - rect.left;
    this.mouseOffset.y = e.clientY - rect.top;
    this.velocity = { x: 0, y: 0 };
    this.mouseHistory = [];
  }
 
  dragMove(e) {
    if (!this.isDragging) return;
    this.position.x = e.clientX - this.mouseOffset.x;
    this.position.y = e.clientY - this.mouseOffset.y;
    this.mouseHistory.push({ x: e.clientX, y: e.clientY });
    if (this.mouseHistory.length > 5) this.mouseHistory.shift();
    this.updateElementStyle();
  }
 
  endDrag() {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.element.style.cursor = 'grab';
    if (this.mouseHistory.length >= 2) {
      const first = this.mouseHistory[0];
      const last = this.mouseHistory[this.mouseHistory.length - 1];
      this.velocity.x = (last.x - first.x) / this.mouseHistory.length;
      this.velocity.y = (last.y - first.y) / this.mouseHistory.length;
    }
  }
 
  update() {
    if (!this.isDragging) {
      // Apply gravity
      const gravity = 0.5;
      this.velocity.y += gravity;
 
      // Update position
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
 
      // Collision detection
      const elementWidth = this.element.offsetWidth;
      const elementHeight = this.element.offsetHeight;
 
      // Bottom
      if (this.position.y + elementHeight > window.innerHeight) {
        this.position.y = window.innerHeight - elementHeight;
        this.velocity.y = -this.velocity.y * 0.8;
        this.velocity.x *= 0.95;
      }
 
      // Top
      if (this.position.y < 0) {
        this.position.y = 0;
        this.velocity.y = -this.velocity.y * 0.8;
      }
 
      // Right
      if (this.position.x + elementWidth > window.innerWidth) {
        this.position.x = window.innerWidth - elementWidth;
        this.velocity.x = -this.velocity.x * 0.8;
      }
 
      // Left
      if (this.position.x < 0) {
        this.position.x = 0;
        this.velocity.x = -this.velocity.x * 0.8;
      }
 
      // Rotation
      this.rotation += this.velocity.x * 0.5;
      this.rotation = ((this.rotation % 360) + 360) % 360;
    }
 
    this.updateElementStyle();
  }
 
  updateElementStyle() {
    this.element.style.left = `${this.position.x}px`;
    this.element.style.top = `${this.position.y}px`;
    this.element.style.transform = `rotate(${this.rotation}deg)`;
  }
}
 
// Initialize elements and start animation
document.addEventListener('DOMContentLoaded', () => {
  const elements = document.querySelectorAll('.gravity-element');
  const gravityElements = Array.from(elements).map(el => new GravityElement(el));
 
  /*function animate() {
    gravityElements.forEach(element => element.update());
    requestAnimationFrame(animate);
  }*/
 
  animate();
});