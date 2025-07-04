# 🛒 Haat Delivery Test Task — React Native (Expo + Expo Router)

This project is a simplified version of a food delivery app, built using **React Native**, **Expo**, and **expo-router**, demonstrating:

- Category listing
- Market detail navigation
- Section-based product display with advanced scroll behavior

---

## 🚀 Setup Instructions

```bash
# 1. Clone the repository
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

# 2. Install dependencies
npm install
# or
yarn

# 3. Run the Expo app
npx expo start
```

> Make sure you have Expo CLI installed globally (`npm install -g expo-cli`) and a simulator or Expo Go app to test.

---

## 📁 Folder Structure (Simplified)

```
.
├── app/
│   ├── index.tsx               # Home screen: Market categories
│   └── market/[categoryId].tsx # Category detail page with SectionList
├── components/                 # UI components
├── lib/api.ts                 # API helpers
├── constants/                 # Image base and reusable constants
└── README.md
```

---

## 💡 Features & Implementation Notes

### ✅ Category List (Home Screen)

- Fetched using `GET /api/markets/4532`
- Displayed as a 2-column grid with category images
- Scroll-based header animation (hides on scroll using `react-native-reanimated`)
- Tapping a category navigates to its detail screen

### ✅ Category Detail Screen

- Fetched using `GET /api/markets/4532/categories/:categoryId`
- Subcategories rendered as `SectionList` with sticky headers
- Horizontal scrollable tab bar syncs with list scrolling
- Tapping a tab scrolls to its respective section with precise offset
- Layout respects the iOS status bar using `react-native-safe-area-context`
- Product grid with 2 items per row and blurred name background using `expo-blur`

---

## 🔁 Scroll Behavior (Advanced UX)

- Implemented `onViewableItemsChanged` to track current section in view
- Used `scrollToLocation` with `viewOffset` to avoid clipping under sticky headers
- Used `InteractionManager.runAfterInteractions` to delay scroll until list layout is ready

---

## 🧪 How to Test

1. Run the app using `npx expo start`
2. Scroll down on the **home screen** — header should smoothly hide
3. Tap a category → navigates to category detail
4. Tap on any subcategory tab → scrolls to that section in the product list
5. Scroll up/down → tabs update to reflect current visible section

---

## 🚧 Challenges & Solutions

| Challenge                                                     | Solution                                                                                            |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| SectionList `scrollToLocation` fails if list not yet measured | Used `InteractionManager.runAfterInteractions` and `recordInteraction()` to ensure layout readiness |
| Products clipped under header                                 | Applied `viewOffset` equal to header height                                                         |
| Header animation conflicts with safe area                     | Used `react-native-safe-area-context` to calculate proper padding                                   |

---

## 📦 Dependencies

- **expo** (SDK 50+)
- **react-native-reanimated**
- **expo-router**
- **expo-blur**
- **react-native-safe-area-context**
