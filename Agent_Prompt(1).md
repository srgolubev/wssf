# Project Directive: Build "Зимний фест 2026" Landing Page

You are an expert Frontend Developer and UI/UX Designer. Your task is to build a high-performance, mobile-first landing page for the "Зимний фест 2026" (Winter Festival 2026).

**Repository Context:** `https://github.com/srgolubev/wssf`

## 1. Technical Stack & Foundation
- **Framework:** HTML5, Tailwind CSS (v3+), and Vanilla JavaScript.
- **Performance:** Critical. Optimize images, minify CSS/JS, and ensure a Lighthouse score of 95+.
- **Design:** Mobile-first approach. Ensure responsive layouts for all breakpoints.
- **Typography:** Use local fonts located in `assets/fonts/`. Fallback to sans-serif system fonts if loading fails.
- **Icons:** Use SVG icons (e.g., Heroicons or similar) strictly. **DO NOT use emojis** anywhere on the site.

## 2. Design System
**Color Palette (Graffiti Night Dark):**
Configure Tailwind with these custom colors:
- Background: `#242055` (Deep Blue/Purple)
- Foreground: `#FFFFFF` (White text)
- Primary: `#00E5FF` (Cyan - Buttons/Highlights)
- PrimaryForeground: `#242055`
- Accent: `#80DEEA`
- AccentForeground: `#1A1A3D`

**Visual Style:**
- Modern, energetic, sports-oriented.
- **Special Feature:** Implement a "Reactive Snow" effect over the background.
  - Use a lightweight HTML5 Canvas script.
  - The snow should fall naturally but react to the user's cursor (repel or swirl) to add interactivity.
  - Ensure this does not impact performance (use requestAnimationFrame).

## 3. Assets & Media Handling
- **Logos:**
  - Header & Footer: Use files from `assets/main-logo/`.
- **Images:**
  - Source: `assets/images/`.
  - Logic: If a specific image name is not found, render a stylish placeholder with the section name.
- **Hero Logic:**
  - Check for `assets/images/hero-logo*` (e.g., .png or .svg).
  - **IF EXISTS:** Render this image in the center of the Hero block.
  - **IF NOT:** Render the main title text ("Зимний фестиваль школьного и студенческого спорта 2026").

## 4. Section Structure & Content
Implement the following sections in order:

### A. Header
- Sticky navigation.
- Logo on the left (`assets/main-logo/`).
- Navigation links (anchor links to sections).
- CTA Button: "Регистрация".

### B. Hero Section (Centered)
- **Background:** Dynamic snow effect visible here.
- **Content:**
  - **Visual:** Apply the "Hero Logic" defined in Section 3 (Image vs Text).
  - **Subtitle:** "Главное зимнее событие для молодежи Москвы"
  - **Details:** "24 января 2026 | ОК «Лужники» | Бесплатное участие"
  - **Description:** "Присоединяйся к тысячам участников, соревнуйся в зимних дисциплинах и встречайся с легендами спорта."
  - **CTA Button:** "Стать участником" (Primary Color).

### C. About (Split Layout)
- **Title:** "О фестивале"
- **Text:** "С 2023 года фестиваль стал главной платформой для развития зимнего спорта среди подростков Москвы. Это не просто соревнования, а пространство для мотивации, где спорт сочетается с образованием и развлечениями. В 2026 году мы ожидаем рекордные 10 000 участников."
- **Bullets:** Развитие зимних видов спорта, Поддержка талантливой молодежи, Здоровый образ жизни.
- **Image:** Representative image from assets.

### D. Star Masterclasses (Carousel)
- **Title:** "Звездные мастер-классы"
- **Description:** "Уникальная возможность поучиться у лучших. Олимпийские чемпионы и профессионалы поделятся секретами мастерства."
- **Cards:**
  1. Александр Легков (Лыжные гонки)
  2. Никита Крюков (Лыжные гонки)
  3. Илья Ковальчук (Хоккей)
  4. Денис Леонтьев (Сноуборд-джибинг)

### E. Sports Disciplines (Carousel or Grid)
- **Title:** "Спортивные дисциплины"
- **Items:**
  - Лыжные гонки (1.5 и 3 км)
  - Тэг-регби (бесконтактная игра)
  - Волейбол на снегу
  - Юкигассен (японская битва снежками)
  - Сноуборд-джибинг
  - Снежная эстафета

### F. Interactive Quest (Feature List)
- **Title:** "Интерактивный спортивный квест"
- **Description:** "Преврати посещение фестиваля в игру. Зарабатывай баллы и получай призы."
- **Features:**
  - Онлайн-карта с заданиями
  - Чат-бот для трекинга
  - Обмен баллов на призы

### G. Event Program (Timeline/Schedule) **[NEW REQUIREMENT]**
- **Title:** "Программа дня"
- **Structure:** Create a clean vertical timeline.
  - *Example entries (Populate with logical placeholders if real data is missing):*
  - 09:00 - Сбор гостей и регистрация
  - 10:00 - Церемония открытия
  - 11:00 - Старт соревнований и мастер-классов
  - 14:00 - Развлекательная программа
  - 17:00 - Награждение и закрытие

### H. Entertainment Zone (Gallery Carousel)
- **Title:** "Зона развлечений"
- **Items:** Хоккейный силомер, Гигантская дженга, Снукбол, Биатлонное стрельбище, Дартс снежками, First Aid.

### I. Location (Split Layout)
- **Title:** "Место проведения: ОК «Лужники»"
- **Content:** "Современная инфраструктура, подготовленная лыжно-биатлонная трасса и большой открытый каток."
- **Features:** Профессиональная трасса, Теплые раздевалки, Фудкорт.

### J. Statistics (Stats Row)
- **Title:** "Фестиваль в цифрах"
- **Stats:**
  - "10 000+" Участников
  - "4" Волейбольные площадки
  - "2" Арены для тэг-регби
  - "12" Зон активностей

### K. CTA / Footer
- **Title:** "Готов стать частью истории?"
- **Text:** "Регистрация уже открыта. Собери команду или участвуй лично."
- **Buttons:** "Зарегистрироваться" (Primary), "Скачать программу" (Secondary).
- **Footer:** Copyright, Social Links, Privacy Policy link.

## 5. SEO & Metadata Implementation
- **Meta Tags:** Title, Description, Keywords.
- **Open Graph (OG):** Add `og:title`, `og:description`, `og:image`, `og:url`.
- **JSON-LD Schema:** Implement `Event` (specifically `SportsEvent`) schema:
  - Name: "Зимний фестиваль школьного и студенческого спорта 2026"
  - StartDate: "2026-01-24"
  - Location: "ОК Лужники, Москва"
  - Description: Summary of the event.
  - Offers: { "@type": "Offer", "price": "0", "priceCurrency": "RUB" }

## 6. Execution Steps
1.  **Setup:** Initialize project structure with HTML5 boilerplate and Tailwind via CDN (for rapid prototyping) or CLI setup instructions.
2.  **Global Styles:** Define CSS variables for the color scheme and fonts.
3.  **Snow Effect:** Write the JavaScript for the cursor-reactive snow canvas.
4.  **Layout Construction:** Build sections A through K sequentially.
5.  **Responsiveness:** Refine padding, font sizes, and grid columns for mobile vs desktop.
6.  **SEO:** Inject the meta tags and JSON-LD script into the `<head>`.
7.  **Final Review:** Check console for errors and verify no emojis are present.