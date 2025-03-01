# File Manager
This project is a cross-platform file manager application built using Tauri, React, and TypeScript. It leverages Vite for the build process and Tailwind CSS for styling. The application aims to provide a seamless and efficient user experience for managing files across different operating systems.

## Features
- **Cross Platform Support** - Runs on Windows, macOS, and Linux, ensuring a consistent experience across platforms.
- **Modern UI**: Utilizes React and Tailwind CSS to deliver a responsive and intuitive user interface.
- **Performance Optimizations**: Built with Vite and Tauri, offering fast load times and low resource consumption.

## Getting Started
Follow these instructions to set up and run the project locally.

### Prerequisites
- **Node.js**: Ensure you have Node.js installed. You can download it from [***nodejs.org***](https://nodejs.org/).
- **Rust & Cargo**: Tauri requires the Rust programming language and its package manager, Cargo. Install them from [***rust-lang.org***](https://www.rust-lang.org/tools/install).

### Installation
1. Clone the repository:
```bash
git clone https://github.com/yourusername/file-manager.git
cd file-manager
```
2. Install dependencies:
```bash
make install
```
3. Build the Tauri Application:
```bash
make build
```

### Running in Development mode
To start the application in development mode on windows with hot-reloading:
```bash
make run-windows
```

## Project Structure
- **``src/``**: Contains the React components and application logic.
- **``src-tauri/``**: Holds Tauri-specific configuration and Rust source code.
- **``public/``**: Static assets and the main HTML file.
-  **``src-tauri/src/commands/``** - Holds the Rust code for Tauri commands.
- **``src-tauri/src/utils/``** - Holds the configs for prometheus metrics and DB metrics.

## Contributing
Contributions are welcome! If you have suggestions for improvements or new features, please open an issue or submit a pull request.