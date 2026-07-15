// 参数：在 Loon 任务「参数」里填省份，如：贵州
// 不填则默认贵州

let provname;
if (typeof $argument !== "undefined" && $argument && String($argument).trim() !== "") {
  provname = String($argument).trim();
} else {
  provname = "贵州";
}

// 去掉可能误写的「省」
provname = provname.replace(/省$/, "");

const encoded = encodeURIComponent(provname);
const apiUrls = [
  `https://apis.tianapi.com/oilprice/index?key=231de491563c35731436829ac52aad43&prov=${encoded}`,
  `https://apis.tianapi.com/oilprice/index?key=a2bc7a0e01be908881ff752677cf94b7&prov=${encoded}`,
  `https://apis.tianapi.com/oilprice/index?key=1bcc67c0114bc39a8818c8be12c2c9ac&prov=${encoded}`,
  `https://apis.tianapi.com/oilprice/index?key=3c5ee42145c852de4147264f25b858dc&prov=${encoded}`,
  `https://apis.tianapi.com/oilprice/index?key=d718b0f7c2b6d71cb3a9814e90bf847f&prov=${encoded}`
];
let i = 0;

function go() {
  if (i >= apiUrls.length) {
    notify("油价查询", "全部接口失败", "请稍后再试");
    $done();
    return;
  }
  const req = { url: apiUrls[i++] };
  if (typeof $httpClient !== "undefined") {
    $httpClient.get(req, (e, r, d) => (e ? go() : handle(d)));
  } else if (typeof $task !== "undefined") {
    $task.fetch(req).then(r => handle(r.body), () => go());
  } else {
    $done();
  }
}

function handle(data) {
  let obj;
  try {
    obj = JSON.parse(data);
  } catch (e) {
    go();
    return;
  }
  if (obj.code !== 200) {
    go();
    return;
  }

  const r = obj.result;
  const content =
    `⛽️92号汽油: ¥${r.p92}\n` +
    `⛽️95号汽油: ¥${r.p95}\n` +
    `⛽️98号汽油: ¥${r.p98}\n` +
    `⛽️0号柴油: ¥${r.p0}`;

  const title = r.prov + "油价提醒";
  console.log(title + "\n" + r.time + "\n" + content);
  notify(title, r.time, content);
  $done();
}

function notify(t, s, b) {
  if (typeof $notification !== "undefined") $notification.post(t, s, b);
  else if (typeof $notify !== "undefined") $notify(t, s, b);
}

go();
