## 1. Java8 特性
* 1.Lambda 表达式
* 2.Stream流
	1. stream 串行流
	2. parallelStream 并行流
* 3.Optional
* 4.functional interface 函数式接口
## 2. java9 新特性
* 1.模块化系统
* 2.==G1== 成为默认垃圾回收器（==单线程==去完成标记清除算法）
* 3.接口私有方法
* 4.快速创建不可变集合（List.of()、Set.of()、Map.of() 和 Map.ofEntries()）
## 3. java10 新特性
1.局部变量类型推断(var)
2.G1 并行 Full GC（==并行==标记清除算法）
## 4. java11 新特性
1.HTTP Client 标准化（支持异步非阻塞）
```java title:async.java
client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
   .thenApply(HttpResponse::body)
   .thenAccept(System.out::println);
```
2.新的垃圾回收器 Epsilon
>一个完全消极的 GC 实现，分配有限的内存资源，最大限度的降低内存占用和内存吞吐延迟时间

3.启动单文件源代码程序
>允许使用 Java 解释器直接执行 Java 源代码。源代码在内存中编译，然后由解释器执行
## 5. java12 新特性
1.Shenandoah GC
>目标是 99.9% 的暂停小于 10ms
>和 Java11 开源的 ZGC 相比（需要升级到 [JDK11](https://so.csdn.net/so/search?q=JDK11&spm=1001.2101.3001.7020) 才能使用），Shenandoah GC 有稳定的 JDK8u 版本

2.G1 收集器优化
Java12 为默认的垃圾收集器 G1 带来了两项更新:

**可中止的混合收集集合** ：JEP344 的实现，为了达到用户提供的停顿时间目标，JEP 344 通过把要被回收的区域集（混合收集集合）拆分为强制和可选部分，使 G1 垃圾回收器能中止垃圾回收过程。 G1 可以中止可选部分的回收以达到停顿时间目标。
**及时返回未使用的已分配内存** ：JEP346 的实现，增强 G1 GC，以便在空闲时自动将 Java 堆内存返回给操作系统。
## 6. java13 新特性
## 7. java14 新特性
1.空指针异常精准提示
>明确指出 null 的变量/字段
```txt title:空指针报错.txt
Exception in thread "main" java.lang.NullPointerException: 
    Cannot invoke "String.length()" because "str" is null
    at com.example.Test.main(Test.java:10)
```
## 8. java17 新特性
> Java 17 将是继 Java 8 以来最重要的长期支持（LTS）版本，是 Java 社区八年努力的成果。==Spring 6.x== 和 ==Spring Boot 3.x== ,==Spring Cloud 2022.X==最低支持的就是 Java 17。

1.增强的伪随机数生成器
支持自定义随机数
```java title:random.java
RandomGeneratorFactory<RandomGenerator> l128X256MixRandom = RandomGeneratorFactory.of("L128X256MixRandom");
// 使用时间戳作为随机数种子
RandomGenerator randomGenerator = l128X256MixRandom.create(System.currentTimeMillis());
// 生成随机数
randomGenerator.nextInt(10));
```
## 9.Java 19 新特性

1.虚拟线程（预览）
* 与传统线程池对比

| 特性    | 传统线程（平台线程）   | 虚拟线程       |
| ----- | ------------ | ---------- |
| 最大线程数 | 几千个          | 数百万个       |
| 内存占用  | 高（每线程 1-2MB） | 低（每线程几百字节） |
| 适用场景  | CPU 密集型      | I/O 密集型    |
| 是否阻塞  | 阻塞           | 不阻塞        |
* 工作原理
>虚拟线程在阻塞时（如 I/O、锁等待）会释放底层平台线程
>平台线程可以继续执行其他虚拟线程
>I/O 完成后，虚拟线程会被调度到可用的平台线程继续执行
## 10.Java 20 新特性
 1. 作用域值（第一次孵化）
 * 作用域与ThreadLocal 的对比

| 特性     | ThreadLocal | Scoped Values |
| ------ | ----------- | ------------- |
| 可变性    | 可修改         | 不可变           |
| 作用域    | 整个线程生命周期    | 限定作用域         |
| 内存泄漏风险 | 需要手动清理      | 自动清理          |
| 性能     | 较好          | 更好            |
| 虚拟线程支持 | 有限          | 原生支持          |

2. 实际应用场景
>请求上下文传递（用户信息、请求ID等）
>事务上下文管理
>日志追踪（Trace ID）
>权限上下文传递

