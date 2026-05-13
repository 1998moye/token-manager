"""
Token 管理器插件图标生成器
设计哲学: "Crystalline Key" — 密钥的晶体化表达
"""

from PIL import Image, ImageDraw
import math
import os

SIZES = [16, 32, 48, 128]
OUTPUT_DIR = "public/icons"

BG = (15, 23, 42)
PRIMARY = (56, 189, 248)
SECONDARY = (6, 182, 212)
ACCENT = (251, 191, 36)
DARK = (51, 65, 85)
HIGHLIGHT = (173, 243, 255)


def hex_pts(cx, cy, r):
    return [(cx + r * math.cos(math.pi / 3 * i - math.pi / 6),
             cy + r * math.sin(math.pi / 3 * i - math.pi / 6)) for i in range(6)]


def rhombus_pts(cx, cy, half):
    return [(cx, cy - half), (cx + half, cy), (cx, cy + half), (cx - half, cy)]


def draw_icon(size):
    img = Image.new('RGBA', (size, size), (*BG, 255))
    d = ImageDraw.Draw(img)
    cx, cy = size // 2, size // 2

    # --- 背景圆晕 ---
    for frac, alpha in [(0.40, 35), (0.30, 25), (0.20, 15)]:
        r = int(size * frac)
        overlay = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        od = ImageDraw.Draw(overlay)
        od.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(*PRIMARY, alpha))
        img = Image.alpha_composite(img, overlay)

    d = ImageDraw.Draw(img)

    # --- 外层深色六边形 ---
    d.polygon(hex_pts(cx, cy, size * 0.44), fill=DARK)

    # --- 六边形内描边 ---
    d.polygon(hex_pts(cx, cy, size * 0.40), outline=PRIMARY, width=max(1, size // 32))

    # --- 六边形角装饰点 ---
    for i in range(6):
        angle = math.pi / 3 * i - math.pi / 6
        vx = int(cx + size * 0.40 * math.cos(angle))
        vy = int(cy + size * 0.40 * math.sin(angle))
        dv = max(1, size // 16)
        d.polygon(rhombus_pts(vx, vy, dv), fill=PRIMARY)

    # --- 密钥头部（菱形） ---
    key_cy = cy - size * 0.05
    kh = size * 0.18
    d.polygon(rhombus_pts(cx, key_cy, kh), fill=PRIMARY)

    # 菱形高光
    hl = size * 0.07
    d.polygon(rhombus_pts(cx, key_cy - size * 0.06, hl), fill=HIGHLIGHT)

    # --- 密钥柄部（竖条） ---
    sw = size * 0.08
    shaft_top = key_cy + kh
    shaft_bot = cy + size * 0.26
    d.rectangle([cx - sw / 2, shaft_top, cx + sw / 2, shaft_bot], fill=SECONDARY)

    # --- 齿（3 个金色小矩形向右伸出） ---
    tw = size * 0.10
    th = size * 0.048
    for i in range(3):
        ty = shaft_top + size * 0.04 + i * (th + size * 0.035)
        d.rectangle([cx, ty, cx + tw, ty + th], fill=ACCENT)

    # --- 底部金色圆点 ---
    dot_r = max(1, size // 16)
    dot_y = shaft_bot + size * 0.04
    d.ellipse([cx - dot_r, dot_y - dot_r, cx + dot_r, dot_y + dot_r], fill=ACCENT)

    return img


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    for sz in SIZES:
        img = draw_icon(sz)
        out = os.path.join(OUTPUT_DIR, f"icon{sz}.png")
        img.save(out, "PNG")
        print(f"[OK] icon{sz}.png ({sz}x{sz})")
    print("done")


if __name__ == "__main__":
    main()