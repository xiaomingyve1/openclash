// stream-all.js
// 流媒体全平台检测脚本 (Stash 专用版)

const SERVICES = {
    chatgpt: {
        name: "ChatGPT",
        url: "https://chat.openai.com",
        check: checkOpenAI,
        icon: "message.fill"
    },
    youtube: {
        name: "YouTube",
        url: "https://www.youtube.com/premium",
        check: checkYouTube,
        icon: "play.rectangle.fill"
    },
    netflix: {
        name: "Netflix",
        url: "https://www.netflix.com/title/81215567",
        check: checkNetflix,
        icon: "n.square.fill"
    },
    disneyplus: {
        name: "Disney+",
        url: "https://www.disneyplus.com",
        check: checkDisneyPlus,
        icon: "play.house.fill"
    },
    tiktok: {
        name: "TikTok",
        url: "https://www.tiktok.com",
        check: checkTikTok,
        icon: "music.note.tv.fill"
    },
    primevideo: {
        name: "Prime Video",
        url: "https://www.primevideo.com",
        check: checkPrimeVideo,
        icon: "play.square.stack.fill"
    },
    hbomax: {
        name: "HBO Max",
        url: "https://www.hbomax.com",
        check: checkHBOMax,
        icon: "h.square.fill"
    }
};

async function main() {
    const args = getArguments();
    const results = [];
    
    // 并行执行所有检测
    await Promise.all(args.services.map(async (serviceKey) => {
        try {
            const service = SERVICES[serviceKey];
            if (!service) return;
            
            const result = await withTimeout(service.check(), 5000);
            results.push({
                service: service.name,
                unlocked: result.unlocked,
                region: result.region || "Unknown",
                icon: service.icon
            });
        } catch (error) {
            results.push({
                service: service.name,
                unlocked: false,
                region: "Error",
                icon: service.icon
            });
        }
    }));

    return {
        status: "success",
        results: results.sort((a, b) => a.service.localeCompare(b.service))
    };
}

// 检测逻辑实现 -------------------------------------------------
async function checkOpenAI() {
    const res = await fetch("https://chat.openai.com/cdn-cgi/trace");
    const text = await res.text();
    const match = text.match(/loc=([A-Z]{2})/);
    return { 
        unlocked: res.status === 200,
        region: match ? match[1] : null
    };
}

async function checkYouTube() {
    const res = await fetch("https://www.youtube.com/premium");
    const region = res.headers.get("x-country-code") || "US";
    return {
        unlocked: !(await res.text()).includes("YouTube Premium is not available"),
        region: region
    };
}

async function checkNetflix() {
    try {
        const res = await fetch("https://www.netflix.com/title/81215567");
        const region = res.headers.get("x-netflix-region")?.toUpperCase() || "US";
        return {
            unlocked: res.status === 200,
            region: region
        };
    } catch {
        return { unlocked: false, region: "Blocked" };
    }
}

// 其他检测函数实现类似...

// 工具函数 ----------------------------------------------------
function withTimeout(promise, timeout) {
    return Promise.race([
        promise,
        new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), timeout)
    ]);
}

function getArguments() {
    const defaultServices = Object.keys(SERVICES);
    return {
        services: typeof $argument !== 'undefined' ? ($argument.services || defaultServices) : defaultServices,
        style: 'native',
        colorLabel: true
    };
}

// 执行入口
(async () => {
    try {
        const data = await main();
        $done(data);
    } catch (error) {
        $done({
            status: "error",
            error: error.message
        });
    }
})();
