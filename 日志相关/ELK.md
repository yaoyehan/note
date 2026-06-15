## 什么是ELK？
![[ELK.png]]
E（**elasticSearch**）：搜索引擎，负责海量**数据存储**，高效**模糊查询**
L（**LogStash**）：开源的**数据处理管道**，能够将**非结构化的数据信息转化为结构化的数据**，最终将数据写入到搜索引擎，如下：
![[LogStash.png]]
K（**Kibana**）：搜索引擎的UI界面服务
架构图如下：
![[ELK架构图.png]]

## 架构优化1
```ad-question
LogStash默认占用1G的内存，普通应用也才占用4G内存，有什么优雅的解决方法吗？

> 那就是Featbeat，只需要10MB内存

```
![[ELK-Featbeat版.png]]
## 架构优化2 
### 日志丢失问题
![[featbeat导致日志丢失.png]]
```ad-danger
Filebeat在高峰期日志输出跟不上，就会存储在内存队列中，内存队列的大小有限，当存储不下时，就会导致内存溢出（OOM），从而导致日志丢失。
```
加入Kafka作为消息队列，Filebeat将日志数据写入到kafka中就好了！
![[Kafka接入日志系统.png]]
 
## 架构优化3
```ad-question
这套架构还有什么优化空间吗？

> 1. 日志一般不需要什么复杂的逻辑处理，所以logstash一般可以去掉
> 2. kafka不具备直接写入数据到其他服务中的能力，所以需要加上kafka connect组件

```
![[架构优化3.png]]