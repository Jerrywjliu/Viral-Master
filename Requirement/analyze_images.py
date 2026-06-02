import base64
import sys
import requests
from pathlib import Path

API_KEY = input("请输入你的 OpenRouter API Key: ").strip()
if not API_KEY:
    print("API Key 不能为空")
    sys.exit(1)

IMAGE_DIR = Path(__file__).parent
IMAGE_FILES = sorted(IMAGE_DIR.glob("微信图片_*.png"))

if not IMAGE_FILES:
    print("未找到微信图片_*.png 文件")
    sys.exit(1)

def encode_image(path: Path) -> str:
    with open(path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")

contents = []
for img in IMAGE_FILES:
    b64 = encode_image(img)
    contents.append({
        "type": "image_url",
        "image_url": {"url": f"data:image/png;base64,{b64}"}
    })

contents.append({
    "type": "text",
    "text": "请详细描述这4张截图分别是什么内容（用户界面、功能模块、页面布局等），使用中文回答。"
})

resp = requests.post(
    "https://openrouter.ai/api/v1/chat/completions",
    headers={
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
    },
    json={
        "model": "gpt-4o-mini",
        "messages": [{"role": "user", "content": contents}],
        "max_tokens": 2000,
    },
    timeout=120,
)

if resp.status_code != 200:
    print(f"请求失败 ({resp.status_code}): {resp.text}")
    sys.exit(1)

data = resp.json()
print("\n" + "=" * 60)
print("图片分析结果:")
print("=" * 60)
print(data["choices"][0]["message"]["content"])
