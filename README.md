<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1fWlt0QaPgvttuEf4ynTioAMduhSfTZbV

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
# 🧮 Scientific Calculator

[![Repository](https://img.shields.io/badge/repo-JASWANTHguruguntla%2FScientific--Calculator-blue)](https://github.com/JASWANTHguruguntla/Scientific-Calculator) [![License](https://img.shields.io/badge/license-MIT-green.svg)](#license) [![Issues](https://img.shields.io/github/issues/JASWANTHguruguntla/Scientific-Calculator)](https://github.com/JASWANTHguruguntla/Scientific-Calculator/issues)

A modern, accurate, and extensible scientific calculator implementation with a clean user interface and robust computation engine. Designed for clarity, reliability, and easy extension to add functions or a new UI front-end.

🗂️ Table of Contents
- Overview
- Features
- Demo / Screenshots
- Installation
- Quick Start
- Usage Examples
- Development & Testing
- Contributing
- Roadmap
- License
- Author & Contact
- Acknowledgements
- Notes / Next Steps

📘 Overview
--------
Scientific Calculator is a project that provides precise mathematical operations commonly used in engineering, physics, and mathematics. It focuses on:
- High-precision arithmetic
- Common transcendental functions (sin, cos, tan, exp, log, etc.)
- Expression parsing and evaluation
- Extensible plugin-friendly architecture to add new functions or backends (CLI, GUI, Web)

✨ Features
--------
- Basic arithmetic (+, -, ×, ÷)
- Trigonometric, inverse trigonometric, hyperbolic functions
- Exponentials, logarithms, and roots
- Factorial, combinations, permutations
- Support for parentheses and operator precedence
- Configurable precision (where supported)
- Clean, modular codebase for easy extension and testing

🖼️ Demo / Screenshots
------------------
Replace the placeholders below with images or GIFs from your project:

![Calculator UI - Placeholder](docs/images/ui-screenshot-1.png)
![Calculator Demo - Placeholder](docs/images/ui-screenshot-2.gif)

💾 Installation
------------
Choose the instructions that match the implementation in this repository.

For Node.js / JavaScript projects:
```bash
# Clone the repository
git clone https://github.com/JASWANTHguruguntla/Scientific-Calculator.git
cd Scientific-Calculator

# Install dependencies
npm install

# Start (if a web/desktop UI)
npm start
```

For Python projects:
```bash
# Clone the repository
git clone https://github.com/JASWANTHguruguntla/Scientific-Calculator.git
cd Scientific-Calculator

# (Optional) create virtual environment
python -m venv venv
source venv/bin/activate  # macOS / Linux
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Run
python main.py
```

⚡ Quick Start
-----------
- Clone the repo
- Follow the relevant install instructions above
- Open the app or invoke the CLI (see Usage Examples)

🧩 Usage Examples
--------------
Run expressions from a REPL or CLI (example syntax — adjust to your project's CLI):

```bash
# Example CLI usage
./calculator "sin(pi/2) +
