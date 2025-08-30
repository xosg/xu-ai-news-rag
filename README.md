# 新闻 AI 引擎

## Ollama 安装

```shell

# 下载ollama，或者从官网: https://ollama.com/download/windows
winget install Ollama.Ollama

# 嵌入式模型
ollama pull bge-m3

# LLM 大模型
ollama pull qwen3:8b

# 设置环境变量，然后使用nVidia显卡启动
docker run -d --gpus=all -e OLLAMA_ORIGINS="*" -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama 

```

## Chroma安装

```shell
# Windows64需要docker启动

# 设置环境变量，然后启动
docker run --env=CHROMA_CORS_ALLOW_ORIGINS=["*"] -d ghcr.io/chroma-core/chroma:latest -p 8000:8000 -v chroma_data:/chroma/chroma --name chroma chromadb/chroma

```

## 启动

```shell
# 随便启动一个http服务器，托管./frontend里面的文件
node serve.js


```
