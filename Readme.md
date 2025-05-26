# Asset Chart Visualizer

A simple web application to visualize simulated asset value changes over time using an HTML canvas chart. Users can adjust various chart parameters, such as line color, line width, shadow effects, and dot fill patterns, to observe different visual behaviors of the chart. The application dynamically updates as these parameters are modified.

## Tech Stack

*   **Vue 3**: Leveraging the Composition API with TSX for building the user interface.
*   **Pinia**: For state management, particularly for chart data and configuration.
*   **Vite**: As the build tool and development server.
*   **TypeScript**: For type safety and improved developer experience.
*   **HTML Canvas API**: For rendering the dynamic chart.

## Project Setup and Running Instructions

1.  **Prerequisites**:
    *   Node.js (which includes npm/npx)
    *   `pnpm` (If you don't have pnpm, you can install it via npm: `npm install -g pnpm`)

2.  **Navigate to the project directory**:
    ```bash
    cd asset-chat
    ```

3.  **Install Dependencies**:
    Use `pnpm` to install the project dependencies as defined in `package.json` and `pnpm-lock.yaml`.
    ```bash
    pnpm install
    ```

4.  **Run the Development Server**:
    This command will start the Vite development server.
    ```bash
    pnpm dev
    ```

5.  **Access the Application**:
    Once the development server is running, you can access the application in your web browser at the following URL (this is the default Vite development server URL):
    [http://localhost:5173](http://localhost:5173)

The chart should be visible, and you can use the control panel to adjust its appearance and behavior.
