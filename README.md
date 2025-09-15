# Cyberpunk Matrix Flip Clock Timer - React App

A cyberpunk-themed digital timer/clock with matrix rain background, fluorescent tube glitch effects, and comprehensive mobile support including iOS fullscreen functionality.

## Features

### 🎯 Core Functionality
- **Clock Mode**: Display current time with smooth flip animations
- **Countdown Timer**: Set custom countdown timers with hours, minutes, and seconds
- **Effective Time Tracking**: Track and accumulate completed timer sessions
- **Goal Setting**: Add custom goals/tags to timer sessions

### 🔥 Cyberpunk Effects
- **Matrix Rain Background**: Animated falling characters background
- **Fluorescent Tube Glitches**: Random realistic tube flickering effects
- **Flip Clock Animation**: Smooth 3D flip animations on digit changes
- **Cyberpunk Styling**: Green glow effects, transparent boards, futuristic design

### 📱 Mobile Optimization
- **iOS Fullscreen Support**: Works across Safari, Chrome, Firefox, and Edge on iOS
- **Responsive Design**: Optimized for all screen sizes and orientations
- **Landscape Mode**: Special optimizations for mobile landscape viewing
- **Touch Controls**: Mobile-friendly interactions and gestures

### 🎨 Visual Features
- **95% Digit Size**: Large, readable digits optimized for visibility
- **70% Transparent Boards**: See-through digit containers showing matrix background
- **Dynamic Sizing**: Automatic font scaling based on screen size and device type
- **Centered Display**: Perfect centering across all devices and orientations

## Technologies Used

- **React 18**: Modern React with hooks and functional components
- **CSS3**: Advanced animations, gradients, and responsive design
- **Canvas API**: Matrix rain effect rendering
- **Web Audio API**: Notification sounds
- **Modern JavaScript**: ES6+ features, async/await

## Project Structure

```
src/
├── components/
│   ├── MatrixBackground.js      # Animated matrix rain effect
│   ├── FlipClock/
│   │   ├── FlipClock.js        # Main clock/timer display
│   │   └── FlipClock.css       # Clock styling and animations
│   ├── Controls/
│   │   ├── Controls.js         # Timer controls and buttons
│   │   └── Controls.css        # Control styling
│   └── EffectiveTime/
│       ├── EffectiveTime.js    # Time tracking components
│       └── EffectiveTime.css   # Time tracking styling
├── hooks/
│   ├── useMobile.js            # Mobile detection and responsive sizing
│   ├── useFullscreen.js        # iOS fullscreen functionality
│   └── useCyberpunkGlitch.js   # Fluorescent tube glitch effects
├── App.js                      # Main application component
├── App.css                     # Global app styling
├── index.js                    # React app entry point
└── index.css                   # Global CSS variables and base styles
```

## Installation and Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```
   Opens [http://localhost:3000](http://localhost:3000) in your browser.

3. **Build for Production**
   ```bash
   npm run build
   ```
   Creates optimized production build in `build/` folder.

## Usage

### Clock Mode
- Click "Clock" button to display current time
- Time updates every second with smooth flip animations
- Perfect for displaying current time with cyberpunk aesthetics

### Countdown Timer
- Click "Countdown" button to enter timer mode
- Set hours, minutes, and seconds using input fields
- Click "Start" to begin countdown
- Timer displays remaining time with flip animations
- Plays notification sound when timer reaches zero

### Effective Time Tracking
- Completed countdown sessions automatically add to pending time
- Click "Add" to add pending time to your daily effective time total
- Click "Clear" to reset pending time without adding
- Track your daily productivity with cumulative time display

### Goal Setting
- Click "Goal" button to set a custom goal/tag for your timer session
- Goals display during countdown mode
- Helps organize and categorize your timer sessions

### Fullscreen Mode
- Click "Fullscreen" button for immersive experience
- Works across all browsers including iOS Safari, Chrome, Firefox, and Edge
- Hides browser interface for maximum screen utilization
- Touch screen to show/hide controls in fullscreen mode

### Cyberpunk Effects
- Random fluorescent tube glitches occur every 4-10 seconds
- Three glitch types: flicker, buzz, and startup effects
- Matrix rain background continuously animates
- All effects are optimized for performance across devices

## Mobile Optimization

### iOS Fullscreen
- Advanced address bar hiding techniques
- Multiple scroll attempts for stubborn browsers
- Continuous monitoring to keep interface hidden
- Safe area support for notched devices

### Responsive Design
- Dynamic font scaling based on screen size
- Landscape mode optimizations
- Touch-friendly controls and interactions
- Automatic layout adjustments for all screen sizes

### Performance
- Hardware-accelerated animations
- Optimized Canvas rendering for matrix effect
- Efficient React hooks for state management
- Minimal re-renders with proper memoization

## Browser Support

- **Desktop**: Chrome, Firefox, Safari, Edge (all modern versions)
- **Mobile**: iOS Safari, iOS Chrome, iOS Firefox, iOS Edge
- **Android**: Chrome, Firefox, Samsung Internet
- **Features**: Full functionality across all supported browsers

## Development

### Available Scripts
- `npm start`: Run development server
- `npm test`: Run test suite
- `npm run build`: Create production build
- `npm run eject`: Eject from Create React App (irreversible)

### Customization
- Modify CSS variables in `src/index.css` for global styling changes
- Adjust glitch effects in `src/hooks/useCyberpunkGlitch.js`
- Customize mobile breakpoints in `src/hooks/useMobile.js`
- Modify fullscreen behavior in `src/hooks/useFullscreen.js`

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.