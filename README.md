# Alvin Huang Portfolio ☕️ & 💻

[![Astro](https://img.shields.io/badge/Astro-BC52EE?style=for-the-badge&logo=astro&logoColor=white)](https://astro.build/)
[![Svelte](https://img.shields.io/badge/Svelte-FF3E00?style=for-the-badge&logo=svelte&logoColor=white)](https://svelte.dev/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)

這是一個結合了 **咖啡職人精神** 與 **前端技術探索** 的個人作品集。專案致力於透過高端動畫視覺與自動化管理系統，展現開發者對細節的追求。

---

## 🌟 核心特色：極致視覺呈現

本專案不僅僅是靜態網頁，更是一個動態影音與網頁互動的實驗場。

### 1. Remotion - 網頁即影片
我們將 **Remotion** 整合進 Astro 之中，將 React 元件轉化為高品質的動畫幀。
- **動態專案展示**：精選專案不再只是靜態圖片，而是透過 Remotion 渲染出的流暢動畫。
- **數據驅動視訊**：動畫內容直接綁定 GitHub Repo 數據，達成即時更新。

### 2. GSAP - 流暢的捲動體驗
利用 **GSAP (GreenSock Animation Platform)** 驅動網頁整體的動態靈魂。
- **ScrollTrigger**：精確控制頁面捲動時的元素變化，營造視差與層次感。
- **微互動**：從按鈕懸停到背景光影，皆透過 GSAP 達成細膩的物理感與過渡。

### 3. Lottie - 精簡而生動
整合 **Lottie-web** 處理複雜的向量動畫（如：咖啡杯加載動畫）。
- **輕量化**：以 JSON 格式載入，在不犧牲頁面載入速度的前提下提供 60fps 的頂級視覺。

---

## 🛠 零成本 Headless CRM 架構

本專案實踐了完全免費、自給自足的內容管理系統，達成「開發者友善」的維運模式。

### 🔗 GitHub API & Firebase 完美整合
我們建構了一個無需資料庫後端、完全透過前端與 Serverless 服務達成的 CRM 系統：
- **GitHub API**：動態發現並抓取所有公開專案的星數、語言與描述。
- **Firebase Firestore**：作為中繼層，存儲專案的隱藏/顯示狀態與自定義元數據。
- **Smart Image Loading**：自動巡檢 GitHub 倉庫中的截圖，若無則自動生成備援視覺。

### 🖥 專屬 Admin Panel
內建基於 **Svelte 5** 開發的管理後台：
1.  **一鍵同步**：按下按鈕即觸發 GitHub API 全量更新至 Firebase。
2.  **狀態控制**：直接在 UI 上勾選是否將該專案設為「精選 (Featured)」。
3.  **自動化部署**：與 GitHub Actions 綁定，更新內容後自動觸發靜態頁面重新編譯。

---

## 🏗 技術堆疊

| 領域 | 使用技術 |
| :--- | :--- |
| **Framework** | Astro 5 (核心鏡像) |
| **Component** | Svelte 5 & React 19 (Remotion) |
| **Styling** | TailwindCSS + Gruvbox 顏色體系 |
| **Backend** | Firebase Auth & Firestore |
| **CI/CD** | GitHub Actions |

---

## 🚀 快速開始

### 本地開發
1.  複製專案
    ```bash
    git clone https://github.com/alvin999/alvin-huang-portfolio.git
    ```
2.  安裝依賴 (進入 `web` 目錄)
    ```bash
    cd web
    npm install
    ```
3.  啟動開發伺服器
    ```bash
    npm run dev
    ```

### 環境變數
請在 `web/.env` 中配置以下資訊：
- `PUBLIC_FIREBASE_CONFIG`: Firebase 專案配置 (JSON 格式)

---

## 📜 授權

本專案採 [MIT License](LICENSE) 授權。

Designed & Developed by **Alvin Huang** ☕️
