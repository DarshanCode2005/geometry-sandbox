// Define the Shape interface
interface Shape {
    x: number;
    y: number;
    size: number;
    color: string;
    alpha: number;
    outlineWidth: number;
    outlineColor: string;
    rotation?: number;
    scaleX?: number;
    scaleY?: number;
    vx: number;
    vy: number;
    draw(ctx: CanvasRenderingContext2D): void;
    containsPoint(x: number, y: number): boolean;
    rotate(angle: number): void;
    scale(factor: number): void;
    reflect(axis: 'x' | 'y'): void;
    update(canvasWidth: number, canvasHeight: number): void;
}

// Circle implementation
class Circle implements Shape {
    public rotation: number = 0;
    public scaleX: number = 1;
    public scaleY: number = 1;
    public vx: number = Math.random() * 4 - 2; // Random velocity between -2 and 2
    public vy: number = Math.random() * 4 - 2;

    constructor(
        public x: number,
        public y: number,
        public size: number,
        public color: string,
        public alpha: number = 1,
        public outlineWidth: number = 0,
        public outlineColor: string = '#000000'
    ) {}

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        
        // Apply transformations
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.scale(this.scaleX, this.scaleY);
        
        // Draw circle
        ctx.beginPath();
        ctx.fillStyle = this.getRGBAColor();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw outline if width > 0
        if (this.outlineWidth > 0) {
            ctx.strokeStyle = this.outlineColor;
            ctx.lineWidth = this.outlineWidth;
            ctx.stroke();
        }
        
