# Flyora - Aircraft Parts Manufacturing Website

A modern, responsive website for Flyora, an aircraft parts manufacturing company, featuring stunning 3D animations, video backgrounds, and interactive elements.

## ✨ Features

### 🏠 Homepage (`index.html`)
- **Full-screen sky video background** - Non-repeating cloud video covering the entire page
- **3D plane model animation** - Plane glides in from the left and descends as you scroll
- **Responsive design** - Adapts to all screen sizes
- **Modern glassmorphism UI** - Sleek, professional appearance
- **Smooth scroll animations** - GSAP-powered transitions

### 📞 Contact Page (`contact.html`)
- **Interactive contact form** with validation:
  - Full Name (required)
  - Phone Number (required, with validation)
  - Email Address (required, with email validation)
  - Enquiry Type dropdown (Aircraft Parts, Prototyping, Consultation, etc.)
  - Message textarea (required)
- **3D plane model** on the left side
- **Real-time form validation** with visual feedback
- **Success/error messages** with smooth animations
- **Responsive layout** that fits within 100vh

### 🎨 Design Elements
- **Consistent branding** - Flyora logo and aviation theme throughout
- **Professional color scheme** - Dark theme with green accents (#d1ff48)
- **Typography** - Devil Breeze, Poppins, and Bimbo fonts
- **Video backgrounds** - Sky/cloud video on both pages
- **3D animations** - Interactive plane models using Three.js

## 🛠️ Technical Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Grid, Flexbox, and animations
- **JavaScript (ES6+)** - Interactive functionality
- **Three.js** - 3D graphics and animations
- **GSAP** - Smooth animations and transitions

### 3D Models
- **GLTF/GLB format** - Optimized 3D models
- **Multiple plane models** - Fallback system if primary model fails to load
- **Animation support** - Built-in model animations when available

## 📁 File Structure

```
AnimatedWebsite-main/
├── index.html              # Homepage
├── contact.html            # Contact page
├── style.css               # Main stylesheet
├── contact.css             # Contact page specific styles
├── app.js                  # 3D animations and homepage logic
├── contact.js              # Contact page 3D and form handling
├── img/                    # Assets directory
│   ├── SSYouTube.online_Cloud Heaven Copyrights Free Video_1080p.mp4
│   ├── stylized_ww1_plane.glb
│   ├── wwii_cartoon_plane_free.glb
│   ├── sukhoi_su-75.glb
│   ├── c17__transport_aircraft.glb
│   ├── cargo_aircraft.glb
│   └── [other image assets]
└── README.md               # This file
```

## 🚀 Getting Started

1. **Clone or download** the project files
2. **Open `index.html`** in a modern web browser
3. **Navigate** between Home and Contact pages using the header menu
4. **Experience** the 3D plane animations and scroll effects

## 🎯 Key Features Explained

### 3D Plane Animation System
- **Homepage**: Plane glides in from the left on page load, then descends as you scroll
- **Contact Page**: Static plane model on the left side with hover effects
- **Fallback System**: If 3D models fail to load, creates a simple geometric plane
- **Responsive**: Adapts to different screen sizes and orientations

### Video Background
- **Full-screen coverage** without repeating
- **Optimized performance** with proper video attributes
- **Fallback support** for browsers that don't support video
- **Consistent across pages** for unified experience

### Form Validation
- **Real-time validation** as users type
- **Visual feedback** with color-coded borders
- **Comprehensive validation** for email, phone, and required fields
- **User-friendly messages** with smooth animations

## 🎨 Customization

### Colors
- Primary accent: `#d1ff48` (green)
- Background: `#1B1B1B` (dark)
- Text: `#eef8ce` (light)

### Fonts
- Headings: "Devil Breeze"
- Body: "Poppins"
- Accent: "Bimbo"

### 3D Models
Replace the GLB files in the `img/` directory to use different plane models. The system will automatically try to load them in order.

## 📱 Responsive Design

The website is fully responsive with breakpoints at:
- **Desktop**: 1024px and above
- **Tablet**: 768px - 1023px
- **Mobile**: 767px and below

## 🔧 Browser Support

- **Chrome** 60+
- **Firefox** 55+
- **Safari** 12+
- **Edge** 79+

## 📞 Contact Information

- **Email**: info@flyora.com
- **Phone**: +1 (555) 123-4567
- **Website**: [Flyora Aircraft Parts](index.html)

## 🎬 Video Background

The sky video background (`SSYouTube.online_Cloud Heaven Copyrights Free Video_1080p.mp4`) provides a dynamic, professional backdrop that enhances the aviation theme without being distracting.

## ✈️ Aviation Theme

The entire website is designed around aviation and aircraft manufacturing:
- **Plane models** for 3D animations
- **Sky video background**
- **Aviation terminology** in content
- **Professional aerospace branding**

---

**Flyora** - Precision Aircraft Parts Manufacturing
*Taking flight with innovation and quality*
