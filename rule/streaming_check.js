// streaming_check.js
const SERVICES = {
  ChatGPT: {
    testUrl: 'https://chat.openai.com/cdn-cgi/trace',
    icon: 'message.fill',
    regionMatch: /loc=([A-Z]{2})/
  },
  YouTube: {
    testUrl: 'https://www.youtube.com/redirect?redir_token=test',
    icon: 'play.rectangle.fill',
    regionMatch: /country%3D([A-Z]{2})/
  },
  // 其他服务配置类似...
};

async function checkService(serviceName) {
  const service = SERVICES[serviceName];
  try {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 8000);

    const response = await fetch(service.testUrl, {
      method: 'GET',
      redirect: 'manual',
      signal: controller.signal
    });

    // 区域检测逻辑增强
    let region = 'N/A';
    if (response.headers.get('location')) {
      const redirectUrl = response.headers.get('location');
      const regionMatch = redirectUrl.match(service.regionMatch);
      region = regionMatch ? regionMatch[1] : 'N/A';
    }

    return { status: response.status === 200 ? 'unlocked' : 'locked', region };
  } catch (error) {
    return { status: 'error', region: 'N/A' };
  }
}

function createTileEntry(service, result) {
  const statusColor = result.status === 'unlocked' ? '#32D74B' : '#FF453A';
  return {
    icon: {
      name: service.icon,
      color: statusColor,
      symbol: true  // 强制使用SF Symbols
    },
    title: service.name,
    subtitle: result.region,
    accessory: {
      text: result.status === 'unlocked' ? '解锁' : '封锁',
      color: statusColor
    }
  };
}

async function main() {
  try {
    const entries = await Promise.all(
      Object.entries(SERVICES).map(async ([name, config]) => {
        const result = await checkService(name);
        return createTileEntry({ name, ...config }, result);
      })
    );

    return {
      tiles: [{
        type: 'grid',
        columns: 2,
        entries: entries
      }]
    };
  } catch (error) {
    return { 
      tiles: [{
        type: 'text',
        title: '检测服务不可用',
        subtitle: error.message,
        color: '#FF9500'
      }]
    };
  }
}

// 必须导出main函数
module.exports = main;
