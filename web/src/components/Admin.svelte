<script>
    import { onMount } from 'svelte';
    import { auth, googleProvider, db } from '../lib/firebase';
    import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
    import { collection, getDocs, doc, setDoc, query, orderBy } from 'firebase/firestore';

    let user = null;
    let loading = true;
    let projects = [];
    let isSyncing = false;
    let message = "";
    let configError = false;

    const ADMIN_EMAIL = "bingoppp@gmail.com"; 

    onMount(() => {
        // Safe parse helper
        const safeParse = (str) => {
            try {
                if (!str) return {};
                const match = str.match(/\{[\s\S]*\}/);
                return JSON.parse(match ? match[0] : str);
            } catch (e) { return {}; }
        };

        const firebaseConfig = safeParse(import.meta.env.PUBLIC_FIREBASE_CONFIG);
        if (!firebaseConfig.apiKey) {
            configError = true;
            loading = false;
            return;
        }

        onAuthStateChanged(auth, (u) => {
            user = u;
            loading = false;
            if (u && u.email === ADMIN_EMAIL) {
                fetchProjects();
            }
        });
    });

    async function login() {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error(error);
            message = "登入失敗: " + error.message;
        }
    }

    async function logout() {
        await signOut(auth);
        projects = [];
    }

    async function fetchProjects() {
        const q = query(collection(db, "projects"), orderBy("stars", "desc"));
        const querySnapshot = await getDocs(q);
        projects = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    async function syncFromGitHub() {
        isSyncing = true;
        message = "正在從 GitHub 同步專案...";
        try {
            const username = "alvin999";
            const response = await fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=100`);
            const repos = await response.json();
            
            const filteredRepos = repos.filter(repo => !repo.fork);
            
            for (const repo of filteredRepos) {
                const projectData = {
                    id: String(repo.id),
                    name: repo.name,
                    description: repo.description || "",
                    url: repo.homepage || repo.html_url,
                    github_repo: repo.html_url,
                    stars: repo.stargazers_count,
                    language: repo.language || "",
                    is_featured: repo.stargazers_count > 0,
                    updated_at: new Date().toISOString()
                };
                
                await setDoc(doc(db, "projects", String(repo.id)), projectData);
            }
            
            message = "同步完成！";
            await fetchProjects();
        } catch (error) {
            console.error(error);
            message = "同步錯誤: " + error.message;
        } finally {
            isSyncing = false;
        }
    }

    async function triggerDeploy() {
        message = "正在觸發重新部署... (此功能需設定 GitHub Token)";
        // 未來可加入呼叫 GitHub Dispatch 邏輯
    }
</script>

<div class="p-8 max-w-4xl mx-auto bg-black/20 rounded-3xl border border-white/10 backdrop-blur-md">
    {#if loading}
        <div class="text-center py-10">載入中...</div>
    {:else if configError}
        <div class="text-center py-10 border border-red-500/30 bg-red-500/5 rounded-2xl">
            <h2 class="text-xl font-bold text-red-400 mb-2">Firebase 配置異常 ⚠️</h2>
            <p class="text-gray-400 text-sm px-4">
                系統無法讀取有效的金鑰配置。請檢查您的 GitHub Secret <code>PUBLIC_FIREBASE_CONFIG</code> 是否為正確的 JSON 格式。
            </p>
        </div>
    {:else if !user}
        <div class="text-center py-10">
            <h2 class="text-2xl font-bold mb-6">管理後台</h2>
            <button on:click={login} class="px-8 py-3 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-colors">
                使用 Google 登入
            </button>
        </div>
    {:else if user.email !== ADMIN_EMAIL}
        <div class="text-center py-10 text-red-400">
            您的帳號 ({user.email}) 沒有存取權限。
            <button on:click={logout} class="block mx-auto mt-4 text-white underline">登出</button>
        </div>
    {:else}
        <div class="flex justify-between items-center mb-8">
            <h2 class="text-2xl font-bold">專案管理後台</h2>
            <div class="flex gap-4">
                <button on:click={syncFromGitHub} disabled={isSyncing} class="px-4 py-2 bg-indigo-500 rounded-xl text-sm disabled:opacity-50">
                    {isSyncing ? '同步中...' : '同步 GitHub'}
                </button>
                <button on:click={triggerDeploy} class="px-4 py-2 bg-green-600 rounded-xl text-sm">
                    發布更新
                </button>
                <button on:click={logout} class="px-4 py-2 bg-white/10 rounded-xl text-sm border border-white/10">
                    登出
                </button>
            </div>
        </div>

        {#if message}
            <div class="mb-6 p-4 rounded-xl bg-white/5 border border-white/10 text-sm text-indigo-300">
                {message}
            </div>
        {/if}

        <div class="grid gap-4">
            {#each projects as project}
                <div class="p-4 bg-white/5 border border-white/5 rounded-2xl flex justify-between items-center">
                    <div>
                        <h3 class="font-bold text-lg">{project.name}</h3>
                        <p class="text-sm text-gray-400">{project.description || '無描述'}</p>
                        <div class="flex gap-4 mt-2 text-xs text-gray-500">
                            <span>⭐ {project.stars}</span>
                            <span>{project.language}</span>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>
