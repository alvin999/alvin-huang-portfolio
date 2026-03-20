/**
 * 自動從 GitHub 抓取專案截圖的「聰明」腳本
 * 1. 嘗試從內容 API 獲取 screenshots 資料夾清單
 * 2. 優先尋找名稱包含 'main' 或 'cover' 的圖片
 * 3. 否則取第一張圖片
 * 4. 支援 main/master 雙分支自動切換
 */

const SCREENSHOT_CACHE = new Map<string, string>();

export async function getProjectScreenshot(projectName: string, specifiedFile?: string): Promise<string> {
    const cacheKey = `${projectName}-${specifiedFile || 'auto'}`;
    if (SCREENSHOT_CACHE.has(cacheKey)) return SCREENSHOT_CACHE.get(cacheKey)!;

    const owner = 'alvin999';
    const branches = ['main', 'master'];
    const possiblePaths = ['screenshots', 'Screenshots', 'screenshot', 'Screenshot'];

    // 嘗試從 API 獲取（包含指定檔案或自動探索）
    for (const branch of branches) {
        // 如果有指定檔案，先嘗試直接獲取該檔案的資訊
        if (specifiedFile) {
            try {
                const checkUrl = `https://raw.githubusercontent.com/${owner}/${projectName}/${branch}/screenshots/${specifiedFile}`;
                const res = await fetch(checkUrl, { method: 'HEAD' });
                if (res.ok) {
                    SCREENSHOT_CACHE.set(cacheKey, checkUrl);
                    return checkUrl;
                }
            } catch (e) {}
        }

        // 嘗試透過 API 探索目錄
        for (const path of possiblePaths) {
            try {
                const response = await fetch(`https://api.github.com/repos/${owner}/${projectName}/contents/${path}?ref=${branch}`);
                if (!response.ok) continue;

                const files = await response.json();
                if (!Array.isArray(files)) continue;

                const images = files.filter(f => 
                    f.type === 'file' && 
                    /\.(png|jpg|jpeg|webp|gif)$/i.test(f.name)
                );

                if (images.length > 0) {
                    // 將圖片依照檔名進行字典排序 (a到z)
                    images.sort((a, b) => a.name.localeCompare(b.name));

                    const bestMatch = specifiedFile 
                        ? images.find(img => img.name === specifiedFile)
                        : images.find(img => /meta|cover|main|index|landing/i.test(img.name)) || images[0];

                    if (bestMatch) {
                        const url = bestMatch.download_url;
                        SCREENSHOT_CACHE.set(cacheKey, url);
                        return url;
                    }
                }
            } catch (e) {}
        }
    }

    // 最終 Fallback：嘗試最可能的位址
    const lastResort = `https://raw.githubusercontent.com/${owner}/${projectName}/main/screenshots/screenshot1.png`;
    return lastResort;
}
