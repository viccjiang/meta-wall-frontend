# MetaWall Frontend

MetaWall 社群平台前端，使用 Nuxt 4 建構，串接 MetaWall RESTful API。

## 技術棧

- **Nuxt 4** - Vue 全端框架
- **Vue 3** - 前端框架
- **TypeScript** - 型別檢查
- **Pinia** - 狀態管理
- **Tailwind CSS** - 樣式框架
- **ESLint 9** - 程式碼檢查
- **eslint-plugin-tailwindcss** - Tailwind class 規則檢查
- **Nuxt Icon** - 圖示元件
- **Nuxt Image** - 圖片最佳化
- **Google Fonts** - Noto Sans TC / Paytone One

## 功能

- 使用者註冊 / 登入 / 登出
- 個人資料設定（暱稱、性別、大頭照）
- 修改密碼
- 動態牆（貼文列表、搜尋、排序）
- 發佈 / 刪除貼文
- 按讚 / 取消按讚
- 留言 / 刪除留言
- 追蹤 / 取消追蹤使用者
- 追蹤名單、按讚列表
- 查看其他使用者個人頁面

## 環境設定

複製 `.env.example` 並建立 `.env` 檔案：

```bash
cp .env.example .env
```

環境變數：

| 變數名稱 | 說明 | 預設值 |
|---|---|---|
| `NUXT_PUBLIC_API_BASE` | 後端 API 位址 | — |

## 安裝與啟動

```bash
# 安裝依賴
npm install

# 啟動開發伺服器 (http://localhost:3000)
npm run dev

# 執行 ESLint
npm run lint

# 自動修正常見 ESLint 問題
npm run lint:fix

# 執行 Nuxt / Vue TypeScript 型別檢查
npx nuxi typecheck

# 建構正式版本
npm run build

# 預覽正式版本
npm run preview
```

## 開發檢查

- ESLint 採用 Nuxt flat config，設定檔位於 `eslint.config.mjs`
- 已啟用 `eslint-plugin-tailwindcss`，會檢查 Tailwind class 的 shorthand、衝突與排序相關問題
- Tailwind ESLint 規則會讀取 `tailwind.config.ts`
- 型別檢查可使用 `npx nuxi typecheck` 或 `npx vue-tsc --noEmit`

## 專案結構

```
app/
├── middleware/         # 路由中介層 (auth 守衛)
├── composables/       # 組合式函式 (useApi)
├── stores/            # Pinia stores (auth)
├── utils/             # 工具函式 (auth payload 解析)
├── types/             # TypeScript 型別定義
├── layouts/           # 頁面佈局 (default, auth)
├── components/        # 共用元件 (PostCard, PostForm, UserCard)
└── pages/             # 頁面路由
    ├── index.vue      # 動態牆首頁
    ├── login.vue      # 登入
    ├── register.vue   # 註冊
    ├── profile.vue    # 個人資料設定
    ├── following.vue   # 追蹤名單
    ├── likes.vue      # 按讚列表
    ├── post/create.vue # 發佈貼文
    └── user/[id].vue  # 使用者個人頁
```

## 後端 API

- 使用 Nuxt 內建 `$fetch` 與 `useAsyncData` 進行資料請求
- `useApi()` composable 封裝 `$fetch.create()`，自動注入 Bearer token 及處理 401 登出
- API 位址透過環境變數 `NUXT_PUBLIC_API_BASE` 設定，禁止寫死於程式碼中

## 備註

- 使用者頁面路由為 `app/pages/user/[id].vue`
- 若修改 API 回應結構，請同步更新 `app/types/api.ts`
