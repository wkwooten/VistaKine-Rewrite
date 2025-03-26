# VistaKine - Interactive 3D Engineering Textbook

## Project Overview

VistaKine is an interactive 3D engineering textbook designed to teach kinematic and dynamic concepts through engaging visualizations and physics simulations. Built with SvelteKit and Threlte, it leverages the power of Three.js and Rapier physics to create an immersive learning experience.

This project aims to overcome challenges faced in previous iterations, such as complex state management and scroll synchronization issues, by utilizing Svelte's reactivity and a component-based architecture.

## Key Features

*   **Interactive 3D Visualizations:** Uses Threlte (a Svelte renderer for Three.js) to create dynamic and interactive 3D scenes.
*   **Physics Simulations:** Integrates Rapier physics for realistic simulations of engineering concepts.
*   **Component-Based Architecture:** Built with SvelteKit for a modular and maintainable codebase.
*   **Fluid Design System:** Employs SCSS with the Utopia package for fluid typography and spacing, ensuring intrinsic responsiveness.
*   **Chapter-Based Structure:** Content is organized into distinct chapters, each managed as a separate route for better performance and organization.
*   **Engaging Content:** Aims to incorporate narrative elements (characters, comics) alongside technical explanations.

## Tech Stack

*   **Framework:** SvelteKit
*   **3D Rendering:** Threlte / Three.js
*   **Physics Engine:** @threlte/rapier / Rapier
*   **Styling:** SCSS, Utopia (for fluid typography and spacing)
*   **State Management:** Svelte Stores

## Project Status

The project has completed its Minimum Viable Product (MVP) phase, establishing the core structure, basic styling, Threlte integration, and initial chapter layout.

Currently in **Phase 2: Expanding the MVP**, focusing on:
*   Enhancing Chapter 1 with full content and real physics simulations.
*   Improving intra-chapter navigation and scroll handling.
*   Refining UI components and overall styling (including dark mode).
*   Developing additional chapters.
*   Performance testing and optimization.

*(Refer to `Memory.md` for a detailed breakdown of phases and tasks.)*

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd VistaKine
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or pnpm install or yarn install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev -- --open
    # or pnpm dev -- --open or yarn dev -- --open
    ```

This will start the development server, typically available at `http://localhost:5173`.

## Project Structure (Simplified)
