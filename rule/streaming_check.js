// streaming_check.js
const SERVICES = {
  'ChatGPT': {
    url: 'https://chat.openai.com/',
    icon: 'message.fill',
    regions: ['US', 'UK', 'SG']
  },
  'YouTube': {
    url: 'https://www.youtube.com/premium',
    icon: 'play.rectangle.fill',
    regions: ['US', 'JP', 'KR']
  },
  'Netflix': {
    url: 'https://www.netflix.com/title/81215567',
    icon: 'n.square.fill',
    regions: ['US', 'JP', 'UK']
  },
  'Disney+': {
    url: 'https://www.disneyplus.com/',
    icon: 'play.square.fill',
    regions: ['US', 'UK', 'SG']
  },
  'TikTok': {
    url: 'https://www.tiktok.com/',
    icon: 'video.fill',
    regions: ['US', 'JP', 'TW']
  },
  'Amazon Prime': {
    url: 'https://www.primevideo.com/',
    icon: 'a.square.fill',
    regions: ['US', 'JP', 'UK']
  },
  'HBO Max': {
    url: 'https://www.hbomax.com/',
    icon: 'h.square.fill',
    regions: ['US', 'UK', 'ES']
  }
};

async function checkService(service) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(service.url, {
      method: 'HEAD',
      redirect: 'manual',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    // 状态码检测逻辑
    if ([200, 301, 302, 307].includes(response.status)) {
      return {status: 'unlocked', region: detectRegion(response)};
    }
    return {status: 'locked', region: 'N/A'};
  } catch (error) {
    console.error(`[${service}检测失败]: ${error}`);
    return {status: 'error', region: 'N/A'};
  }
}

function detectRegion(response) {
  // 这里实现实际的区域检测逻辑
  // 示例随机返回区域，实际应解析响应头/内容
  const regions = this.SERVICES[service].regions;
  return regions[Math.floor(Math.random() * regions.length)];
}

async function main() {
  const results = [];
  
  for (const [name, config] of Object.entries(SERVICES)) {
    const {status, region} = await checkService(name);
    results.push({
      icon: config.icon,
      title: name,
      subtitle: region,
      status: status === 'unlocked' ? '🟢 解锁' : '🔴 封锁',
      color: status === 'unlocked' ? '#34C759' : '#FF3B30'
    });
  }
  
  return {
    tiles: [{
      type: 'grid',
      entries: results.map(r => ({
        icon: {name: r.icon, color: r.color},
        title: r.title,
        subtitle: r.subtitle,
        status: r.status
      }))
    }]
  };
}

main();
