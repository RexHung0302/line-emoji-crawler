const fs = require("fs");
const puppeteer = require("puppeteer");
const axios = require("axios");

const TargetURL =
  "https://developers.line.biz/en/docs/messaging-api/emoji-list/#line-emoji-definitions"; // 可自行替換目標網址
const outputDir = "./download"; // 輸出資料夾

// 清空資料夾
const emptyDir = async (path) => {
  const files = fs.readdirSync(path);
  for (const file of files) {
    const filePath = `${path}/${file}`;
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      await emptyDir(filePath);
      // 刪除空資料夾
      fs.rmdirSync(filePath);
    } else {
      fs.unlinkSync(filePath);
      console.log(`刪除 ${file} 文件成功`);
    }
  }
};

// 抓取所有 Emoji
const getAllEmojiHandler = async (page, container, dir) => {
  const emojiContainers = await container.$$(
    '[class="emoji-grid-item border border-gray-200 dark:border-gray-800 text-center flex flex-col flex-wrap rounded"]'
  );

  const emojiDataPromises = emojiContainers.map(async (emojiContainer, i) => {
    const emojiIdElement = await emojiContainer.$('code[id^="emoji-"]');
    const emojiId = await page.evaluate(
      (el) => el.textContent.trim(),
      emojiIdElement
    );
    console.log(`抓取 id ${dir.split("/")[2]}: 第 ${i} 個 Emoji, ${emojiId}`);

    const emojiDiv = await emojiContainer.$(".m-auto");
    // 拿取圖片元素的 background
    const emojiDivStyle = await page.evaluate(
      (el) => el.style.background,
      emojiDiv
    );
    // 只取 background 的 url(去掉頭尾的引號)
    const emojiUrl = emojiDivStyle.split("url(")[1].split(")")[0];

    const emojiUrlTrim = emojiUrl.substring(1, emojiUrl.length - 1);

    // 下載 Emoji
    const downloadPromise = new Promise((resolve, reject) => {
      axios({
        method: "get",
        url: emojiUrlTrim,
        responseType: "stream",
      })
        .then((response) => {
          response.data.pipe(fs.createWriteStream(`${dir}/${emojiId}.png`));

          // 紀錄 Emoji 資料
          resolve({
            id: emojiId,
            url: emojiUrlTrim,
          });
        })
        .catch((err) => {
          console.log("err:", err);
          reject(err);
        });
    });
    return downloadPromise;
  });

  return Promise.all(emojiDataPromises);
};

// 點擊所有 Show All
const clickAllShowAllHandler = async (page, container) => {
  const showAllBtn = await container.$('[class="emoji-grid mt-3"] button');
  await showAllBtn.click();
};

// 寫入 JSON
const writeAllDataToJSONHandler = async (data) => {
  const dataJSON = JSON.stringify(data, null, 2);
  fs.writeFileSync(`${outputDir}/allData.json`, dataJSON);
  console.log(`寫入 JSON 成功`);
};

// 抓取所有 Product ID，並且建立資料夾
const getAllProductIdAndMkdir = async (page) => {
  const showAllContainers = await page.$$(
    '[class="sm:p-3 py-10 my-4 border-t sm:border border-gray-250 dark:border-gray-750 rounded"]'
  );

  const result = {};

  for (let i = 0; i < showAllContainers.length; i++) {
    const container = showAllContainers[i];

    // 為了方便測試，到第二個 Show All 就停止
    // if (i === 2) {
    //   break;
    // }

    // 先點擊所有 Show All
    await clickAllShowAllHandler(page, container);

    const idElement = await container.$('code[id^="product-"]');
    const id = await page.evaluate((el) => el.textContent.trim(), idElement);

    // 創建資料夾
    const dir = `${outputDir}/${id}`;

    if (!fs.existsSync(dir)) {
      console.log(`創建第 ${i} 個資料夾 ${id}`);
      fs.mkdirSync(dir);
    }

    // 抓取所有 Emoji
    const emojiData = await getAllEmojiHandler(page, container, dir);

    result[id] = emojiData;
  }

  // 寫入 JSON
  await writeAllDataToJSONHandler(result);
};

// 抓取 Emoji
const downloadEmojiHandler = async (page) => {
  // 抓取所有 Product ID，並且建立資料夾
  await getAllProductIdAndMkdir(page);
};

(async () => {
  // 開始前先清空資料夾
  await emptyDir(outputDir);
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(TargetURL);
  // 抓取 Emoji
  await downloadEmojiHandler(page);
  await browser.close();
})();
