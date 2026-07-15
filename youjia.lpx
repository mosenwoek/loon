// 黔东南油价 - Loon（爬取 qiyoujiage，优先凯里）
// 若凯里页无效会自动回退贵州省页

const urls = [
  "http://m.qiyoujiage.com/kaili.shtml",
  "http://m.qiyoujiage.com/guizhou.shtml"
];
let idx = 0;

function next() {
  if (idx >= urls.length) {
    notify("黔东南油价", "查询失败", "页面解析失败，请稍后再试");
    $done();
    return;
  }
  const url = urls[idx++];
  const req = {
    url,
    headers: {
      "referer": "http://m.qiyoujiage.com/",
      "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15"
    }
  };

  if (typeof $httpClient !== "undefined") {
    $httpClient.get(req, (err, resp, body) => {
      if (err || !body) return next();
      parse(body, url);
    });
  } else if (typeof $task !== "undefined") {
    $task.fetch(req).then(r => parse(r.body, url), () => next());
  } else {
    $done();
  }
}

function parse(html, url) {
  const re = /<dl>[\s\S]*?<dt>([^<]*油)<\/dt>[\s\S]*?<dd>([\d.]+)\(元\)<\/dd>/gi;
  const prices = [];
  let m;
  while ((m = re.exec(html)) !== null) {
    prices.push({ name: m[1].trim(), value: m[2] });
  }

  if (prices.length < 4) {
    next();
    return;
  }

  // 尽量按 92/95/98/0 排序展示
  const line = (n) => {
    const p = prices.find(x => x.name.includes(n));
    return p ? `⛽️${p.name}: ¥${p.value}` : "";
  };
  const content = [line("92"), line("95"), line("98"), line("0")].filter(Boolean).join("\n");
  const title = "贵州黔东南油价";
  const sub = "数据来源：油价网（请与三价区核对）";

  console.log(title + "\n" + content);
  notify(title, sub, content);
  $done();
}

function notify(t, s, b) {
  if (typeof $notification !== "undefined") $notification.post(t, s, b);
  else if (typeof $notify !== "undefined") $notify(t, s, b);
}

next();
