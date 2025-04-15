# Canvas Geometry Sandbox

A simple interactive HTML5 Canvas + TypeScript application for creating, manipulating, and animating geometric shapes.

URL to the project: https://darshancode2005.github.io/geometry-sandbox/

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/DarshanCode2005/geometry-sandbox.git
   cd geometry-sandbox
   ```

2. Make sure you have TypeScript installed:
   ```bash
   npm install -g typescript
   ```

3. Compile the TypeScript file:
   ```bash
   tsc
   ```

4. Open `index.html` in your browser:
   ```bash
   # Using a simple server like http-server (optional)
   npx http-server
   # Or just open the file directly in your browser
   ```

## Features

- **Shape Creation**: Add circles, rectangles, and triangles to the canvas
- **Interactive Controls**:
  - Shape selection and drag-and-drop positioning
  - Rotation (left/right)
  - Scaling (up/down)
  - Reflection (X/Y axis)
  - Delete shapes
- **Style Customization**:
  - Fill color
  - Transparency (alpha)
  - Outline width and color
  - Size control
- **Physics Animation**:
  - Shapes move with velocity
  - Bounce off canvas edges
  - FPS counter

## How to Use

### Adding Shapes

1. Select a shape type (Circle, Rectangle, Triangle) from the dropdown
2. Choose a fill color, transparency level, size, and outline settings
3. Click anywhere on the canvas to add the shape

### Selecting and Manipulating Shapes

1. Click on any shape to select it (a dashed outline will appear)
2. Drag to reposition the selected shape
3. Use the transformation buttons to:
   - Rotate the shape left or right
   - Scale the shape up or down
   - Reflect the shape along X or Y axis
   - Delete the shape

### Customizing Selected Shapes

When a shape is selected, you can modify:
- Fill color
- Transparency
- Outline width and color
- Size

Changes will apply immediately to the selected shape.

### Animation

- Shapes automatically move around the canvas when not selected
- They bounce off the edges of the canvas
- Select a shape to pause its movement
- Release selection to resume animation

## Technical Details

- Built with TypeScript and HTML5 Canvas
- Object-oriented design with Shape interface and specialized implementations
- Utilizes requestAnimationFrame for smooth animation
- CSS styling for a modern, user-friendly interface

## License

MIT 