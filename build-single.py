#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Gộp toàn bộ website (html + css + js) thành 1 file duy nhất.
Chạy:  python3 build-single.py
Kết quả: on-thi-lich-su-dang.html (tải 1 file này là chạy được ngay)
"""
import io, sys

SRC = "index.html"
OUT = "on-thi-lich-su-dang.html"
CSS_TAG = '<link rel="stylesheet" href="css/style.css">'
JS_FILES = ["js/data-c1.js", "js/data-c2.js", "js/data-c3.js",
            "js/data-c4.js", "js/data-c5.js", "js/data-c6.js", "js/app.js"]

def read(p):
    with io.open(p, encoding="utf-8") as f:
        return f.read()

def main():
    html = read(SRC)

    # 1. Nhúng CSS
    css = read("css/style.css")
    assert "</style" not in css.lower(), "CSS chứa thẻ đóng, cần xử lý thêm"
    assert html.count(CSS_TAG) == 1, "Không tìm thấy thẻ link CSS"
    html = html.replace(CSS_TAG, "<style>\n/* === embedded css/style.css === */\n" + css + "\n</style>")
    print("nhúng CSS: OK (%d ký tự)" % len(css))

    # 2. Nhúng JS theo đúng thứ tự
    for jf in JS_FILES:
        tag = '<script src="%s"></script>' % jf
        assert html.count(tag) == 1, "Không tìm thấy thẻ script: " + jf
        js = read(jf)
        assert "</script" not in js.lower(), "JS chứa thẻ đóng: " + jf
        html = html.replace(tag, "<script>\n/* === embedded %s === */\n" % jf + js + "\n</script>")
        print("nhúng %s: OK (%d ký tự)" % (jf, len(js)))

    # 3. Ghi chú nguồn gốc
    html = html.replace("<!DOCTYPE html>",
        "<!DOCTYPE html>\n<!-- BẢN 1-FILE: toàn bộ website gộp trong file này. Tải file này về, nhấp đúp là chạy. Được tạo tự động bởi build-single.py -->",
        1)

    with io.open(OUT, "w", encoding="utf-8") as f:
        f.write(html)

    # 4. Kiểm tra nhanh: đếm số câu hỏi (mỗi câu có dạng {c:N,q:)
    n = html.count("{c:")
    print("ghi %s: OK (%d KB, %d câu hỏi)" % (OUT, len(html) // 1024, n))
    if n < 500:
        print("CẢNH BÁO: số câu hỏi ít bất thường!", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
