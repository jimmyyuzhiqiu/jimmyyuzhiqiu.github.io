# 余智秋简历网页

这是一个零依赖静态简历网页，直接打开 `index.html` 即可查看，也可以用本地 HTTP 服务预览。页面支持中文 / English 切换，并包含竞赛证书展示区。

## 文件

- `index.html`：页面主体
- `src/styles.css`：视觉样式、响应式布局和动效
- `src/site.js`：滚动进度、入场动画、项目筛选和项目详情切换
- `public/certificates/`：竞赛证书与项目证明图片
- `public/operations-map.png`：首屏业务视觉资产
- `public/resume-cn.pdf`：中文正式简历下载文件
- `public/resume-en.pdf`：英文详细简历备用文件

## 本地预览

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

打开：

```text
http://127.0.0.1:4173/index.html
```
