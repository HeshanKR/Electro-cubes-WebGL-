# Electric Cube Cosmos 🌌

A mesmerizing 3D web application featuring a massive glowing electric cube at the center of a cosmic scene, surrounded by three orbiting streams of smaller electric cubes in blue and purple hues. The scene creates a stunning visual effect of energy particles flowing through space, with realistic starfields and cinematic camera movements.

![Electric Cube Cosmos Preview](preview.png)

## ✨ Features

- **Massive Central Cube**: A 45x45x45 unit glowing electric cube at the scene center
- **Triple Orbital Streams**: Three layers of orbiting cubes (blue middle, purple above/below)
- **Realistic Starfield**: 15,000+ dynamically distributed stars filling all of space
- **Cinematic Camera**: Orbital movement with user controls for exploration
- **Post-Processing Effects**: Bloom lighting and SMAA anti-aliasing for cinematic quality
- **Performance Optimized**: Instanced mesh rendering for 260+ cubes at 60fps

## 🚀 Live Demo

[View Live Demo](https://your-demo-url.com)

## 🛠️ Tech Stack

### Core Technologies
- **React 18** - Component-based architecture
- **Three.js** - WebGL 3D rendering engine
- **React Three Fiber** - Declarative Three.js renderer for React
- **React Three Drei** - Utility components and helpers
- **React Three Postprocessing** - Advanced visual effects
- **Vite** - Fast build tool and development server

### Key Libraries
- `three` - 3D graphics library
- `@react-three/fiber` - React renderer for Three.js
- `@react-three/drei` - Useful helpers for React Three Fiber
- `@react-three/postprocessing` - Post-processing effects
- `lil-gui` - Debug GUI controls

## 📁 Project Structure

```
electric-cubes-react/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── App.jsx          # Main application component
│   ├── index.css        # Global styles
│   ├── main.jsx         # Application entry point
│   └── App.css          # Component styles
├── package.json
├── vite.config.js
└── README.md
```

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/electric-cube-cosmos.git
   cd electric-cube-cosmos
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 🎮 Controls

- **Mouse Drag**: Orbit camera around the scene
- **Mouse Wheel**: Zoom in/out
- **R Key**: Reset camera to default position
- **GUI Panel**: Adjust bloom and trail effects (bottom-right)

## 🏗️ Architecture

### Component Structure

- **Starfield**: Procedural star generation with vertex colors
- **CentralCube**: Massive glowing cube with rotation animation
- **ElectricCubes**: Blue orbital stream (middle layer)
- **PurpleCubesAbove**: Upper purple orbital stream
- **PurpleCubesBelow**: Lower purple orbital stream
- **Scene**: Main container with lighting and camera controls

### Performance Optimizations

- **Instanced Meshes**: Efficient rendering of multiple identical objects
- **Frame Rate Capping**: Consistent 60fps with delta-time calculations
- **LOD System**: Adaptive detail based on distance
- **Memory Management**: Proper cleanup of geometries and materials

### Animation System

- **Curve-Based Movement**: CatmullRomCurve3 for smooth orbital paths
- **Procedural Animation**: Sine wave variations for organic motion
- **Time-Based Updates**: Frame-independent animation using delta time
- **Hierarchical Animation**: Different speeds for each orbital layer

## 🎨 Visual Effects

### Lighting Setup
- Ambient lighting for base illumination
- Directional light for definition
- Point light at scene center for glow
- Dynamic lighting colors matching cube themes

### Post-Processing Pipeline
- **Bloom Effect**: Radiant glow around bright elements
- **SMAA**: Subpixel morphological anti-aliasing
- **Tone Mapping**: ACES Filmic for realistic colors
- **Color Encoding**: sRGB for web compatibility

## 🔧 Customization

### Adjusting Cube Streams
Edit the height offsets in `App.jsx`:
```javascript
const heightOffset = 35 // Change spacing between layers
```

### Modifying Colors
Update emissive colors in the material properties:
```javascript
emissive={new THREE.Color(0x00aaff)} // Electric blue
emissive={new THREE.Color(0x8a2be2)} // Purple
```

### Camera Settings
Adjust orbital parameters in the Scene component:
```javascript
const radius = 80 + Math.sin(time * 0.1) * 10 // Camera distance
```

## 📊 Performance Metrics

- **260+ Cubes**: Rendered using instanced meshes
- **15,000 Stars**: Procedural vertex-colored particles
- **60 FPS**: Consistent frame rate with optimizations
- **WebGL Optimized**: Cross-browser compatibility

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by cosmic visualization and particle systems
- Built with the amazing React Three Fiber ecosystem
- Thanks to the Three.js community for WebGL expertise

## 📞 Contact

**Your Name**
- Email: your.email@example.com
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/your-profile)
- Portfolio: [Your Portfolio](https://your-portfolio.com)

---

⭐ **Star this repo if you found it interesting!**
