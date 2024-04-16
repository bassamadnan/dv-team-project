import * as React from "react";
import { ReactP5Wrapper } from "@p5-wrapper/react";

// Define the sketch function with the provided particle system code
function sketch(p) {
    let particles = [];
    
    // Particle class
    class Particle {
        constructor() {
            this.x = p.random(0, p.width);
            this.y = p.random(0, p.height);
            this.r = p.random(1, 8);
            this.xSpeed = p.random(-2, 2);
            this.ySpeed = p.random(-1, 1.5);
        }

        createParticle() {
            p.noStroke();
            p.fill('rgba(29, 0, 249, 0.5)');
            p.circle(this.x, this.y, this.r * 2); // Drawing the particle as a circle with diameter equal to 2 * radius
        }

        moveParticle() {
            if (this.x < 0 || this.x > p.width) {
                this.xSpeed *= -1;
            }
            if (this.y < 0 || this.y > p.height) {
                this.ySpeed *= -1;
            }
            this.x += this.xSpeed;
            this.y += this.ySpeed;
        }

        checkCollision(other) {
            // Calculate the distance between two particles
            const distanceX = other.x - this.x;
            const distanceY = other.y - this.y;
            const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

            // Check if the distance is less than the sum of the radii (collision)
            if (distance < this.r + other.r) {
                // Calculate normal vector and unit normal vector
                const normalX = distanceX / distance;
                const normalY = distanceY / distance;

                // Calculate relative velocity
                const relativeVelocityX = other.xSpeed - this.xSpeed;
                const relativeVelocityY = other.ySpeed - this.ySpeed;

                // Calculate dot product of relative velocity and normal vector
                const dotProduct = relativeVelocityX * normalX + relativeVelocityY * normalY;

                // If the dot product is less than 0, the particles are moving towards each other
                if (dotProduct < 0) {
                    // Calculate the impulse scalar
                    const impulse = dotProduct / 2;

                    // Update the velocities of both particles
                    this.xSpeed += impulse * normalX;
                    this.ySpeed += impulse * normalY;
                    other.xSpeed -= impulse * normalX;
                    other.ySpeed -= impulse * normalY;

                    // Move the particles apart to avoid overlap
                    const overlap = this.r + other.r - distance;
                    const correctionX = overlap * normalX / 2;
                    const correctionY = overlap * normalY / 2;
                    this.x -= correctionX;
                    this.y -= correctionY;
                    other.x += correctionX;
                    other.y += correctionY;
                }
            }
        }
    }

    // Setup function
    p.setup = () => {
        p.createCanvas(720, 400);
        for (let i = 0; i < p.width / 10; i++) {
            particles.push(new Particle());
        }
    };

    // Draw function
    p.draw = () => {
        p.background('yellow');
        for (let i = 0; i < particles.length; i++) {
            const particle = particles[i];
            particle.createParticle();
            particle.moveParticle();
            
            // Check for collisions with other particles
            for (let j = i + 1; j < particles.length; j++) {
                particle.checkCollision(particles[j]);
            }
        }
    };
}

// Define the functional component
const Particle = () => {
    return <ReactP5Wrapper sketch={sketch} />;
};

// Export the functional component
export default Particle;