        // Draw selection indicator if needed
        if (this.isSelected) {
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]); // Dashed line for selection
            ctx.stroke();
            ctx.setLineDash([]); // Reset dash pattern
        }
        
        ctx.restore();
    }

    // Helper method to convert color to rgba format with alpha
    private getRGBAColor(): string {
        // Parse hex color to rgb
        const r = parseInt(this.color.slice(1, 3), 16);
        const g = parseInt(this.color.slice(3, 5), 16);
        const b = parseInt(this.color.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${this.alpha})`;
    }

    containsPoint(x: number, y: number): boolean {
        // Calculate distance from point to center
        const distance = Math.sqrt(
            Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2)
        );
        // Point is inside if distance is less than radius (size)
        return distance <= this.size;
    }
    
    // Selection status
    private _isSelected: boolean = false;
    
    get isSelected(): boolean {
        return this._isSelected;
    }
    
    set isSelected(value: boolean) {
        this._isSelected = value;
    }

    // Transformation methods
    rotate(angle: number): void {
        this.rotation += angle;
    }

    scale(factor: number): void {
        this.size *= factor;
    }

    reflect(axis: 'x' | 'y'): void {
        if (axis === 'x') {
            this.scaleX *= -1;
        } else {
            this.scaleY *= -1;
        }
    }

    // Physics update
    update(canvasWidth: number, canvasHeight: number): void {
        // Move the shape according to its velocity
        this.x += this.vx;
        this.y += this.vy;
        
        // Bounce off the edges
        if (this.x - this.size < 0) {
            this.x = this.size;
            this.vx = Math.abs(this.vx);
        } else if (this.x + this.size > canvasWidth) {
            this.x = canvasWidth - this.size;
            this.vx = -Math.abs(this.vx);
        }
        
        if (this.y - this.size < 0) {
            this.y = this.size;
            this.vy = Math.abs(this.vy);
        } else if (this.y + this.size > canvasHeight) {
            this.y = canvasHeight - this.size;
            this.vy = -Math.abs(this.vy);
        }
    }
}

// Rectangle implementation
class Rectangle implements Shape {
    public rotation: number = 0;
    public scaleX: number = 1;
    public scaleY: number = 1;
    public vx: number = Math.random() * 4 - 2; // Random velocity between -2 and 2
    public vy: number = Math.random() * 4 - 2;
    
    constructor(
        public x: number,
        public y: number,
        public size: number,
        public color: string,
        public alpha: number = 1,
        public outlineWidth: number = 0,
        public outlineColor: string = '#000000',
        public width?: number,
        public height?: number
    ) {
        // If width/height not provided, use size
        this.width = width || size * 2;
        this.height = height || size;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        
        // Apply transformations
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.scale(this.scaleX, this.scaleY);
        
        // Draw rectangle
        ctx.fillStyle = this.getRGBAColor();
        ctx.fillRect(
            -this.width! / 2,
            -this.height! / 2,
            this.width!,
            this.height!
        );
        
        // Draw outline if width > 0
        if (this.outlineWidth > 0) {
            ctx.strokeStyle = this.outlineColor;
            ctx.lineWidth = this.outlineWidth;
            ctx.strokeRect(
                -this.width! / 2,
                -this.height! / 2,
                this.width!,
                this.height!
            );
        }
        
        // Draw selection indicator if needed
        if (this.isSelected) {
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]); // Dashed line for selection
            ctx.strokeRect(
                -this.width! / 2,
                -this.height! / 2,
                this.width!,
                this.height!
            );
            ctx.setLineDash([]); // Reset dash pattern
        }
        
        ctx.restore();
    }

    // Helper method to convert color to rgba format with alpha
    private getRGBAColor(): string {
        // Parse hex color to rgb
        const r = parseInt(this.color.slice(1, 3), 16);
        const g = parseInt(this.color.slice(3, 5), 16);
        const b = parseInt(this.color.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${this.alpha})`;
    }

    containsPoint(x: number, y: number): boolean {
        // For simplicity, we'll check if the point is in the untransformed rectangle
        // A more accurate implementation would account for rotation
        return (
            x >= this.x - this.width! / 2 * this.scaleX &&
            x <= this.x + this.width! / 2 * this.scaleX &&
            y >= this.y - this.height! / 2 * this.scaleY &&
            y <= this.y + this.height! / 2 * this.scaleY
        );
    }
    
    // Selection status
    private _isSelected: boolean = false;
    
    get isSelected(): boolean {
        return this._isSelected;
    }
    
    set isSelected(value: boolean) {
        this._isSelected = value;
    }

    // Transformation methods
    rotate(angle: number): void {
        this.rotation += angle;
    }

    scale(factor: number): void {
        this.size *= factor;
        this.width = this.width! * factor;
        this.height = this.height! * factor;
    }

    reflect(axis: 'x' | 'y'): void {
        if (axis === 'x') {
            this.scaleX *= -1;
        } else {
            this.scaleY *= -1;
        }
    }

    // Physics update
    update(canvasWidth: number, canvasHeight: number): void {
        // Move the shape according to its velocity
        this.x += this.vx;
        this.y += this.vy;
        
        // Get effective half-width and half-height considering scale
        const halfWidth = (this.width! / 2) * Math.abs(this.scaleX);
        const halfHeight = (this.height! / 2) * Math.abs(this.scaleY);
        
        // Bounce off the edges
        if (this.x - halfWidth < 0) {
            this.x = halfWidth;
            this.vx = Math.abs(this.vx);
        } else if (this.x + halfWidth > canvasWidth) {
            this.x = canvasWidth - halfWidth;
            this.vx = -Math.abs(this.vx);
        }
        
        if (this.y - halfHeight < 0) {
            this.y = halfHeight;
            this.vy = Math.abs(this.vy);
        } else if (this.y + halfHeight > canvasHeight) {
            this.y = canvasHeight - halfHeight;
            this.vy = -Math.abs(this.vy);
        }
    }
}

// Triangle implementation
class Triangle implements Shape {
    private x1: number = 0;
    private y1: number = 0;
    private x2: number = 0;
    private y2: number = 0;
    private x3: number = 0;
    private y3: number = 0;
    public rotation: number = 0;
    public scaleX: number = 1;
    public scaleY: number = 1;
    public vx: number = Math.random() * 4 - 2; // Random velocity between -2 and 2
    public vy: number = Math.random() * 4 - 2;

    constructor(
        public x: number,
        public y: number,
        public size: number,
        public color: string,
        public alpha: number = 1,
        public outlineWidth: number = 0,
        public outlineColor: string = '#000000'
    ) {
        this.updateVertices();
    }
    
