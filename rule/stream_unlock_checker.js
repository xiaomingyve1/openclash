async function fetchUnlockStatus() {
  const services = [
    { name: "ChatGPT",     url: "https://chat.openai.com/", regionKey: "openai" },
    { name: "YouTube",     url: "https://www.youtube.com/red", regionKey: "yt" },
    { name: "Netflix",     url: "https://www.netflix.com/title/81215567", regionKey: "nf" },
    { name: "Disney+",     url: "https://www.disneyplus.com/", regionKey: "dp" },
    { name: "TikTok",      url: "https://www.tiktok.com/", regionKey: "tt" },
    { name: "Amazon Prime",url: "https://www.primevideo.com/", regionKey: "ap" },
    { name: "HBO Max",     url: "https://www.hbomax.com/", regionKey: "hb" }
  ];

  const results = await Promise.allSettled(services.map(service =>
    fetch(service.url, { method: 'GET', mode: 'no-cors' }).then(() => ({
      name: service.name,
      status: "解锁",
      region: "未知区域",
      color: "green"
    })).catch(() => ({
      name: service.name,
      status: "封锁",
      region: "无",
      color: "red"
    }))
  ));

  return results.map(r => r.value || {
    name: "未知服务",
    status: "错误",
    region: "无",
    color: "gray"
  });
}

async function render() {
  const services = await fetchUnlockStatus();

  const html = `
    <div style="display: grid; gap: 12px; padding: 10px">
      ${services.map(s => `
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="width: 12px; height: 12px; border-radius: 50%; background-color: ${s.color};"></span>
          <strong>${s.name}</strong>
          <span style="flex-grow: 1; text-align: right;">${s.status} (${s.region})</span>
        </div>
      `).join("")}
    </div>
  `;

  return {
    title: "流媒体解锁检测",
    content: html
  };
}
