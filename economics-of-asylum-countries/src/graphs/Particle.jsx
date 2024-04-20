import * as React from "react";
import { ReactP5Wrapper } from "@p5-wrapper/react";
import { incoming_refugee_data, outgoing_refugee_data, population_data } from "../utils/data_parser";

function sketch(p) {
    let innerBoxParticles = [];
    let outerBoxParticles = [];

    // Particle class
    class Particle {
        constructor(isInnerBox = false, isIncomingRefugee = false) {
            this.isInnerBox = isInnerBox;
            this.isIncomingRefugee = isIncomingRefugee;
            this.x = isInnerBox
                ? p.random(200, 720)
                : p.random(0, p.width);
            this.y = isInnerBox
                ? p.random(100, 550)
                : p.random(0, p.height);
            this.r = 6;
            this.xSpeed = p.random(-2, 2);
            this.ySpeed = p.random(-1, 1.5);
            this.color = isIncomingRefugee ? 'purple' : 'rgba(16, 0, 141, 0.5)';
            if (!this.isInnerBox) {
                this.color = 'red';
            }
        }

        createParticle() {
            p.noStroke();
            p.fill(this.color);
            if (this.isIncomingRefugee) {
                p.square(this.x, this.y, this.r * 2); // Draw square for incoming refugees
            } else {
                p.circle(this.x, this.y, this.r * 2); // Draw circle for regular population
            }
        }

        moveParticle() {
            if (this.isInnerBox) {
                // If the particle is inside the inner box
                if (this.x < 200 || this.x > 720) {
                    this.xSpeed *= -1;
                }
                if (this.y < 100 || this.y > 550) {
                    this.ySpeed *= -1;
                }
            } else {
                // If the particle is outside the inner box
                if (this.x < 0 || this.x > p.width) {
                    this.xSpeed *= -1;
                }
                if (this.y < 0 || this.y > p.height) {
                    this.ySpeed *= -1;
                }
            }
            this.x += this.xSpeed;
            this.y += this.ySpeed;
        }
    }

    const populationFactor = 0.000001;
    const refugeeMultiplier = 100000;
    const incomingRefugeePercentage = 1;

    p.setup = () => {
        p.createCanvas(920, 650);
        var totalPopulation = population_data['840'][0];
        var scaledTotalPopulation = Math.floor(population_data['840'][19] * populationFactor);
        var scaledIncomingRefugees = Math.floor(incoming_refugee_data['2021']['840']);
        var scaledOutgoingRefugees = Math.floor(outgoing_refugee_data['2021']['840'].Count);
        var scaledTotalRefugees = scaledIncomingRefugees + scaledOutgoingRefugees;
        var normalizedRefugees = scaledTotalRefugees / totalPopulation;
        var scaledRefugeeParticles = Math.floor(normalizedRefugees * refugeeMultiplier);
        var incomingRefugeeParticles = Math.floor(scaledIncomingRefugees / scaledTotalRefugees * scaledRefugeeParticles * incomingRefugeePercentage);

        innerBoxParticles = Array(scaledTotalPopulation).fill().map(() => new Particle(true, false));
        incomingRefugeeParticles = Array(incomingRefugeeParticles).fill().map(() => new Particle(true, true));
        innerBoxParticles = [...innerBoxParticles, ...incomingRefugeeParticles];

        console.log(scaledRefugeeParticles);
        outerBoxParticles = Array(scaledRefugeeParticles).fill().map(() => new Particle(false, false));
    };

    p.draw = () => {
        p.background('yellow');

        // Draw inner box
        p.stroke(0);
        p.fill(255);
        p.rect(200, 100, 520, 450); // Bigger rectangle

        // Handle particles inside the inner box
        for (const particle of innerBoxParticles) {
            particle.createParticle();
            particle.moveParticle();
        }

        // Handle particles outside the inner box
        for (const particle of outerBoxParticles) {
            particle.createParticle();
            particle.moveParticle();
        }
    };
}

const Particle = () => {
    return <ReactP5Wrapper sketch={sketch} />;
};

export default Particle;