    private updateVertices(): void {
        // Create an equilateral triangle centered at (x,y)
        const height = this.size * Math.sqrt(3);
        this.x1 = 0;
        this.y1 = -2/3 * height;
        this.x2 = -this.size;
        this.y2 = 1/3 * height;
        this.x3 = this.size;
        this.y3 = 1/3 * height;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        
        // Apply transformations
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.scale(this.scaleX, this.scaleY);
        
        // Draw triangle
        ctx.beginPath();
        ctx.fillStyle = this.getRGBAColor();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.lineTo(this.x3, this.y3);
        ctx.closePath();
        ctx.fill();
        
        // Draw outline if width > 0
        if (this.outlineWidth > 0) {
            ctx.strokeStyle = this.outlineColor;
            ctx.lineWidth = this.outlineWidth;
            ctx.stroke();
        }
        
        // Draw selection indicator if needed
        if (this.isSelected) {
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]); // Dashed line for selection
            ctx.stroke();
            ctx.setLineDash([]); // Reset dash pattern
        }
        
        ctx.restore();
    }

    // Helper method to convert color to rgba format with alpha
    private getRGBAColor(): string {
        // Parse hex color to rgb
        const r = parseInt(this.color.slice(1, 3), 16);
        const g = parseInt(this.color.slice(3, 5), 16);
        const b = parseInt(this.color.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${this.alpha})`;
    }

    containsPoint(x: number, y: number): boolean {
        // This is a simplified check that doesn't account for transformations
        // For accurate results, we would need to apply inverse transformations
        
        // Create temporary points with the transform applied
        const dx = x - this.x;
        const dy = y - this.y;
        
        // Simple distance check as an approximation
        return Math.sqrt(dx*dx + dy*dy) <= this.size * 1.5;
    }
    
    // Selection status
    private _isSelected: boolean = false;
    
    get isSelected(): boolean {
        return this._isSelected;
    }
    
    set isSelected(value: boolean) {
        this._isSelected = value;
    }
    
    private sign(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): number {
        return (x1 - x3) * (y2 - y3) - (x2 - x3) * (y1 - y3);
    }

    // Transformation methods
    rotate(angle: number): void {
        this.rotation += angle;
    }

    scale(factor: number): void {
        this.size *= factor;
        this.updateVertices();
    }

    reflect(axis: 'x' | 'y'): void {
        if (axis === 'x') {
            this.scaleX *= -1;
        } else {
            this.scaleY *= -1;
        }
    }

    // Physics update
    update(canvasWidth: number, canvasHeight: number): void {
        // Move the shape according to its velocity
        this.x += this.vx;
        this.y += this.vy;
        
        // Get a bounding radius for simplified collision
        const boundingRadius = this.size * 1.5;
        
        // Bounce off the edges
        if (this.x - boundingRadius < 0) {
            this.x = boundingRadius;
            this.vx = Math.abs(this.vx);
        } else if (this.x + boundingRadius > canvasWidth) {
            this.x = canvasWidth - boundingRadius;
            this.vx = -Math.abs(this.vx);
        }
        
        if (this.y - boundingRadius < 0) {
            this.y = boundingRadius;
            this.vy = Math.abs(this.vy);
        } else if (this.y + boundingRadius > canvasHeight) {
            this.y = canvasHeight - boundingRadius;
            this.vy = -Math.abs(this.vy);
        }
    }
}

window.addEventListener('load', () => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    
    // Get UI elements
    const shapeTypeSelect = document.getElementById('shapeType') as HTMLSelectElement;
    const shapeColorInput = document.getElementById('shapeColor') as HTMLInputElement;
    const shapeSizeInput = document.getElementById('shapeSize') as HTMLInputElement;
    const shapeAlphaInput = document.getElementById('shapeAlpha') as HTMLInputElement;
    const alphaValueDisplay = document.getElementById('alphaValue') as HTMLSpanElement;
    const outlineWidthInput = document.getElementById('outlineWidth') as HTMLInputElement;
    const outlineWidthValueDisplay = document.getElementById('outlineWidthValue') as HTMLSpanElement;
    const outlineColorInput = document.getElementById('outlineColor') as HTMLInputElement;
    const selectionStatus = document.querySelector('.selection-status') as HTMLParagraphElement;
    
    // Get transformation buttons
    const btnRotateLeft = document.getElementById('rotateLeft') as HTMLButtonElement;
    const btnRotateRight = document.getElementById('rotateRight') as HTMLButtonElement;
    const btnScaleUp = document.getElementById('scaleUp') as HTMLButtonElement;
    const btnScaleDown = document.getElementById('scaleDown') as HTMLButtonElement;
    const btnReflectX = document.getElementById('reflectX') as HTMLButtonElement;
    const btnReflectY = document.getElementById('reflectY') as HTMLButtonElement;
    const btnDelete = document.getElementById('deleteShape') as HTMLButtonElement;
    
    // Array to store all shapes
    const shapes: (Circle | Rectangle | Triangle)[] = [];
    
    // Currently selected shape
    let selectedShape: (Circle | Rectangle | Triangle) | null = null;
    
    // Dragging state
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    
    // Animation flag
    let animationRunning = true;
    let animationId: number;
    
    if (!ctx) {
        console.error('Could not get 2D context');
        return;
    }
    
    // Update UI displays for sliders
    shapeAlphaInput.addEventListener('input', () => {
        const value = shapeAlphaInput.value;
        alphaValueDisplay.textContent = `${value}%`;
        
        // Update selected shape if one exists
        if (selectedShape) {
            selectedShape.alpha = parseInt(value) / 100;
        }
    });
    
    outlineWidthInput.addEventListener('input', () => {
        const value = outlineWidthInput.value;
        outlineWidthValueDisplay.textContent = `${value}px`;
        
        // Update selected shape if one exists
        if (selectedShape) {
            selectedShape.outlineWidth = parseInt(value);
        }
    });
    
    outlineColorInput.addEventListener('input', () => {
        // Update selected shape if one exists
        if (selectedShape) {
            selectedShape.outlineColor = outlineColorInput.value;
        }
    });
    
    // Update shape controls to match selected shape
    function updateControlsFromShape(shape: Shape) {
        shapeColorInput.value = shape.color;
        shapeSizeInput.value = shape.size.toString();
        shapeAlphaInput.value = Math.round(shape.alpha * 100).toString();
        alphaValueDisplay.textContent = `${Math.round(shape.alpha * 100)}%`;
        outlineWidthInput.value = shape.outlineWidth.toString();
        outlineWidthValueDisplay.textContent = `${shape.outlineWidth}px`;
        outlineColorInput.value = shape.outlineColor;
    }
    
    // Function to update the UI based on selection state
    function updateSelectionUI() {
        const buttons = [
            btnRotateLeft, btnRotateRight, btnScaleUp, 
            btnScaleDown, btnReflectX, btnReflectY, btnDelete
        ];
        
        if (selectedShape) {
            buttons.forEach(btn => btn.disabled = false);
            selectionStatus.textContent = `Selected: ${getShapeType(selectedShape)} at (${Math.round(selectedShape.x)}, ${Math.round(selectedShape.y)})`;
            updateControlsFromShape(selectedShape);
        } else {
            buttons.forEach(btn => btn.disabled = true);
            selectionStatus.textContent = 'No shape selected';
        }
    }
    
    // Helper function to get the type of a shape as string
    function getShapeType(shape: Shape): string {
        if (shape instanceof Circle) return 'Circle';
        if (shape instanceof Rectangle) return 'Rectangle';
        if (shape instanceof Triangle) return 'Triangle';
        return 'Shape';
    }
    
    // Function to clear canvas and redraw all shapes
    function render() {
        // Clear canvas
        ctx!.fillStyle = '#f0f0f0';
        ctx!.fillRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw each shape
        shapes.forEach(shape => {
            // Update physics if not selected or being dragged (keep those shapes static)
            if (!shape.isSelected && !isDragging) {
                shape.update(canvas.width, canvas.height);
            }
            shape.draw(ctx!);
        });
        
        // Add title text
        ctx!.font = '24px Arial';
        ctx!.fillStyle = '#333';
        ctx!.textAlign = 'center';
        ctx!.fillText('TypeScript Canvas Demo', canvas.width / 2, 50);
        
        // Display FPS counter
        const fps = Math.round(1000 / (Date.now() - lastFrameTime));
        lastFrameTime = Date.now();
        ctx!.font = '14px Arial';
        ctx!.textAlign = 'left';
        ctx!.fillText(`FPS: ${fps}`, 10, 20);
    }
    
    // Track frame time for FPS counter
    let lastFrameTime = Date.now();
    
    // Animation loop function
    function animate() {
        if (animationRunning) {
            render();
            animationId = requestAnimationFrame(animate);
        }
    }
    
    // Start the animation loop
    function startAnimation() {
        if (!animationRunning) {
            animationRunning = true;
            animate();
        }
    }
    
    // Stop the animation loop
    function stopAnimation() {
        if (animationRunning) {
            animationRunning = false;
            cancelAnimationFrame(animationId);
        }
    }
    
    // Function to create a shape based on the selected type
    function createShape(x: number, y: number): Circle | Rectangle | Triangle {
        const shapeType = shapeTypeSelect.value;
        const color = shapeColorInput.value;
        const size = parseInt(shapeSizeInput.value);
        const alpha = parseInt(shapeAlphaInput.value) / 100;
        const outlineWidth = parseInt(outlineWidthInput.value);
        const outlineColor = outlineColorInput.value;
        
        switch (shapeType) {
            case 'circle':
                return new Circle(x, y, size, color, alpha, outlineWidth, outlineColor);
            case 'rectangle':
                return new Rectangle(x, y, size, color, alpha, outlineWidth, outlineColor);
            case 'triangle':
                return new Triangle(x, y, size, color, alpha, outlineWidth, outlineColor);
            default:
                return new Circle(x, y, size, color, alpha, outlineWidth, outlineColor);
        }
    }
    
    // Function to select a shape at the given coordinates
    function selectShapeAt(x: number, y: number) {
        // Deselect currently selected shape
        if (selectedShape) {
            selectedShape.isSelected = false;
        }
        
        // Find a shape containing the point (search in reverse to get top-most shape)
        selectedShape = null;
        for (let i = shapes.length - 1; i >= 0; i--) {
            if (shapes[i].containsPoint(x, y)) {
                selectedShape = shapes[i];
                selectedShape.isSelected = true;
                break;
            }
        }
        
        // Update UI
        updateSelectionUI();
    }
    
    // Function to get mouse position relative to canvas
    function getMousePos(event: MouseEvent) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }
    
    // Handle canvas mousedown for starting drag
    canvas.addEventListener('mousedown', (event) => {
        const { x, y } = getMousePos(event);
        
        // Check if clicked on an existing shape
        let clickedOnShape = false;
        for (let i = shapes.length - 1; i >= 0; i--) {
            if (shapes[i].containsPoint(x, y)) {
                clickedOnShape = true;
                
                // Select the shape
                selectShapeAt(x, y);
                
                // Start dragging if we have a selected shape
                if (selectedShape) {
                    isDragging = true;
                    dragStartX = x;
                    dragStartY = y;
                    dragOffsetX = x - selectedShape.x;
                    dragOffsetY = y - selectedShape.y;
                    
                    // Change cursor
                    canvas.style.cursor = 'grabbing';
                }
                
                break;
            }
        }
        
        // If didn't click on a shape, add a new one
        if (!clickedOnShape) {
            // Deselect current shape
            if (selectedShape) {
                selectedShape.isSelected = false;
                selectedShape = null;
            }
            
            // Create and add a new shape
            const shape = createShape(x, y);
            shapes.push(shape);
            
            // Update UI
            updateSelectionUI();
            
            console.log(`Added ${shapeTypeSelect.value} at (${x}, ${y})`);
        }
    });
    
    // Handle mouse move for dragging
    canvas.addEventListener('mousemove', (event) => {
        if (isDragging && selectedShape) {
            const { x, y } = getMousePos(event);
            
            // Update shape position
            selectedShape.x = x - dragOffsetX;
            selectedShape.y = y - dragOffsetY;
            
            // Update selection UI to show new position
            updateSelectionUI();
        }
    });
    
    // Handle mouse up to end dragging
    canvas.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            canvas.style.cursor = 'crosshair';
        }
    });
    
    // Handle mouse leaving canvas
    canvas.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;
            canvas.style.cursor = 'crosshair';
        }
    });
    
    // Rotation handlers
    btnRotateLeft.addEventListener('click', () => {
        if (selectedShape) {
            selectedShape.rotate(-15);
        }
    });
    
    btnRotateRight.addEventListener('click', () => {
        if (selectedShape) {
            selectedShape.rotate(15);
        }
    });
    
    // Scale handlers
    btnScaleUp.addEventListener('click', () => {
        if (selectedShape) {
            selectedShape.scale(1.2);
        }
    });
    
    btnScaleDown.addEventListener('click', () => {
        if (selectedShape) {
            selectedShape.scale(0.8);
        }
    });
    
    // Reflect handlers
    btnReflectX.addEventListener('click', () => {
        if (selectedShape) {
            selectedShape.reflect('x');
        }
    });
    
    btnReflectY.addEventListener('click', () => {
        if (selectedShape) {
            selectedShape.reflect('y');
        }
    });
    
    // Delete handler
    btnDelete.addEventListener('click', () => {
        if (selectedShape) {
            const index = shapes.indexOf(selectedShape);
            if (index > -1) {
                shapes.splice(index, 1);
                selectedShape = null;
                updateSelectionUI();
            }
        }
    });
    
    // Initial setup
    updateSelectionUI();
    
    // Start the animation loop
    animate();
}); 