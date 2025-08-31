# 新闻 AI 引擎

## Docker 安装

```shell
# 使用Windows包管理器下载，或者走官网：
# https://www.docker.com/products/docker-desktop/
winget install Docker.DockerDesktop

# 检查 Docker 版本
docker --version
```

## Ollama 安装

```shell
# 下载ollama，或者从官网: 
# https://ollama.com/download/windows
winget install Ollama.Ollama

# 嵌入式模型选择bge-m3，支持多种自然语言
ollama pull bge-m3

# LLM 大模型
ollama pull qwen3:8b

# 设置环境变量，然后使用nVidia显卡启动，设置长一点的KEEP_ALIVE
docker run -d --gpus=all -e OLLAMA_ORIGINS="*" -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama -e OLLAMA_KEEP_ALIVE=24h

```

## Chroma安装

```shell
# Windows64需要docker启动，或者WSL系统

# 设置环境变量，然后启动
docker run --env=CHROMA_CORS_ALLOW_ORIGINS=["*"] -d ghcr.io/chroma-core/chroma:latest -p 8000:8000 -v chroma_data:/chroma/chroma --name chroma chromadb/chroma

```

## 启动

```shell
# 随便启动一个http服务器，托管 web/ 里面的文件
node serve.js

# 进入管理界面初始化，点击Rebuild数据库
open http://localhost:{port}/admin.html

# 如需修改端口等参数，请在 web/base.js 开头修改
```

## MIT LICENSE

Copyright (c) 2025 JinHengyu

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
