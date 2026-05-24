## 1. 什么是langChain
LainChain是一个**大模型框架**，由大语言模型（LLMs）驱动的应用程序，

## 2.框架对比
![[框架对比.png]]
**LangChain** ：这些工具里出现最早、最成熟的，适合复杂任务分解和单智能体应用
**LlamaIndex** ：专注于高效的索引和检索，适合 RAG 场景。（注意不是Meta开发的）
**LangChain4J** ：LangChain还出了Java、JavaScript（LangChain.js）两个语言的版本，
LangChain4j的功能略少于LangChain，但是主要的核心功能都是有的。
**SpringAI/SpringAI Alibaba** ：有待进一步成熟，此外只是简单的对于一些接口进行了封装
**SemanticKernel** ：也称为sk，微软推出的，对于C#同学来说，那就是5颗
## 3.架构设计

v0.1
![[langchain v0.1框架图.png|600]]
v0.2/0.3
![[langchain v0.2框架图.png|600]]

1. 结构1：**LangChain**
**langchain**：构成应用程序认知架构的Chains，Agents，Retrieval strategies等。
构成应⽤程序的链、智能体、RAG。
**langchain-community**：第三方集成
⽐如：Model I/O、Retrieval、Tool & Toolkit；合作伙伴包 langchain-openai，langchain-
anthropic等。
**langchain-Core**：基础抽象和LangChain表达式语言 (LCEL)

小结：LangChain，就是AI应用组装套件，封装了一堆的API。langchain框架不大，但是里面琐碎的知识点特别多。就像玩乐高，提供了很多标准化的乐高零件（比如，连接器、轮子等）。

2. 结构2：**LangGrap**
**LangGraph**可以看做基于LangChain的api的进一步封装，能够协调多个Chain、Agent、Tools完成更复杂的任务，实现更高级的功能。

3. 结构3：**LangSmith**
链路追踪。提供了6大功能，涉及**Debugging** (调试)、**Playground** (沙盒)、**Prompt Management** (提示管理)、**Annotation** (注释)、**Testing** (测试)、**Monitoring** (监控)等。

4. 结构4：**LangServe**
将**LangChain**的可运行项和链部署为**REST API**，使得它们可以通过网络进行调用。
Java怎么调用langchain呢？就通过这个langserve。将langchain应用包装成一个rest api，对外暴露服务。同时，支持更高的并发，稳定性更好。


## 5. RAG
Retrieval-Augmented Generation（检索增强生成）
![[RAG.png]]

## 6.Agent

```
Agent = LLM + Memory + Tools + Planning + Action + check（观察）
```

## 7.LangChain的核心组件说明
1. **Model I/O**：标准化各个大模型的输入和输出，包含输入模版，模型本身和格式化输出。
![[Model IO.png]]
**Format(格式化)** ：即指代Prompts Template，通过模板管理大模型的输入。将原始数据格式化成 模型可以处理的形式，插入到一个模板问题中，然后送入模型进行处理。 
**Predict(预测)** ：即指代Models，使用通用接口调用不同的大语言模型。接受被送进来的问题，然 后基于这个问题进行预测或生成回答。 
**Parse(生成)** ：即指代Output Parser 部分，用来从模型的推理中提取信息，并按照预先设定好的 模版来规范化输出。比如，格式化成一个结构化的JSON对象。

2. **Chains(链条)**：用于将多个模块串联起来组成一个完整的流程

>例如，一个 Chain 可能包括一个 Prompt 模板、一个语言模型和一个输出解析器，它们一起工作以处理 用户输入、生成响应并处理输出。

常见的Chain类型：
**LLMChain** ：最基础的模型调用链
**SequentialChain** ：多个链串联执行 
**RouterChain** ：自动分析用户的需求，引导到最适合的链 
**RetrievalQA** ：结合向量数据库进行问答的链

3. **Memory(记忆模块)**:用于保存对话历史或上下文信息，以便在后续对话中使用。 
>常见的 Memory 类型： 

**ConversationBufferMemory** ：保存完整的对话历史
**ConversationSummaryMemory** ：保存对话内容的精简摘要（适合长对话） **ConversationSummaryBufferMemory** ：混合型记忆机制，兼具上面两个类型的特点 **VectorStoreRetrieverMemory** ：保存对话历史存储在向量数据库中

4. **Agents(智能体)**: 是 LangChain 的高阶能力，它可以自主选择工具并规划执行步骤。
>Agent 的关键组成：

**AgentType** ：定义决策逻辑的工作流模式 。如:零样本工具调用任务，文档检索问答类任务，适配现代聊天模型的工具调用任务等。
**Tool** ：是一些内置的功能模块，如API调用、搜索引擎、文本处理、数据查询等工具。Agents通 过这些工具来执行特定的功能。 
**AgentExecutor** ：用来运行智能体并执行其决策的工具，负责协调智能体的决策和实际的工具执行。

5. **Retrieval(检索)**: 对应着RAG，检索外部数据，然后在执行生成步骤时将其传递到 LLM。步骤包括文档加载、 切割、Embedding等。
>Embedding:将文本图片等非结构化的信息转化为低纬稠密数值向量。

![[retrieval.png]]

**Source** ：数据源，即大模型可以识别的多种类型的数据：视频、图片、文本、代码、文档等。 
**Load** ：负责将来自不同数据源的非结构化数据，加载为文档(Document)对象 
**Transform** ：负责对加载的文档进行转换和处理，比如将文本拆分为具有语义意义的小块。 **Embed** ：将文本编码为向量的能力。一种用于嵌入文档，另一种用于嵌入查询 
**Store** ：将向量化后的数据进行存储 
**Retrieve** ：从大规模文本库中检索和查询相关的文本段落


6. Callbacks：回调机制，允许连接到 LLM 应用程序的各个阶段，可以监控和分析LangChain的运行情况，比如日志记录、监控、流传输等，以优化性能。
>其实就是一个回调钩子，将LLM执行过程通过钩子回调给日志、监控平台等。

