# 📊 Finance Dashboard

A powerful, real-time financial data visualization dashboard built with Next.js that connects to any REST API. Create customizable widgets to monitor stocks, cryptocurrencies, market data, and more - all in one place.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC?style=flat-square&logo=tailwind-css)
![Redux](https://img.shields.io/badge/Redux-Toolkit-764ABC?style=flat-square&logo=redux)

## ✨ Features

### 🎯 Core Functionality
- **Universal API Support** - Connect to any JSON REST API
- **Three Widget Types**:
  - 📇 **Card Widgets** - Display key metrics and values
  - 📋 **Table Widgets** - Show lists and tabular data with pagination
  - 📈 **Chart Widgets** - Visualize time-series data with interactive line charts
- **Real-time Updates** - Auto-refresh widgets at customizable intervals (5s - 1hr)
- **Drag & Drop** - Reorder widgets with intuitive drag-and-drop
- **Persistent Storage** - Widgets saved to localStorage, survive page refreshes
- **Responsive Design** - Works seamlessly on mobile, tablet, and desktop

### 🔐 Security
- **API Key Protection** - Server-side proxy hides API keys from browser
- **Secure Headers** - Configurable API authentication (Bearer, API Key, Custom)
- **CORS Handling** - Built-in proxy handles cross-origin requests

### 🎨 User Experience
- **Dark Mode** - Toggle between light and dark themes
- **Skeleton Loading** - Smooth loading states without layout shifts
- **Smart Field Detection** - Automatically detects and categorizes API data
- **Search & Filter** - Quickly find fields when configuring widgets
- **Error Handling** - Clear, actionable error messages with debugging info
- **Empty States** - Helpful placeholders guide users through setup

### 🚀 Developer Features
- **Type-Safe** - Redux Toolkit for predictable state management
- **Modular Architecture** - Clean separation of concerns
- **Debug Mode** - Console logs help troubleshoot API issues
- **Hot Reload** - Fast development with Next.js
- **Extensible** - Easy to add new widget types or API integrations

## 🎥 Demo

### Dashboard Overview
![Dashboard Screenshot](https://via.placeholder.com/800x450/1e293b/10b981?text=Finance+Dashboard+Demo)

### Widget Types
| Card Widget | Table Widget | Chart Widget |
|-------------|--------------|--------------|
| ![Card](https://via.placeholder.com/250x180/1e293b/10b981?text=Card+Widget) | ![Table](https://via.placeholder.com/250x180/1e293b/10b981?text=Table+Widget) | ![Chart](https://via.placeholder.com/250x180/1e293b/10b981?text=Chart+Widget) |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- A REST API endpoint (or use the demo APIs below)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/finance-dashboard.git
cd finance-dashboard

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### First Widget in 60 Seconds

1. **Click "Add Widget"**
2. **Enter API URL**: `https://api.coingecko.com/api/v3/coins/bitcoin`
3. **Click "Test API"** - Should detect ~30 fields
4. **Select "Card" widget type**
5. **Pick fields**: `name`, `symbol`, `market_cap_rank`
6. **Click "Add Widget"** - Done! 🎉

## 📖 Usage Guide

### Connecting to an API

#### Supported APIs
The dashboard works with any JSON REST API. Here are some examples:

**Stock & Finance:**
```bash
# Alpha Vantage (requires free API key)
https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=demo

# Indian Stock API (requires key from indianapi.in)
https://stock.indianapi.in/stock?name=Tata+Steel
```

**Cryptocurrency:**
```bash
# CoinGecko (no key required)
https://api.coingecko.com/api/v3/coins/bitcoin

# CoinCap (no key required)
https://api.coincap.io/v2/assets/bitcoin
```

**General Data:**
```bash
# JSONPlaceholder (testing)
https://jsonplaceholder.typicode.com/users
https://jsonplaceholder.typicode.com/posts
```

#### API Authentication

The dashboard supports multiple authentication methods:

**1. API Key in Header (Most Common)**
```
API Key Header: X-Api-Key
API Key: your_key_here
```

**2. Bearer Token**
```
API Key Header: Authorization
API Key Prefix: Bearer
API Key: your_token_here
```

**3. Custom Header**
```
API Key Header: apikey
API Key Prefix: (leave empty)
API Key: your_key_here
```

### Creating Widgets

#### Card Widget
**Best for:** Individual metrics, KPIs, status values

**Example Use Cases:**
- Current stock price
- Market cap
- 24h change percentage
- Total portfolio value

**Setup:**
1. Select "Card" widget type
2. Choose scalar fields from the API response
3. Fields display as label-value pairs

#### Table Widget
**Best for:** Lists, rankings, multiple data points

**Example Use Cases:**
- Top 10 stocks by volume
- Cryptocurrency rankings
- Transaction history
- Portfolio holdings

**Setup:**
1. Select "Table" widget type
2. Choose an array from the API response
3. Select columns to display
4. Pagination automatically enabled (10 rows/page)

#### Chart Widget
**Best for:** Time-series data, trends, historical analysis

**Example Use Cases:**
- Stock price over time
- Trading volume history
- Portfolio performance
- Market trends

**Setup:**
1. Select "Chart" widget type
2. Choose time-series data (object with date keys or array)
3. Select Y-axis field (must be numeric)
4. Chart auto-detects date field

### Widget Configuration

#### Auto-Refresh Intervals
Configure how often widgets fetch new data:

- **5 seconds** - High-frequency trading data
- **30 seconds** - Default, good balance
- **1 minute** - Market overviews
- **5 minutes** - News feeds
- **1 hour** - Daily summaries

#### Editing Widgets
1. Click the ⚙️ icon on any widget
2. Modify name, URL, fields, or interval
3. Click "Save Changes"
4. Widget updates immediately

#### Reordering Widgets
- Hover over a widget
- Click and drag the ⠿ icon
- Drop in new position
- Order persists across sessions



### Environment Variables

Create `.env.local` in the project root:

```bash
# Optional: Default API key for Indian Stock API
NEXT_PUBLIC_INDIAN_API_KEY=your_key_here

# Add more API keys as needed
# NEXT_PUBLIC_ALPHA_VANTAGE_KEY=your_key
# NEXT_PUBLIC_COINMARKETCAP_KEY=your_key
```

### Tailwind Configuration

Customize colors, fonts, and breakpoints in `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#10b981', // Change primary color
          hover: '#059669',
        },
      },
      screens: {
        'xs': '475px', // Custom breakpoint
      },
    },
  },
}
```

## 🛠️ Development

### Available Scripts

```bash
# Development server with hot reload
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Type check (if using TypeScript)
npm run type-check
```

### Adding a New Widget Type

1. **Create Widget Component** (`src/components/widgets/YourWidget.jsx`):
```javascript
export default function YourWidget({ widget, dragListeners, onEdit, onDelete }) {
  // Implement your widget logic
  return <div>Your Widget</div>
}
```

2. **Update Widget Renderer** (`src/components/widgets/WidgetRenderer.jsx`):
```javascript
if (widget.type === "your-type") return <YourWidget {...props} />;
```

3. **Add to Type Selector** (`src/components/modals/WidgetTypeSelector.jsx`):
```javascript
const types = [
  { id: "card", label: "Card", icon: "📊" },
  { id: "table", label: "Table", icon: "📋" },
  { id: "chart", label: "Chart", icon: "📈" },
  { id: "your-type", label: "Your Type", icon: "🎯" }, // Add this
];
```

4. **Update Modal Logic** (`src/components/modals/AddWidgetModal.jsx`)

### Debugging

**Enable debug mode** by checking browser console:

```javascript
// Console logs show:
=== VALIDATE API DEBUG ===
Scalars found: 15
Arrays: ["data", "items"]
Series: ["Time Series (Daily)"]

=== CHART LOAD DEBUG ===
Widget config: { seriesPath: "...", yField: "..." }
API Response: { ... }
```

**Common Issues:**

| Issue | Solution |
|-------|----------|
| "Path not found" | Check console for available paths, copy exact path |
| "Field not found" | Verify field name matches API response exactly |
| Widget shows "—" | Field path doesn't exist in API response |
| API key exposed | Make sure proxy route is set up correctly |
| CORS error | Use the built-in proxy (`/api/proxy`) |

## 🧪 Testing

### Testing Different API Formats

The dashboard automatically detects and handles:

**1. Flat Objects** (for Cards)
```json
{
  "name": "Bitcoin",
  "price": 45000,
  "change": 5.2
}
```

**2. Arrays** (for Tables)
```json
{
  "stocks": [
    { "symbol": "AAPL", "price": 150 },
    { "symbol": "GOOGL", "price": 2800 }
  ]
}
```

**3. Time Series - Object Format** (for Charts)
```json
{
  "Time Series (Daily)": {
    "2024-01-01": { "open": 100, "close": 105 },
    "2024-01-02": { "open": 105, "close": 108 }
  }
}
```

**4. Time Series - Array Format** (for Charts)
```json
{
  "data": [
    { "date": "2024-01-01", "value": 100 },
    { "date": "2024-01-02", "value": 105 }
  ]
}
```

### Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Fully Supported |
| Firefox | 88+ | ✅ Fully Supported |
| Safari | 14+ | ✅ Fully Supported |
| Edge | 90+ | ✅ Fully Supported |
| Mobile Safari | iOS 14+ | ✅ Fully Supported |
| Chrome Mobile | 90+ | ✅ Fully Supported |

## 📱 Responsive Breakpoints

| Device | Width | Layout |
|--------|-------|--------|
| Mobile | < 640px | 1 column, compact UI |
| Tablet | 640px - 1024px | 2 columns, medium spacing |
| Desktop | 1024px - 1280px | 3 columns, full features |
| Large Desktop | > 1280px | 4 columns, spacious layout |

## 🎨 Customization

### Changing Colors

Edit `src/app/globals.css`:

```css
:root {
  --primary: 16 185 129; /* Emerald-500 */
  --primary-hover: 5 150 105; /* Emerald-600 */
}

.dark {
  --primary: 16 185 129;
  --primary-hover: 5 150 105;
}
```

### Custom Widget Styling

Override styles in individual widget components:

```javascript
// In CardWidget.jsx, modify the container classes:
<div className="your-custom-classes">
  {/* Widget content */}
</div>
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

```bash
# Or use Vercel CLI
npm i -g vercel
vercel
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t finance-dashboard .
docker run -p 3000:3000 finance-dashboard
```

### Environment Variables for Production

Set these in your deployment platform:

```bash
NEXT_PUBLIC_INDIAN_API_KEY=your_key
NODE_ENV=production
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Add comments for complex logic
- Test on multiple screen sizes
- Update README if adding features
- Keep components small and focused

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js** - The React framework
- **Tailwind CSS** - Utility-first CSS framework
- **Redux Toolkit** - State management
- **Recharts** - Chart library
- **DND Kit** - Drag and drop
- **Lucide Icons** - Icon library

## 📞 Support

- **Documentation**: [Project Wiki](https://github.com/devbhardwaj012/finance-dashboard/wiki)
- **Issues**: [GitHub Issues](https://github.com/devbhardwaj012/finance-dashboard/issues)
- **Discussions**: [GitHub Discussions](https://github.com/devbhardwaj012/finance-dashboard/discussions)

## 🗺️ Roadmap

### Version 2.0 (Planned)
- [ ] More widget types (Pie charts, Gauges, Heatmaps)
- [ ] Widget templates/presets
- [ ] Export dashboard configuration
- [ ] Multiple dashboard pages
- [ ] Collaborative dashboards (share with team)
- [ ] Advanced filtering and sorting
- [ ] Custom color themes
- [ ] Widget alerts and notifications
- [ ] Data export (CSV, JSON, PDF)
- [ ] Keyboard shortcuts

### Version 1.5 (In Progress)
- [x] API key security (proxy)
- [x] Responsive design
- [x] Dark mode
- [x] Skeleton loading
- [ ] Widget duplication
- [ ] Undo/redo functionality

## 💡 Tips & Tricks

### Maximizing Performance
- Use longer refresh intervals for slower-changing data
- Limit the number of simultaneous widgets (< 10 recommended)
- Use table pagination for large datasets

### Best Practices
- Test APIs before adding widgets
- Use descriptive widget names
- Group related widgets together (drag to arrange)
- Enable dark mode to reduce eye strain

### Troubleshooting
- Check browser console for detailed error messages
- Use "Test API" button before saving widgets
- Verify API key is correct and active
- Ensure API endpoint is accessible from your network

---

**Built with ❤️ by [Dev Bhardwaj](https://github.com/devbhardwaj012)**

**Star ⭐ this repo if you find it useful!**